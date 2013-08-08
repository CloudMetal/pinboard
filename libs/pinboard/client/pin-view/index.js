
/**
 * Module dependencies
 */

var domify = require('domify');
var html = require('./template');
var reactive = require('reactive');
var Emitter = require('emitter');

/**
 * Export `PinView`.
 */

module.exports = PinView;

/**
 * PinView constructor
 */

function PinView(model) {
  this.el = domify(html);
  this.model = model;

  reactive(this.el, this.model);

  this.thumbnail = this.el.querySelector('img');
  this.thumbnail.addEventListener('load', this.onloaded.bind(this));
};

Emitter(PinView.prototype);

PinView.prototype.onloaded = function (e) {
  this.emit('loaded', this);
};
