var mysql = require('mysql');
var url = require('url');
const md5 = require('md5');
// var qiniu = require('qiniu');
var connection;
connect();

function connect() {
	connection = mysql.createConnection({
		host: '120.79.249.143',
		user: 'xuyang',
		password: 'xyxl1997',
		database: 'jm',
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
						nativeSql(sql, res => {
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
						nativeSql(sql, res => { });
					}
				})
				let sql = `select * from video where title like '%${params.title}%' order by id desc limit ${params.offset},${params.limit}`;
				nativeSql(sql, res => {
					success(res);
				})
			})
		},
		getHotVideo(request, success) {
			getGetParams(request, params => {
				selectListMQL(params, "*", "video", "order by play_count desc,updated_at desc", res => {
					success(res);
				})
			})
		},
		getRecommend(request, success) {
			getGetParams(request, params => {
				selectListMQL({ offset: 0, limit: 10 }, "*", "video", "order by rand()", res => {
					success(res);
				})
			})
		},
		getHotKey(request, success) {
			getGetParams(request, params => {
				selectListMQL(params, "*", "search_key", "and `key` != '' order by `count` desc", res => {
					success(res);
				})
			})
		},
		addPlayCount(request, success) {
			getPostParams(request, params => {
				let sql = `update video set play_count = play_count + 1 where id = ${params.id}`;
				nativeSql(sql, res => {
					success("success");
				})
			})
		},
		// 注册
		userRegister(request, success) {
			getPostParams(request, params => {
				selectMQL({ account: params.account }, "*", "user", "", res => {
					if (res.length == 0) {
						insertMQL({
							account: params.account,
							password: params.password,
							vip_date: getDate(new Date().getTime())
						}, "user", res => {
							console.log(res)
							if (res.id > 0) {
								success({
									result: true,
									message: "注册成功",
									datas: res
								})
							} else {
								success({
									result: false,
									message: "未知错误"
								})
							}
						})
					} else {
						success({
							result: false,
							message: "该账号已被注册"
						})
					}
				})
			})
		},
		// 登录
		userLogin(request, success) {
			getPostParams(request, params => {
				selectMQL({
					account: params.account,
					password: params.password
				}, "*", "user", "", res => {
					if (res.length > 0) {
						let token = md5(new Date().getTime() + res[0].account);
						let sql = `update ppx.user set \`token\` = '${token}' where id = '${res[0].id}'`;
						nativeSql(sql, res => {
							success({
								result: true,
								message: "登录成功",
								datas: {
									token: token
								}
							})
						})
					} else {
						success({
							result: false,
							message: "账号或密码错误"
						})
					}
				})
			})
		},
		playCheckToken(request, success) {
			checkToken(request, user => {
				var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || request.connection.remoteAddress || "";
				ip = ip.split(":")[3];
				// 查询播放次数
				var sql = `select * from ppx.ip_count where \`ip\`='${ip}' and date_format(\`date\`,'%Y-%m-%d')=CURDATE()`;
				var play_count = 0;
				nativeSql(sql, res => {
					if (res.length == 0) {
						// 该ip今天未播放，插入播放记录
						insertMQL({
							ip: ip,
							play_count: 1
						}, "ip_count", res => {

						})
					} else {
						// 播放次数 + 1
						play_count = res[0].play_count;
						sql = `update ppx.ip_count set \`play_count\` = \`play_count\`+1,\`date\`='${getDate(new Date().getTime())}' where \`ip\` = '${ip}' and date_format(\`date\`,'%Y-%m-%d')=CURDATE()`;
						nativeSql(sql, res => {

						})
					}
					success({
						datas: {
							user: user,
							play_count: play_count
						},
						result: true
					});
				})
			})
		},
		userInvest(request, success) {
			checkToken(request, user => {
				if (!user) {
					success({
						result: false,
						message: "登录信息有误，请重新登录"
					})
				} else {
					getPostParams(request, params => {
						connection.beginTransaction();
						selectMQL({
							password: params.password,
							isUsed: 0
						}, "*", "card", "", res => {
							if (res.length == 0) {
								// 不存在卡密
								success({ result: false, message: "无效的充值卡密！" });
							} else {
								// 存在卡密，充值
								let date = res[0].day * 24 * 60 * 60 * 1000;
								if (user.vip) {
									date += new Date(user.vip_date).getTime();
								} else {
									date += new Date().getTime();
								}
								nativeSql(`update ppx.user set \`vip_date\`='${getDate(date)}' where \`id\`='${user.id}' `, res => {
									if (res.affectedRows == 1) {
										// 已充值，删除该卡密
										nativeSql(`update ppx.card set \`isUsed\`='1',\`invest_time\`='${getDate(new Date().getTime())}' where \`password\`='${params.password}'`, res => {
											if (res.affectedRows == 1) {
												connection.commit();
												success({
													result: true,
													message: "充值成功"
												})
											} else {
												connection.rollback();
												success({ result: false, massage: "充值出错，请稍后重试" })
											}
										}, true)
									} else {
										connection.rollback();
										success({ result: false, massage: "充值出错，请稍后重试" })
									}
								}, true)
							}
						})
					})
				}
			})
		},
		getUserInfo(request, success) {
			checkToken(request, user => {
				success({
					result: true,
					user: user
				})
			})
		},
		getHistory(request, success) {
			getGetParams(request, params => {
				nativeSql(`select * from ppx.video where id in (${params.history}) order by field(id,${params.history});`, res => {
					success({
						result: true,
						datas: res
					})
				});
			})
		}
	},
	jiumi: {
		// 登录
		userLogin(request, success) {
			getPostParams(request, params => {
				selectMQL({
					account: params.account,
					password: params.password
				}, "*", "jm_user", "", res => {
					if (res.length > 0) {
						let token = md5(new Date().getTime() + res[0].account);
						let sql = `update jm.jm_user set \`token\` = '${token}' where id = '${res[0].id}'`;
						nativeSql(sql, res => {
							success({
								result: true,
								message: "登录成功",
								datas: {
									token: token
								}
							})
						})
					} else {
						success({
							result: false,
							message: "账号或密码错误"
						})
					}
				})
			})
		},
		// 签到
		mark(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					nativeSql(`select * from jm.jm_mark where user_id='${user.id}' and day(\`created_at\`)=day(now())`, res => {
						if (res[0]) {
							success({
								result: false,
								message: "您今日已签到"
							})
						} else {
							insertMQL({
								'user_id': user.id
							}, 'jm_mark', res => {
								success({
									result: true,
									datas: res,
									message: "签到成功"
								})
							})
						}
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 获取是否签到
		getIsMark(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					nativeSql(`select * from jm.jm_mark where user_id='${user.id}' and day(\`created_at\`)=day(now())`, res => {
						success({
							result: true,
							datas: res[0] ? 1 : 0,
							message: "获取成功"
						})
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 获取当月签到记录
		getMonthMark(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					nativeSql(`select * from jm.jm_mark where user_id='${user.id}' and month(\`created_at\`)=month(now()) order by created_at`, res => {
						success({
							result: true,
							datas: res,
							message: "获取成功"
						})
					});
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 获取所有签到记录
		getAllMark(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					nativeSql(`select * from jm.jm_mark where user_id='${user.id}' order by created_at desc`, res => {
						success({
							result: true,
							datas: res,
							message: "获取成功"
						})
					});
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 添加纪念日
		addDays(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					getPostParams(request, params => {
						insertMQL({
							user_id: user.id,
							date: params.date,
							content: params.content
						}, "jm.jm_days", res => {
							success({
								result: true,
								datas: res,
								message: "添加成功"
							})
						})
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 编辑纪念日
		editDays(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					getPostParams(request, params => {
						nativeSql(`update jm.jm_days set date = '${params.date}',content = '${params.content}' where user_id = '${user.id}' and id = '${params.id}'`, res => {
							success({
								result: true,
								datas: res,
								message: "修改成功"
							})
						})
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 查询其他纪念日列表
		getOtherDays(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					selectListMQL({
						user_id: user.id,
						is_recommend: 0
					}, "*", "jm.jm_days", 'order by id desc', res => {
						res.rows.forEach(v => {
							v.diffDay = getDiffDay(v.date);
						})
						success({
							result: true,
							datas: res,
							message: "获取成功"
						})
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		},
		// 查询推荐纪念日
		getRecDays(request, success) {
			checkJiumiToken(request, user => {
				if (user) {
					selectListMQL({
						user_id: user.id,
						is_recommend: 1
					}, "*", "jm.jm_days", '', res => {
						res.rows.forEach(v => {
							v.diffDay = getDiffDay(v.date);
						})
						success({
							result: true,
							datas: res,
							message: "获取成功"
						})
					})
				} else {
					success({
						result: false,
						message: "令牌过期，请重新登录"
					})
				}
			})
		}
	}

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
	let p = JSON.parse(JSON.stringify(params));
	delete p.limit;
	delete p.offset;
	selectMQL(p, "count(*) as total", table, "", res => {
		result.total = (JSON.parse(JSON.stringify(res)))[0].total;
		selectMQL(params, key, table, sort, res => {
			result.rows = res;
			success(result);
		})
	})
}
// 时间戳获取日期
function getDate(timeStamp) {
	let date = new Date(timeStamp);
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}
function nativeSql(sql, success, rollback = false) {
	console.log(sql)
	connection.query(sql, (error, res) => {
		if (error) {
			if (rollback) {
				connection.rollback();
			}
			success({
				message: "未知错误",
				result: false
			})
		} else {
			success(res);
		}
	})
}
function getDiffDay(date) {
	let timeDiff = new Date().getTime() - new Date(date).getTime();
	return parseInt(timeDiff / 1000 / 60 / 60 / 24);
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
		keys.push("`" + key + "`");
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
function checkToken(request, user) {
	selectMQL({
		token: request.headers['token']
	}, "*", "user", "", res => {
		if (res[0]) {
			let time = new Date(res[0].vip_date).getTime();
			let now = new Date().getTime();
			res[0].vip = time > now;
			user(res[0]);
		} else {
			user(null);
		}
	})
}
/**
 * 判断session_key权限 jiumi
 */
function checkJiumiToken(request, user) {
	selectMQL({
		token: request.headers['token']
	}, "*", "jm_user", "", res => {
		if (res[0]) {
			user(res[0]);
		} else {
			user(null);
		}
	})
}
module.exports = {
	query: query
}