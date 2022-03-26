const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let updateData = JSON.parse(event.body);
    let id = event?.pathParameters?.userId;
    
    let dbQuery = `INSERT INTO section_assignment_preference
                     VALUES
                     `;
    let params = [];
    
    let preferenceArray = updateData.preferences;
    let paramIndex = 1;
    preferenceArray.forEach((preferenceObj) => {
        dbQuery += `($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`;
        params.push(id);
        params.push(preferenceObj.section_id);
        switch(preferenceObj.preference) {
            case 'Prefer To Do':
                params.push('Prefer To Do');
                break;
            case 'Prefer Not To Do':
                params.push('Prefer Not To Do');
                break;
            case 'Can\'t Do':
                params.push('Can\'t Do');
                break;
        }
    });
    
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