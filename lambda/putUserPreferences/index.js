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
        "headers": { "Content-Type": "application/json" }
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }
    
    let id = event?.pathParameters?.userId;
    
    // If the API was called without specifying a user ID,
    // or if the user ID is malformed, then return an error.
    if (id == null || id == '' || isNaN(+id)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified and must be numeric.');
        return response;
    }
    
    // If the event body was not specified, then necessary information
    // to update a user preferences is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let updateData = JSON.parse(event.body);
    
    let dbQuery = `INSERT INTO section_assignment_preference
                     VALUES
                     `;
    let params = [];
    
    let preferenceArray = updateData.preferences;
    let paramIndex = 1;
    let valueStrings = [];
    preferenceArray.forEach((preferenceObj) => {
       valueStrings.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(id);
        params.push(preferenceObj.section_id);
        switch(preferenceObj.preference) {
            case 'Prefer To Do':
                params.push('Prefer To Do');
                break;
            case 'Indifferent':
                params.push('Indifferent');
                break;
            case 'Prefer Not To Do':
                params.push('Prefer Not To Do');
                break;
            case 'Can\'t Do':
                params.push('Can\'t Do');
                break;
        }
    });
    
    for (let i = 0; i < valueStrings.length; i++) { 
        dbQuery += valueStrings[i];
        if (i != (valueStrings.length - 1)) {
            dbQuery += ",\n";
        }
        else {
            dbQuery += "\n";
        }
    }
    
    dbQuery += `ON CONFLICT(person_id, section_id)
                DO UPDATE SET preference = EXCLUDED.preference`;
    
    await helper_functions.queryDB(dbQuery, params);

    return response;
};