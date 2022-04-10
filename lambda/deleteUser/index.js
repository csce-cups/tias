const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userId = event?.pathParameters?.userId;
    
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
    
    let dbQueries = ['DELETE FROM person_unavailability WHERE person_id = $1',
                     'DELETE FROM qualification WHERE person_id = $1',
                     'DELETE FROM section_assignment WHERE person_id = $1',
                     'DELETE FROM section_assignment_preference WHERE person_id = $1',
                     'DELETE FROM trade_request WHERE person_id_sender = $1 OR person_id_receiver = $1',
                     'DELETE FROM person WHERE person_id = $1'];
    let params = [userId];
    
    for (const dbQuery of dbQueries) {
        await helper_functions.queryDB(dbQuery, params).catch((err) => {
            helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to delete user and associated dependencies.');
        });
        
        if (response.statusCode === 500) {
            return response;
        }
    }

    return response;
};