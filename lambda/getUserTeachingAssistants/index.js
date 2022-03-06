/*
    Structure of getStoredParameter motivated by user Imran on 
    stackoverflow.com/questions/53973798/getting-values-from-parameter-store-in-aws
    and by documentation provided by Amazon Web Services at 
    https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#getParameter-property
*/

const awsSDK = require('aws-sdk');
awsSDK.config.update({ region: 'us-east-1' });
const { Pool, Client } = require('pg')

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

const queryUserTeachingAssistants = async (professorId) => {
  const client = new Client({
    user: dbUsername,
    host: dbEndpoint,
    database: dbName,
    password: dbPass,
    port: 5432,
  });

  client.connect();

  const query = `SELECT p.person_id, p.first_name, p.last_name
                    FROM person p INNER JOIN professor_staff ps
                    ON p.person_id = ps.person_id_teaching_assistant
                    WHERE ps.person_id_professor = $1`;
  const params = [professorId];
  
  return await client
    .query(query, params)
    .then((dbResponse) => {
        return dbResponse.rows;
    })
    .catch((error) => console.error(error));
};

exports.handler = async (event) => {
    let professorId = event.pathParameters.userId;
    
    await prefetchDBInfo();
    await queryUserTeachingAssistants(professorId)
            .then((dbRows) => {
                console.log('dbRows is', dbRows);
                
                const response = {
                    statusCode: 200,
                    body: {teachingAssistants: JSON.stringify(dbRows)}
                };
                
                console.log(JSON.stringify(response));
                
                return response;
            })
            .catch((error) => {console.error(error)});
};