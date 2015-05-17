/*
 * Redis
 *
 */

module.exports = Redis;


var _ = require("lodash");
var path = require("path");
var redis = require("redis");

var clientMap = {};

//==============================================================================
//-- constructor

var Adapter = require(path.join("..", "adapter"));
Redis.prototype = Object.create(Adapter.prototype);

function Redis() {
  var self = this;

  //-- super
  Adapter.apply(self, Array.prototype.slice.call(arguments));

  var _host = self.host || "127.0.0.1";
  var _port = self.port || 6379;
  var _db = self.db || 0;
  var _maxClients = self.maxClients || 1;
  var _clientKey = _host + "_" + _port + "_" + _db;

  function _connect() {
    var client = clientMap[_clientKey];
    if (!client) {
      clientMap[_clientKey] = client = {};
    }

    var maxClients = client.maxClients || 0;
    var connIndex = client.connIndex || 0;
    var connections = client.connections || [];
    var conn = connections[connIndex];

    if (!conn) {
      conn = redis.createClient(_port, _host, {detect_buffers: true});
      conn.select(_db);
      connections[connIndex] = conn;
    }

    if (_maxClients > maxClients) {
      maxClients = _maxClients;
    }

    client.maxClients = maxClients;
    client.connIndex = (connIndex + 1) % maxClients;
    client.connections = connections;

    return conn;
  }

  Object.defineProperty(self, "client", {
    get: function() {
      return _connect();
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

Redis.prototype.keys = function(pattern, done) {
  var self = this;

  self.client.keys(self._getKey(pattern), function(err, result) {
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

  self.client.rpop(self._getKey(key), function(err, value) {
    done(err, self._decode(value));
  });
};

//==============================================================================
