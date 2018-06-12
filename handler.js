'use strict';

const statusjockey = require('status-jockey');
const config = require('./config/sj-config.js');
const headers = {
  ["Access-Control-Allow-Origin"]: `https://${process.env.STAGE === 'prod' ? 'library.nyu.edu' : '*'}`,
  ["Access-Control-Allow-Headers"]: "Content-Type"
};

module.exports.status = (event, context, callback) =>
  Promise.resolve(event)
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
