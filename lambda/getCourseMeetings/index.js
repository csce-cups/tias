const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    
    // Appease CORS for the requesting domain, if the domain
    // is one that we expect.
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" }
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }
    
    const dbQuery = 
    `
        SELECT section_meeting.section_id, course.department, course.course_number, course_section.section_number, 
               course_section.placeholder_professor_name, course_section.capacity_peer_teachers,
               section_meeting.start_time, section_meeting.end_time, section_meeting.weekday, 
               section_meeting.place
        FROM section_meeting
        LEFT OUTER JOIN course_section ON course_section.section_id = section_meeting.section_id
        LEFT OUTER JOIN course ON course.course_id = course_section.course_id
        WHERE section_meeting.meeting_type = 'Laboratory'
        ORDER BY section_meeting.weekday, section_meeting.start_time, (section_meeting.end_time - section_meeting.start_time),
                 course.course_number, course_section.section_number
    `;
    const params = [];
    
    // Retrieve all course meetings for each course in the database.
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to retrieve course meetings.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = { };
    
    // Parse through the database results, and create a response
    // body that contains course meetings separated into arrays 
    // by day of the week.
    let prevSliceIndex = 0;
    for(let i = 1; i < dbRows.length; i++) {
        if (dbRows[i].weekday != dbRows[i - 1].weekday) {
            responseBody[dbRows[i - 1].weekday] = dbRows.slice(prevSliceIndex, i);
            prevSliceIndex = i;
        }
    }
	
	// Capture the remaining day of the week (Friday).
	responseBody[dbRows[dbRows.length - 1].weekday] = dbRows.slice(prevSliceIndex, dbRows.length);

    response.body = JSON.stringify(responseBody);
    return response;
};