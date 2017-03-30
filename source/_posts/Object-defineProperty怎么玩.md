---
title: Object.defineProperty怎么玩
date: 2017-02-21 09:21:22
tags:
---

原文转载地址<http://imweb.io/topic/56d40adc0848801a4ba198ce>

Object.defineProperty ，顾名思义，为对象定义属性。在js中我们可以通过下面这几种方法定义属性

```

// (1) define someOne property name
someOne.name = 'cover';

//or use (2) 

someOne['name'] = 'cover';

// or use (3) defineProperty
Object.defineProperty(someOne, 'name', {
    value : 'cover'
})

```

从上面看，貌似使用Object.defineProperty很麻烦，那为啥存在这样的方法呢？
带着疑问，我们来看下 Object.defineProperty的定义。

<!-- more -->

先来看下MDN对defineProperty的定义：
>The Object.defineProperty() method defines a new property directly on an object, or modifies an exisiting property on an object, and returns the object.

从上面得知，我们可以通过`Object.defineProperty`这个方法，直接在一个对象上定义一个新的属性，或者是修改已存在的属性。最终这个方法会返回该对象。


##语法
object.defineProperty(object, propertyname, descriptor)

##参数
1. object 必需。 要在其上添加或修改属性的对象。 这可能是一个本机 JavaScript对象（即用户定义的对象或内置对象）或 DOM 对象。
2. propertyname 必需。 一个包含属性名称的字符串。
3. descriptor 必需。 属性描述符。 它可以针对数据属性或访问器属性。

其中descriptor的参数值得我们关注下,该属性可设置的值有：
1. 【value】 属性的值，默认为 undefined。
2. 【writable】 该属性是否可写，如果设置成 false，则任何对该属性改写的操作都无效（但不会报错），对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。

```
var someOne = { };
Object.defineProperty(someOne, "name", {
    value:"coverguo" , //由于设定了writable属性为false 导致这个量不可以修改
    writable: false 
});  
console.log(someOne.name); // 输出 coverguo
someOne.name = "linkzhu";
console.log(someOne.name); // 输出coverguo

```

3. 【configurable]】如果为false，则任何尝试删除目标属性或修改属性以下特性（writable, configurable, enumerable）的行为将被无效化，对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。 

```
var someOne = { };
Object.defineProperty(someOne, "name", {
    value:"coverguo" ,
    configurable: false 
});  
delete someOne.name; 
console.log(someOne.name);// 输出 coverguo
someOne.name = "linkzhu";
console.log(someOne.name); // 输出coverguo

```

4. 【enumerable】 是否能在for-in循环中遍历出来或在Object.keys中列举出来。对于像前面例子中直接在对象上定义的属性，这个属性该特性默认值为为 true。


注意 在调用Object.defineProperty()方法时，如果不指定， configurable， enumerable， writable特性的默认值都是false,这跟之前所 说的对于像前面例子中直接在对象上定义的属性，这个特性默认值为为 true。并不冲突，如下代码所示：

```
//调用Object.defineProperty()方法时，如果不指定
var someOne = { };
someOne.name = 'coverguo';
console.log(Object.getOwnPropertyDescriptor(someOne, 'name'));
//输出 Object {value: "coverguo", writable: true, enumerable: true, configurable: true}

//直接在对象上定义的属性，这个特性默认值为为 true
var otherOne = {};
Object.defineProperty(otherOne, "name", {
    value:"coverguo" 
});  
console.log(Object.getOwnPropertyDescriptor(otherOne, 'name'));
//输出 Object {value: "coverguo", writable: false, enumerable: false, configurable: false}

```

从上面，可以得知，我们可以通过使用Object.defineProperty，来定义和控制一些特殊的属性，如属性是否可读，属性是否可枚举，甚至修改属性的修改器（setter）和获取器(getter)
那什么场景和地方适合使用到特殊的属性呢？
***


###实际运用
在一些框架，如vue、express、qjs等，经常会看到对Object.defineProperty的使用。那这些框架是如何使用呢？

##MVVM中数据‘双向绑定’实现

