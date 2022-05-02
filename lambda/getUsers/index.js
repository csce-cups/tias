const helper_functions = require("./helper_functions");

let params = [];
let paramIndex = 1;

/*
    Construct a query for users, taking into account all
    specified filters. If a particular user ID was specified,
    then query for the specified user.
*/
const constructDBQuery = (userId, userEmail, userFirstName, userLastName, userTypes) => {
    let baseQuery = `
        SELECT person_id, email, first_name, last_name, profile_photo_url,
               desired_number_assignments, peer_teacher, teaching_assistant, 
               administrator, professor
            FROM person`;
    
    let whereClause = " WHERE ";
    let conditions = [];
    
    // Query by ID.
    if (userId) {
        conditions.push(`person_id = $${paramIndex}`);
        paramIndex++;
        params.push(userId);
    }
    
    // Filter by email.
    if (userEmail) {
        conditions.push(`email = $${paramIndex}`);
        paramIndex++;
        params.push(userEmail);
    }
    
    // Filter by first name.
    if (userFirstName) {
        conditions.push(`first_name ILIKE $${paramIndex}`);
        paramIndex++;
        params.push(userFirstName);
    }
    
    // Filter by last name.
    if (userLastName) {
        conditions.push(`last_name ILIKE $${paramIndex}`);
        paramIndex++;
        params.push(userLastName);
    }
    
    // Filter by user type (potentially multiple).
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
    
    // Complete the WHERE clause using specified
    // filters.
    for(let i = 0; i < conditions.length; i++) {
        if (i !== 0) {
            whereClause += " AND ";
        }
        
        whereClause += conditions[i];
    }
    
    let fullQuery = null;
    // If no filters are specified, and thus
    // the WHERE clause is not expanded, then
    // query all users.
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
    // Can filter users by type using query string parameters,
    // types are: peer-teacher, teaching-assistant, administrator,
    // and professor. Multiple types can be specified.
    let userTypes     = event?.multiValueQueryStringParameters?.usertype;
    // Can filter users by their first name, last name, and email.
    let userFirstName = event?.queryStringParameters?.firstname;
    let userLastName  = event?.queryStringParameters?.lastname;
    let userEmail     = event?.queryStringParameters?.email;
    
    let accessHeader = null;
    
    // Appease CORS for the requesting domain, if the domain
    // is one that we expect.
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" }
    };
    
    // Set the access header only upon an expected domain;
    // setting the access header to null in the response isn't
    // necessarily safe.
    if (accessHeader !== null) {
        response.headers['Access-Control-Allow-Origin'] = accessHeader;
        response.headers['Vary'] = 'Origin';
    }
    
    params = [];
    // Construct a users query and query the DB.
    let dbQuery = constructDBQuery(userId, userEmail, userFirstName, userLastName, userTypes);
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, "Unable to retrieve specified user(s).");
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const responseBody = {
        "users": dbRows
    };

    response.body = JSON.stringify(responseBody);
    return response;
};