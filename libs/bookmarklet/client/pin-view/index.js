
var Emitter = require('emitter');
var domify = require('domify');
var minstache = require('minstache');
var events = require('events');
var template = require('./template');

/**
 * Export `PinView`.
 */

module.exports = PinView;

function PinView(model) {
  this.model = model;
};

Emitter(PinView.prototype);

PinView.prototype.render = function () {
  this.el = domify(minstache(template, this.model));
  this.bind();
  return this;
};

PinView.prototype.bind = function () {
  this.events = events(this.el, this);
  this.events.bind('click [data-js-action=save]', 'onSave');
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

PinView.prototype.onChangeDescription = function (e) {
  e.preventDefault();
  this.model.description = e.target.value;
};

PinView.prototype.remove = function () {
  this.unbind();
  this.el.parentNode.removeChild(this.el);
};
