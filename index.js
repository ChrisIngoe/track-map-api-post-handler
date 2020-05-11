const AWS = require('aws-sdk');

//const dynamo = new AWS.DynamoDB.DocumentClient();
const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
});

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  let body;
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
  };

  let data = event;
  event.locationId = Math.round(Date.now() / 1000);
  event.ttl = Date.now() + 86400; //expires after 1 day

  let params = {
    TableName: 'track-map',
    Item: data,
  };

  try {
    console.log(params);
    body = await dynamo.put(params).promise();
  } catch (err) {
    statusCode = '400';
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
