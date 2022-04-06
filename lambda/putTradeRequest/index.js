const helper_functions = require("./helper_functions");

const UpdateTradeRequest = async (sender, senderCourse, receiver, receiverCourse, status) => {
    let dbQuery = `UPDATE trade_request 
                   SET request_status = $1
                   WHERE person_id_sender = $2 AND section_id_sender = $3
                   AND person_id_receiver = $4 AND section_id_receiver = $5`;
    let params = [status, sender, senderCourse, receiver, receiverCourse];
    await helper_functions.queryDB(dbQuery, params);
};

exports.handler = async (event) => {
    const response = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
    };
    
    const userId = event?.pathParameters?.userId;
    const requestBody = JSON.parse(event.body);
    
    const sender         = requestBody.trade_request.person_id_sender;
    const senderCourse   = requestBody.trade_request.course_section_id_sender;
    const receiver       = requestBody.trade_request.person_id_receiver;
    const receiverCourse = requestBody.trade_request.course_section_id_receiver;
    const tradeReqStatus = requestBody.trade_request.trade_req_status;
    
    if(userId == sender) {
        if (tradeReqStatus != 'Cancelled') {
            helper_functions.GenerateErrorResponseAndLog({stack: ''}, response, 'Invalid request status.');
        }
        else {
            UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
        }
    }
    else if (userId == receiver) {
        if (tradeReqStatus == 'Accepted') {
            UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
        }
        else if (tradeReqStatus == 'Rejected') {
            UpdateTradeRequest(sender, senderCourse, receiver, receiverCourse, tradeReqStatus);
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