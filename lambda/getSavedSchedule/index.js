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
        "headers": { "Content-Type": "application/json", 
                     "Access-Control-Allow-Origin": accessHeader }
    };
    
    const dbQuery = 
    `
        SELECT * FROM section_assignment
    `;
    const params = [];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to load saved schedule.');
    });

    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = { scheduled: {} };
    
    for (let row of dbRows) {
        if (responseBody.scheduled[row.section_id] === undefined) {
            responseBody.scheduled[row.section_id] = [];
        }
        responseBody.scheduled[row.section_id].push(row.person_id);
    }

    response.body = JSON.stringify(responseBody);
    return response;
};