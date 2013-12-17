
var Emitter = require('emitter');
var domify = require('domify');
var minstache = require('minstache');
var events = require('events');
var template = require('./template');
var request = require('superagent');

/**
 * Export `PinView`.
 */

module.exports = PinView;

function PinView(model) {
  this.model = model;
  // Setting default board to the first one
  this.model.board = 1;
};

// Checking the number of unique boards from the current pins
// [TODO] Change this to load from a database of boards instead
function loadPinBoards(pins, selectorEl) {

  // List for storing unqiue boards
  // This is used to fill the dropdown options of board selection
  // [TODO] remove pre-determined boards once board database is setup
  var selectionQueList = ["1", "2", "3", "4", "5"];

  // For each pin, 
  pins.forEach(function (pin) {
    // Check if the pin's board number already exist
    if (existInArray(selectionQueList, pin.board) == false) {
      // If yes, store the pinboard id into the list for dropdown menu
      selectionQueList.push(pin.board);
    }
  });

  // Create an option for all the available boards
  for (var i = 0; i < selectionQueList.length; i++) {
    // Creating a new opton
    var option = document.createElement("option");
    option.text = selectionQueList[i];
    // Adding the option
    selectorEl.add(option, null);
  }

};

// Check of a value exists in an array
function existInArray(array, id) {
  for(var i = 0; i < array.length; i++ ) {
      if (array[i] == id) {
        return true;
      }
  }
  return false;
}

Emitter(PinView.prototype);

PinView.prototype.render = function () {
  this.el = domify(minstache(template, this.model));
  var boardSelector = this.el.querySelector('#boardSelection');
  this.bind();

  // Client-side request library for retrieving data from db
  request
    .get('http://localhost:3000/pinboard/api/v1/pin/')
    .end(function(res){
      // Getting a list of pins from the database
      loadPinBoards(res.body.pins, boardSelector);
    });

  return this;
};

PinView.prototype.bind = function () {
  this.events = events(this.el, this);
  this.events.bind('click [data-js-action=save]', 'onSave');
  this.events.bind('click [data-js-action=feature]', 'onFeature');
  this.events.bind('change select', 'onChangeBoard');
  this.events.bind('change textarea', 'onChangeDescription');
};

PinView.prototype.unbind = function () {
  this.events.unbind();
};

PinView.prototype.onSave = function (e) {
  e.preventDefault();
  console.log('save!');
  this.emit('save');
};

PinView.prototype.onFeature = function (e) {
  this.model.featuredStatus = e.target.checked;
}

PinView.prototype.onChangeBoard = function (e) {
  e.preventDefault();
  this.model.board = e.target.value;
}

PinView.prototype.onChangeDescription = function (e) {
  e.preventDefault();
  this.model.description = e.target.value;
};

PinView.prototype.remove = function () {
  this.unbind();
  this.el.parentNode.removeChild(this.el);
};
