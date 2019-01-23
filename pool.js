//引入mysql
const mysql=require('mysql');
var pool=mysql.createPool({
	host:'127.0.0.1',
	port:3306,
	user:'root',
	password:'',
	database:'FOODKING',
	connectionLimit:30
});
//导出
module.exports=pool;