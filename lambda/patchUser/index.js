const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let updateData = JSON.parse(event.body);
    let updates = [];
    
    let id = event?.pathParameters?.userId;
    
    for(let fieldToUpdate of Object.keys(updateData)) {
        switch (fieldToUpdate) {
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
    
    const dbQuery = 
    `
        UPDATE person
        ${setClause}
        WHERE person_id = $1
    `;
    console.log(dbQuery);
    console.log('id is:', id);
    const params = [id];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    console.log(dbRows);
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({})
    };

    return response;
};