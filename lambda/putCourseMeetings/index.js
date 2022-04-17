const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    const requestBody = JSON.parse(event.body);
    
    const updatedSections = requestBody.updated_sections;
    
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    
    for (const updatedSection of updatedSections) {
        let dbQuery = `UPDATE course_section 
                       SET placeholder_professor_name = $1, capacity_peer_teachers = $2 
                       WHERE section_id = $3`;
        let params = [updatedSection.placeholder_professor_name, updatedSection.capacity_peer_teachers, updatedSection.section_id];
        await helper_functions.queryDB(dbQuery, params);
    }

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": accessHeader },
    };
    
    helper_functions.cleanup();
    
    return response;
};