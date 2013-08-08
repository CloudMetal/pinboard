
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
  .get('data/pins.json')
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
  });
};
