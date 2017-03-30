---
title: Cache Storage如何可控
date: 2017-02-09 09:40:03
tags: Javacsript
---

昨天尝试给自己的Github Page使用了service worker工具，从而更好地利用和控制缓存，其中代码中有一段：

```javascript
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
```

这段代码会判断request请求是否命中了缓存，如果是就直接使用缓存，response同理。

那么，这个caches就成了关键。它是如何work的呢？其实这个caches就是Cache Storage，它存在全局变量window中，因此无需定义可直接调用。

我们从一个简单的DEMO中来看它的使用方式：

```javascript
caches.delete('c1');
caches.delete('c2');
Promise.all([
  caches.open('c1').then(function(cache) {
    return cache.put('/hehe', new Response('aaa', { status: 200 }));
  }),
  caches.open('c2').then(function(cache) {
    return cache.put('/hehe', new Response('bbb', { status: 200 }));
  })
]).then(function() {
  return caches.match('/hehe');
}).then(function(response) {
  return response.text();
}).then(function(body) {
  console.log(body);
});
```

首先，在 caches 上调用 open 方法就可以异步地得到一个 Cache 对象的引用。在这个对象上我们可以把 Response 对象 put 进去（参数是一个 URL 和一个 Response 对象）、用 match 方法取出（传入一个 URL 取出对应的 Response 对象）。match 方法不仅可以在 Cache 上调用 CacheStorage 上也有 match 方法，比如上面例子就打开了两个 Cache，都写入一个叫 /hehe 的 URL。在写入操作完成之后，到外部的 CacheStorage 上调用 match 方法来匹配 /hehe，结果是随机的（没找到这个规则在哪里定义的）。
　　
虽然上面的例子中只对 Cache 对象 put 了一个数据，而 Cache 对象本身可以存放更多的 URL/Response 对。并且提供了 delete（用户删除）、keys（用于遍历）等方法。但是 Cache 并不像 localStorage 一样有 clear 方法，如果非要清空一个 Cache，可以直接在 CacheStorage 上把整个 Cache 给 delete 掉再重新 open。这套 API 和 ServiceWorker 一家的，它通常被用于 ServiceWorker 中，整个设计风格也和 ServiceWorker 一样都基于 Promise。
