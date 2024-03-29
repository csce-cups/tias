const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userId = event?.pathParameters?.userId;
    
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
                     "Access-Control-Allow-Origin": accessHeader }
    };
    
    let dbQuery = `SELECT * FROM "Viability" WHERE person_id = $1`;
    let params = [userId];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, `Unable to retrieve user's viable courses.`);
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = {
        "viableCourses": dbRows
    };
    
    response.body = JSON.stringify(responseBody);

    return response;
};