/*
 * Memori
 *
 */

var _ = require("lodash");
var path = require("path");

//==============================================================================
//-- export

module.exports = Memori;

//==============================================================================
//-- constructor

function Memori(options) {
  var _options = _.merge({adapter: "memory"}, options);
  var _module = path.join(__dirname, "lib", "adapters", _options.adapter);
  var _adapter = require(_module);
  this._adapter = new _adapter(_options);

  Object.defineProperty(this, "adapter", {
    get: function() {
      return this._adapter.adapter;
    }
  });
}

//==============================================================================
//-- public instance methods

Memori.prototype.set = function(key, value, done) {
  this._adapter.set(key, value, done);
};

//------------------------------------------------------------------------------
//-- fake overloading, this is the real definition

Memori.prototype.set = function(key, value, ttl, done) {
  this._adapter.set(key, value, ttl, done);
};

//------------------------------------------------------------------------------

Memori.prototype.get = function(key, done) {
  this._adapter.get(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.del = function(key, done) {
  this._adapter.del(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.incr = function(key, done) {
  this._adapter.incr(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.decr = function(key, done) {
  this._adapter.decr(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.keys = function(pattern, done) {
  this._adapter.keys(pattern, done);
};

//------------------------------------------------------------------------------

Memori.prototype.push = function(key, value, done) {
  this._adapter.push(key, value, done);
};

//------------------------------------------------------------------------------

Memori.prototype.pop = function(key, done) {
  this._adapter.pop(key, done);
};

//==============================================================================
