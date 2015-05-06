require("node-test-helper");

xdescribe(TEST_NAME, function() {
  var memory = null;

  before(function() {
    memory = new Memory();
  });

  describe("#set()", function() {
    it("should store value into cache using the given key", function(done) {
    });
    it("should store value into cache using the given key and ttl", function(done) {
    });
    it("should store integers", function(done) {
    });
    it("should store floats", function(done) {
    });
    it("should store booleans", function(done) {
    });
    it("should store arrays", function(done) {
    });
    it("should store objects", function(done) {
    });
  });

  describe("#get()", function() {
    it("should return value from cache using the given key", function(done) {
    });
    it("should return values from cache using the given keys", function(done) {
    });
    it("should retrieve integers", function(done) {
    });
    it("should retrieve floats", function(done) {
    });
    it("should retrieve booleans", function(done) {
    });
    it("should retrieve arrays", function(done) {
    });
    it("should retrieve objects", function(done) {
    });
  });

  describe("#del()", function() {
    it("should delete value from cache using the given key", function(done) {
    });
  });

  describe("#incr()", function() {
    it("should increment value using the given key", function(done) {
    });
  });

  describe("#decr()", function() {
    it("should decrement value using the given key", function(done) {
    });
  });

  describe("#keys()", function() {
    it("should return cache keys using the given pattern", function(done) {
    });
  });

  describe("#push()", function() {
    it("should push value into queue using the given key", function(done) {
    });
  });

  describe("#pop()", function() {
    it("should pop value from queue using the given key", function(done) {
    });
  });

});
