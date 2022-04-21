const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userId = event?.pathParameters?.userId;

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
    
    // If the API was called without specifying a user ID,
    // or if the user ID is malformed, then return an error.
    if (userId == null || userId == '' || isNaN(+userId)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified and must be numeric.');
        return response;
    }
    
    let dbQuery = `SELECT section_id, preference
                   FROM section_assignment_preference 
                   WHERE person_id = $1
                   ORDER BY section_id`;
    let params = [userId];
    
    // Query the information for the respective user.
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to retrieve user preferences.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = {
        "preferences": dbRows
    };
    
    response.body = JSON.stringify(responseBody);
    return response;
};