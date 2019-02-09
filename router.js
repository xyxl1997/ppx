var mysql = require("./mysql");

function route(pathname, request, response) {
	var path = pathname.split('/');
	path.shift(); // 删除第一个空字符串
	var now = mysql.query;
	path.forEach((v) => {
		now = now[v]
	})
	try {
		now(request, res => {
			write(response, res);
		})
		console.log(path);
	} catch (e) {
		console.log(e);
	}
}

function write(response, res) {
	response.writeHead(200, {
		'Content-Type': 'text/plain; charset=utf8'
	})
	response.write(JSON.stringify(res));
	response.end();
}
exports.route = route;