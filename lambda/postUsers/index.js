const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
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
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": accessHeader }
    };
    
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
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    const qualificationsQuery = 
    `
        INSERT INTO qualification
        SELECT '${dbRows[0].person_id}', course.course_id, 'false' FROM course
    `;
    const qualificationsParams = [];
    
    await helper_functions.queryDB(qualificationsQuery, qualificationsParams);
    
    let responseBody = {
        person_id: dbRows[0].person_id
    };

    response.body = JSON.stringify(responseBody);
    return response;
};