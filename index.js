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
  var _options = _.merge({adapter: "redis"}, options);
  var _module = path.resolve(".", "lib", "adapters", _options.adapter);
  var _adapter = require(_module);
  this._client = new _adapter(_options);

  Object.defineProperty(this, "client", {
    get: function() {
      return this._client;
    }
  });
}

//==============================================================================
//-- public instance methods

Memori.prototype.set = function(key, value, done) {
  this.client.set(key, value, done);
};

//------------------------------------------------------------------------------
//-- fake overloading, this is the real definition

Memori.prototype.set = function(key, value, ttl, done) {
  this.client.set(key, value, ttl, done);
};

//------------------------------------------------------------------------------

Memori.prototype.get = function(key, done) {
  this.client.get(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.del = function(key, done) {
  this.client.del(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.incr = function(key, done) {
  this.client.incr(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.decr = function(key, done) {
  this.client.decr(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.keys = function(key, done) {
  this.client.keys(key, done);
};

//------------------------------------------------------------------------------

Memori.prototype.push = function(key, value, done) {
  this.client.push(key, value, done);
};

//------------------------------------------------------------------------------

Memori.prototype.pop = function(key, done) {
  this.client.pop(key, done);
};

//==============================================================================
