var async = require("async"),
    sinon = require("sinon"),
    chai = require("chai"),
    expect = chai.expect,
    stub = sinon.stub,
    Memori = require(process.cwd());

describe("Memori", function() {

  describe("constructor", function() {
    it("accepts params", function() {
      var cache = new Memori({
        host: "test_host",
        port: 9999,
        database: "test_database",
        username: "test_username",
        password: "test_password",
        ttl: 8888
      });
      expect(cache.client.host).to.equal("test_host");
      expect(cache.client.port).to.equal(9999);
      expect(cache.client.database).to.equal("test_database");
      expect(cache.client.username).to.equal("test_username");
      expect(cache.client.password).to.equal("test_password");
      expect(cache.client.ttl).to.equal(8888);
    });
  });

  describe("methods", function() {
    before(function() {
      cache = new Memori();
    });

    describe("#set", function() {
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
    });

    describe("#get", function() {
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
    });

    describe("#del", function() {
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

    describe("#incr", function() {
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

    describe("#decr", function() {
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

    describe("#keys", function() {
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

      it("should return cache keys using the given key", function(done) {
        cache.keys("key-*", function(err, value) {
          expect(err).to.not.exist;
          expect(value).to.include("key-01");
          expect(value).to.include("key-02");
          expect(value).to.include("key-03");
          done();
        });
      });
    });

    describe("when list type is queue (default)", function() {
      before(function(done) {
        queue = new Memori();
        queue.del("queue1", done);
      });
      describe("#push", function() {
        it("should push value into queue using the given key", function(done) {
          async.series([
            function(next) {
              queue.push("queue1", "queue1 value1", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(1);
                next();
              });
            },
            function(next) {
              queue.push("queue1", "queue1 value2", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(2);
                next();
              });
            },
            function(next) {
              queue.push("queue1", "queue1 value3", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(3);
                next();
              });
            }
          ], done);
        });
      });

      describe("#pop", function() {
        it("should pop value from queue using the given key", function(done) {
          async.series([
            function(next) {
              queue.pop("queue1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("queue1 value1");
                next();
              });
            },
            function(next) {
              queue.pop("queue1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("queue1 value2");
                next();
              });
            },
            function(next) {
              queue.pop("queue1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("queue1 value3");
                next();
              });
            }
          ], done);
        });
      });
    });

    describe("when list type is stack", function() {
      before(function(done) {
        stack = new Memori({listType: "stack"});
        stack.del("stack1", done);
      });
      describe("#push", function() {
        it("should push value into stack using the given key", function(done) {
          async.series([
            function(next) {
              stack.push("stack1", "stack1 value3", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(1);
                next();
              });
            },
            function(next) {
              stack.push("stack1", "stack1 value2", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(2);
                next();
              });
            },
            function(next) {
              stack.push("stack1", "stack1 value1", function(err, result) {
                expect(err).to.not.exist;
                expect(result).to.equal(3);
                next();
              });
            }
          ], done);
        });
      });

      describe("#pop", function() {
        it("should pop value from stack using the given key", function(done) {
          async.series([
            function(next) {
              stack.pop("stack1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("stack1 value1");
                next();
              });
            },
            function(next) {
              stack.pop("stack1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("stack1 value2");
                next();
              });
            },
            function(next) {
              stack.pop("stack1", function(err, value) {
                expect(err).to.not.exist;
                expect(value).to.equal("stack1 value3");
                next();
              });
            }
          ], done);
        });
      });
    });

  });

});
