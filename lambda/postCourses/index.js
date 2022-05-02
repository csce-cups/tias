const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    
    // Appease CORS for the requesting domain, if the domain
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
    
    // If the event body was not specified, then necessary information
    // to populate a course is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let requestBody = JSON.parse(event.body);
    
    // Expectations: the department and course numbers should be non-null and
    // non-empty strings. Furthermore, the department should not be numeric.
    if (requestBody.department == null || requestBody.department == '' || !isNaN(+requestBody.department)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Course department must be specified and non-numeric.');
        return response;
    }
    if (requestBody.course_number == null || requestBody.course_number == '') {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Course number must be specified.');
        return response;
    }
    
    // Add the course to our data.
    const dbQuery = `INSERT INTO course (department, course_number, course_name)
                     VALUES ($1, $2, $3)`;
    const params = [requestBody.department, requestBody.course_number, requestBody.course_name];
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to add course.');
    });

    return response;
};