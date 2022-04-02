const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let userInfo                = JSON.parse(event.body);
    let userToken               = userInfo.token;
    let userEmail               = userInfo.email;
    let userFirstName           = userInfo.firstName;
    let userLastName            = userInfo.lastName;
    let userProfilePhoto        = userInfo.profilePhoto;
    let userIsPeerTeacher       = userInfo.isPeerTeacher;
    let userIsTeachingAssistant = userInfo.isTeachingAssistant;
    let userIsProfessor         = userInfo.isProfessor;
    let userIsAdmin             = userInfo.isAdmin;
    
    const dbQuery = 
    `
        INSERT INTO person (google_token_sub, email, first_name, last_name, 
                            profile_photo_url, peer_teacher, teaching_assistant, 
                            administrator, professor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING person_id
    `;
    const params = [userToken, userEmail, userFirstName, userLastName, userProfilePhoto, 
                    userIsPeerTeacher, userIsTeachingAssistant, userIsProfessor, 
                    userIsAdmin];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    let responseBody = {
        person_id: dbRows[0].person_id
    };
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify(responseBody)
    };

    return response;
};