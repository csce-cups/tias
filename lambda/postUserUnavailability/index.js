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
    
    return `${hour - timezoneOffsetHours}:${minute}`;
};

exports.handler = async (event) => {
    let requestBody = JSON.parse(event.body);
    let id = event?.pathParameters?.userId;
    
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", 
                     "Access-Control-Allow-Origin": "http://localhost:3000"}
    };
    
    
    let dbQuery = `DELETE FROM person_unavailability
                   WHERE person_id = $1`;
    let params = [id];
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Update to user unavailability has failed.');
        return response;
    });
    
    
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
    }
    
    await helper_functions.queryDB(dbQuery, params).catch((err) => {
        helper_functions.GenerateErrorResponseAndLog(err, response, 'Update to user unavailability has failed.');
    });

    return response;
};