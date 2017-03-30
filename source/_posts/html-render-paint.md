---
title: html render & paint（重排和重绘）
date: 2017-01-18 11:05:38
tags: css
---

首先，先吐槽一下weex学习社区的内容真的非常不全面，自学很难，优点是调试相对简单，暂时放一放，以后有空再看看。

---

接下来进入正题，讲一讲昨天刚复习的有关<font color=red>浏览器页面渲染</font>的知识点。

##repaint、reflow/relayout、restyle

这四个概念分别代表什么？先来看一张图，了解一下浏览器页面的渲染过程
<img src="https://ganchengyuan1990.github.io/blog/img/render.png" />

<!-- more -->

<font color=red>这里要注意的是：</font>要生成Dom Tree和Css Tree以后才会生成render tree，然后进行绘制(paint)。

1. 首先，浏览器解析HTML源码构建DOM树，在DOM树中，每个HTML标签都有对应的节点，并且在介于两个标签中间的文字块也对应一个text节点。DOM树的根节点是documentElement，也就是<html>标签；
2. 然后，浏览器对CSS代码进行解析，一些当前浏览器不能识别的CSS hack写法（如-moz-/-webkit等前缀，以及IE下的/_等）将会被忽略。CSS样式的优先级如下：最低的是浏览器的默认样式，然后是通过<link>、import引入的外部样式和行内样式，最高级的是直接写在标签的style属性中的样式；
3. 随后将进入非常有趣的环节-构建渲染树。渲染树跟DOM树结构相似但并不完全匹配。渲染树会识别样式，所以如果通过设置display:none隐藏的标签是不会被渲染树引入的。同样的规则适用于<head>标签以及其包含的所有内容。另外，在渲染树中可能存在多个渲染节点（渲染树中的节点称为渲染节点）映射为一个DOM标签，例如，多行文字的<p>标签中的每一行文字都会被视为一个单独的渲染节点。渲染树的一个节点也称为frame-结构体，或者盒子-box（与CSS盒子类似）。每个渲染节点都具有CSS盒子的属性，如width、height、border、margin等；
4. 最后，等待渲染树构建完毕后，浏览器便开始将渲染节点一一绘制-paint到屏幕上。。

OK，接下来看一个例子

```html
<html>
<head>
  <title>Beautiful page</title>
</head>
<body>
    
  <p>
    Once upon a time there was 
    a looong paragraph...
  </p>
  
  <div style="display: none">
    Secret message
  </div>
  
  <div><img src="..." /></div>
  ...
 
</body>
</html>
```

这个html对应的DOM结构如下：

```html
documentElement (html)
    head
        title
    body
        p
            [text node]
        
        div 
            [text node]
        
        div
            img
        
        ...
```
由于渲染树会忽略head内容和隐藏的节点，并且会将<p>中的多行文字按行数映射为单独的渲染节点，故构建完成的渲染树结构如下：

```html
root (RenderView)
    body
        p
            line 1
        line 2
        line 3
        ...
        
    div
        img
        
    ...

```

<br>
## 重绘-repaint和回流（重排）-reflow

同一时间内至少存在一个页面初始化layout行为和一个绘制行为（除非你的页面是空白页-blank）。在此之后，改变任何影响构造渲染树的行为都会触发以下一种或者多种动作：

1.  渲染树的部分或者全部将需要重新构造并且渲染节点的大小需要重新计算。这个过程叫做回流-reflow，或者layout，或者layouting（靠，能不能愉快的翻译了，是不是还来个过去式啊?!），或者relayout（这词是原文作者杜撰的，为了标题中多个“R”）。浏览器中至少存在一个reflow行为-即页面的初始化layout；
2.  屏幕的部分区域需要进行更新，要么是因为节点的几何结构改变，要么是因为格式改变，如背景色的变化。屏幕的更新行为称作重绘-repaint，或者redraw。

<br>
## 如何减少重绘和回流
减少因为重绘和回流引起的糟糕用户体验的本质是尽量减少重绘和回流，减少样式信息的set行为。可以通过以下几点来优化：
1.  不要逐个修改多个样式。对于静态样式来说，最明智和易维护的代码是通过改变classname来控制样式；而对于动态样式来说，通过一次修改节点的cssText来代替样式的逐个改变。
2.  "离线"处理多个DOM操作。“离线”的意思是将需要进行的DOM操作脱离DOM树，比如：
* 通过documentFragment集中处理临时操作；
* 将需要更新的节点克隆，在克隆节点上进行更新操作，然后把原始节点替换为克隆节点；
* 先通过设置display:none将节点隐藏（此时出发一次回流和重绘），然后对隐藏的节点进行100个操作（这些操作都会单独触发回流和重绘），完毕后将节点的display改回原值（此时再次触发一次回流和重绘）。通过这种方法，将100次回流和重绘缩减为2次，大大减少了消耗
3. 不要过多进行重复的样式计算操作。如果你需要重复利用一个静态样式值，可以只计算一次，用一个局部变量储存，然后利用这个局部变量进行相关操作。
4. 总之，当你在打算改变样式时，首先考虑一下渲染树的机制，并且评估一下你的操作会引发多少刷新渲染树的行为。例如，我们知道一个绝对定位的节点是会脱离文档流，所以当对此节点应用动画时不会对其他节点产生很大影响，当绝对定位的节点置于其他节点上层时，其他节点只会触发重绘，而不会触发回流。

<br>
## restyle到底是什么？
仔细的朋友会发现，到现在我们也没具体说restyle的情况，<font color=red>restyle指的是没有几何结构改变的渲染树变化。也就是说restyle和reflow是一个层次的概念，完成以后都会引发repaint!</font>

<br>
## 总结一下
重新计算渲染树的行为被Mozilla称为回流-reflow，被其他浏览器称为layout；
将重新计算后的渲染树更新到屏幕的行为叫做重绘-repaint，或者redraw（in IE/DynaTrace）；