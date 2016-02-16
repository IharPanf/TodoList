var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

        var pathname = url.parse(request.url).pathname;
        var action = url.parse(request.url).path;

        route(handle, pathname, response, request, action);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;
