var http = require("http");
var url = require("url");

/**
 * 捕获所有未捕获的异常，防止断开连接
 */
process.on('uncaughtException', function (error) {
	console.log(error);
})

function start(route) {
	function onRequest(request, response) {
		response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type,token");
        response.setHeader("Access-Control-Expose-Headers", "*");

        if (request.method=="OPTIONS") {
			response.writeHead(200, {
				'Content-Type': 'text/plain; charset=utf8'
			})
			response.end();
            return;
        }
		var pathname = url.parse(request.url).pathname;
		route(pathname, request, response);
	}
	http.createServer(onRequest).listen(80);
	console.log("Server has started.");
}

exports.start = start;