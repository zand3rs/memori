require("node-test-helper");

describe(TEST_NAME, function() {
  var redis = null;

  before(function() {
    redis = new Redis();
  });

  describe("#set()", function() {
    it("should store value into cache using the given key", function(done) {
      redis.set("instance_key", "instance value", function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store value into cache using the given key and ttl", function(done) {
      redis.set("instance_key2", "instance value2", 300, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store integers", function(done) {
      redis.set("integer", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store floats", function(done) {
      redis.set("float", 1.2, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store booleans", function(done) {
      redis.set("bool", false, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store arrays", function(done) {
      redis.set("array", [1, "2", 3.4], function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
    it("should store objects", function(done) {
      redis.set("object", {data: {string: "string", integer: 9}}, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal("OK");
        done();
      });
    });
  });

  describe("#get()", function() {
    it("should return value from cache using the given key", function(done) {
      redis.get("instance_key", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal("instance value");
        done();
      });
    });

    it("should return values from cache using the given keys", function(done) {
      redis.get(["instance_key", "instance_key2"], function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.include("instance value");
        expect(result).to.include("instance value2");
        done();
      });
    });
    it("should retrieve integers", function(done) {
      redis.get("integer", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(1);
        done();
      });
    });
    it("should retrieve floats", function(done) {
      redis.get("float", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(1.2);
        done();
      });
    });
    it("should retrieve booleans", function(done) {
      redis.get("bool", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(false);
        done();
      });
    });
    it("should retrieve arrays", function(done) {
      redis.get("array", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.eql([1, "2", 3.4]);
        done();
      });
    });
    it("should retrieve objects", function(done) {
      redis.get("object", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.eql({data: {string: "string", integer: 9}});
        done();
      });
    });
  });

  describe("#del()", function() {
    before(function(done) {
      async.series([
        function(next) {
          redis.set("key-01", "value 01", next);
        },
        function(next) {
          redis.set("key-02", "value 02", next);
        },
        function(next) {
          redis.set("key-03", "value 03", next);
        }
      ], done);
    });

    it("should delete value from cache using the given key", function(done) {
      async.series([
        function(next) {
          redis.get(["key-01", "key-02", "key-03"], function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.include("value 01");
            expect(result).to.include("value 02");
            expect(result).to.include("value 03");
            next();
          });
        },
        function(next) {
          redis.del("key-01", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(1);
            next();
          });
        },
        function(next) {
          redis.del(["key-02", "key-03"], function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(2);
            next();
          });
        }
      ], function(err) {
        redis.get(["key-01", "key-02", "key-03"], function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.eql([null, null, null]);
          done();
        });
      });
    });
  });

  describe("#incr()", function() {
    before(function(done) {
      redis.del("counter", done);
    });

    it("should increment value using the given key", function(done) {
      async.series([
        function(next) {
          redis.incr("counter", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal(1);
            next();
          });
        },
        function(next) {
          redis.incr("counter", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal(2);
            next();
          });
        }
      ], done);
    });
  });

  describe("#decr()", function() {
    before(function(done) {
      redis.del("counter", done);
    });

    it("should decrement value using the given key", function(done) {
      async.series([
        function(next) {
          redis.decr("counter", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal(-1);
            next();
          });
        },
        function(next) {
          redis.decr("counter", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal(-2);
            next();
          });
        }
      ], done);
    });
  });

  describe("#keys()", function() {
    before(function(done) {
      async.eachSeries([
        "hello",
        "hallo",
        "hxllo",
        "heaxllo",
        "olleh"
      ], function(item, next) {
        redis.set(item, item, next);
      }, done);
    });

    it("should return cache keys using the given pattern: h*llo", function(done) {
      redis.keys("h*llo", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.include("hello");
        expect(value).to.include("hallo");
        expect(value).to.include("hxllo");
        expect(value).to.include("heaxllo");
        expect(value).to.not.include("olleh");
        done();
      });
    });

    it("should return cache keys using the given pattern: h?llo", function(done) {
      redis.keys("h?llo", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.include("hello");
        expect(value).to.include("hallo");
        expect(value).to.include("hxllo");
        expect(value).to.not.include("heaxllo");
        expect(value).to.not.include("olleh");
        done();
      });
    });

    it("should return cache keys using the given pattern: h[ae]llo", function(done) {
      redis.keys("h[ae]llo", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.include("hello");
        expect(value).to.include("hallo");
        expect(value).to.not.include("hxllo");
        expect(value).to.not.include("heaxllo");
        expect(value).to.not.include("olleh");
        done();
      });
    });
  });

  describe("#push()", function() {
    before(function(done) {
      redis.del("queue1", done);
    });
    it("should push value into queue using the given key", function(done) {
      async.series([
        function(next) {
          redis.push("queue1", "queue1 value1", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(1);
            next();
          });
        },
        function(next) {
          redis.push("queue1", "queue1 value2", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(2);
            next();
          });
        },
        function(next) {
          redis.push("queue1", "queue1 value3", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(3);
            next();
          });
        }
      ], done);
    });
  });

  describe("#pop()", function() {
    it("should pop value from queue using the given key", function(done) {
      async.series([
        function(next) {
          redis.pop("queue1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal("queue1 value1");
            next();
          });
        },
        function(next) {
          redis.pop("queue1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal("queue1 value2");
            next();
          });
        },
        function(next) {
          redis.pop("queue1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal("queue1 value3");
            next();
          });
        }
      ], done);
    });
  });

  describe("#expire()", function() {
    before(function(done) {
      redis.set("to_expire1", "to_expire value1", done);
    });

    it("should set the ttl of existing key", function(done) {
      redis.expire("to_expire1", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        setTimeout(function() {
          redis.get("to_expire1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.not.exist;
            done();
          });
        }, 1000);
      });
    });

    it("should return 0 if key does not exist", function(done) {
      redis.expire("to_expire2", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(0);
        done();
      });
    });
  });

});
