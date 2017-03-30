---
title: webpack入门&感想
date: 2017-02-23 10:09:04
tags:
---

也许你想在写代码的时候检查自己的js是否符合jshint的规范，那么隆重推荐preLoaders和postLoaders，loaders是webpack的最重要模块，用它来处理各种类型的文件。perLoaders顾名思义就是在loaders执行之前处理的，webpack的处理顺序是perLoaders - loaders - postLoaders。

另外，这两天把服务器从apache迁移到了nginx，nginx的反向代理功能确实非常有用，现在已经把原本监听8080端口的NodeJs服务都反响代理到了80端口，这样一来我的HTTPS证书相当于在8080端口也能起效了。
