---
title: 微信面试题--lazyMan实现
date: 2017-02-14 10:14:51
tags:
---

今天来写一个LazyMan，实际就是熟悉一下ES6和Promise对象的语法，实现一个简单的队列。

直接上代码:

```javascript
class C {
    constructor(name) {
        this.tasks = [];
        setTimeout(() => this.next());
        return this.push(() => new Promise(r => console.log(`Hi! This is ${name}`) || r()));
    }

    next() {
      let task = this.tasks.shift();
      task && task().then(() => this.next());
    }

    push (v) {
        this.tasks.push(v);
        return this;
    }

    unshift(v) {
      this.tasks.unshift(v);
      return this;
    }

    sleep (sec) {
        return this.push(() => new Promise(r => console.log(`//等待${sec}秒..`) || setTimeout(() => console.log(`Wake up after ${sec}`) || r(), 1000 * sec)));
    }

    sleepFirst (sec) {
        return this.unshift(() => new Promise(r => console.log(`//等待${sec}秒..`) || setTimeout(() => console.log(`Wake up after ${sec}`) || r(), 1000 * sec)));
    }
    eat (name) {
        return this.push(() => new Promise(r => console.log(`Eat ${name}`) || r()));
    }
}

const LazyMan = function (name) {
    return new C(name);
}

setTimeout(() => console.log('123232323') || LazyMan('Hank').sleep(10).eat('dinner'), 2000); 

```