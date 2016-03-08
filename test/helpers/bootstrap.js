var cwd = process.cwd();
var nodepath = require("path");

global._ = require("lodash");
global.async = require("async");
global.Memori = require(cwd);
global.Adapter = require(nodepath.join(cwd, "lib", "adapter"));
global.Memory = require(nodepath.join(cwd, "lib", "adapters", "memory"));
global.Redis = require(nodepath.join(cwd, "lib", "adapters", "redis"));
