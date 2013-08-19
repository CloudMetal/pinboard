
/**
 * Module dependencies
 */

var domify = require('domify');
var html = require('./template');
var Pin = require('pin');
var PinView = require('pin-view');
var request = require('superagent');

// inject template into the DOM
document.body.appendChild(domify(html));

// Container element
var container = document.querySelector('#container');

// Initialize Packery
var pckry;

request
  .get('/pinboard/api/v1/pin/')
  .end(function(res){
    createPins(res.body.pins);
  });

function createPins(pins) {
  var imageCount = pins.length;

  pins.forEach(function (pin) {
    var model = new Pin(pin);
    var view = new PinView(model);
    container.appendChild(view.el);

    view.once('loaded', function (view) {
      imageCount--;
      if (imageCount === 0) {
        // pckry.layout();
        pckry = new Packery(container, { itemSelector: '.pin' });
      }
    });

    view.on('comment', function (view, commentText) {
      console.log('---------- commentText is:' + commentText)
      addComment(view.model.id, commentText);
    });

  });
};

function addComment(key, text) {
  var id = key.split('!')[1];
  var path = '/pinboard/api/v1/pin/' + id + '/comment/';
  request
    .post(path)
    .send({ 'message': text })
    .end(function (error, response) {
      if (error) {
        console.error(error);
      }
      console.log(response);
    });
};
