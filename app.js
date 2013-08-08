
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var server;

var app = express();
app.set('port', process.env.PORT || 3000);

// mount sub-app
app.use('/pinboard', require('./libs/pinboard/app'));

server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
