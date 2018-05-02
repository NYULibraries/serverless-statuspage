'use strict';
const statusjockey = require('status-jockey');
const config = require('./sj-config.js');

module.exports.statuspage = (event, context, callback) =>
  statusjockey(event.queryStringParameters, config, process.env.STATUSPAGE_API_KEY)
    .then(data => callback(null, data))
    .catch(() => callback(null, []));
