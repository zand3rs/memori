require("node-test-helper");

describe(TEST_NAME, function() {

  describe("constructor", function() {
    it("should use the default Memory adapter when no adapter is provided", function() {
      var cache = new Memori();
      expect(cache.adapter).to.equal("memory");
    });

    it("should throw an Error for unsupported adapters", function() {
      var fn = function() { new Memori({adapter: "none"}); }
      expect(fn).to.throw(Error, /Cannot find module/);
    });
  });

  describe("valid adapters", function() {
    it("should load the provided adapter", function() {
      ["memory", "redis"].forEach(function(adapter) {
        expect((new Memori({adapter: adapter})).adapter).to.equal(adapter);
      });
    });
  });

  describe("instance properties", function() {
    describe("#adapter", function() {
      it("should return the name of the active adapter", function() {
        var cache = new Memori({adapter: "redis"});
        expect(cache.adapter).to.equal("redis");
      });
    });

    describe("#identity", function() {
      it("should return the identity of the active adapter", function() {
        var cache = new Memori({identity: "cache_identity"});
        expect(cache.identity).to.equal("cache_identity");
      });
    });
  });

  describe("instance methods", function() {
    var cache = null;
    var fakeAdapter = null;

    before(function() {
      var FakeMemori = function() {
        this._adapter = new Adapter();
      }
      FakeMemori.prototype = Object.create(Memori.prototype);
      cache = new FakeMemori();
      fakeAdapter = mock(cache._adapter);
    });

    ["set", "get", "del", "incr", "decr", "keys", "push", "pop", "expire"].forEach(function(method) {
      it("should call the adapter method: " + method + "()", function() {
        fakeAdapter.expects(method).once();
        cache[method]();
        fakeAdapter.verify();
      });
    });
  });

});
