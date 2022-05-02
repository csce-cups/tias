const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const person_id = event?.pathParameters?.userId;
    
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
                     "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify({
            trade_requests: await helper_functions.queryDB(
                `SELECT * FROM trade_request WHERE person_id_sender = $1 OR person_id_receiver = $1`
                , [person_id]
            )
            .catch(
                err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the trade requests.")
            )
        })
    };

    return response;
};