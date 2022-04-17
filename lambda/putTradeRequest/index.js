const helper_functions = require("./helper_functions");

const UpdateTradeRequest = async (sender, senderCourse, receiver, receiverCourse, status) => {
    console.log(`UpdateTradeRequest: ${sender}, ${senderCourse}, ${receiver}, ${receiverCourse}, ${status}`);
    let dbQuery = `UPDATE trade_request 
                   SET request_status = $1
                   WHERE person_id_sender = $2 AND section_id_sender = $3
                   AND person_id_receiver = $4 AND section_id_receiver = $5`;
    let params = [status, sender, senderCourse, receiver, receiverCourse];
    return await helper_functions.queryDB(dbQuery, params);
};

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
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": accessHeader }
    };
    
    const userId = +event?.pathParameters?.userId;
    const requestBody = JSON.parse(event.body);
    
    const sender         = requestBody.person_id_sender;
    const senderCourse   = requestBody.section_id_sender;
    const receiver       = requestBody.person_id_receiver;
    const receiverCourse = requestBody.section_id_receiver;
    const tradeReqStatus = requestBody.request_status;

    let request = await helper_functions.queryDB(`
    SELECT *
    FROM trade_request
    WHERE person_id_sender = $1
    AND section_id_sender = $2
    AND person_id_receiver = $3
    AND section_id_receiver = $4
    AND request_status = 'Pending'`
    , [sender, senderCourse, receiver, receiverCourse])
    .catch(err => helper_functions.GenerateErrorResponseAndLog(err, response, 'Failed to get an existing trade request from the database.'));
    
    if (response.statusCode === 500) {
        return response;
    }

    if (!request.length) {
        helper_functions.GenerateErrorResponseAndLog({stack: ''}, response, 'Not trade requests in the database exist with the given parameters.');
        return;
    }
    
    if(userId === sender) {
        if (tradeReqStatus !== 'Cancelled') {
            helper_functions.GenerateErrorResponseAndLog({stack: ''}, response, 'Invalid request status.');
        }
        else {
            await UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
        }
    }
    else if (userId === receiver) {
        if (tradeReqStatus === 'Accepted') {
            await UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
            let actions = []
            actions.push(helper_functions.queryDB(`
                UPDATE trade_request 
                SET request_status = 'Cancelled'
                WHERE 
                request_status = 'Pending'
                AND
                (
                    (person_id_sender = $1 AND section_id_sender = $2)
                    OR
                    (person_id_receiver = $1 AND section_id_receiver = $2)
                )
            `, [sender, senderCourse]))
            const reassign_query = `
                UPDATE section_assignment
                SET person_id = $1
                WHERE person_id = $2 AND section_id = $3
            `;
            actions.push(helper_functions.queryDB(reassign_query, [sender, receiver, receiverCourse]))
            actions.push(helper_functions.queryDB(reassign_query, [receiver, sender, senderCourse]))
            await Promise.all(actions)
        }
        else if (tradeReqStatus === 'Rejected') {
            await UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
        }
        else {
            helper_functions.GenerateErrorResponseAndLog({stack: ''}, response, 'Invalid request status.');
        }
    }
    else {
        helper_functions.GenerateErrorResponseAndLog({stack: ''}, response, 'Invalid request user ids.');
    }

    return response;
};