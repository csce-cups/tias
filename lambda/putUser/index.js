const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let updateData = JSON.parse(event.body);
    const params = [];
    let updates = [];
    
    let id = event?.pathParameters?.userId;
    
    let paramIndex = 1;
    for(let fieldToUpdate of Object.keys(updateData)) {
        switch (fieldToUpdate) {
            case 'google_token_sub':
                updates.push(`google_token_sub = ${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'profile_photo_url':
                updates.push(`profile_photo_url = ${paramIndex++}`);
                params.push(updateData[fieldToUpdate]);
                break;
            case 'desired_number_assignments':
                updates.push(`desired_number_assignments = ${paramIndex++}`);
                params.push(+updateData[fieldToUpdate]);
                break;
            case 'is_peer_teacher':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("peer_teacher = true");
                }
                break;
            case 'is_teaching_assistant':
                if (updateData[fieldToUpdate] == true) {
                    updates.push("teaching_assistant = true");
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
        WHERE person_id = ${paramIndex}
    `;
    console.log(dbQuery);
    console.log('id is:', id);
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    console.log(dbRows);
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify({})
    };

    return response;
};