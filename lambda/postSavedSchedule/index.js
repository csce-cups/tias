const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let scheduledObj = JSON.parse(event.body).scheduled;

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({})
    };

    await helper_functions.queryDB(`DELETE FROM section_assignment`, []).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err: "Failed to delete the old schedule."});
    })

    await helper_functions.queryDB(`DELETE FROM trade_request`, []).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err: "Failed to delete the old trade requests."});
    })
    
    let dbQuery = `INSERT INTO section_assignment
                VALUES
                `;
    let params = []
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