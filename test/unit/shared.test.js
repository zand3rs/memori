exports.shouldBehaveLikeAdapter = function() {

  describe("#set()", function() {
    it("should store value into cache using the given key", function(done) {
      this.adapter.set("instance_key", "instance value", function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store value into cache using the given key and ttl", function(done) {
      this.adapter.set("instance_key2", "instance value2", 300, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store integers", function(done) {
      this.adapter.set("integer", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store floats", function(done) {
      this.adapter.set("float", 1.2, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store booleans", function(done) {
      this.adapter.set("bool", false, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store arrays", function(done) {
      this.adapter.set("array", [1, "2", 3.4], function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
    it("should store objects", function(done) {
      this.adapter.set("object", {data: {string: "string", integer: 9}}, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        done();
      });
    });
  });

  describe("#get()", function() {
    it("should return value from cache using the given key", function(done) {
      this.adapter.get("instance_key", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal("instance value");
        done();
      });
    });

    it("should return values from cache using the given keys", function(done) {
      this.adapter.get(["instance_key", "instance_key2"], function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.include("instance value");
        expect(result).to.include("instance value2");
        done();
      });
    });
    it("should retrieve integers", function(done) {
      this.adapter.get("integer", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(1);
        done();
      });
    });
    it("should retrieve floats", function(done) {
      this.adapter.get("float", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(1.2);
        done();
      });
    });
    it("should retrieve booleans", function(done) {
      this.adapter.get("bool", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(false);
        done();
      });
    });
    it("should retrieve arrays", function(done) {
      this.adapter.get("array", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.eql([1, "2", 3.4]);
        done();
      });
    });
    it("should retrieve objects", function(done) {
      this.adapter.get("object", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.eql({data: {string: "string", integer: 9}});
        done();
      });
    });
  });

  describe("#del()", function() {
    before(function(done) {
      var self = this;
      async.series([
        function(next) {
          self.adapter.set("key-01", "value 01", next);
        },
        function(next) {
          self.adapter.set("key-02", "value 02", next);
        },
        function(next) {
          self.adapter.set("key-03", "value 03", next);
        }
      ], done);
    });

    it("should delete value from cache using the given key", function(done) {
      var self = this;
      async.series([
        function(next) {
          self.adapter.get(["key-01", "key-02", "key-03"], function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.include("value 01");
            expect(result).to.include("value 02");
            expect(result).to.include("value 03");
            next();
          });
        },
        function(next) {
          self.adapter.del("key-01", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(1);
            next();
          });
        },
        function(next) {
          self.adapter.del(["key-02", "key-03"], function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(2);
            next();
          });
        }
      ], function(err) {
        self.adapter.get(["key-01", "key-02", "key-03"], function(err, result) {
          expect(err).to.not.exist;
          expect(result).to.eql([null, null, null]);
          done();
        });
      });
    });
  });

  describe("#incr()", function() {
    before(function(done) {
      this.adapter.del("counter", done);
    });

    it("should set non-existent key to 0 before incrementing value", function(done) {
      this.adapter.incr("counter", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(1);
        done();
      });
    });

    it("should increment value stored in key by 1", function(done) {
      this.adapter.incr("counter", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(2);
        done();
      });
    });

    it("should increment value stored in key by the given value", function(done) {
      this.adapter.incr("counter", 8, function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(10);
        done();
      });
    });

    it("should allow negative increments", function(done) {
      this.adapter.incr("counter", -2, function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(8);
        done();
      });
    });
  });

  describe("#decr()", function() {
    before(function(done) {
      this.adapter.del("counter", done);
    });

    it("should set non-existent key to 0 before decrementing value", function(done) {
      this.adapter.decr("counter", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(-1);
        done();
      });
    });

    it("should decrement value stored in key by 1", function(done) {
      this.adapter.decr("counter", function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(-2);
        done();
      });
    });

    it("should decrement value stored in key by the given value", function(done) {
      this.adapter.decr("counter", 8, function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(-10);
        done();
      });
    });

    it("should allow negative decrements", function(done) {
      this.adapter.decr("counter", -2, function(err, value) {
        expect(err).to.not.exist;
        expect(value).to.equal(-8);
        done();
      });
    });
  });

  describe("#keys()", function() {
    before(function(done) {
      var self = this;
      async.eachSeries([
        "hello",
        "hallo",
        "hxllo",
        "heaxllo",
        "olleh"
      ], function(item, next) {
        self.adapter.set(item, item, next);
      }, done);
    });

    it("should return cache keys using the given pattern: h*llo", function(done) {
      this.adapter.keys("h*llo", function(err, value) {
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
      this.adapter.keys("h?llo", function(err, value) {
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
      this.adapter.keys("h[ae]llo", function(err, value) {
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
      this.adapter.del("queue1", done);
    });
    it("should push value into queue using the given key", function(done) {
      var self = this;
      async.series([
        function(next) {
          self.adapter.push("queue1", "queue1 value1", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(1);
            next();
          });
        },
        function(next) {
          self.adapter.push("queue1", "queue1 value2", function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.equal(2);
            next();
          });
        },
        function(next) {
          self.adapter.push("queue1", "queue1 value3", function(err, result) {
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
      var self = this;
      async.series([
        function(next) {
          self.adapter.pop("queue1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal("queue1 value1");
            next();
          });
        },
        function(next) {
          self.adapter.pop("queue1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal("queue1 value2");
            next();
          });
        },
        function(next) {
          self.adapter.pop("queue1", function(err, value) {
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
      var self = this;
      async.series([
        function(next) {
          self.adapter.set("to_expire1", "to_expire value1", next);
        },
        function(next) {
          self.adapter.push("to_expire_q1", "to_expire_q value1", next);
        }
      ], done);
    });

    it("should set the ttl of existing key", function(done) {
      var self = this;
      self.adapter.expire("to_expire1", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        setTimeout(function() {
          self.adapter.get("to_expire1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.not.exist;
            done();
          });
        }, 1500);
      });
    });

    it("should set the ttl of existing list key", function(done) {
      var self = this;
      self.adapter.expire("to_expire_q1", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(1);
        setTimeout(function() {
          self.adapter.get("to_expire_q1", function(err, value) {
            expect(err).to.not.exist;
            expect(value).to.not.exist;
            done();
          });
        }, 1500);
      });
    });

    it("should return 0 if key does not exist", function(done) {
      this.adapter.expire("to_expire2", 1, function(err, result) {
        expect(err).to.not.exist;
        expect(result).to.equal(0);
        done();
      });
    });
  });

};
