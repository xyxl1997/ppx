require('babel-register');
var server = require("./server");
var router = require("./router");
 
server.start(router.route);