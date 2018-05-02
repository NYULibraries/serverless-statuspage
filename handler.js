'use strict';
const statusjockey = require('status-jockey');
const config = require('./sj-config.js');

module.exports.status = (event, context, callback) =>
  Promise.resolve(event)
    .then(() => statusjockey(event.queryStringParameters, config, process.env.STATUSPAGE_API_KEY))
    .then(data => callback(null, data))
    .catch((_err) => callback(null, []));
