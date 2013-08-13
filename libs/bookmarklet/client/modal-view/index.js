
/**
 * Module dependencies
 */

var events = require('events');
var unique = require('unique');
var domify = require('domify');
var minstache = require('minstache');
var Emitter = require('emitter');
var template = require('./template');
var listItemTemplate = require('./list-item-template');

var minMediaWidth = 50;

module.exports = ModalView;

function ModalView(model) {
  this.model = model;
  this.link = createStyle();
  this.el = createEl();

  this.events = events(this.el, this);
  this.events.bind('click [data-js-action=select]', 'onSelect');
  this.events.bind('click [data-js-action=cancel]', 'onCancel');
};

Emitter(ModalView.prototype);

ModalView.prototype.onSelect = function (e) {
  e.preventDefault();
  this.model.thumbnailUrl = e.srcElement.src;
  this.emit('select');
};

ModalView.prototype.onCancel = function (e) {
  e.preventDefault();
  this.emit('cancel');
}

ModalView.prototype.remove = function () {
  this.events.unbind();
  this.el.parentNode.removeChild(this.el);
  this.link.parentNode.removeChild(this.link);
};

function createEl() {
  // NodeList of all img elements
  var imgs = document.querySelectorAll('img');

  // Array of img src's that are larget than minimum threashold
  var list = [].slice.call(imgs).filter(function (img, i) {
    return img.width >= minMediaWidth;
  }).map(function (img, i) {
    return img.src;
  });

  list = unique(list).map(function (src, i) {
    return minstache(listItemTemplate, { src: src });
  });

  return domify(minstache(template, { list: list.join('') }));
};

function createStyle() {
  var link = document.createElement("link");
  link.id = "frog-pinterest-styles";
  link.href = "http://localhost:3000/pinboard/stylesheets/bookmark.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  return link;
};
