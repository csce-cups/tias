const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const dbQuery = 
    `
        SELECT * FROM section_assignment
    `;
    const params = [];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const responseBody = { scheduled: {} };
    
    for (let row of dbRows) {
        if (responseBody.scheduled[row.section_id] === undefined) {
            responseBody.scheduled[row.section_id] = []
        }
        responseBody.scheduled[row.section_id].push(row.person_id)
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};