/*
 * Adapter
 *
 */

var _ = require("lodash");

//==============================================================================
//-- export

module.exports = Adapter;

//==============================================================================
//-- constructor

function Adapter(options) {
  var _options = options || {};
  this._adapter = _options.adapter || "";
  this._host = _options.host || "";
  this._port = _options.port || 0;
  this._database = _options.database || "";
  this._username = _options.username || "";
  this._password = _options.password || "";
  this._ttl = _options.ttl || 0;
  this._prefix = "__MEMORI__:" + _options.prefix || "";
  this._objPrefix = "__OBJECT__:";

  //-- getters
  Object.defineProperty(this, "options", {
    get: function() { return this._options; }
  });
  Object.defineProperty(this, "adapter", {
    get: function() { return this._adapter; }
  });
  Object.defineProperty(this, "host", {
    get: function() { return this._host; }
  });
  Object.defineProperty(this, "port", {
    get: function() { return this._port; }
  });
  Object.defineProperty(this, "database", {
    get: function() { return this._database; }
  });
  Object.defineProperty(this, "username", {
    get: function() { return this._username; }
  });
  Object.defineProperty(this, "password", {
    get: function() { return this._password; }
  });
  Object.defineProperty(this, "ttl", {
    get: function() { return this._ttl; }
  });
  Object.defineProperty(this, "prefix", {
    get: function() { return this._prefix; }
  });
  Object.defineProperty(this, "objPrefix", {
    get: function() { return this._objPrefix; }
  });
}

//==============================================================================
//-- public instance methods

Adapter.prototype.set = function(key, value, ttl, done) {
  var _done = _.detect([ttl, done], _.isFunction);
  _.isFunction(_done) && _done();
};

//------------------------------------------------------------------------------

Adapter.prototype.get = function(key, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.del = function(key, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.incr = function(key, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.decr = function(key, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.keys = function(key, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.push = function(key, value, done) {
  _.isFunction(done) && done();
};

//------------------------------------------------------------------------------

Adapter.prototype.pop = function(key, done) {
  _.isFunction(done) && done();
};

//==============================================================================
//-- protected

Adapter.prototype._getKey = function(key) {
  var _key = null;
  var _prefix = this.prefix;

  if (_.isArray(key)) {
    _key = _.reduce(key, function(result, item) {
      result.push(_prefix + item);
      return result;
    }, []);
  } else {
    _key = _prefix + key;
  }

  return _key;
};

//------------------------------------------------------------------------------

Adapter.prototype._cleanKey = function(key) {
  var _key = null;
  var _prefix = this.prefix;
  var regex = new RegExp("^" + _prefix);

  if (_.isArray(key)) {
    _key = _.reduce(key, function(result, item) {
      result.push(item.replace(regex, ""));
      return result;
    }, []);
  } else {
    _key = key.replace(regex, "");
  }
  return _key;
};

//------------------------------------------------------------------------------

Adapter.prototype._encode = function(value) {
  var val = value;

  if (_.isObject(value) || _.isNumber(value)) {
    val = this.objPrefix + JSON.stringify(value);
  }
  return val;
};

//------------------------------------------------------------------------------

Adapter.prototype._decode = function(value) {
  var val = value;
  var _objPrefixSize = _.size(this.objPrefix);
  var _type = (value || "").substr(0, _objPrefixSize);

  if (_type === this.objPrefix) {
    try {
      val = JSON.parse(value.substr(_objPrefixSize));
    } catch (e) {}
  }
  return val;
};

//==============================================================================
