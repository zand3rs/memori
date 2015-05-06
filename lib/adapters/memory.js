/*
 * Memory
 *
 */

var _ = require("lodash");
var path = require("path");

var Adapter = require(path.join("..", "adapter"));

//==============================================================================
//-- export

module.exports = Memory;

//==============================================================================
//-- constructor

Memory.prototype = Object.create(Adapter.prototype);

function Memory() {
  //-- super
  Adapter.apply(this, Array.prototype.slice.call(arguments));
}

//==============================================================================
