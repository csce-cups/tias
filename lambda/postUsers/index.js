const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let accessHeader = null;
    
    if (event.headers.origin == 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin == 'http://localhost:3000') {
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
    
    // If the event body was not specified, then necessary information
    // to create a user is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let userInfo                = JSON.parse(event.body);
    let userTokenHash           = userInfo.token;
    let userEmail               = userInfo.email;
    let userFirstName           = userInfo.firstName ?? '';
    let userLastName            = userInfo.lastName ?? '';
    let userProfilePhoto        = userInfo.profilePhoto ?? '';
    let userIsPeerTeacher       = userInfo.isPeerTeacher ?? false;
    let userIsTeachingAssistant = userInfo.isTeachingAssistant ?? false;
    let userIsProfessor         = userInfo.isProfessor ?? false;
    let userIsAdmin             = userInfo.isAdministrator ?? false;
    
    if ((userTokenHash == null || userTokenHash == '') && (userEmail == null || userEmail == '')) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Must specify either token or email address.');
        return response;
    }
    
    const dbQuery = 
    `
        INSERT INTO person (google_token_sub, email, first_name, last_name, 
                            profile_photo_url, peer_teacher, teaching_assistant, 
                            administrator, professor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING person_id
    `;
    const params = [userTokenHash, userEmail, userFirstName, userLastName, userProfilePhoto, 
                    userIsPeerTeacher, userIsTeachingAssistant, userIsAdmin, userIsProfessor];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to add user.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    const qualificationsQuery = 
    `
        INSERT INTO qualification
        SELECT '${dbRows[0].person_id}', course.course_id, 'false' FROM course
    `;
    const qualificationsParams = [];
    
    await helper_functions.queryDB(qualificationsQuery, qualificationsParams).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to add user default qualifications.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    let responseBody = {
        person_id: dbRows[0].person_id
    };

    response.body = JSON.stringify(responseBody);
    return response;
};