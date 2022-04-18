const helper_functions = require("./helper_functions");

const deleteTable = (table) => {
    return helper_functions.queryDB(`
        TRUNCATE ${table} CASCADE
    `, [])
}

exports.handler = async (event) => {
    const eventBody = JSON.parse(event.body);
    
    let accessHeader = null;
    
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json",
                     "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify({})
    };

    await Promise.all([
        deleteTable('person_unavailability'),
        deleteTable('section_assignment_preference'),
        deleteTable('section_assignment'),
        deleteTable('section_meeting'),
        deleteTable('trade_request'),
        deleteTable('course_section'),
        helper_functions.queryDB('ALTER SEQUENCE course_section_section_id_seq RESTART WITH 1').catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Couldn't reset the numbering for the section id."))
    ])

    if (response.statusCode === 500) {
        return response;
    }

    const add_sections = []

    for (let meeting of eventBody) {
        add_sections.push(helper_functions.queryDB(
        `
            INSERT INTO course_section (course_id, section_number, placeholder_professor_name)
            VALUES (\$1, \$2, \$3)
            ON CONFLICT (course_id, section_number) DO NOTHING
            RETURNING section_id
        `,
        [meeting.course_id, meeting.section_number, meeting.instructor]).then(rows => eventBody.filter(m => m.course_id === meeting.course_id && m.section_number === meeting.section_number).forEach(m => {
            if (rows[0]?.section_id)
                m.section_id = rows[0].section_id
        })).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, `Couldn't Insert at least 1 Course Section`)))

    }

    await Promise.all(add_sections)

    if (response.statusCode === 500) {
        return response;
    }

    const add_section_meetings = []

    for (let meeting of eventBody) {
        for (let day of meeting.days_met) {
            add_section_meetings.push(helper_functions.queryDB(
            `
                INSERT INTO section_meeting (section_id, weekday, start_time, end_time, place, meeting_type)
                VALUES (\$1, \$2, \$3, \$4, \$5, \$6)
                ON CONFLICT DO NOTHING
            `,
            [meeting.section_id, day, meeting.start_time, meeting.end_time, meeting.room, meeting.meeting_type]).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, `Couldn't Insert at least 1 Course Section Meeting`)))
        }
    }

    await Promise.all(add_section_meetings)

    if (response.statusCode === 500) {
        return response;
    }

    helper_functions.cleanup()

    return response;
};