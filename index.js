/*
 * Memori
 *
 */

module.exports = Memori;


var _ = require("lodash");
var path = require("path");

//==============================================================================
//-- constructor

function Memori(options) {
  var _options = _.merge({adapter: "memory"}, options);
  var _module = path.join(__dirname, "lib", "adapters", _options.adapter);
  var _adapterImpl = require(_module);
  var _adapter = new _adapterImpl(_options);

  Object.defineProperty(this, "_adapter", {
    get: function() {
      return _adapter;
    }
  });
  Object.defineProperty(this, "adapter", {
    get: function() {
      return _adapter.name;
    }
  });
  Object.defineProperty(this, "identity", {
    get: function() {
      return _adapter.identity;
    }
  });
}

//==============================================================================
//-- public instance methods

Memori.prototype.set = function(key, value, done) {
  this._adapter.set(key, value, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------
//-- fake overloading, this is the real definition

Memori.prototype.set = function(key, value, ttl, done) {
  var _ttl = _.find([ttl], _.isSafeInteger);
  var _done = _.find([ttl, done], _.isFunction);

  this._adapter.set(key, value, _ttl, function(err, result) {
    _done && _done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.get = function(key, done) {
  this._adapter.get(key, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.del = function(key, done) {
  this._adapter.del(key, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.incr = function(key, done) {
  this._adapter.incr(key, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------
//-- fake overloading, this is the real definition

Memori.prototype.incr = function(key, value, done) {
  var _value = _.find([value], _.isSafeInteger);
  var _done = _.find([value, done], _.isFunction);

  this._adapter.incr(key, value, function(err, result) {
    _done && _done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.decr = function(key, done) {
  this._adapter.decr(key, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------
//-- fake overloading, this is the real definition

Memori.prototype.decr = function(key, value, done) {
  var _value = _.find([value], _.isSafeInteger);
  var _done = _.find([value, done], _.isFunction);

  this._adapter.decr(key, value, function(err, result) {
    _done && _done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.keys = function(pattern, done) {
  this._adapter.keys(pattern, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.push = function(key, value, done) {
  this._adapter.push(key, value, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.pop = function(key, done) {
  this._adapter.pop(key, function(err, result) {
    done && done(err, result);
  });
};

//------------------------------------------------------------------------------

Memori.prototype.expire = function(key, ttl, done) {
  this._adapter.expire(key, ttl, function(err, result) {
    done && done(err, result);
  });
};

//==============================================================================
