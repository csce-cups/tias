const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let requestBody = JSON.parse(event.body);
    let accessHeader = null;
    
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", 
                     "Access-Control-Allow-Origin": accessHeader }
    };
    
    const dbQuery = `INSERT INTO course (department, course_number, course_name)
                     VALUES ($1, $2, $3)`;
    const params = [requestBody.department, requestBody.course_number, requestBody.course_name];
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to add course.');
    });

    return response;
};