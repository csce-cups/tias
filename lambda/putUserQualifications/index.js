const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
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
        "headers": { "Content-Type": "application/json" }
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }
    
    let id = event?.pathParameters?.userId;
    
    // If the API was called without specifying a user ID,
    // or if the user ID is malformed, then return an error.
    if (id == null || id == '' || isNaN(+id)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified and must be numeric.');
        return response;
    }
    
    // If the event body was not specified, then necessary information
    // to update a user qualifications is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let qualificationsObj = JSON.parse(event.body).qualifications;
    
    for(let courseID of Object.keys(qualificationsObj)) {
        let dbQuery = `UPDATE qualification 
                       SET qualified= $1 
                       WHERE person_id = $2 AND course_id = $3
                     `;
        let params = [qualificationsObj[courseID], id, courseID];
        await helper_functions.queryDB(dbQuery, params);
    }

    return response;
};