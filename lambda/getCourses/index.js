const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    
    // Appease CORS for the requesting domain, if the domain
    // is one that we expect.
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    // Return all courses currently 
    // in the database.
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify(
            await helper_functions.queryDB(
                `SELECT * FROM course`
                , []
            )
            .catch(
                err => helper_functions.GenerateErrorResponseAndLog(err, response, 500, "Failed to get the courses.")
            )
        )
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }

    return response;
};