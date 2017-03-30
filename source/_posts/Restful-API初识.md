---
title: ZT-Restful API初识
date: 2017-01-24 09:57:30
tags: 后端
---

转载：<http://scarletsky.github.io/2016/11/30/error-handling-in-restful-api/>

Restful API这个概念是我这几天看博客才接触到的，但其实在日常开发中这个思想始终都占据着重要地位。

### 简介
随着移动开发和前端开发的崛起，越来越多的 Web 后端应用都倾向于实现 Restful API。
Restful API 是一个简单易用的前后端分离方案，它只需要对客户端请求进行处理，然后返回结果即可， 无需考虑页面渲染，一定程度上减轻了后端开发人员的负担。
不过，这也意味着，有一些工作就必须由前端来完成了，比如错误处理。

当 Restful API 需要抛出错误的时候，我们要考虑的是：这个错误应该包含哪些信息。
我们先看看 Github, Google, Facebook, Twitter, Twilio 的错误信息是怎样的。

<!-- more -->

```javascript
//Github
{
  "message": "Validation Failed",
  "errors": [
    {
      "resource": "Issue",
      "field": "title",
      "code": "missing_field"
    }
  ]
}

//Google
{
  "error": {
    "errors": [
      {
        "domain": "global",
        "reason": "insufficientFilePermissions",
        "message": "The user does not have sufficient permissions for file {fileId}."
      }
    ],
    "code": 403,
    "message": "The user does not have sufficient permissions for file {fileId}."
  }
}

//Facebook
{
  "error": {
    "message": "Message describing the error", 
    "type": "OAuthException",
    "code": 190,
    "error_subcode": 460,
    "error_user_title": "A title",
    "error_user_msg": "A message",
    "fbtrace_id": "EJplcsCHuLu"
  }
}
```

观察这些结构可以发现它们都有一些共同的地方：

* 都利用了 Http 状态码
* 有些返回了业务错误码
* 都提供了给用户看的错误提示信息
* 有些提供了给开发者看的错误信息


### 设计错误类型

我们刚才提到过，可以利用 Http 状态码来为错误类型进行分类。
通常我们所说的分类通常是对客户端错误进行分类， 即 4xx 类型的错误。

而这些错误类型中，我们最常用的是：

1. 400 Bad Request
由于包含语法错误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。
通常在请求参数不合法或格式错误的时候可以返回这个状态码。

2. 401 Unauthorized
当前请求需要用户验证。
通常在没有登录的状态下访问一些受保护的 API 时会用到这个状态码。

3. 403 Forbidden
服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助。
通常在没有权限操作资源时(如修改/删除一个不属于该用户的资源时)会用到这个状态码。

4. 404 Not Found
请求失败，请求所希望得到的资源未被在服务器上发现。
通常在找不到资源时返回这个状态码。

我个人习惯把错误分成以下几种类型：

* 格式错误 (FORMAT_INVALID)
* 数据不存在 (DATA_NOT_FOUND)
* 数据已存在 (DATA_EXISTED)
* 数据无效 (DATA_INVALID)
* 登录错误 (LOGIN_REQUIRED)
* 权限不足 (PERMISSION_DENIED)

错误分类之后，我们抛错误的时候就变得更加直观了：
```javascript
if (!res.body.title) {
  throw new Error(ERROR.FORMAT_INVALID)
}
if (!user) {
  throw new Error(ERROR.LOGIN_REQUIRED)
}
if (!post) {
  throw new Error(ERROR.DATA_NOT_FOUND)
}
if (post.creator.id !== user.id) {
  throw new Error(ERROR.PERMISSION_DENIED)
}
```