const helper_functions = require("./helper_functions");
const { OAuth2Client } = require('google-auth-library');
const awsSDK = require('aws-sdk');
const axios = require('axios')
awsSDK.config.update({ region: 'us-east-1' });

async function userExists(userToken) {
    const dbQuery = 
    `
        SELECT *
            FROM person
            WHERE google_token_sub = $1
    `;
    const params = [userToken];
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    if (dbRows.length == 0) {
        console.log('returning null');
        return null;
    }
    else {
        return dbRows[0].person_id;
    }
}

function createUser(requestBody) {
    return new Promise((resolve, reject) => {
        axios
            .put('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users', requestBody)
            .then(res => {
                console.log('result is', res);
                resolve(res);
            })
            .catch(error => {
                console.log('error is', error);
                reject(error);
            });
    });
}

exports.handler = async (event) => {
    let requestBody = JSON.parse(event.body);
    let token = requestBody.token;
    let dbID = null;

    let paramResponse = null;

    paramResponse = await helper_functions.getStoredParameter('/tias/prod/google-client-id');
    let clientID = paramResponse.Parameter.Value;
    
    const client = new OAuth2Client(clientID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientID
    });

    const payload = ticket.getPayload();
    const userToken = payload['sub'];
    
    let userID = await userExists(userToken);
    if (userID != null) {
        dbID = userID;
    }
    else {
        requestBody.token = userToken;
        await createUser(requestBody).then((response) => { dbID = response.data.person_id});
    }
    
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" },
        body: JSON.stringify({ id: dbID }),
    };
    
    return response;
};
