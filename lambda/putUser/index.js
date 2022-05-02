const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    const params = [];
    let updates = [];
    
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
    // to update a user is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let updateData = JSON.parse(event.body);
    
    let paramIndex = 1;
    for(let fieldToUpdate of Object.keys(updateData)) {
        switch (fieldToUpdate) {
            case 'google_token_sub':
                updates.push(`google_token_sub = $${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'first_name':
                updates.push(`first_name = $${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'last_name':
                updates.push(`last_name = $${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'profile_photo_url':
                updates.push(`profile_photo_url = $${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'desired_number_assignments':
                updates.push(`desired_number_assignments = $${paramIndex++}`);
                params.push(+updateData[fieldToUpdate]);
                break;
            case 'is_peer_teacher':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("peer_teacher = true");
                }
                else if (updateData[fieldToUpdate] == false) {
                    updates.push("peer_teacher = false");
                }
                break;
            case 'is_teaching_assistant':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("teaching_assistant = true");
                }
                else if (updateData[fieldToUpdate] == false) {
                    updates.push("teaching_assistant = false");
                }
                break;
            case 'is_professor':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("professor = true");
                }
                else if (updateData[fieldToUpdate] == false) {
                    updates.push("professor = false");
                }
                break;
            case 'is_administrator':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("administrator = true");
                }
                else if (updateData[fieldToUpdate] == false) {
                    updates.push("administrator = false");
                }
                break;
        }
    }
    
    let setClause = "SET ";
    
    for(let i = 0; i < updates.length; i++) {
        if (i !== 0) {
            setClause += ", ";
        }
        
        setClause += updates[i];
    }
    
    params.push(id);
    
    const dbQuery = 
    `
        UPDATE person
        ${setClause}
        WHERE person_id = $${paramIndex}
    `;
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to update user.');
    });

    return response;
};