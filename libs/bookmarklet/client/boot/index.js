
/**
 * Module dependencies
 */

var Pin = require('pin');
var PinView = require('pin-view');
var ModalView = require('modal-view');
var request = require('superagent');

// Setup path for database
var postPath = 'http://localhost:3000/pinboard/api/v1/pin/';

// Setting options for the child window
var options = [
  'toolbars=0',
  'width=750',
  'heigth=500',
  'scrollbars=no',
  'resizable=no',
  'menubar=no',
  'location=no',
  'toolbar=no'
].join(',');

// Get current page information (including getting domain, page description and page URL)
var pin = new Pin();

// Assign page date to modal's model
var modalView = new ModalView(pin);

// Insert modal HTML to page
document.body.appendChild(modalView.el);

// Insert modal CSS to page
document.querySelector("head").appendChild(modalView.link);

// Load board selection dropdown and setup UI listeners
var pinView = new PinView(pin);

var childWindow;

modalView.on('cancel', function () {
  modalView.remove();
});

modalView.on('select', function () {
  childWindow = window.open('', '', options);
  pinView.render();
  childWindow.document.body.appendChild(pinView.el);
});

pinView.on('save', function (e) {
  pinView.remove();
  childWindow.close();
  send();
});

function send() {
  request
    .post(postPath)
    .send(pin)
    .end(function (error, response) {
      if (error) {
        console.error(error);
      }
      console.log(response);
    });
};
