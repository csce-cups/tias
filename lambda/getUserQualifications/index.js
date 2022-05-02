const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    
    // Enable CORS for the requesting domain, if the domain
    // is one that we expect.
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
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
    
    let userId = event?.pathParameters?.userId;
    
    // If the API was called without specifying a user ID,
    // then return an error.
    if (userId == null || userId == '' || isNaN(+userId)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified and must be numeric.');
        return response;
    }
    
    let dbQuery = `SELECT course.course_id, course.course_number, qualification.qualified
                   FROM qualification JOIN course
                   ON qualification.course_id = course.course_id
                   WHERE qualification.person_id = $1`;
    let params = [userId];
    
    // Get the user's qualifications for all courses that the
    // user has marked qualifications for.
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to retrieve user qualifications.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = {
        "qualifications": dbRows
    };
    
    response.body = JSON.stringify(responseBody);
    return response;
};