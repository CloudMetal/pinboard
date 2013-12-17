
/**
 * Module dependencies
 */

var domify = require('domify');
var html = require('./template');
var Pin = require('pin');
var PinView = require('pin-view');
var request = require('superagent');
var minstache = require('minstache');

// inject template into the DOM
document.body.appendChild(domify(html));

// Container element
var container = document.querySelector('#container');
var boardSelector = document.querySelector('#boardSelection');

// Initialize Packery
var pckry;

// Client side request library for retrieving data from db
request
  .get('/pinboard/api/v1/pin/')
  .end(function(res){
    // Getting a list of pins from the database
    createPins(res.body.pins, 1);
    loadPinBoards(res.body.pins, boardSelector);
  });

function loadPinBoards(pins, selectorEl) {
    var pinCount = pins.length;

    var selectionQueList = [];

    pins.forEach(function (pin) {
        // Check for unique boards
        if (existInArray(selectionQueList, pin.board) == false) {
          // Keep a array record of unique boards
          selectionQueList.push(pin.board);
        }
    });

    // Create a selection with all the available boards
    for (var i = 0; i < selectionQueList.length; i++) {
        var option = document.createElement("option");
        option.text = selectionQueList[i];
        selectorEl.add(option, null);
    }

};

function existInArray(array, id) {
    for(var i = 0; i < array.length; i++ ) {
        if (array[i] == id) {
          return true;
        }
    }
    return false;
}

function createPins(pins, boardId) {
  var imageCount = pins.length;
  container.innerHTML = '';

  pins.forEach(function (pin) {
    // Storing pin data fields in a Pin object
    var model = new Pin(pin);
    // Init the view components for each pin
    var view = view = new PinView(model);
    console.log("model: " + model.board);
    
    if (model.board == boardId) {
      console.log('load the poll!'); 
      container.appendChild(view.el);
    }

    view.once('loaded', function (view) {
      imageCount--;
      if (imageCount === 0) {
        pckry = new Packery(container, { itemSelector: '.pin' });
      }
    });

    view.on('comment', function (view, commentText) {
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
