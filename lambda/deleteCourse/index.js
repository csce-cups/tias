const helper_functions = require("./helper_functions");

exports.handler = async (event) => {
    let courseId = event?.pathParameters?.courseId;
    
    let accessHeader = null;
    
    // Enable CORS for the requesting domain, if the domain
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
    
    // If the API was called without specifying a course ID,
    // then return an error.
    if (courseId == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Course ID must be specified.');
        return response;
    }
    
    // Validate that a course with the specified ID exists
    // in the database before attempting a delete.
    const dbQueryValidate = `SELECT *
                             FROM course
                             WHERE course_id = $1`;
    let params = [courseId];
    
    // Check if the course being deleted exists.
    let courseRows = await helper_functions.queryDB(dbQueryValidate, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Failed to query the specified course.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    // Error out if the course is not found.
    if (courseRows.length === 0) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 404, 'Specified course does not exist.');
    }
    
    // Query all course sections associated with
    // the course being deleted.
    const dbQuerySections = `SELECT section_id
                             FROM course_section
                             WHERE course_id = $1`;
    
    let sectionIDObjs = await helper_functions.queryDB(dbQuerySections, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Failed to query sections associated with specified course.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    // If course sections existed for the course being deleted,
    // then delete all records in our database relevant to the
    // respective sections.
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
                helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to delete course and associated dependencies.');
            });
            
            if (response.statusCode === 500) {
                return response;
            }
        }
    }
    
    let dbQueries = ['DELETE FROM qualification WHERE course_id = $1',
                     'DELETE FROM course WHERE course_id = $1'];
    params = [courseId];
    
    // Delete records related to the course itself, rather than
    // the course's sections to finish deletion. Includes deletion
    // of user qualification records for the course.
    for (const dbQuery of dbQueries) {
        await helper_functions.queryDB(dbQuery, params).catch((err) => {
            helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Unable to delete course and associated dependencies.');
        });
        
        if (response.statusCode === 500) {
            return response;
        }
    }

    return response;
};