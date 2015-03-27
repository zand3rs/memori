# memori

A simple in-memory cache/queue using [Redis](http://redis.io/) as the default storage. Supports object and number values.


## Dependencies

* [Redis](https://github.com/mranney/node_redis)


## Installation

```sh
$ npm install memori
```

## Usage

```javascript
var Memori = require("memori");
var cache = new Memori();

//-- set
cache.set("key", "value", function(err, result) {
  console.log(err, result);
});

//-- get
cache.get("key", function(err, value) {
  console.log(err, value);
});
```

## Methods

### set(key, value, callback)
### set(key, value, ttl, callback)

Set key to hold the value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful set operation. The ttl unit is in seconds and value could be any of _string, number or object_. If ttl is not provided, the default ttl of 0 is used which means no expiration.

```javascript
var Memori = require("memori");
var cache = new Memori();

cache.set("key", "value", function(err, result) {
  console.log(err, result);
});

//-- set key with 60 second expiration
cache.set("key", "value", 60, function(err, result) {
  console.log(err, result);
});
```

* get()
* del()
* incr()
* decr()
* keys()
* push()
* pop()


