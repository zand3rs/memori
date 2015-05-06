var cwd = process.cwd();
var nodepath = require("path");

global.async = require("async")
global.Memori = require(cwd);
global.Adapter = require(nodepath.join(cwd, "lib", "adapter"));
global.Redis = require(nodepath.join(cwd, "lib", "adapters", "redis"));
