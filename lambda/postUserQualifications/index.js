const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let qualificationsObj = JSON.parse(event.body).qualifications;
    let id = event?.pathParameters?.userId;
    
    let dbQuery = `INSERT INTO qualification
                     VALUES
                     `;
    let params = [];
    
    let paramIndex = 1;
    let valueStrings = [];
    for(let course of Object.keys(qualificationsObj)) {
        valueStrings.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(id);
        params.push(course);
        params.push(qualificationsObj[course]);
    }
    
    for (let i = 0; i < valueStrings.length; i++) { 
        dbQuery += valueStrings[i];
        if (i != (valueStrings.length - 1)) {
            dbQuery += ",\n";
        }
    }
    
    console.log(dbQuery);
    
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