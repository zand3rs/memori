/*
 * Memory
 *
 */

module.exports = Memory;


var _ = require("lodash");
var path = require("path");

//==============================================================================
//-- constructor

var Adapter = require(path.join("..", "adapter"));
Memory.prototype = Object.create(Adapter.prototype);

function Memory() {
  //-- super
  Adapter.apply(this, Array.prototype.slice.call(arguments));

  var _store = null;
  Object.defineProperty(this, "store", {
    get: function() {
      if (!_store) {
        _store = new MemoryStore();
      }
      return _store;
    }
  });
}

//==============================================================================
//-- public instance methods

Memory.prototype.set = function(key, value, ttl, done) {
  var self = this;

  var _ttl = _.detect([ttl, self.ttl], _.isNumber);
  var _done = _.detect([ttl, done, _.noop], _.isFunction);

  self.store.set(self._getKey(key), self._encode(value), _ttl, _done);
};

//------------------------------------------------------------------------------

Memory.prototype.get = function(key, done) {
  var self = this;

  self.store.get(self._getKey(key), function(err, value) {
    if (_.isArray(value)) {
      var _value = _.reduce(value, function(result, item) {
        result.push(self._decode(item));
        return result;
      }, []);
      done(err, _value);
    } else {
      done(err, self._decode(value));
    }
  });
};

//------------------------------------------------------------------------------

Memory.prototype.del = function(key, done) {
  var self = this;

  self.store.del(self._getKey(key), function(err, result) {
    done(err, result);
  });
};

//------------------------------------------------------------------------------

Memory.prototype.incr = function(key, done) {
  var self = this;

  self.store.incr(self._getKey(key), function(err, value) {
    done(err, value);
  });
};

//------------------------------------------------------------------------------

Memory.prototype.decr = function(key, done) {
  var self = this;

  self.store.decr(self._getKey(key), function(err, value) {
    done(err, value);
  });
};

//------------------------------------------------------------------------------

Memory.prototype.keys = function(pattern, done) {
  var self = this;

  self.store.keys(self._getKey(pattern), function(err, result) {
    done(err, self._cleanKey(result));
  });
};

//------------------------------------------------------------------------------

Memory.prototype.push = function(key, value, done) {
  var self = this;

  self.store.push(self._getKey(key), self._encode(value), function(err, result) {
    done(err, result);
  });
};

//------------------------------------------------------------------------------

Memory.prototype.pop = function(key, done) {
  var self = this;

  self.store.pop(self._getKey(key), function(err, value) {
    done(err, self._decode(value));
  });
};

//==============================================================================
//-- MemoryStore

function MemoryStore() {
  var _map = {};

  Object.defineProperty(this, "map", {
    get: function() {
      return _map;
    }
  });
}

//------------------------------------------------------------------------------

MemoryStore.prototype.set = function(key, value, ttl, done) {
  var self = this;
  var expiry = null;
  var _ttl = parseInt(ttl) || 0;

  if (_ttl > 0) {
    expiry = new Date(+new Date() + (_ttl * 1000));
  }
  self.map[key] = { key: key, value: value, expiry: expiry };

  done(null, "OK");
};

//------------------------------------------------------------------------------

MemoryStore.prototype.get = function(key, done) {
  var self = this;
  var currDate = new Date();
  var value = null;

  function _getValue(_key) {
    var _value = null;
    var _item = self.map[_key] || {};

    if (_item.expiry) {
      if (currDate > _item.expiry) {
        delete self.map[_key];
      } else {
        _value = _item.value || null;
      }
    } else {
      _value = _item.value || null;
    }

    return _value;
  }

  if (_.isArray(key)) {
    value = [];
    key.forEach(function(_key) {
      value.push(_getValue(_key));
    });
  } else {
    value = _getValue(key);
  }

  done(null, value);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.del = function(key, done) {
  var self = this;
  var result = 0;

  function _delete(_key) {
    if (self.map[_key]) {
      delete self.map[_key];
      result++;
    }
  }

  if (_.isArray(key)) {
    key.forEach(function(_key) {
      _delete(_key);
    });
  } else {
    _delete(key);
  }

  done(null, result);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.incr = function(key, done) {
  var self = this;
  var item = self.map[key] || {};
  var value = (parseInt(item.value) || 0) + 1;

  self.map[key] = { key: key, value: value };
  done(null, value);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.decr = function(key, done) {
  var self = this;
  var item = self.map[key] || {};
  var value = (parseInt(item.value) || 0) - 1;

  self.map[key] = { key: key, value: value };

  done(null, value);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.keys = function(pattern, done) {
  var self = this;
  var regex = new RegExp("^" + pattern.replace("*", ".*"));
  var result = _.filter(_.keys(self.map), function(key) {
    return regex.test(key);
  });

  done(null, result);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.push = function(key, value, done) {
  var self = this;
  var item = self.map[key] || {};

  if (!_.isArray(item.value)) {
    item.value = [];
  }
  item.key = key;
  item.value.push(value);
  self.map[key] = item;

  done(null, item.value.length);
};

//------------------------------------------------------------------------------

MemoryStore.prototype.pop = function(key, done) {
  var self = this;
  var item = self.map[key] || {};
  var value = null;

  if (_.isArray(item.value)) {
    value = item.value.shift() || null;
  }

  done(null, value);
};

//==============================================================================
