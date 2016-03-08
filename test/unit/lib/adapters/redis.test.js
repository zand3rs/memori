require("node-test-helper");

describe(TEST_NAME, function() {
  var shared = require("../../shared.test.js");

  before(function() {
    this.adapter = new Redis();
  });

  shared.shouldBehaveLikeAdapter();
});
