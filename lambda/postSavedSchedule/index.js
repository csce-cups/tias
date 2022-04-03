const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let scheduledObj = JSON.parse(event.body).scheduled;

    let dbQuery = `DELETE FROM section_assignment`;
    let params = [];

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({})
    };

    await helper_functions.queryDB(dbQuery, params).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err: "Failed to delete the old schedule."});
    })
    
    dbQuery = `INSERT INTO section_assignment
                VALUES
                `;
    
    let dbParams = []

    let paramIndex = 1;
    for (let sectionId of Object.keys(scheduledObj)) {
        for (let personId of scheduledObj[sectionId]) {
            dbParams.push(`($${paramIndex++}, $${paramIndex++})`);
            params.push(personId);
            params.push(sectionId);
        }
    }

    dbQuery += dbParams.join(', ');
    
    await helper_functions.queryDB(dbQuery, params).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err: "Failed to save the new schedule."});
    });

    return response;
};