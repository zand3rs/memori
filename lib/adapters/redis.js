/*
 * Redis
 *
 */

var _ = require("lodash");
var path = require("path");
var redis = require("redis");

var Adapter = require(path.join("..", "adapter"));

//==============================================================================
//-- export

module.exports = Redis;

//==============================================================================
//-- constructor

Redis.prototype = Object.create(Adapter.prototype);

function Redis() {
  //-- super
  Adapter.apply(this, Array.prototype.slice.call(arguments));

  this._client = null;
  Object.defineProperty(this, "client", {
    get: function() {
      if (!this._client) {
        this._client = this._createClient();
      }
      return this._client;
    }
  });
}

//==============================================================================
//-- public instance methods

Redis.prototype.set = function(key, value, ttl, done) {
  var self = this;

  var _ttl = _.detect([ttl, self.ttl], _.isNumber);
  var _done = _.detect([ttl, done, _.noop], _.isFunction);

  if (_ttl <= 0) {
    self.client.set(self._getKey(key), self._encode(value), _done);
  } else {
    self.client.setex(self._getKey(key), _ttl, self._encode(value), _done);
  }
};

//------------------------------------------------------------------------------

Redis.prototype.get = function(key, done) {
  var self = this;

  if (_.isArray(key)) {
    self.client.mget(self._getKey(key), function(err, value) {
      var _value = _.reduce(value, function(result, item) {
        result.push(self._decode(item));
        return result;
      }, []);
      done(err, _value);
    });
  } else {
    self.client.get(self._getKey(key), function(err, value) {
      done(err, self._decode(value));
    });
  }
};

//------------------------------------------------------------------------------

Redis.prototype.del = function(key, done) {
  var self = this;

  self.client.del(self._getKey(key), function(err, result) {
    done(err, parseInt(result) || 0);
  });
};

//------------------------------------------------------------------------------

Redis.prototype.incr = function(key, done) {
  var self = this;

  self.client.incr(self._getKey(key), function(err, value) {
    done(err, parseInt(value) || 0);
  });
};

//------------------------------------------------------------------------------

Redis.prototype.decr = function(key, done) {
  var self = this;

  self.client.decr(self._getKey(key), function(err, value) {
    done(err, parseInt(value) || 0);
  });
};

//------------------------------------------------------------------------------

Redis.prototype.keys = function(key, done) {
  var self = this;

  self.client.keys(self._getKey(key), function(err, result) {
    done(err, self._cleanKey(result));
  });
};

//------------------------------------------------------------------------------

Redis.prototype.push = function(key, value, done) {
  var self = this;

  self.client.lpush(self._getKey(key), self._encode(value), function(err, result) {
    done(err, parseInt(result) || 0);
  });
};

//------------------------------------------------------------------------------

Redis.prototype.pop = function(key, done) {
  var self = this;

  if (self.listType == "stack") {
    self.client.lpop(self._getKey(key), function(err, value) {
      done(err, self._decode(value));
    });
  } else {
    self.client.rpop(self._getKey(key), function(err, value) {
      done(err, self._decode(value));
    });
  }
};


//==============================================================================
//-- private instance methods

Redis.prototype._createClient = function() {
  var self = this;

  var host = self.host || "127.0.0.1";
  var port = self.port || 6379;
  var db = _.isNumber(self.database) ? self.database : 0;
  var opts = {detect_buffers: true};

  var client = redis.createClient(port, host, opts);
  client.select(db);

  return client;
};

//==============================================================================
