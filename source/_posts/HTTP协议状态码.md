---
title: 阿里云服务器NodeJs部署小问题
date: 2017-02-10 10:41:46
tags: 网络相关
---

今天在写自己的小项目。遇到一个问题。

用nodejs写的后端，Vue前端，后端逻辑非常简单，就是从第三方接口查信息，然后通过Mongodb存储到本地数据库，并且把信息返回。

这个工作只花了20分钟就在本地测试通过了，然后开始部署到自己的阿里云服务器上。结果上去以后就有问题，获取不到！

<img src="https://ganchengyuan1990.github.io/blog/img/20170210.jpg" alt="">

<!-- more -->

写的是一个Jsonp的跨域请求，但其实已经不是跨域了，因为请求发起地址是"http://jasongan.cn/"，response地址是"http://jasongan.cn:9001"。

在node.js中也写了header，启用了CORS来应对跨域问题

>res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

这都没什么奇怪的，问题是让我把测试机通过公司的代理服务器再发HTTP请求时，居然获得了response！

<img src="https://ganchengyuan1990.github.io/blog/img/20170210.png" alt="">

来看一下此时HTTP的请求信息
```
Request URL:http://jasongan.cn:9001/?callback=_jsonprjvoxbwo27h0lgel5a0s5rk9
Request Method:GET
Status Code:200 OK
Remote Address:10.200.70.3:8080

Response Headers
view source
Access-Control-Allow-Headers:Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Methods:PUT, POST, GET, DELETE, OPTIONS
Access-Control-Allow-Origin:*
Connection:keep-alive
Content-Length:184
Date:Fri, 10 Feb 2017 06:44:54 GMT
Via:1.1 proxy3.fn.com (squid/3.4.4)
X-Cache:MISS from proxy3.fn.com
X-Cache-Lookup:MISS from proxy3.fn.com:8080

Request Headers
view source
Accept:*/*
Accept-Encoding:gzip, deflate, sdch
Accept-Language:zh-CN,zh;q=0.8
Cache-Control:no-cache
Host:jasongan.cn:9001
Pragma:no-cache
Proxy-Connection:keep-alive
Referer:http://jasongan.cn/
User-Agent:Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1

callback:_jsonprjvoxbwo27h0lgel5a0s5rk9

```
Response Headers里X-Cache表示你的 http request 是由 proxy server 回的 .MISS 表 proxy无资料,代理动作, HIT 表 proxy 直接回应。

最后发现，自己的阿里云服务器如果要开启nodejs服务，默认是监听8080端口的，因此改成response地址<http://jasongan.cn:8080>就可以了。而因为公司代理服务器的端口也恰好是8080，所以才可以。
