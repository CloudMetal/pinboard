
/**
 * Module dependencies
 */


/**
 * Export `Pin`.
 */

module.exports = Pin;

/**
 * Pin model
 */

function Pin(attrs) {
  this.set(attrs);
};

Pin.prototype.set = function (attrs) {
  for (var key in attrs) {
    this[key] = attrs[key];
  }
};
