const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userId = event?.pathParameters?.userId;
    
    let accessHeader = null;
    
    // Enable CORS for the requesting domain, if the domain
    // is one that we expect.
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" }
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }
    
    // If the API was called without specifying a user ID,
    // then return an error.
    if (userId == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified.');
        return response;
    }
    
    // Validate that a user with the specified ID exists
    // in the database before attempting a delete.
    const dbQueryValidate = `SELECT *
                             FROM person
                             WHERE person_id = $1`;
    let params = [userId];
    
    let userRows = await helper_functions.queryDB(dbQueryValidate, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Failed to query the specified user.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    // Error out if the user is not found.
    if (userRows.length === 0) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 404, 'Specified user does not exist.');
        return response;
    }
    
    let dbQueries = ['DELETE FROM person_unavailability WHERE person_id = $1',
                     'DELETE FROM qualification WHERE person_id = $1',
                     'DELETE FROM section_assignment WHERE person_id = $1',
                     'DELETE FROM section_assignment_preference WHERE person_id = $1',
                     'DELETE FROM trade_request WHERE person_id_sender = $1 OR person_id_receiver = $1',
                     'DELETE FROM person WHERE person_id = $1'];
    
    // Attempt to remove user records and all dependent records.
    for (const dbQuery of dbQueries) {
        await helper_functions.queryDB(dbQuery, params).catch((err) => {
            helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to delete user and associated dependencies.');
        });
        
        if (response.statusCode === 500) {
            return response;
        }
    }

    return response;
};