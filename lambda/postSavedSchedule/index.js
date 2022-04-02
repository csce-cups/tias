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
        response.body = JSON.stringify({err});
    })
    
    dbQuery = `INSERT INTO section_assignment
                VALUES
                `;
    
    let paramIndex = 1;
    for (let sectionId of Object.keys(scheduledObj)) {
        for (let personId of scheduledObj[sectionId]) {
            dbQuery += `($${paramIndex++}, $${paramIndex++})`;
            params.push(personId);
            params.push(sectionId);
        }
    }
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch(err => {
        response.statusCode = 500;
        response.body = JSON.stringify({err});
    });
    
    console.log(dbRows);

    return response;
};