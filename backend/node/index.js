var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/backend/node/"] = requestHandlers.show;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);
