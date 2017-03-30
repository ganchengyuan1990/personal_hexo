---
title: Ubantu新服务器搭建
date: 2017-03-22 15:00:33
tags:
---


今日新开一个Ubantu服务器，先来学习。

yum操作

yum，是Yellow dog Updater, Modified 的简称，是杜克大学为了提高RPM 软件包安装性而开发的一种软件包管理器。起初是由yellow dog 这一发行版的开发者Terra Soft 研发，用python 写成，那时还叫做yup(yellow dog updater)，后经杜克大学的Linux@Duke 开发团队进行改进，遂有此名。yum 的宗旨是自动化地升级，安装/移除rpm 包，收集rpm 包的相关信息，检查依赖性并自动提示用户解决。yum 的关键之处是要有可靠的repository，顾名思义，这是软件的仓库，它可以是http 或ftp 站点，也可以是本地软件池，但必须包含rpm 的header，header 包括了rpm 包的各种信息，包括描述，功能，提供的文件，依赖性等。正是收集了这些header 并加以分析，才能自动化地完成余下的任务。

nginx安装
这个比在windows系统下要麻烦得多，需要依次安装PCRE/zlib等依赖包。

node.js
全局变量global

---
<!-- more -->

Webpack:
再来看看CommonsChunkPlugin 的其他配置选项：

minChunks：公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。


什么时候用VUEX，什么时候用props？
Vuex实际上是类Flux的数据管理架构。它主要帮我们更好的组织代码，更好的让Vue中的状态更好的通过状态管理维护起来。在实际项目运用中我们需要对组件的组件本地状态(component local state)和应用层级状态(application level state)进行区分。
Vuex的作用就是汇集应用层级的状态到一处，方便管理。

所以，如果只需要单向传递，比如父组件向子组件，那么使用props即可，加入需要隔层或者反向传递（子组件传向父组件），那么就用vuex。

---

function d({name = "Jason", age = "24"} = {}) {
    return `${name} ${age}`;
}
console.log(d({}))

---
当代码在一个环境中执行时，会创建变量对象的一个作用域链，作用域链保证对执行环境有权访问的所有变量和函数的有序访问。

一般地，内部环境可以通过作用域链访问所有的外部环境。

作用域链本质上是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。

无论什么时候在函数中访问一个变量时，就会从作用域链中搜索具有相应名字的变量。

---
没想到ES7都出来了，学习一下sleep和async


const sleep = (timeountMS) => new Promise((resolve) => {
    setTimeout(resolve(123123), timeountMS);
});

const testAsync = async() => {
    const t = sleep(1000);
    console.log(t);
}

testAsync();