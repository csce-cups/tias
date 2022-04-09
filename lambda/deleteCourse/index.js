const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let courseId = event?.pathParameters?.courseId;
    
    let accessHeader = null;
    
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", 
                     "Access-Control-Allow-Origin": accessHeader }
    };
    
    const dbQuerySections = `SELECT section_id
                             FROM course_section
                             WHERE course_id = $1`;
    let params = [courseId];
    
    let sectionIDObjs = await helper_functions.queryDB(dbQuerySections, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Failed to query sections associated with specified course.');
        return response;
    });
    
    if (sectionIDObjs.length !== 0) {
        let sectionIDs = sectionIDObjs.map((sectionIDObj) => sectionIDObj.section_id);
    
        let inString = '(' + sectionIDs.join() + ')';
        
        let dbQueries = [`DELETE FROM trade_request WHERE section_id_sender IN ${inString} OR section_id_receiver IN ${inString}`,
                         `DELETE FROM section_assignment_preference WHERE section_id IN ${inString}`,
                         `DELETE FROM section_assignment WHERE section_id IN ${inString}`,
                         `DELETE FROM section_meeting WHERE section_id IN ${inString}`,
                         `DELETE FROM course_section WHERE section_id IN ${inString}`];
        params = [];
        
        for (const dbQuery of dbQueries) {
            await helper_functions.queryDB(dbQuery, params).catch((err) => {
                helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to delete course and associated dependencies.');
                return response;
            });
        }
    }

    let dbQueries = ['DELETE FROM qualification WHERE course_id = $1',
                     'DELETE FROM course WHERE course_id = $1'];
    params = [courseId];
    
    for (const dbQuery of dbQueries) {
        await helper_functions.queryDB(dbQuery, params).catch((err) => {
            helper_functions.GenerateErrorResponseAndLog(err, response, 'Unable to delete course and associated dependencies.');
            return response;
        });
    }

    return response;
};