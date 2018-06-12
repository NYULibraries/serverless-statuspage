'use strict';

const statusjockey = require('status-jockey');
const config = require('./config/sj-config.js');

module.exports.status = (event, context, callback) => {
  const headers = {
    ["Access-Control-Allow-Origin"]: `${process.env.STAGE === 'prod' ? 'https://library.nyu.edu' : '*'}`,
    ["Access-Control-Allow-Headers"]: "Content-Type"
  };

  return Promise.resolve(event)
  .then(() => statusjockey(event.queryStringParameters, config, process.env.STATUSPAGE_API_KEY))
  .then(data => callback(null, {
    statusCode: 200,
    body: JSON.stringify(data),
    headers
  }))
  .catch((err) => {
    console.error(err.message);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify([]),
      headers
    });
  });
};
