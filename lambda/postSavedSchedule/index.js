const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let scheduledObj = JSON.parse(event.body).scheduled;
    
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
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify({})
    };
    
    let dbQuery = `TRUNCATE section_assignment`;
    let params = [];

    await helper_functions.queryDB(dbQuery, params).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to delete the old schedule."))

    if (response.statusCode === 500) {
        return response;
    }
                
    dbQuery = `TRUNCATE trade_request`;

    await helper_functions.queryDB(dbQuery, params).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to delete the trade requests."));

    if (response.statusCode === 500) {
        return response;
    }
    
    dbQuery = `INSERT INTO section_assignment
                VALUES`;
    
    let dbParams = []

    let paramIndex = 1;
    for (let sectionId of Object.keys(scheduledObj)) {
        for (let personId of scheduledObj[sectionId]) {
            dbParams.push(`($${paramIndex++}, $${paramIndex++})`);
            params.push(personId);
            params.push(sectionId);
        }
    }

    dbQuery += dbParams.join(', ');
    
    await helper_functions.queryDB(dbQuery, params).catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to save the new schedule."))

    if (response.statusCode === 500) {
        return response;
    }

    return response;
};