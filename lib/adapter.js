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
  var _adapter = _options.adapter || "";
  var _host = _options.host || "";
  var _port = _options.port || 0;
  var _db = _options.db || 0;
  var _ttl = _options.ttl || 0;
  var _maxClients = _.toSafeInteger(_options.maxClients) || 1;
  var _identity = _.trimEnd(_options.identity, ":");
  var _prefix = "__MEMORI__:";
  var _objPrefix = "__OBJECT__:";

  var prefix = _.trimEnd(_options.prefix, ":");
  if (prefix) {
    _prefix += prefix + ":";
  }

  //-- getters
  Object.defineProperty(this, "adapter", {
    get: function() { return _adapter; }
  });
  Object.defineProperty(this, "name", {
    get: function() { return _adapter; }
  });
  Object.defineProperty(this, "host", {
    get: function() { return _host; }
  });
  Object.defineProperty(this, "port", {
    get: function() { return _port; }
  });
  Object.defineProperty(this, "db", {
    get: function() { return _db; }
  });
  Object.defineProperty(this, "ttl", {
    get: function() { return _ttl; }
  });
  Object.defineProperty(this, "maxClients", {
    get: function() { return _maxClients; }
  });
  Object.defineProperty(this, "identity", {
    get: function() {
      return _identity;
    }
  });
  Object.defineProperty(this, "prefix", {
    get: function() {
      var prefix = _prefix;
      if (_identity) {
        prefix += _identity + ":";
      }
      return prefix;
    }
  });
  Object.defineProperty(this, "objPrefix", {
    get: function() { return _objPrefix; }
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

Adapter.prototype.incr = function(key, value, done) {
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

//------------------------------------------------------------------------------

Adapter.prototype.expire = function(key, ttl, done) {
  throw new Error("expire: Not supported!");
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

  if (_.isString(value) && !_.isEmpty(value)) {
    var _objPrefixSize = _.size(this.objPrefix);
    var _type = value.substr(0, _objPrefixSize);

    if (_type === this.objPrefix) {
      try {
        val = JSON.parse(value.substr(_objPrefixSize));
      } catch (e) {}
    }
  }
  return val;
};

//------------------------------------------------------------------------------

Adapter.prototype._error = function(value) {
  if (!value) {
    return null;
  }

  var err = new Error("Unknown Error");
  if (_.isError(value)) {
    err = value;
  } else if (_.isString(value) && !_.isEmpty(value)) {
    err = new Error(value);
  } else if (_.isArray(value) && !_.isEmpty(value)) {
    err = new Error(_.join(value, ", "));
  } else if (_.isObject(value) && !_.isEmpty(value.message)) {
    err = new Error(value.message);
  }
  return err;
};

//------------------------------------------------------------------------------

Adapter.prototype._success = function(value) {
  var result = _.toSafeInteger(value);

  if (_.isString(value) && value === "OK") {
    result = 1;
  }
  return result;
};

//==============================================================================
