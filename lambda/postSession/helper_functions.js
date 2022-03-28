/*
    Structure of getStoredParameter motivated by user Imran on 
    stackoverflow.com/questions/53973798/getting-values-from-parameter-store-in-aws
    and by documentation provided by Amazon Web Services at 
    https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameter-property
*/

const awsSDK = require('aws-sdk');
awsSDK.config.update({ region: 'us-east-1' });

const { Client } = require('pg');

const sysManagerClient = new awsSDK.SSM();

let dbEndpoint = null;
let dbName = null;
let dbUsername = null;
let dbPass = null;

const getStoredParameter = (parameterName) => {
    return new Promise((resolve, reject) => {
        sysManagerClient.getParameter({
            Name: parameterName,
            WithDecryption: true,
        }, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
};

const prefetchDBInfo = async () => {
    let paramResponse = null;

    paramResponse = await getStoredParameter('/tias/prod/db-endpoint');
    dbEndpoint = paramResponse.Parameter.Value;

    paramResponse = await getStoredParameter('/tias/prod/db-name');
    dbName = paramResponse.Parameter.Value;

    paramResponse = await getStoredParameter('/tias/prod/db-username');
    dbUsername = paramResponse.Parameter.Value;

    paramResponse = await getStoredParameter('/tias/prod/db-password');
    dbPass = paramResponse.Parameter.Value;
};

const queryDB = async (dbQuery, params) => {
  await prefetchDBInfo(dbQuery, params);
  
  const client = new Client({
    user: dbUsername,
    host: dbEndpoint,
    database: dbName,
    password: dbPass,
    port: 5432,
  });

  client.connect();
  
  return await client
    .query(dbQuery, params)
    .then((dbResponse) => {
		client.end();
        return dbResponse.rows;
    })
    .catch((error) => console.error(error));
};

module.exports = { getStoredParameter, prefetchDBInfo, queryDB };