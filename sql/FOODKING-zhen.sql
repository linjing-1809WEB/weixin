SET NAMES UTF8;
DROP DATABASE IF EXISTS FOODKING;
CREATE DATABASE FOODKING CHARSET=UTF8;
USE FOODKING;

/**用户信息**/
CREATE TABLE fk_news(
uid INT PRIMARY KEY AUTO_INCREMENT,
family_uid INT,
title VARCHAR(64),
date DATE,
text VARCHAR(256)
);
/**文字内容导入**/
INSERT INTO fk_news VALUES
(null,1,'最 新 消 息','2018-09-20','中秋假期出貨時間公告'),
(null,1,'最 新 消 息','2018-08-15','您使用的炸粉、烘焙粉有含鋁重金屬嗎？'),
(null,1,'最 新 消 息','2018-03-21','美味王清明連假暫停出貨公告'),
(null,1,'最 新 消 息','2018-01-24','美味王春節暫停出貨公告'),
(null,1,'最 新 消 息','2017-08-18','美味王風味系列新品上市!'),
(null,2,'檔 案 下 載','2018-09-21','厦门美味皇食品有限公司相关档案'),
(null,2,'檔 案 下 載','2018-09-21','2018美味王產品報價表'),
(null,2,'檔 案 下 載','2018-09-21','2018美味王產品報價表（A4）'),
(null,2,'檔 案 下 載','2018-09-21','2018美味王產品報價表（A5）'),
(null,3,'媒 體 報 導','2017-10-30','視客戶為創業夥伴，美味王的跨海品牌聖經'),
(null,3,'媒 體 報 導','2017-10-02','「不喜歡道歉」美味王砸重金設檢驗室，向黑心食品宣戰'),
(null,3,'媒 體 報 導','2017-08-08','智利驚見雞排珍奶，芭樂哥與美味王的台灣味王國'),
(null,3,'媒 體 報 導','2017-07-20','ODM「心」型態，充滿人情味的創業夢工廠');

