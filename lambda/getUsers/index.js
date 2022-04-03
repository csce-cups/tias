const helper_functions = require("./helper_functions");

let params = [];
let paramIndex = 1;

const constructDBQuery = (userId, userEmail, userFirstName, userLastName, userTypes) => {
    let baseQuery = `
        SELECT person_id, email, first_name, last_name, profile_photo_url,
               desired_number_assignments, peer_teacher, teaching_assistant, 
               administrator, professor
            FROM person`;
    
    let whereClause = " WHERE ";
    let conditions = [];
    
    if (userId) {
        conditions.push(`person_id = $${paramIndex}`);
        paramIndex++;
        params.push(userId);
    }
    
    if (userEmail) {
        conditions.push(`email = $${paramIndex}`);
        paramIndex++;
        params.push(userEmail);
    }
    
    if (userFirstName) {
        conditions.push(`first_name ILIKE $${paramIndex}`);
        paramIndex++;
        params.push(userFirstName);
    }
    
    if (userLastName) {
        conditions.push(`last_name ILIKE $${paramIndex}`);
        paramIndex++;
        params.push(userLastName);
    }
    
    if (userTypes) {
        userTypes.forEach((userTypeElement) => {
            if (userTypeElement === 'peer-teacher') {
                conditions.push("peer_teacher = true");
            }
            else if (userTypeElement === 'teaching-assistant') {
                conditions.push("teaching_assistant = true");
            }
            else if (userTypeElement === 'administrator') {
                conditions.push("administrator = true");
            }
            else if (userTypeElement === 'professor') {
                conditions.push("professor = true");
            }
        });
    }
    
    for(let i = 0; i < conditions.length; i++) {
        if (i !== 0) {
            whereClause += " AND ";
        }
        
        whereClause += conditions[i];
    }
    
    let fullQuery = null;
    if (whereClause.length === 7) {
        fullQuery = baseQuery;
    }
    else {
        fullQuery = baseQuery + whereClause;
    }
     
    return fullQuery;
};

exports.handler = async (event) => {
    let userId        = event?.pathParameters?.userId;
    let userTypes     = event?.multiValueQueryStringParameters?.usertype;
    let userFirstName = event?.queryStringParameters?.firstname;
    let userLastName  = event?.queryStringParameters?.lastname;
    let userEmail     = event?.queryStringParameters?.email;
    
    params = [];
    let dbQuery = constructDBQuery(userId, userEmail, userFirstName, userLastName, userTypes);
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const responseBody = {
        "users": dbRows
    };

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};