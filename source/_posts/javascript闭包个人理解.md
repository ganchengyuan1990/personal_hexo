---
title: javascript闭包个人理解
date: 2017-01-17 08:56:37
tags: Javascript
---

个人理解，闭包的目的就是为了从外部读取内部函数的局部参数而设置的桥梁方法。

```javascript
function closure() {
    var n = 1;
    nAdd=function(){n+=1; }
    function inner(){
        alert(n)
    }
    return inner;
}

var result = closure();
result();

nAdd();
result(); // 1000

var name = "The Window";
　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　return function(){
　　　　　　　　return this.name;
　　　　　　};
　　　　}
　　};
alert(object.getNameFunc()());

```

闭包中局部变量是引用而不是拷贝，所以可以利用自执行函数，传入形参（数值传递）。