const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const dbQuery = 
    `
        SELECT section_meeting.section_id, course.department, course.course_number, course_section.section_number, course_section.placeholder_professor_name,
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
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const responseBody = { };
    
    let prevSliceIndex = 0;
    for(let i = 1; i < dbRows.length; i++) {
        if (dbRows[i].weekday != dbRows[i - 1].weekday) {
            responseBody[dbRows[i - 1].weekday] = dbRows.slice(prevSliceIndex, i);
            prevSliceIndex = i;
        }
    }
	
	responseBody[dbRows[dbRows.length - 1].weekday] = dbRows.slice(prevSliceIndex, dbRows.length);
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};