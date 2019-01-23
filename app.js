//引入express模块,创建端口，监听，并托管到静态文件在public
const express=require('express');
var app=express();
app.listen(3000);
app.use(express.static('./public'));

//使用body-parser中间件来将post请求的数据req.body解析为对象
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

//引入链接池
const pool=require('./pool');

//解决跨域访问的配置-->先加载cors模块
const cors=require('cors');
app.use(cors({
	origin:[
		"http://127.0.0.1:3001",
		"http://localhost:3001",
		"http://127.0.0.1:8080",
		"http://localhost:8080",
		"http://176.30.9.140:8080"
	],
	credentials:true
}))
//a1:加载第三方模块：express-session
const session = require("express-session");
//a2:对模块进行配置
app.use(session({
  secret:"128位随机字符",  //安全令牌
  resave:false,     //每次请求是否要重新创建session对象
  saveUninitialized:true,  //初始化值
  cookie:{    //将session id保存cookie
    maxAge:1000*60*60*24  //保存的最大时间，一天
  }
}));

//此处开始直接创建路由器  不另外创建路由文件夹。
/****************************************user**************************************/
app.get("/register",(req,res)=>{
	var uname = req.query.uname;
	var email = req.query.email;
	var upwd = req.query.upwd;
	var phone = req.query.phone;
	//验证用户名格式
	var reg = /^[a-z0-9_]{8,12}$/;
	if(!reg.test(uname)){
		res.send({code:-1,msg:"用户名格式不正确"});
		return;
	}
	//添加用户的信息到数据库
	var sql = "INSERT INTO fk_user VALUES(null,?,?,md5(?),?)";
	pool.query(sql,[uname,email,upwd,phone],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows > 0){
			res.send({code:1,msg:"注册成功"});
		}else{
			res.send({code:-1,msg:"注册失败"});
		}
	})
});
//功能三：用户名是否存在
app.get("/exUname",(req,res)=>{
	var uname = req.query.uname;
	var sql = " SELECT count(uid) as c FROM fk_user WHERE uname=?"
	pool.query(sql,[uname],(err,result)=>{
		if(err) throw err;
		if(result[0].c > 0){
			res.send({code:-1,msg:"用户名已存在"});
		}else{
			res.send({code:1,msg:"欢迎使用"})
		}
	})
})
//功能四：用户登录
app.get("/login",(req,res)=>{
	var uname = req.query.uname;
	var upwd = req.query.upwd;
	var sql = " SELECT count(uid) as c,uid FROM fk_user WHERE uname=? AND upwd = md5(?)";
	pool.query(sql,[uname,upwd],(err,result)=>{
		if(err) throw err;
		var c = result[0].c;
		if(c == 1){
			req.session.uid = result[0].uid;
			res.send({code:1,msg:"登录成功"});
		}else{
			res.send({code:-1,msg:"用户名或密码错误"})
		}
	})
})

/****************************************news**************************************/
app.get("/getNews",(req,res)=>{
	var nid=req.query.nid;
	var sql="SELECT * FROM fk_news where family_uid=?";
	pool.query(sql,[nid],(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
}) 
/****************************************about**************************************/
app.get("/getAboutPic",(req,res)=>{
	var aid = req.query.aid;
	var sql = "SELECT * FROM fk_about_pic WHERE family_aid=?";
	pool.query(sql,[aid],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
app.get("/getAbout",(req,res)=>{
	var aid = req.query.aid;
	var sql = "SELECT * FROM fk_about WHERE family_aid=?";
	pool.query(sql,[aid],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
/****************************************join****************************************/
//功能七：获取join页面的图片
app.get("/getJoinPic",(req,res)=>{
	var uid = req.query.uid;
	var sql = " SELECT * FROM fk_join_pic WHERE family_uid=?";
	pool.query(sql,[uid],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
})
//功能六：获取join页面的文字内容
app.get("/getJoin",(req,res)=>{
	var uid =req.query.uid;
	var sql = " SELECT * FROM fk_join WHERE family_uid=?";
	pool.query(sql,[uid],(err,result)=>{
		if(err) throw err;
		res.send(result)
	})
})

/*********************************index********************************************/
//功能五：获取页头页尾的图片！
app.get("/getImage",(req,res)=>{
	var rows=[
		{id:1,img_url:"http://176.30.9.140:3000/images/index_base/boydyBG.jpg"},
		{id:2,img_url:"http://176.30.9.140:3000/images/index_base/contentContainerBG.jpg"},
		{id:3,img_url:"http://176.30.9.140:3000/images/index_base/logo.png"},
		{id:4,img_url:"http://176.30.9.140:3000/images/index_base/logo_rwd.png"},
		{id:5,img_url:"http://176.30.9.140:3000/images/index_base/Iso.png"},
		{id:6,img_url:"http://176.30.9.140:3000/images/index_base/IAF.png"},
		{id:7,img_url:"http://176.30.9.140:3000/images/index_base/tel.jpg"},
	];
	res.send(rows);
});
/*******************************************product***********************************/
//功能四：获取product商品详情——商品详情！
app.get("/getSpec",(req,res)=>{
	var pid=req.query.pid;
	var sql="select *from fk_product_spec where pid=?";
	pool.query(sql,[pid],(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
});

//功能三：获取product商品详情——商品详情！
app.get("/getDetail",(req,res)=>{
	var pid=req.query.pid;
	var sql="select *from fk_product_family where pid=?";
	pool.query(sql,[pid],(err,result)=>{
		if(err)throw err;
		res.send(result);
	});
});

//功能二：获取product商品详情——主标题
app.get("/getFname",(req,res)=>{
	var sql="select * from fk_product_fname";
	pool.query(sql,(err,result)=>{
		if(err)throw err;
		res.send(result);
	})
});

//功能一：获取product商品详情——主标题、副标题、图片等！
app.get("/getProduct",(req,res)=>{
//获取请求的参数
	var pno=req.query.pno;
	var pageSize=req.query.pageSize;
	var fid=req.query.fid;
	var kwords=req.query.kwords;
//验证
	if(!pno)pno=1;
	if(!pageSize)pageSize=18;
	var reg=/^[0-9]{1,2}$/;
	if(!reg.test(pno)){res.send({code:-1,msg:"页码格式不正确"});return;}

//定义obj.code、计算obj.pagecount、获取obj.data!显示页码obj.pno,和查询总数obj.total
//限制显示个数，传开始值offset 和页数 pageSize
var progress=0;
var obj={code:1,pno:pno};
var offset=parseInt((pno-1)*pageSize);
pageSize=parseInt(pageSize);

//分两种情况，一给了fid根据类查找数据，二没有给fid而是给了kwords根据关键字查找数据！
//一、当fid==undefined && kwords!=undefined   应该是按关键字查找
//二、当fid!=undefined && kwords==undefined  应该是按类编号查找
//三、当fid==undefined && kwords==undefined   应该是全部查找！
	if(fid==undefined && kwords!=undefined){//undefined  竟然是true！！！
		kwords=kwords.split(" ");
		var titles=kwords.map(function(){return ` subname like ? `;}).join(" and ");
		kwords.forEach(function(val,i,arr){kwords[i]=`%${val}%`;});
		var sql="select count(pid) as cn from fk_product_family where "+titles;
		pool.query(sql,[kwords],(err,result)=>{
			if(err)throw err;
			obj.pagecount=Math.ceil(result[0].cn/pageSize);
			obj.totals=Math.ceil(result[0].cn);
			progress+=50;
			if(progress==100){res.send(obj);}
		})
		var sql="select * from fk_product_family where  "+titles+"  limit ?,? ";
		pool.query(sql,[kwords,offset,pageSize],(err,result)=>{
			if(err)throw err;
			obj.data=result;
			progress+=50;
			if(progress==100){res.send(obj);/*console.log("kwords的"+obj);*/}
		})
	}else if(fid!=undefined && kwords==undefined){
  //按照fid类查找数据的情况！
		var sql="select count(pid) as cn from fk_product_family where family_pid=?";
		pool.query(sql,[fid],(err,result)=>{
			if(err)throw err;
			obj.pagecount=Math.ceil(result[0].cn/pageSize);
			obj.totals=Math.ceil(result[0].cn);
			progress+=50;
			if(progress==100){res.send(obj);}
		})
		var sql="select * from fk_product_family where family_pid=? limit ?,?";
		pool.query(sql,[fid,offset,pageSize],(err,result)=>{
			if(err)throw err;
			obj.data=result;
			progress+=50;
			if(progress==100){res.send(obj);/*console.log("fid的"+obj);*/}
		})
	}else if(fid==undefined && kwords==undefined){
		//查找全部数据的情况！
		var sql="select count(pid) as cn from fk_product_family";
		pool.query(sql,(err,result)=>{
			if(err)throw err;
			obj.pagecount=Math.ceil(result[0].cn/pageSize);
			obj.totals=Math.ceil(result[0].cn);
			progress+=50;
			if(progress==100){res.send(obj);}
		})
		var sql="select * from fk_product_family limit ?,?";
		pool.query(sql,[offset,pageSize],(err,result)=>{
			if(err)throw err;
			obj.data=result;
			progress+=50;
			if(progress==100){res.send(obj);/*console.log("全部的"+obj);*/}
		})
	}
})
