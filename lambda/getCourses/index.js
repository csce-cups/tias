const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "http://localhost:3000" },
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