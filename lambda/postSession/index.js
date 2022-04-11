const helper_functions = require("./helper_functions");
const { OAuth2Client } = require('google-auth-library');
const awsSDK = require('aws-sdk');
const axios = require('axios');
const cryptoLib = require('crypto');
awsSDK.config.update({ region: 'us-east-1' });

async function getExistingUserID(userTokenHash, userEmail) {
    let dbQuery = `SELECT *
                   FROM person
                   WHERE `;
    const params = [];
    
    if (userTokenHash !== null) {
        dbQuery += 'google_token_sub = $1';
        params.push(userTokenHash);
    }
    else if (userEmail !== null) {
        dbQuery += 'email = $1';
        params.push(userEmail);
    }
    
    let dbRows = await helper_functions.queryDB(dbQuery, params);
    
    if (dbRows.length == 0) {
        return null;
    }
    else {
        return dbRows[0].person_id;
    }
}

function createUser(requestBody) {
    return new Promise((resolve, reject) => {
        axios
            .post('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users', requestBody)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function updateUser(userID, requestBody) {
    return new Promise((resolve, reject) => {
        axios
            .put(`https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/users/${userID}`, requestBody)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

exports.handler = async (event) => {
    let accessHeader = null;
    
    if (event.headers.origin === 'https://www.csce-scheduler.com') {
        accessHeader = 'https://www.csce-scheduler.com';
    }
    else if (event.headers.origin === 'http://localhost:3000') {
        accessHeader = 'http://localhost:3000';
    }
    
    let response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json", 
                   "Access-Control-Allow-Origin": accessHeader }
    };
    
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
    let userTokenHash = cryptoLib.createHash('md5').update(userToken).digest('hex');
    
    let userID = await getExistingUserID(userTokenHash, null);
    if (userID != null) {
        dbID = userID;
    }
    else {
        userID = await getExistingUserID(null, requestBody.email);
        if (userID != null) {
            dbID = userID;
            await updateUser(dbID, {'google_token_sub': userTokenHash, 'profile_photo_url': requestBody.profilePhoto});
        }
        else {
            requestBody.token = userTokenHash;
            dbID = await createUser(requestBody);
        }
    }
    
    response.body = JSON.stringify({ id: dbID });
    return response;
};
