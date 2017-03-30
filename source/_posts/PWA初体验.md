---
title: PWA初体验
date: 2017-02-07 09:33:22
tags: 
---

`白屏`以及`离线不可用`，是Web App最大的体验问题。据说，PWA是解决这两大问题的曙光。

那么，就很有必要来了解试用一下这玩意儿。

OK, 程序员的好习惯之一是使用Github，搜索"pwa demo"

<img src="https://ganchengyuan1990.github.io/blog/img/time.gif" alt="">

<!--more -->

按照md来进行安装和部署之后，按照要求来试玩（因为下载不到chrome canary版本，暂用普通的Chrome来测试）：

Step 1: Go offline.(切离线环境)
Step 2: Register BG Sync from above register button.(点击页面上注册按钮)
Step 3: Enter a git username and click add.(输入github用户名)
Step 4: Go online and sync will be triggered when user is gets connectivity and card will be updated.(切上线环境以后刷新)

试用以后并不能work.

因此简单修改步骤:

Step 1: 线上环境首先搜索一个github用户名。
Step 2: 获得结果以后切离线环境。
Step 3: 点击注册按钮。
Step 4: 离线环境下搜索同一个用户名，正常来说无法访问，但是同样可以获得正确结果。

<img src="https://ganchengyuan1990.github.io/blog/img/pwa.png" alt="">


为何如此神奇呢？
<img src="https://ganchengyuan1990.github.io/blog/img/header.png" alt="">
上图是HTTP Response头部信息，看起来这个serviceWorker是重点

先看一段定义
>一个 service worker 是一段运行在浏览器后台进程里的脚本，它独立于当前页面，提供了那些不需要与web页面交互的功能在网页背后悄悄执行的能力。在将来，基于它可以实现消息推送，静默更新以及地理围栏等服务，但是目前它首先要具备的功能是拦截和处理网络请求，包括可编程的响应缓存管理。

接着看代码：
```javascript

//Adding `fetch` event listener
self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then((response) => {
        var responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

```
可以看到，全局变量有一个监听器，监听fetch事件，而这边的fetch就是获取API的工作，`从上面(If request is already in cache, return it)可以看出如果命中了缓存中的request，就直接使用缓存，response同理。`

从下面的代码中可以看到，如果处于offline状态，请求参数会先存在localStorage中，然后sync事件会激活，从而再去发送请求

>.catch(function (error) {
    //If user is offline and sent a request, store it in localStorage
    //Once user comes online, trigger bg sync fetch from application tab to make the failed request
    localStorage.setItem('request', name);
    spinnerElement.classList.remove('show'); //hide spinner
    console.error(error);
  });


```javascript
self.addEventListener('sync', (event) => {
  console.info('Event: Sync');

  //Check registered sync name or emulated sync from devTools
  if (event.tag === 'github' || event.tag === 'test-tag-from-devtools') {
    event.waitUntil(
      //To check all opened tabs and send postMessage to those tabs
      self.clients.matchAll().then((all) => {
        return all.map((client) => {
          return client.postMessage('online'); //To make fetch request, check app.js - line no: 122
        })
      })
      .catch((error) => {
        console.error(error);
      })
    );
  }
});
```
这样来看，必须了解一下serviceWorker的工作原理与使用方法了，阅读文章大有收获<https://www.w3ctech.com/topic/866>

根据以上文章可以在自己的Github Page中应用Service Worker，大家可以看看我的Blog，现已开启服务<https://ganchengyuan1990.github.io/blog/>。

值得注意的是，目前只有`HTTPS协议`下可以使用Service Worker，而Github Page服务器上使用的就是HTTPS协议，所以最合适用来试验。另外，如果所有第三方资源(包括图片)最好也使用HTTPS协议，否则就会有报错，无法正常显示。办法之一就是把图片资源都放在Github Page服务器上。