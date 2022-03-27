const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let qualificationsObj = JSON.parse(event.body).qualifications;
    let id = event?.pathParameters?.userId;
    
    for(let courseID of Object.keys(qualificationsObj)) {
        let dbQuery = `UPDATE qualification 
                       SET qualified= $1 
                       WHERE person_id = $2 AND course_id = $3
                     `;
        let params = [qualificationsObj[courseID], id, courseID];
        await helper_functions.queryDB(dbQuery, params);
    }

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify({})
    };

    return response;
};