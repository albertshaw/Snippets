/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./configs/route-config');
var configure = require('./configs/server-config').configure;
var http = require('http');

var app = express();

configure(app);
routes.configure(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
