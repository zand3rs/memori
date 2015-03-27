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

Set the value of key. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful operation. The ttl unit is in seconds and value could be any of _string, number or object_. If ttl is not provided, the default ttl of 0 is used which means no expiration.

```javascript
//-- set key without expiration
cache.set("key", "value", function(err, result) {
  console.log(err, result);
});

//-- set key with 60 second expiration
cache.set("key", "value", 60, function(err, result) {
  console.log(err, result);
});
```

### get(key, callback)

Get the value of key/s. If the key does not exist, a null value is returned. 

```javascript
//-- string key
cache.get("key", function(err, value) {
  console.log(err, value);
});

//-- array of keys
cache.get(["key1", "key2"], function(err, values) {
  console.log(err, values);
});
```

### del(key, callback)

Removes the specified key/s. The number of keys deleted is returned on successful operation.

```javascript
//-- string key
cache.del("key", function(err, result) {
  console.log(err, result);
});

//-- array of keys
cache.del(["key1", "key2"], function(err, result) {
  console.log(err, result);
});
```

### incr(key, callback)

Increments the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation.

```javascript
cache.incr("counter", function(err, value) {
  console.log(err, value);
});
```

### decr(key, callback)

Decrements the number stored at key by one. If the key does not exist, it is set to 0 before performing the operation.

```javascript
cache.decr("counter", function(err, value) {
  console.log(err, value);
});
```

* keys()
* push()
* pop()


