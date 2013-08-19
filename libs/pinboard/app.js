
/**
 * Module dependencies.
 */

var express = require('express');
var cors = require('cors');
var http = require('http');
var path = require('path');
var levelup = require('level');

var app = module.exports = express();
var db = levelup('./pin.db', { valueEncoding: 'json' });
var count = 0;

var bookmarkletPath = 'http://localhost:3000/pinboard/javascript/bookmarklet.js'

var bookmarkletPath = 'http://localhost:3000/pinboard/javascript/bookmarklet.js'

app.set('views', __dirname + '/views');

app.use('/api', cors());
app.use('/api', express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascript', express.static(path.join(__dirname, 'build')));
app.use('/stylesheets', express.static(path.join(__dirname, 'build')));

app.get('/', function (request, response) {
  response.render('index.hjs', { title: 'Pinboard' });
});

app.get('/about', function (request, response) {
  response.render('about.hjs', { title: 'About pinboard', path:bookmarkletPath });
});

// PINBOARD API

app.get('/api/v1/pin/', function (request, response) {
  var pins = getPins(render);

  function render(pins) {
    response.json(200, { "pins": pins });
  }
});

app.get('/api/v1/pin/:id', function (request, response) {
  var key = 'pin!' + request.params.id;
  getPin(key, function (data) {
    data.id = key;
    response.json(200, { "pin": data });
  });
});

app.post('/api/v1/pin/:id/comment', function (request, response) {
  var key = 'pin!' + request.params.id;

  var comment = request.body;

  console.log('comment', comment);

  getPin(key, function (data) {
    data.comments = data.comments || [];
    data.comments.push(comment.message);

    db.put(key, data, function (err) {
      if (err) return console.log('Ooops!', err);
      response.send(200, 'New comment added to pin!');
    });
  });
});

app.post('/api/v1/pin/', function (request, response) {
  var data = request.body;
  console.log(data);
  savePin(data);
  response.send(200, 'You just got a new pin!');
});

function savePin(data) {
  var id = 'pin!' + (count++);
  db.put(id, data, function (err) {
    if (err) return console.log('Ooops!', err);
  });
};

function getPins(callback) {
  var pins = [];
  db.createReadStream({ start: 'pin!', end:'pin!\xff' })
    .on('data', function (pin) {
      var id = pin.key;
      pin.value.id = id;
      pins.push(pin.value)
    })
    .on('close', function () {
      console.log(pins);
      callback(pins);
    });
};

function getPin(key, callback) {
  db.get(key, function (err, value) {
    callback(value);
  });
};
