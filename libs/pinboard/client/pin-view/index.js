
/**
 * Module dependencies
 */

var events = require('events');
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

  this.events = events(this.el, this);
  this.events.bind('click [data-js-action=showCommentInput]', 'onShowCommentInput');
  this.events.bind('click [data-js-action=hideCommentInput]', 'onHideCommentInput');
};

Emitter(PinView.prototype);

PinView.prototype.onloaded = function (e) {
  this.emit('loaded', this);
};

PinView.prototype.onShowCommentInput = function (e) {
  e.preventDefault();
  // Get the comment-box div
  this.el.children[1].children[3].style.display = 'block';
  this.el.children[1].children[2].style.display = 'none';

  // fix this to reload packery more elegantly
  pckry = new Packery(container, { itemSelector: '.pin' });
};

PinView.prototype.onHideCommentInput = function (e) {
  e.preventDefault();

  // Get the comment-box div
  this.el.children[1].children[3].style.display = 'none';
  this.el.children[1].children[2].style.display = 'block';

  // fix this to reload packery more elegantly
  pckry = new Packery(container, { itemSelector: '.pin' });
};

// PinView.on('showCommentInput', function () {
//   alert('hit');
// });

// PinView.prototype.onShowCommentInput = function (e) {
//   e.preventDefault();
//   this.emit('showCommentInput');
// };