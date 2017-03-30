---
title: 写一个hexo新主题！
date: 2017-02-27 18:30:27
tags:
---


从今天开始，写一个新的Hexo主题，学习一下ejs语法，并且熟悉webpack的工作流程。

首先，找到了Base，就是Yilla，这个主题我非常喜欢，但是它还存在一些可以优化的地方，比如说：

1.当我的域名为https://XXX.github.io/XXX的时候，模版支持不太友好，很多地方只能手动去改代码，否则就会有URL错误的情况产生，所以打算加上这方面的支持。

2.想自己写一些附加功能，比如置顶文章。

3.另外，我最近对NODEJS挺着迷的，并且我自己的网站<https://jasongan.cn>刚刚支持了HTTPS协议，因此开始为博客写接口，形成一个以Github博客为前端，jasongan.cn为后台服务器的完整架构，开始向全栈进发！

<!-- more -->

---

OK，牛吹完了，现在插播一条广告。今天在项目中碰到了一个有关执行上下文的问题，于是就debugger了一下Jquery代码，看看$.proxy如何实现，上代码：

```
$.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

```

这里有几个点需要注意一下：
首先，之所以var args = (2 in arguments) && slice.call(arguments, 2)是因为用户可能会传入其他参数，比如:

>$.proxy(chooseReason, this, "Jason")

这个"Jason"就是用户传入的额外参数，这个时候要把"jason"push到args里，以便之后能够被element取到

>function chooseReason(element) {
    $(this).find('span').html($(element).html()).attr('value', $(element).attr('value'));
}

---