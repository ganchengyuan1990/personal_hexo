---
title: VUE&REACT
date: 2017-03-14 09:18:51
tags:
---

Vue中props的用法总结：
1. 父组件中传递props给子组件, <child  :order-time="canfig.orderTime"></child>，然后子组件中的props中可以收到props: ['orderTime']，当然这是单向传递的。

2. 如果想让子组件修改的属性能够同步到父组件中，那么在父组件中的传递要改为<child  :order-time.sync="canfig.orderTime"></child>.

REACT中渲染页面：
1.JSX中用this.state的属性值渲染，reducer处理state后通过触发redux的mapStateToProps函数，赋新值给props，然后触发了react的生命周期函数componentWillReceiveProps，在里面重新去setState，从而re-render。

<!-- more -->
----------------
###ES6语法深入学习
Object.create()：该方法是ECMAScript5中新增的，可以理解为规范化JS中的原型式继承。
这个方法接收两个参数，一个是用作新对象原型的对象，和一个为新对象定义额外属性的（可选）对象。

let为何解决了闭包循环问题？
let声明的变量直到控制流到达该变量被定义的代码行时才会被装载，所以在到达之前使用该变量会触发错误。
```
 function update() {
      console.log("当前时间:", t);  // 引用错误（ReferenceError）
      ...
      let t = readTachymeter();
    }
    
```

let因为定义了变量的块级作用域（就是最邻近的大括号之间），所以要在全部执行完以后才会回收。而ES5之前只能由函数来定义作用域，所以循环内部无法形成作用域，所以必须用自执行函数制造一个闭包。

```
for(let i = 0; i < arr.length; i++) {
    setTimeout(() => {
        alert(i);
    }, arr[i]);
}

```

这里有一篇文章说的好<https://johanzhu.github.io/2016/09/26/ten/>


-----------------
###css transition属性
过渡属性，最后一个参数表示停顿多久后开始
-webkit-transition:background 2s linear 1s; 

-----------------

JS继承的方式:
1. 原型链继承  
```
function Parent(){
    this.name = 'mike';
}

function Child(){
    this.age = 12;
}
Child.prototype = new Parent();//Child继承Parent，通过原型，形成链条

```

2. 构造函数继承（借助call）
```
function Parent(age){
    this.name = ['mike','jack','smith'];
    this.age = age;
}

function Child(age){
    Parent.call(this,age);
}
var test = new Child(21);
alert(test.age);//21
alert(test.name);//mike,jack,smith
test.name.push('bill');
alert(test.name);//mike,jack,smith,bill
```

3. 组合继承

```
function Parent(name){
    this.name = name;
}

Parent.prototype.sayName = function() {
  return this.name + "!!!!";
}

function Child(name){
  debugger
    this.age = 12;
    Parent.call(this, name);
}

Child.prototype = new Parent();
var test = new Child("Jason")
console.log(test);

```

所以说，一般来讲就只需要把funtion放到prototype中，变量放在构造函数中