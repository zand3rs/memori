# memori

A simple cache/queue library with multiple storage and data type support.


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
cache.set("string", "foo", function(err, result) {
  console.log(err, result);
});
cache.set("number", 2, function(err, result) {
  console.log(err, result);
});
cache.set("object", { data: { key: "val" } }, function(err, result) {
  console.log(err, result);
});

//-- get
cache.get("string", function(err, value) {
  //-- value: "foo"
  console.log(err, value);
});
cache.get("number", function(err, value) {
  //-- value: 2
  console.log(err, value);
});
cache.get("object", function(err, value) {
  //-- value: { data: { key: "val" } }
  console.log(err, value);
});
```

## Methods

### set(key, value, callback)
### set(key, value, ttl, callback)

Set the value of key. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful operation. The ttl unit is in seconds and value could be of any data type. If ttl is not provided, the default ttl of 0 is used which means no expiration.

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

### keys(pattern, callback)

Returns all keys matching pattern.  
Supported glob-style patterns:
* h?llo matches hello, hallo and hxllo
* h\*llo matches hllo and heeeello
* h[ae]llo matches hello and hallo

```javascript
cache.keys("key*", function(err, values) {
  console.log(err, values);
});
```

### push(key, value, callback)

Push value at the head of the list stored at key. If key does not exist, it is created as empty list before performing the push operations. When key holds a value that is not a list, an error is returned. It returns the length of the list after the push operations.

```javascript
cache.push("queue", "q1", function(err, result) {
  console.log(err, result);
});
```

### pop(key, callback)

Removes and returns the last element of the list stored at key.

```javascript
cache.pop("queue", function(err, value) {
  console.log(err, value);
});
```

## Properties

### adapter

Returns the name of the active adapter.

```javascript
console.log("adapter:", cache.adapter);
```

### identity

Sets the cache identity for added flexibility and cache key uniqueness.

```javascript
cache.identity = "my_identity";
```

## Options

The constructor accepts the ff. options:

* adapter
* host
* port
* db
* ttl
* prefix
* identity

```javascript
var Memori = require("memori");
var cache = new Memori({
  adapter: "redis", //-- defaults to "memory" when not provided
  host: "localhost",
  port: 6379,
  db: 1, //-- use db 1 instead of the default 0
  ttl: 300, //-- set default ttl to 300 secs (5mins)
  prefix: "my_cache:", //-- set key prefix
  identity: "my_identity" //-- for additional key uniqueness
});
```
