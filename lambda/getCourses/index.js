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
                     "Access-Control-Allow-Origin": accessHeader },
        "body": JSON.stringify(
            await helper_functions.queryDB(
                `SELECT * FROM course`
                , []
            )
            .catch(
                err => helper_functions.GenerateErrorResponseAndLog(err, response, "Failed to get the courses.")
            )
        )
    };

    return response;
};