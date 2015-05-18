/*
 * Adapter
 *
 */

module.exports = Adapter;


var _ = require("lodash");

//==============================================================================
//-- constructor

function Adapter(options) {
  var _options = options || {};
  this._adapter = _options.adapter || "";
  this._host = _options.host || "";
  this._port = _options.port || 0;
  this._db = _options.db || 0;
  this._ttl = _options.ttl || 0;
  this._maxClients = parseInt(_options.maxClients) || 1;
  this._identity = _.trimRight(_options.identity, ":");
  this._prefix = "__MEMORI__:";
  this._objPrefix = "__OBJECT__:";

  var prefix = _.trimRight(_options.prefix, ":");
  if (prefix) {
    this._prefix += prefix + ":";
  }

  //-- getters
  Object.defineProperty(this, "adapter", {
    get: function() { return this._adapter; }
  });
  Object.defineProperty(this, "host", {
    get: function() { return this._host; }
  });
  Object.defineProperty(this, "port", {
    get: function() { return this._port; }
  });
  Object.defineProperty(this, "db", {
    get: function() { return this._db; }
  });
  Object.defineProperty(this, "ttl", {
    get: function() { return this._ttl; }
  });
  Object.defineProperty(this, "maxClients", {
    get: function() { return this._maxClients; }
  });
  Object.defineProperty(this, "identity", {
    get: function() {
      return this._identity;
    }
  });
  Object.defineProperty(this, "prefix", {
    get: function() {
      var prefix = this._prefix;
      if (this._identity) {
        prefix += this._identity + ":";
      }
      return prefix;
    }
  });
  Object.defineProperty(this, "objPrefix", {
    get: function() { return this._objPrefix; }
  });
}

//==============================================================================
//-- public instance methods

Adapter.prototype.set = function(key, value, ttl, done) {
  throw new Error("set: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.get = function(key, done) {
  throw new Error("get: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.del = function(key, done) {
  throw new Error("del: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.incr = function(key, done) {
  throw new Error("incr: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.decr = function(key, done) {
  throw new Error("decr: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.keys = function(pattern, done) {
  throw new Error("keys: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.push = function(key, value, done) {
  throw new Error("push: Not supported!");
};

//------------------------------------------------------------------------------

Adapter.prototype.pop = function(key, done) {
  throw new Error("pop: Not supported!");
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

  if (_.isObject(value) || _.isNumber(value) || _.isBoolean(value)) {
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
