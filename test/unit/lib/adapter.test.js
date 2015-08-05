require("node-test-helper");

describe(TEST_NAME, function() {

  describe("constructor", function() {
    it("accepts params", function() {
      var adapter = new Adapter({
        adapter: "memory",
        host: "test_host",
        port: 9999,
        db: 1,
        ttl: 8888,
        maxClients: 9
      });
      expect(adapter.adapter).to.equal("memory");
      expect(adapter.name).to.equal("memory");
      expect(adapter.host).to.equal("test_host");
      expect(adapter.port).to.equal(9999);
      expect(adapter.db).to.equal(1);
      expect(adapter.ttl).to.equal(8888);
      expect(adapter.maxClients).to.equal(9);
    });

    describe("with prefix", function() {
      var defaultPrefix = "";

      before(function() {
        var adapter = new Adapter({ prefix: "" });
        defaultPrefix = adapter.prefix;
      });

      it("should set the correct prefix", function() {
        var adapter = new Adapter({ prefix: "" });
        expect(adapter.prefix).to.equal(defaultPrefix);

        var adapter = new Adapter({ prefix: "foo" });
        expect(adapter.prefix).to.equal(defaultPrefix + "foo:");

        var adapter = new Adapter({ prefix: "bar:" });
        expect(adapter.prefix).to.equal(defaultPrefix + "bar:");
      });
    });

    describe("with identity", function() {
      var defaultPrefix = "";

      before(function() {
        var adapter = new Adapter();
        defaultPrefix = adapter.prefix;
      });

      it("should set the identity property", function() {
        var adapter = new Adapter({ identity: "object_identity" });
        expect(adapter.identity).to.equal("object_identity");
      });

      it("should set the correct prefix", function() {
        var adapter = new Adapter({ identity: "bar" });
        expect(adapter.prefix).to.equal(defaultPrefix + "bar:");

        var adapter = new Adapter({ prefix: "foo", identity: "bar" });
        expect(adapter.prefix).to.equal(defaultPrefix + "foo:bar:");
      });
    });
  });

  describe("methods and properties", function() {
    var adapter = null;
    var defaultPrefix = "";

    before(function() {
      adapter = new Adapter();
      defaultPrefix = adapter.prefix;
    });

    describe("#set()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#get()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#del()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#incr()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#decr()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#keys()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#push()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#pop()", function() {
      it("should throw 'Not supported' error", function() {
        expect(adapter.set).to.throw(Error, /Not supported!/);
      });
    });

    describe("#_getKey()", function() {
      it("should return prefixed key", function() {
        var prefix = adapter.prefix;
        expect(adapter._getKey("foo")).to.equal(prefix + "foo");
        expect(adapter._getKey(["foo", "bar"])).to.eql([prefix + "foo", prefix + "bar"]);
      });
    });

    describe("#_cleanKey()", function() {
      it("should return unprefixed key", function() {
        var prefix = adapter.prefix;
        expect(adapter._cleanKey(prefix + "foo")).to.equal("foo");
        expect(adapter._cleanKey([prefix + "foo", prefix + "bar"])).to.eql(["foo", "bar"]);
      });
    });

    describe("#_encode()", function() {
      it("should stringify input param", function() {
        var prefix = adapter.objPrefix;
        expect(adapter._encode("str")).to.equal("str");
        expect(adapter._encode(1)).to.equal(prefix + "1");
        expect(adapter._encode(2.2)).to.equal(prefix + "2.2");
        expect(adapter._encode(true)).to.equal(prefix + "true");
        expect(adapter._encode({key: 3})).to.equal(prefix + JSON.stringify({key: 3}));
      });
    });

    describe("#_decode()", function() {
      it("should stringify input param", function() {
        var prefix = adapter.objPrefix;
        expect(adapter._decode("str")).to.equal("str");
        expect(adapter._decode(prefix + "1")).to.equal(1);
        expect(adapter._decode(prefix + "2.2")).to.equal(2.2);
        expect(adapter._decode(prefix + "true")).to.equal(true);
        expect(adapter._decode(prefix + JSON.stringify({key: 3}))).to.eql({key: 3});
      });
    });
  });

});
