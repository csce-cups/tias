const helper_functions = require("./helper_functions");

const weekday_map_ics = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday"
};

const formatTime = (DT, timezoneOffsetHours) => {
    let utcTime = DT.split('T')[1];
    utcTime = utcTime.substring(0, utcTime.length - 1);
    
    let hour = +utcTime.substring(0, 2);
    let minute = +utcTime.substring(2, 4);
    
    return `${((hour - timezoneOffsetHours) % 24 + 24) % 24}:${minute}`;
};

exports.handler = async (event) => {
    let id = event?.pathParameters?.userId;
    
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
    
    // If the API was called without specifying a user ID,
    // or if the user ID is malformed, then return an error.
    if (id == null || id == '' || isNaN(+id)) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'User ID must be specified and must be numeric.');
        return response;
    }
    
    // If the event body was not specified, then necessary information
    // to update unavailability is missing; return an error.
    if (event.body == null) {
        helper_functions.GenerateErrorResponseAndLog(null, response, 400, 'Missing Request Body.');
        return response;
    }
    
    let requestBody = JSON.parse(event.body);
    
    let dbQuery = `DELETE FROM person_unavailability
                   WHERE person_id = $1`;
    let params = [id];
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Update to user unavailability has failed.');
    });
    
    if (response.statusCode === 500) {
        return response;
    }
    
    dbQuery = `INSERT INTO person_unavailability
               VALUES
                     `;
    params = [];
    
    let unavailabilityArr = requestBody.unavailability;
    let paramIndex = 1;
    let timezoneOffsetHours = requestBody.timezoneOffsetHours;
    let valueStrings = [];
    unavailabilityArr.forEach((unavailabilityObj) => {
        let courseWeekdays  = unavailabilityObj.BYDAY.split(',');
        let courseStartTime = formatTime(unavailabilityObj.DTSTART, timezoneOffsetHours);
        let courseEndTime   = formatTime(unavailabilityObj.DTEND, timezoneOffsetHours);
        courseWeekdays.forEach((weekday) => {
            valueStrings.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
            params.push(id);
            params.push(weekday_map_ics[weekday]);
            params.push(courseStartTime);
            params.push(courseEndTime);
        });
    });
    
    for (let i = 0; i < valueStrings.length; i++) { 
        dbQuery += valueStrings[i];
        if (i != (valueStrings.length - 1)) {
            dbQuery += ",\n";
        }
        else {
            dbQuery += "\n";
        }
    }
    
    dbQuery += `ON CONFLICT(person_id, weekday, start_time, end_time) DO NOTHING`;
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 500, 'Update to user unavailability has failed.');
    });

    return response;
};