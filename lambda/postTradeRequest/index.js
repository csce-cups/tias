const helper_functions = require("./helper_functions");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    const requester_id = event?.pathParameters?.userId;
    let accessHeader = null;
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    const eventBody = JSON.parse(event.body);

    const offered_id = eventBody.offered_id;
    const requested_id = eventBody.requested_id;
    
    console.log('person_id: ', requester_id);
    console.log('offered_id: ', offered_id );
    console.log('requested_id: ', requested_id);

    /// Source: https://nodemailer.com/about/
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtppro.zoho.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "noreply@csce-scheduler.com", // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json",
                     "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify({})
    };

    const requester = (await helper_functions.queryDB(`SELECT * FROM person WHERE person_id = $1`, [requester_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the requesting party.")))[0]

    const people_in_offered = await helper_functions.queryDB(`SELECT person_id FROM section_assignment WHERE section_id = $1`, [offered_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the number of people assigned to the offered section."))

    const people_in_requested = await helper_functions.queryDB(`SELECT person.* FROM section_assignment JOIN person ON person.person_id = section_assignment.person_id WHERE section_id = $1`, [requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the number of people assigned to the requested section."))

    const offered_section = (await helper_functions.queryDB(`SELECT course_section.*, department, course_number FROM course_section JOIN course ON course_section.course_id = course.course_id WHERE section_id = $1`, [offered_id]).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err: "Failed to get the offered section."});
    }))[0]
    const offered_meetings = (await helper_functions.queryDB(`SELECT * FROM section_meeting WHERE section_id = $1`, [offered_id])).filter(meeting => meeting.meeting_type === 'Laboratory')
    
    console.log('people_in_requested', people_in_requested);

    const requested_section = (await helper_functions.queryDB(`SELECT course_section.*, department, course_number FROM course_section JOIN course ON course_section.course_id = course.course_id WHERE section_id = $1`, [requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the requested section.")))[0]
    const requested_meetings = (await helper_functions.queryDB(`SELECT * FROM section_meeting WHERE section_id = $1`, [requested_id])).filter(meeting => meeting.meeting_type === 'Laboratory')

    let requester_in_offered = false
    for (let record of people_in_offered) {
        console.log(record);
        if (requester_id == record.person_id) {
            requester_in_offered = true
            break;
        }
    }
    if (!requester_in_offered) {
        helper_functions.GenerateErrorResponseAndLog({stack: ""}, response, "The person who requested the trade offered a section to which they are not assigned.")
        return response;
    }

    let requester_in_requested = false
    for (let record of people_in_requested) {
        if (requester_id === record.person_id) {
            requester_in_requested = true
            break;
        }
    }
    if (requester_in_requested) {
        helper_functions.GenerateErrorResponseAndLog({stack: ""}, response, "The person who requested the trade requested a section to which they are already assigned.")
        return response;
    }

    const viableCourses = await helper_functions.queryDB(`SELECT * FROM "ViableCourses"($1) WHERE section_id = $2`, [requester_id, requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the viable courses for the requester."))

    if (viableCourses.length === 0) {
        helper_functions.GenerateErrorResponseAndLog({stack: ""}, response, "The requested course is not viable.")
        return response;
    }
    
    for (let meeting of requested_meetings) {
        const conflictingSections = await helper_functions.queryDB(`SELECT section_meeting.* FROM section_assignment JOIN section_meeting ON section_assignment.section_id = section_meeting.section_id AND section_assignment.section_id != \$5 WHERE person_id = \$1 AND weekday = \$2 AND NOT (end_time < \$3 OR start_time > \$4)`, [requester_id, meeting.weekday, meeting.start_time, meeting.end_time, offered_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the requested section."))
     
        console.log(conflictingSections)
    
        if (conflictingSections.length !== 0) {
            helper_functions.GenerateErrorResponseAndLog({stack: ""}, response, "You have another course at the same time.")
            return response;
        }   
    }

    // Automatically Process Trade Request -- Does not Hit trade_request Table
    if (people_in_requested.length < requested_section.capacity_peer_teachers && people_in_offered.length > 1) {
        await helper_functions.queryDB(`UPDATE section_assignment SET section_id = $1 WHERE person_id = $2 AND section_id = $3`, [requested_id, requester_id, offered_id])
        .catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to change the assignment from the offered section to the requested section automatically."))
        response.body = JSON.stringify({msg: "Automatically changed the course assignment."});
        return response;
    }

    const emails = []

    const emailMessage = `You have received a Trade Request from ${requester.first_name} ${requester.last_name}.
    They are offering ${offered_section.department} ${offered_section.course_number} - ${offered_section.section_number} in exchange for your ${requested_section.department} ${requested_section.course_number} - ${requested_section.section_number}.
    Please go to https://www.csce-scheduler.com/labswap to respond to your trades.`

    const emailHTML = `<p>You have received a Trade Request from <b>${requester.first_name} ${requester.last_name}</b>.</p>
    <p>They are offering <b>${offered_section.department} ${offered_section.course_number} - ${offered_section.section_number}</b> in exchange for your <b>${requested_section.department} ${requested_section.course_number} - ${requested_section.section_number}</b>.</p>
    Please go to <a href="https://www.csce-scheduler.com/labswap">CSCE Scheduler LabSwap™</a> to respond to your trades.`

    console.log(emailMessage)
    
    // Construct a Fill of Trade Requests -- Hits the trade_request Table
    const traded_people = []
    for (let {person_id, email} of people_in_requested) {
        console.log('person_id is', person_id);
        if (people_in_offered.includes(person_id)) continue;
        const viableCourses = await helper_functions.queryDB(`SELECT * FROM "ViableCourses"($1) WHERE section_id = $2`, [person_id, offered_id]).catch(err => {
            response.statusCode = 500;
            response.body = JSON.stringify({err: "Failed to get the viable courses for at least one person in the requested section."});
        })
        if (viableCourses.length === 0) continue;
        let person_can_switch = true
        for (let meeting of offered_meetings) {
            const conflictingSections = await helper_functions.queryDB(`SELECT section_meeting.* FROM section_assignment JOIN section_meeting ON section_assignment.section_id = section_meeting.section_id AND section_assignment.section_id != \$5 WHERE person_id = \$1 AND weekday = \$2 AND NOT (end_time < \$3 OR start_time > \$4)`, [person_id, meeting.weekday, meeting.start_time, meeting.end_time, requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the requested section."))
     
            console.log('conflicting: ', conflictingSections)
    
            if (conflictingSections.length !== 0) { person_can_switch = false; break }
        }
        if (!person_can_switch) continue
        traded_people.push(person_id)
        await helper_functions.queryDB(`INSERT INTO trade_request VALUES ($1, $2, $3, $4) ON CONFLICT (person_id_sender, section_id_sender, person_id_receiver, section_id_receiver) DO UPDATE SET request_status = 'Pending'`, [requester_id, offered_id, person_id, requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to create the trade request for at least one person in the requested section."))

        // send mail with defined transport object
        emails.push(transporter.sendMail({
            from: '"CSCE Scheduler" <noreply@csce-scheduler.com>', // sender address
            to: email, // list of receivers
            subject: "✨You Have a New Trade Request on CSCE Scheduler!✨", // Subject line
            text: emailMessage, // plain text body
            html: emailHTML, // html body
        }))
    }
    
    if (traded_people.length === 0) {
        response.body = JSON.stringify({err: 'Unable to trade course successfully with any users in requested section due to qualification or availability conflicts.'});
        return response;
    }

    if (response.body === JSON.stringify({})) {
        response.body = JSON.stringify({requested: traded_people})
    }

    await Promise.all(emails)

    return response;
};