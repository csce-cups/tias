const helper_functions = require("./helper_functions");

const constructDBQuery = (userId, userTypes, params) => {
    let baseQuery = `
        SELECT person_id, email, first_name, last_name, profile_photo_url,
            peer_teacher, teaching_assistant, administrator, professor
        FROM person`;
    
    let whereClause = " WHERE ";
    let conditions = [];
    
    if (userId) {
        conditions.push("person_id = $1");
        params.push(userId);
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
    let userId = event?.pathParameters?.userId;
    let userTypes = event?.multiValueQueryStringParameters?.userType;
    
    let params = [];
    let dbQuery = constructDBQuery(userId, userTypes, params);
    
    console.log(dbQuery);
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const responseBody = {
        "users": dbRows
    };

    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};