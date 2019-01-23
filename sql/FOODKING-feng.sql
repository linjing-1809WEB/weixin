SET NAMES UTF8;
DROP DATABASE IF EXISTS FOODKING;
CREATE DATABASE FOODKING CHARSET=UTF8;
USE FOODKING;


/**用户信息**/
CREATE TABLE fk_user(
	uid INT PRIMARY KEY AUTO_INCREMENT,        #编号
	uname     varchar(32),                     #姓名
	email     varchar(32),                     #账号——邮箱
	upwd      varchar(32),                     #密码
	phone     varchar(11)                      #手机
);

/**数据导入**/
/**1.信息表-导入**/
INSERT INTO fk_user VALUES
(NULL,'美味皇0','MWH0@163.com','123456789','15232569854'),
(NULL,'美味皇1','MWH1@163.com','123456789','15232569854'),
(NULL,'美味皇2','MWH2@163.com','123456789','15232569854'),
(NULL,'美味皇3','MWH3@163.com','123456789','15232569854');


