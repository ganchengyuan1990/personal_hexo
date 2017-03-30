---
title: 今日VUE小记
date: 2017-03-07 09:24:15
tags:
---

最近正在将自己的个人网页从VUE1.0升级到VUE2.0，这期间又学习到了一些零散的知识点，记录下来，内化为自己的只是储备。

-----------------------------

首先，VUEX并没有想象中那么复杂，需要注意的是state可以分模块命名，也就是说在不同模块下可存在取名同样的state，但是mutation/getters/actions是共享同一个命名空间的，虽然也可以在不同的modules里可以命名同一个mutation并且不报错，但是VUEX默认会连续访问这两个MUTATIONS，造成不必要的问题。

另外，VUE本身提供了过渡状态管理组件transition，对应的过渡的-CSS-类名
会有 4 个(CSS)类名在 enter/leave 的过渡中切换
- v-enter: 定义进入过渡的开始状态。在元素被插入时生效，在下一个帧移除。
- v-enter-active: 定义进入过渡的结束状态。在元素被插入时生效，在 transition/animation 完成之后移除。
- v-leave: 定义离开过渡的开始状态。在离开过渡被触发时生效，在下一个帧移除。
- v-leave-active: 定义离开过渡的结束状态。在离开过渡被触发时生效，在 transition/animation 完成之后移除。

<!-- more -->

demo如下
```
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>

new Vue({
  el: '#demo',
  data: {
    show: true
  }
})

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

```

------------------------------


VUE源码中这段非常重要，对数据进行双向绑定,如果有参数就会进入set函数。

```
 Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
 });
```

JS工厂模式与构造函数模式结合(工厂模式会return object)

```
function Observer(data){
    this.data = data;
    this.walk(data)
}

function O

var p = Observer.prototype;

// 遍历
p.walk = function (obj){
    var val,
        _this = this;
    Object.keys(obj).forEach(function (key){
        val = obj[key]
        if(typeof val==="object"){
            new Observer(val)
        }
        _this.convert(key,val)
    })
}

// 绑定getter 和setter
p.convert = function (key,val){
    Object.defineProperty(this.data,key,{
        configurable:true,
        enumarable:true,
        get:function (){
            debugger
            console.log("你访问了"+key);
            return val
        },
        set:function (newVal){
            debugger
            console.log("你设置了"+key);
            console.log("新的"+key+"="+newVal);

            // 如果设置的新值是一个对象，则递归它，加上set/get
            if(typeof newVal ==="object"){
                new Observer(newVal);
            }

            val = newVal
        }
    })
}

let data = {
    user: {
        name: "hello world",
        age: "24"
    },
    address: {
        city: "beijing"
    }
};
var app = new Observer(data);
console.log(app.data.user);
```


最后，需要仔细看看VUE的生命周期：
<img src="https://cn.vuejs.org/images/lifecycle.png" alt="">

