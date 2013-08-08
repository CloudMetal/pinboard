
/**
 * Module dependencies
 */

var Pin = require('./pin');
var PinView = require('./pin-view');
var ModalView = require('./modal-view');

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

var pin = new Pin();

var modalView = new ModalView(pin);
document.body.appendChild(modalView.el);
document.querySelector("head").appendChild(modalView.link);

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
  console.log('pin', pin);
});
