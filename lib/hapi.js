'use strict';

var hapi = require('hapi');
var routes = require('./routes');
var config = require('../config');

var server = new hapi.Server({ debug: { request: ['error'] } });

server.views({
  engines: {
    jade: require('jade')
  },
  path: './views',
  isCached: false
});

server.connection({
  port: config.http.port,
  host: config.http.host,
  labels: ['canvas'],
  router: { stripTrailingSlash: true }
});

server.route(routes);

module.exports = server;
