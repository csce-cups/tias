const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const person_id = event?.pathParameters?.userId;

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "http://localhost:3000" },
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