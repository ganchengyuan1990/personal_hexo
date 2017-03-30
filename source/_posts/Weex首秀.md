---
title: Weex首秀【置顶】
date: 2017-02-16 13:54:46
tags: Vue 置顶
top: 2
---

### 第一部分 2017-01-25

一直想做一个APP，去年也自学过一段时间的`React Native`, 但是RN相对来说学习曲线比较陡峭，并且很多资源包在下载时都不是那么容易，经常error（这个大家都懂）, 所以这事儿就不了了之了。

前两天看了weex的会议，觉得阿里又在放大招了，这个工具虽然目前学习社区不多，资源组件不丰富，但是本身调式来发非常便捷，weex playground非常不错，并且因为weex是基于vue的，所以入门简单，`npm run build`打包以后部署到自己的服务器上，用二维码扫描以后就可以拥有一个自己的APP了，并且是兼容三端的，这一点非常诱人。

于是，我就从github上找到了一个别人的项目，<https://github.com/dodola/WeexOne>，然后改造一个属于自己的APP。
总体样式如下：
<img src="https://ganchengyuan1990.github.io/blog/img/weex.jpg" alt="">
<!-- more -->

开始动手！

首先，引入了picker组件，这个组件用来进行时间选择，前端效果不错。
<img src="https://ganchengyuan1990.github.io/blog/img/weex2.jpg" alt="" />
```javascript
 require('weex-components');
    const picker = require('@weex-module/picker');
  export default {
    data () {
      return {
        value: ''
      }
    },
    methods: {
      pickTime () {
        picker.pickTime({
          value: this.value
        }, event => {
          if (event.result === 'success') {
            this.value = event.data
          }
        })
      }
    }
  }
```

### 第二部分 2017-02-03

首先祝各位鸡年大吉，开工大吉！
趁着今天刚开工，工作任务还不多，可以继续学些Weex。

春节在家无聊的时候，继续跟进了一下Weex的学习，主要把“关于我”这个Page进行了一些优化，这里主要是一些体力活，并没有太多可说的，简单总结以下几点：
1. Weex中所有的文字都要放在<text></text>这个标签里，在普通的网页开发甚至Vue开发中，我偶尔会直接把文字放在div标签里，但是Weex中并不识别这样的语法。
2. Weex的页面布局虽然也使用css语法，但是与Vue以及普通页面并不完全相同，我试验了一下，text-align：center必须用在text标签上，才能使文字居中，但是因为HTML并没有这个标签，所以要加载文字所在的父标签上，这个要注意，另外就是建议在Weex中多应用flex布局。

<img src="https://ganchengyuan1990.github.io/blog/img/psb.jpg" alt="">


## 外部链接问题
在“关于我”这个page中，有一个需求，就是链接到外部网站，因为之前缺少APP开发经验，所以我想当然地认为这个问题非常简单，只需要价格a标签，或者像Vue一样采用Router的方法就可以了，但是后来发现这样并不能正常work。

仔细一看，Demo中所有Router都是链接到项目内部页面的，看地址栏上每个页面其实都是一个经过build的Js文件，这点应该和Vue是类似的，但这个并不符合我的需求，并且外部网站是传统的静态页面，因此还是需要解决。

首先抓包看看访问的URL是否正确:
<img src="https://ganchengyuan1990.github.io/blog/img/psb2.png" alt="">
由上图看 <http://m.feiniu.com/my/order/index.html> 这个请求地址应该没有错，所以有可能是兼容问题。

于是尝试捕捉error
```javascript

 <web class="content" id="webview" src='https://m.taobao.com/?spm=0.0.0.0&v=0#index' onpagestart="startload" onpagefinish="finishload" onerror="failload"></web>

startload: function(e) {
  modal.toast({ message: 'pagestart' })
},
finishload: function(e) {
  modal.toast({ message: 'finishload' })
},
failload: function(event) {
  modal.toast({ message: event })
}

```

使用不同的机器进行测试，安卓手机触发到了finishload事件，而IPHONE触发了failload事件，但是两个手机都无法正常显示网页。

最后我在官方文档中查到这个：
<img src="https://ganchengyuan1990.github.io/blog/img/psb2.jpg" alt="">
web组件要求的weex版本是v0.5+，但是我的项目中用的是v0.32的，所以说看起来还是得仔细查查手册啊，之前在Vue项目中也碰到过这种组件兼容性问题。
<img src="https://ganchengyuan1990.github.io/blog/img/psb3.jpg" alt="">
目前怀疑就是这个问题导致无法正常使用webview（未完待续）。


### 第三部分 2017-02-16

在Weex中，不能直接像HTML中那样用a标签链接打开一个页面，也无法使用Router进行路由，因此需要用到Webview。

Weex官方提供了一个`web`组件：
```
<web class="content" id="webview" src='https://ganchengyuan1990.github.io/blog/' onpagestart="startload" onpagefinish="finishload" onerror="failload"></web>

```

要注意的一点是，在本地server中无法正常在webview中打开页面，但是部署到服务器就好了。
然后打包部署提交到服务器以后看，就OK啦：

<img src="https://ganchengyuan1990.github.io/blog/img/weex20170216.png" alt="">	


这样一来，就把自己的博客给嵌入到APP中啦，感觉不错。

所以说总结起来就是一句话，要多看官方文档，接下来的事儿，就是多在不同环境里试试。

