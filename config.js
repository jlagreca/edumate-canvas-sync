'use strict';

var path = require('path');
var bunyan = require('bunyan');
var Tally = require('rosebank-tally').Tally;

var config = {};

/* Status log endpoint Credentials */
config.status = {
  host: process.env.EDUMATE_CANVAS_SYNC_HOST,
  port: process.env.EDUMATE_CANVAS_SYNC_PORT
};

/* Canvas Credentials */
config.canvas = {
  key: process.env.CANVAS_API_KEY,
  domain: process.env.CANVAS_API_DOMAIN
};

/* Edumate Credentials */
config.edumate = {
  host: process.env.EDUMATE_HOST,
  port: process.env.EDUMATE_PORT,
  suffix: process.env.EDUMATE_PATH,
  username: process.env.EDUMATE_USERNAME,
  password: process.env.EDUMATE_PASSWORD
};

/* rosebank-logger */
config.logger = bunyan.createLogger(
  {
    name: 'edumate-canvas-sync',
    streams: [
      {
        type: 'raw',
        stream: new Tally()
      }
    ]
  }
);

module.exports = config;
