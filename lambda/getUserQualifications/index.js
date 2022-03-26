const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userId = event?.pathParameters?.userId;
    
    let dbQuery = `SELECT qualification.course_id, course.course_number, qualification.qualified
                   FROM qualification JOIN course
                   ON qualification.course_id = course.course_id
                   WHERE qualification.person_id = $1`;
    let params = [userId];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const responseBody = {
        "qualifications": dbRows
    };

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};