
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = module.exports = express();

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascript', express.static(path.join(__dirname, 'build')));
app.use('/stylesheets', express.static(path.join(__dirname, 'build')));

app.get('/', function (request, response) {
  response.render('index.hjs', { title: 'Pinboard' });
});

app.get('/about', function (request, response) {
  response.render('about.hjs', { title: 'About pinboard', path:'http://localhost:3000/pinboard/javascript/bookmark.js' });
});
