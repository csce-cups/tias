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
    await Promise.all([
    getStoredParameter('/tias/prod/db-endpoint').then(paramResponse => {
      dbEndpoint = paramResponse.Parameter.Value;
    }),
    
    getStoredParameter('/tias/prod/db-name').then(paramResponse => {
      dbName = paramResponse.Parameter.Value;
    }),
    
    getStoredParameter('/tias/prod/db-username').then(paramResponse => {
      dbUsername = paramResponse.Parameter.Value;
    }),
    
    getStoredParameter('/tias/prod/db-password').then(paramResponse => {
      dbPass = paramResponse.Parameter.Value;
    }),
  ]);
};

const queryDB = async (dbQuery, params) => {
  if (!dbEndpoint || !dbName || !dbUsername || !dbPass) {
    await prefetchDBInfo(dbQuery, params);
  }
  
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
        return dbResponse.rows;
    })
    .catch((error) => console.error(error))
    .finally(() => client.end());
};

const GenerateErrorResponseAndLog = (err, response, code, msg) => {
    if (err !== null) {
        console.error('error: ', err);
        console.error('trace: ', err.stack);
    }
    response.statusCode = code;
    response.body = JSON.stringify({err: msg});
};

module.exports = { prefetchDBInfo, queryDB, GenerateErrorResponseAndLog };