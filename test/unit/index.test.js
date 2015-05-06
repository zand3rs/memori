require("node-test-helper");

describe(TEST_NAME, function() {

  describe("constructor", function() {
    it("accepts params", function() {
      var cache = new Memori({
        host: "test_host",
        port: 9999,
        db: 1,
        ttl: 8888
      });
      expect(cache.client.host).to.equal("test_host");
      expect(cache.client.port).to.equal(9999);
      expect(cache.client.db).to.equal(1);
      expect(cache.client.ttl).to.equal(8888);
    });

    describe("with prefix", function() {
      var defaultPrefix = "";

      before(function() {
        var cache = new Memori({ prefix: "" });
        defaultPrefix = cache.client.prefix;
      });

      it("should set the correct prefix", function() {
        var cache = new Memori({ prefix: "" });
        expect(cache.client.prefix).to.equal(defaultPrefix);

        var cache = new Memori({ prefix: "foo" });
        expect(cache.client.prefix).to.equal(defaultPrefix + "foo:");

        var cache = new Memori({ prefix: "bar:" });
        expect(cache.client.prefix).to.equal(defaultPrefix + "bar:");
      });
    });

    describe("with identity", function() {
      var defaultPrefix = "";

      before(function() {
        var cache = new Memori();
        defaultPrefix = cache.client.prefix;
      });

      it("should set the identity property", function() {
        var cache = new Memori({ identity: "object_identity" });
        expect(cache.client.identity).to.equal("object_identity");
      });

      it("should set the correct prefix", function() {
        var cache = new Memori({ identity: "bar" });
        expect(cache.client.prefix).to.equal(defaultPrefix + "bar:");

        var cache = new Memori({ prefix: "foo", identity: "bar" });
        expect(cache.client.prefix).to.equal(defaultPrefix + "foo:bar:");
      });
    });
  });

  describe("methods and properties", function() {
    var defaultPrefix = "";

    before(function() {
      cache = new Memori();
      defaultPrefix = cache.client.prefix;
    });

    describe("#identity", function() {
      it("should be set", function() {
        expect(cache.client.identity).to.equal("");
        cache.client.identity = "object_identity";
        expect(cache.client.identity).to.equal("object_identity");
        cache.client.identity = "object_identity:";
        expect(cache.client.identity).to.equal("object_identity");
      });

      it("should set the correct prefix", function() {
        cache.client.identity = "object_id";
        expect(cache.client.prefix).to.equal(defaultPrefix + "object_id:");
      });
    });

    describe("#set()", function() {
      it("should store value into cache using the given key", function(done) {
        cache.set("instance_key", "instance value", function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store value into cache using the given key and ttl", function(done) {
        cache.set("instance_key2", "instance value2", 300, function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store integers", function(done) {
        cache.set("integer", 1, function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store floats", function(done) {
        cache.set("float", 1.2, function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store booleans", function(done) {
        cache.set("bool", false, function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store arrays", function(done) {
        cache.set("array", [1, "2", 3.4], function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
      it("should store objects", function(done) {
        cache.set("object", {data: {string: "string", integer: 9}}, function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.equal("OK");
          done();
        });
      });
    });

    describe("#get()", function() {
      it("should return value from cache using the given key", function(done) {
        cache.get("instance_key", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.equal("instance value");
          done();
        });
      });

      it("should return values from cache using the given keys", function(done) {
        cache.get(["instance_key", "instance_key2"], function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.include("instance value");
          expect(result).to.include("instance value2");
          done();
        });
      });
      it("should retrieve integers", function(done) {
        cache.get("integer", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.equal(1);
          done();
        });
      });
      it("should retrieve floats", function(done) {
        cache.get("float", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.equal(1.2);
          done();
        });
      });
      it("should retrieve booleans", function(done) {
        cache.get("bool", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.equal(false);
          done();
        });
      });
      it("should retrieve arrays", function(done) {
        cache.get("array", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.eql([1, "2", 3.4]);
          done();
        });
      });
      it("should retrieve objects", function(done) {
        cache.get("object", function(err, value) {
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
            cache.set("key-01", "value 01", next);
          },
          function(next) {
            cache.set("key-02", "value 02", next);
          },
          function(next) {
            cache.set("key-03", "value 03", next);
          }
        ], done);
      });

      it("should delete value from cache using the given key", function(done) {
        async.series([
          function(next) {
            cache.get(["key-01", "key-02", "key-03"], function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.include("value 01");
              expect(result).to.include("value 02");
              expect(result).to.include("value 03");
              next();
            });
          },
          function(next) {
            cache.del("key-01", function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.equal(1);
              next();
            });
          },
          function(next) {
            cache.del(["key-02", "key-03"], function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.equal(2);
              next();
            });
          }
        ], function(err) {
          cache.get(["key-01", "key-02", "key-03"], function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.eql([null, null, null]);
            done();
          });
        });
      });
    });

    describe("#incr()", function() {
      before(function(done) {
        cache.del("counter", done);
      });

      it("should increment value using the given key", function(done) {
        async.series([
          function(next) {
            cache.incr("counter", function(err, value) {
              expect(err).to.not.exist;
              expect(value).to.equal(1);
              next();
            });
          },
          function(next) {
            cache.incr("counter", function(err, value) {
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
        cache.del("counter", done);
      });

      it("should decrement value using the given key", function(done) {
        async.series([
          function(next) {
            cache.decr("counter", function(err, value) {
              expect(err).to.not.exist;
              expect(value).to.equal(-1);
              next();
            });
          },
          function(next) {
            cache.decr("counter", function(err, value) {
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
        async.series([
          function(next) {
            cache.set("key-01", "value 01", next);
          },
          function(next) {
            cache.set("key-02", "value 02", next);
          },
          function(next) {
            cache.set("key-03", "value 03", next);
          }
        ], done);
      });

      it("should return cache keys using the given pattern", function(done) {
        cache.keys("key-*", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.include("key-01");
          expect(value).to.include("key-02");
          expect(value).to.include("key-03");
          done();
        });
      });
    });

    describe("#push()", function() {
      before(function(done) {
        cache.del("queue1", done);
      });
      it("should push value into queue using the given key", function(done) {
        async.series([
          function(next) {
            cache.push("queue1", "queue1 value1", function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.equal(1);
              next();
            });
          },
          function(next) {
            cache.push("queue1", "queue1 value2", function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.equal(2);
              next();
            });
          },
          function(next) {
            cache.push("queue1", "queue1 value3", function(err, result) {
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
            cache.pop("queue1", function(err, value) {
              expect(err).to.not.exist;
              expect(value).to.equal("queue1 value1");
              next();
            });
          },
          function(next) {
            cache.pop("queue1", function(err, value) {
              expect(err).to.not.exist;
              expect(value).to.equal("queue1 value2");
              next();
            });
          },
          function(next) {
            cache.pop("queue1", function(err, value) {
              expect(err).to.not.exist;
              expect(value).to.equal("queue1 value3");
              next();
            });
          }
        ], done);
      });
    });

  });

});
