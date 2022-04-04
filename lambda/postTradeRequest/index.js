const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const eventBody = JSON.parse(event.body);

    const requester_id = eventBody.requester;
    const offered_id = eventBody.offer;
    const requested_id = eventBody.request;

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({})
    };

    const people_in_offered = await helper_functions.queryDB(`SELECT person_id FROM section_assignment WHERE section_id = $1`, [offered_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the number of people assigned to the offered section."))

    const people_in_requested = await helper_functions.queryDB(`SELECT person_id FROM section_assignment WHERE section_id = $1`, [requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the number of people assigned to the requested section."))

    // const offered_section = await helper_functions.queryDB(`SELECT * FROM course_section WHERE section_id = $1`, [offered_id]).catch(err => {
    //     response.statusCode = 500;
    //     response.body = JSON.stringify({err: "Failed to get the offered section."});
    // })

    const requested_section = await helper_functions.queryDB(`SELECT * FROM course_section WHERE section_id = $1`, [offered_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the requested section."))

    let requester_in_offered = false
    for (let record of people_in_offered) {
        if (requester_id === record.person_id) {
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
        helper_functions.GenerateErrorResponseAndLog(err, response, "The requested course is not viable.")
        return response;
    }

    // Automatically Process Trade Request -- Does not Hit trade_request Table
    if (people_in_requested.length < requested_section.capacity_peer_teachers && people_in_offered.length > 1) {
        helper_functions.queryDB(`UPDATE section_assignment SET section_id = $1 WHERE person_id = $2 AND section_id = $3`, [requested_id, requester_id, offered_id])
        .then(res => {
            response.body = JSON.stringify({msg: "Automatically changed the course assignment."});
        })
        .catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to change the assignment from the offered section to the requested section automatically."))
        return response;
    }
    
    // Construct a Fill of Trade Requests -- Hits the trade_request Table
    const traded_people = []
    for (let {person_id} of people_in_requested) {
        const viableCourses = await helper_functions.queryDB(`SELECT * FROM "ViableCourses"($1) WHERE section_id = $2`, [person_id, offered_id]).catch(err => {
            response.statusCode = 500;
            response.body = JSON.stringify({err: "Failed to get the viable courses for at least one person in the requested section."});
        })
        if (viableCourses.length === 0) continue;
        traded_people.push(person_id)
        await helper_functions.queryDB(`INSERT INTO trade_request VALUES ($1, $2, $3, $4)`, [requester_id, offered_id, person_id, requested_id]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to create the trade request for at least one person in the requested section."))
        // TODO: Send an email or something I guess...
    }

    if (response.body === JSON.stringify({})) {
        response.body = JSON.stringify({requested: traded_people})
    }

    return response;
};