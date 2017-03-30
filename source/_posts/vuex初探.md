---
title: vuex初探
date: 2017-01-17 10:27:29
tags: [Vue,Javascript]
---

### Vuex的作用是什么
Vuex主要用来进行状态管理，我的理解就是当你的VUE项目大到一定程度以后，需要一个帮手来帮助你进行组件管理，尤其是多层次的组件进行信息交互时，如果没有这样一个工具，就得维护公共变量或者一层一层传递参数，这个过程是非常令人不愉悦的。


### 引入

```javascript

import Vuex from 'vuex';

import * as actions from './actions'; //改变状态都得通过这里的方法
import * as getters from './getters'; //获取状态值的方法

```

## store对象
这个对象就是Vuex创建的实例对象，是重点需要学习的内容。

<!-- more -->

```javascript	

const store = {
	//state对象维护具体状态值
    state: {
        isInitData: true, //首次刷新页面
    },
    /**
     * vuex 2.0 action should be await Vuex规定每个状态值的改变最后都要通过actions函数来操作，并且规定必须是异步，因此调取接口的操作应该都在这里
     */
    actions: {
        fetchSearchDataAction: ({ commit, dispatch }, options) => {
            commit('SET_TOP_LOADING', { type: true })
        },

    },

    /**
     * even vuex 2.0 mutations should be async  actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行。
     */
    mutations: {

        [types.COMBINE_DETAIL_LIST](state, res) {

            let cloneMerchandiseList = [];

            state.merchandiseList.forEach(item => {

                    cloneMerchandiseList.push(Object.assign({}, item, res[item.sm_seq]));

                })
                //combine 合并基础对象和详细属性,重现渲染列表
            state.merchandiseList = cloneMerchandiseList;
        }
    },

    getters: {
        listDownType: (state) => {
            let type = ''
            state.selectListData.filter(item => {
                if(item.isSelect){
                    type = item.sortType
                }
            })
            return type
        }
    }
}

```

<font color=red>注：同步的意义在于这样每一个 mutation 执行完成后都可以对应到一个新的状态（和 reducer 一样），这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。</font>