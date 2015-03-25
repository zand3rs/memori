# memori

A simple in-memory cache using [Redis](http://redis.io/) as the default storage. Supports object and number values.


## Dependencies

* [Redis](https://github.com/mranney/node_redis)


## Installation

```sh
$ npm install memori
```


## Methods

* set()
* get()
* del()
* incr()
* decr()
* keys()


## Usage

```javascript
var Memori = require("memori");
var cache = new Memori();
```

