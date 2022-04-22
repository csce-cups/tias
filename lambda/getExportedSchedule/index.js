const helper_functions = require("./helper_functions");

const weekday_lookup = {
    'Sunday': 'U',
    'Monday': 'M',
    'Tuesday': 'T',
    'Wednesday': 'W',
    'Thursday': 'R',
    'Friday': 'F',
    'Saturday': 'S'
}

exports.handler = async (event) => {
    let accessHeader = null;
    
    if (['https://www.csce-scheduler.com', 'http://localhost:3000'].includes(event.headers.origin)) {
        accessHeader = event.headers.origin;
    }

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify({})
    };

    let dbQuery = `
    SELECT person.*, course_section.*, course.department, course.course_number, course_name, section_meeting.weekday, section_meeting.start_time, section_meeting.end_time, (section_meeting.end_time - section_meeting.start_time) AS duration, section_meeting.place
    FROM section_assignment
    JOIN person ON section_assignment.person_id = person.person_id
    JOIN course_section ON section_assignment.section_id = course_section.section_id
    JOIN course ON course_section.course_id = course.course_id
    JOIN section_meeting ON course_section.section_id = section_meeting.section_id AND section_meeting.meeting_type = 'Laboratory'
    ORDER BY person.last_name, person.first_name, course.department, course_section.section_number, course.course_number, section_meeting.weekday`;
    let params = [];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Failed to export schedule data.');
    });

    if (response.statusCode === 500) {
        return response;
    }
    
    const courseObj = {};
    const peopleObj = {};

    for (let row of dbRows) {
        if (courseObj[row.section_id] === undefined) {
            courseObj[row.section_id] = {
                course_id: row.course_number,
                sec: row.section_number,
                lab_days: [],
                begin: row.start_time,
                end: row.end_time,
                instructor: row.placeholder_professor_name,
                lab_room: row.place,
                peer_teachers: []
            }
        }
        if (!courseObj[row.section_id].lab_days.includes(weekday_lookup[row.weekday])) {
            courseObj[row.section_id].lab_days.push(weekday_lookup[row.weekday])
        }
        const name = `${row.first_name} ${row.last_name}`
        if (!courseObj[row.section_id].peer_teachers.includes(name)) {
            courseObj[row.section_id].peer_teachers.push(name)
        }

        if (peopleObj[row.person_id] === undefined) {
            peopleObj[row.person_id] = {
                first: row.first_name,
                last: row.last_name,
                classes: [],
                labs: {},
                number_lab_hours: 0
            }
        }
        if (!peopleObj[row.person_id].classes.includes(row.course_number)) {
            peopleObj[row.person_id].classes.push(row.course_number)
            peopleObj[row.person_id].labs[row.course_number] = []
        }
        if (!peopleObj[row.person_id].labs[row.course_number].includes(row.section_number)) {
            peopleObj[row.person_id].labs[row.course_number].push(row.section_number)
        }
        if (!row.duration.hours) row.duration.hours = 0
        if (!row.duration.minutes) row.duration.minutes = 0
        peopleObj[row.person_id].number_lab_hours += Math.ceil(row.duration.hours + row.duration.minutes / 60)
    }

    const responseBody = {
        people: Object.values(peopleObj),
        courses: Object.values(courseObj)
    }

    response.body = JSON.stringify(responseBody)

    return response;
};