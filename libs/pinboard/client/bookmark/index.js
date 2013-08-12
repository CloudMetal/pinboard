
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

// Get current page information

// function Pin(thumbnailUrl) {
//    this.url = window.location.href;
//    this.thumbnailUrl = thumbnailUrl;
//    this.description = description();
// }
var pin = new Pin();

// Assign page date to modal's model
// Setup listeners as wel;

// function ModalView(model) {
//    this.model = model;
//    this.link = createStyle();
//    this.el = createEl();
//    this.events = events(this.el, this);
//    this.events.bind('click [data-js-action=select]', 'onSelect');
//    this.events.bind('click [data-js-action=cancel]', 'onCancel');
// }
var modalView = new ModalView(pin);

// Insert modal HTML to page
document.body.appendChild(modalView.el);

// Insert modal CSS to page
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