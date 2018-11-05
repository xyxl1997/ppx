var mysql = require('mysql');
var url = require('url');
// var qiniu = require('qiniu');
var connection;
connect();

function connect() {
	connection = mysql.createConnection({
		host: '120.79.249.143',
		user: 'xuyang',
		password: 'xyxl1997',
		database: 'ppx',
		dateStrings: true,
		port: '3306',
		charset: 'UTF8MB4'
	});
	connection.connect();
	connection.on('error', handleError);
}

function handleError(error) {
	console.log(error.message);
	connect();
}
var query = {
	ppx: {
		addVideo: function (request, success) {
			getPostParams(request, params => {
				selectMQL({ title: params.title, image: params.image }, "*", "video", "", res => {
					if (res.length == 0) {
						insertMQL(params, "video", res => {
							success(res)
						})
					} else {
						let sql = "update video set video = '" + params.video + "' where id = " + res[0].id;
						connection.query(sql, (error, res) => {
							if (error) {
								console.log(error);
								return;
							}
							success("视频更新成功");
						})
					}
				})
			})
		},
		search: function (request, success) {
			getGetParams(request, params => {
				selectMQL({ key: params.title }, "id", "search_key", "", res => {
					if (res.length == 0) {
						insertMQL({ key: params.title, count: 1 }, "search_key");
					} else {
						let sql = `update search_key set count = count + 1 where id = ${res[0].id}`;
						connection.query(sql, (error, res) => {
							if (error) {
								console.log(error);
								return;
							}
						})
					}
				})
				let sql = `select * from video where title like '%${params.title}%' limit ${params.offset},${params.limit}`;
				connection.query(sql, (error, res) => {
					if (error) {
						console.log(error);
						return;
					}
					success = success || function () { }
					success(res);
				})
			})
		},

	},
	day: {
		getList: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectListMQL(params, "*", "day_view", "order by top desc,top_time desc", res => {
						success(res);
					})
				})
			})
		},
		add: function (request, success) {
			checkSessionKey(request, success, user => {
				getPostParams(request, params => {
					insertMQL(params, "day", res => {
						success(res);
					})
				})
			})
		},
		delete: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					deleteMQL(params, "day", res => {
						success(res);
					})
				})
			})
		},
		get: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectMQL(params, "*", "day_view", "", res => {
						success(res);
					})
				})
			})
		},
		update: function (request, success) {

		},
		top: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					let sql = "update day set top = " + params.top + ",top_time = now() where id = " + params.id;
					connection.query(sql, (error, res) => {
						if (error) {
							console.log(error);
							return;
						}
						success(res);
					})
				})
			})
		}
	},
	memo: {
		getList: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectListMQL(params, "*", "memo_view", "order by update_time desc", res => {
						success(res);
					})
				})
			})
		},
		add: function (request, success) {
			checkSessionKey(request, success, user => {
				getPostParams(request, params => {
					params.user_id = user.id;
					insertMQL(params, "memo", res => {
						success(res);
					})
				})
			})
		},
		get: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectMQL(params, "*", "memo_view", "", res => {
						success(res);
					})
				})
			})
		},
		update: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					let sql = "update memo set content = '" + params.content + "' where id =" + params.id;
					connection.query(sql, (error, res) => {
						if (error) {
							console.log(error);
							return;
						}
						success(res);
					})
				})
			})
		},
		delete: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					deleteMQL(params, "memo", res => {
						success(res)
					})
				})
			})
		},
		star: function (request, success) {
			getGetParams(request, params => {
				let sql = "update memo set star = " + params.star + " where id = " + params.id;
				connection.query(sql, (error, res) => {
					if (error) {
						console.log(error);
						return;
					}
					success(res);
				})
			})
		}
	},
	message: {
		getList: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectListMQL(params, "*", "message_view", "order by creat_time desc", res => {
						success(res);
					})
				})
			})
		},
		get: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectMQL(params, "*", "message_view", "", res => {
						success(res);
					})
				})
			})
		},
		add: function (request, success) {
			checkSessionKey(request, success, user => {
				getPostParams(request, params => {
					params.user_id = user.id;
					insertMQL(params, "message", res => {
						success(res);
					})
				})
			})
		},
		delete: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					deleteMQL(params, "massage", res => {
						success(res);
					})
				})
			})
		}
	},
	dayBg: {
		get: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectMQL(params, "*", "day_bg", "", res => {
						success(res);
					})
				})
			})
		}
	},
	sliderBg: {
		getList: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectListMQL(params, "*", "slider_bg", "", res => {
						success(res);
					})
				})
			})
		},
		add: function (request, success) {
			checkSessionKey(request, success, user => {
				getPostParams(request, params => {
					insertMQL(params, "slider_bg", res => {
						success(res);
					})
				})
			})
		},
		delete: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					deleteMQL(params, "slider_bg", res => {
						success(res)
					})
				})
			})
		}
	},
	user: {
		login: function (request, success) {
			getPostParams(request, params => {
				selectMQL(params, "*", "user", "", res => {
					if (res.length == 1) {
						let user = {
							user: res[0].user
						};
						let session_key = new Date().getTime() + "" + res[0].user + new Date().getTime() + res[0].id;
						console.log("session_key = " + session_key);
						connection.query("update user set session_key = '" + session_key + "' where id = " + res[0].id, (error, res) => {
							if (error) {
								console.log(error);
								return;
							}
							user.session_key = session_key;
							success(user);
						});
					}
					else {
						success(false)
					}
				})
			})
		},
		regist: function (request, success) {
			getPostParams(request, params => {
				selectMQL(params, "*", "user", "", res => {
					if (res.length == 0) {
						insertMQL(params, "user", res => {
							success(res);
						})
					} else {
						success({
							id: 0
						});
					}
				})
			})
		},
		get: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					params.id = user.id;
					selectMQL(params, "*", "user", "", res => {
						success(res);
					})
				})
			})
		},
		update: function (request, success) {
			getPostParams(request, params => {
				let sql = "update user set nickname = '" + params.nickname + "',head_image = '" + params.head_image + "' where id = " + params.id;
				connection.query(sql, (error, res) => {
					if (error) {
						console.log(error);
						return;
					}
					success(res);
				})
			})
		}
	},
	photo: {
		getList: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					selectListMQL(params, "*", "photo", "order by creat_time desc", res => {
						success(res);
					})
				})
			})
		},
		add: function (request, success) {
			checkSessionKey(request, success, user => {
				getPostParams(request, params => {
					insertMQL(params, "photo", res => {
						success(res);
					})
				})
			})
		},
		delete: function (request, success) {
			checkSessionKey(request, success, user => {
				getGetParams(request, params => {
					deleteMQL(params, "photo", res => {
						success(res);
					})
				})
			})
		}
	},
	// upload: function (request, success) {
	// 	var bucket = "xuyang"
	// 	var accessKey = 'iWyuGIutQLEBsbkQ9aVtJdafnk35_M33LFeeUsYc';
	// 	var secretKey = 'KQqvjLDGVoFe8-vkftjxG9M-xOybdTp3V5Ic5C52';
	// 	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	// 	var options = {
	// 		scope: bucket,
	// 	}
	// 	var putPolicy = new qiniu.rs.PutPolicy(options);

	// 	var uploadToken = putPolicy.uploadToken(mac);
	// 	console.log(uploadToken)
	// 	success(uploadToken);
	// 	var config = new qiniu.conf.Config();
	// 	var localFile = "/Users/jemy/Documents/qiniu.mp4";
	// 	config.zone = qiniu.zone.Zone_z0;
	// 	var formUploader = new qiniu.form_up.FormUploader(config);
	// 	var putExtra = new qiniu.form_up.PutExtra();
	// }
}
/**
 * 获取POST请求参数
 * @param {request} request 
 * @param {callback} success 
 */
function getPostParams(request, success) {
	let params = "";
	request.on('data', chunk => {
		params += chunk;
		console.log(params + "data")
	});

	request.on('end', () => {
		console.log(params + "end")
		params = JSON.parse(params);
		success(params);
	})
}
/**
 * 获取GET请求参数
 * @param {request} request 
 * @param {callback} success 
 */
function getGetParams(request, success) {
	let params = url.parse(request.url, true).query;
	success(params);
}
/**
 * 查询列表
 */
function selectListMQL(params, key, table, sort, success) {
	let result = {};
	selectMQL({}, "count(*) as total", table, "", res => {
		result.total = (JSON.parse(JSON.stringify(res)))[0].total;
		selectMQL(params, key, table, sort, res => {
			result.rows = res;
			success(result);
		})
	})
}
/**
 * 执行数据库select语句
 * @param {请求参数} params 
 * @param {查询的key} key 
 * @param {表名} table 
 * @param {callback} success 
 */
function selectMQL(params, key, table, sort, success) {
	let sql = "select " + key + " from " + table + " where 1 = 1";
	let list = {
		offset: 0,
		limit: Number.MAX_SAFE_INTEGER
	}
	for (key in params) {
		if (key == "limit" || key == "offset") {
			list[key] = params[key];
		} else {
			sql += " and " + table + "." + key + " = '" + params[key] + "'";
		}
	}
	sql += " " + sort + " limit " + list.offset + "," + list.limit;
	console.log(sql)
	connection.query(sql, (error, res) => {
		if (error) {
			console.log(error);
			return;
		}
		success = success || function () { }
		success(res);
	})
}
/**
 * 执行数据库insert语句
 */
function insertMQL(params, table, success) {
	let sql = "insert into " + table + "(";
	let keys = [];
	let values = [];
	for (key in params) {
		keys.push(key);
		values.push("'" + params[key] + "'");
	}
	keys = keys.join(',');
	values = values.join(',');
	sql += keys + ")" + " values(" + values + ")";
	console.log(sql)
	connection.beginTransaction();
	connection.query(sql, (error, res) => {
		if (error) {
			console.log(error);
			connection.rollback();
			return;
		}
		connection.query("select @@identity as id", (error, res) => {
			if (error) {
				console.log(error);
				connection.rollback();
				return;
			}
			connection.commit();
			success = success || function () { }
			success(res[0]);
		})
	})
}
/**
 * 执行数据库delete语句
 */
function deleteMQL(params, table, success) {
	let sql = "delete from " + table + " where 1 = 1";
	for (key in params) {
		sql += " and " + key + " = '" + params[key] + "'";
	}
	connection.query(sql, (error, res) => {
		if (error) {
			console.log(error);
			return;
		}
		success = success || function () { }
		success(res.affectedRows);
	})
}
/**
 * 判断session_key权限
 */
function checkSessionKey(request, success, user) {
	selectMQL({
		session_key: request.headers['session-key']
	}, "*", "user", "", res => {
		if (res.length == 0) {
			success({
				result: false,
				mes: "没有权限"
			})
		} else {
			user(res[0]);
		}
	})
}
module.exports = {
	query: query
}