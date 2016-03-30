# memori

A simple cache/queue library with multiple storage and data type support.


## Available adapters

* memory (default)
* redis


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
//-- expire in 10 seconds
cache.set("array", [1, 2, 3], 10, function(err, result) {
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
cache.get("array", function(err, value) {
  //-- value: [1, 2, 3]
  console.log(err, value);
});
```

## Methods

### set(key, value, callback)
### set(key, value, ttl, callback)

Set the value of key. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful operation. The ttl unit is in seconds and value could be of any data type. If ttl is not provided, the default 0 (no expiration) or whatever provided in the constructor options will be used.

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
### incr(key, value, callback)

Increments the number stored at key by value (defaults to 1 if not provided). If the key does not exist, it is set to 0 before performing the operation.

```javascript
cache.incr("counter", function(err, result) {
  console.log(err, result);
});

cache.incr("counter", 5, function(err, result) {
  console.log(err, result);
});
```

### decr(key, callback)
### decr(key, value, callback)

Decrements the number stored at key by value (defaults to 1 if not provided). If the key does not exist, it is set to 0 before performing the operation.

```javascript
cache.decr("counter", function(err, result) {
  console.log(err, result);
});

cache.decr("counter", 5, function(err, result) {
  console.log(err, result);
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

### expire(key, ttl, callback)

Set the timeout of a key. The ttl unit is in seconds.

```javascript
cache.expire("key", 10, function(err, result) {
  console.log(err, result);
});
```

## Properties

### adapter

Returns the name of the active adapter.

```javascript
console.log("adapter:", cache.adapter);
```

### identity

Returns the identity of the active adapter.

```javascript
console.log("identity:", cache.identity);
```

## Options

The constructor accepts the ff. options:

* adapter
* host
* port
* db
* user or username
* password or pass
* ttl
* prefix
* identity

```javascript
var Memori = require("memori");
var cache = new Memori({
  adapter: "redis", //-- defaults to "memory" when not provided
  host: "localhost",
  port: 6379,
  password: "abc123", //-- use password to authenticate if not empty
  db: 1, //-- use db 1 instead of the default 0
  ttl: 300, //-- set the default ttl to 300 secs; defaults to 0 when not provided
  prefix: "my_cache", //-- set key prefix
  identity: "my_identity" //-- for additional cache key uniqueness
});
```
