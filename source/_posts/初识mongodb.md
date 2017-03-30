---
title: 初识mongodb
date: 2017-01-20 09:14:53
tags: 后端
---

### mongodb
传说中的非关系数据库，颠覆了我们在大学时学数据库时的三观，虽说那时并非所有的数据库都是关系型数据库，但起码有一统江湖的感觉。


## 引入
```javascript
npm i mongo
```
另外，还有一个非常重要的步骤，要在命令行中执行 mongod --dbpath "D:\vue\vue-wechat\server"  D:\vue\vue-wechat\server换成需要启动服务的位置，也就是你项目的server文件夹。这个命令相当于打开MONGODB的服务界面，让其进入服务状态。

<!-- more -->


## server JS维护
```javascript
const mongodb = require('mongodb');
const  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('XXXX', server, {safe:true}); //XXXX可以改成任意名字

const hostname = '127.0.0.1';
const port = 9001; //port注意不要和已启动的服务端口重合，比如PHP常用的9000，VUE常用的8080

http.createServer((req, res) => {
  var json; 
  var _callbackName = req.url.substr(req.url.indexOf('=') + 1);

  http.get('XXXXXXXX', (response) => {  
    response.setEncoding('utf8');  
    response.on('data', (data) => {  
     // json = data;  
      res.end(_callbackName + "(" + data + ")");

      res._tempData = data;

      db.open( (err, db) =>{
		    if (!err) {
		        console.log('connect db');
				//数据库连接
		        db.createCollection('test', { safe: true }, (err, collection) => {
		        	debugger
		            if (err) {
		                console.log(err);
		            } else {
		                var tmp1 = JSON.parse(res._tempData);
		                collection.insert([tmp1], { safe: true }, function(err, result) {
		                    console.log(result);
		                });
		                /*collection.remove({title: "world"}, function(err, count) {
		                	// console.log(count);
		                })*/
		                collection.find().toArray(function(err, docs) {
		                    console.log('find');
		                    console.log(docs);
		                });

		                db.close();
		                /*collection.findOne(function(err, doc) {
		                    console.log('findOne');
		                    console.log(doc);
		                });*/

		            }

		        });
		    } else {
		        console.log(err);
		    }
	  });

    });  

  });  
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

<font color=red>总结一下，总的来说非常简单，不知效率如何，我的猜想，应该是比较适合层次较少的JSON数据结构。</font>