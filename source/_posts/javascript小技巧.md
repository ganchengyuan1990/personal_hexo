---
title: ZT-javascript小技巧
date: 2017-01-24 10:52:27
tags: Javascript
---



>`计算最小值`
```javascript
function smallest(array) {
  return Math.min.apply(Math, array);
}

console.log(smallest([9,13,7,8,33])); //7
```

>`巧用call方法`
```
function useCall() {
    [].forEach.call(arguments, function(val, key) {
        console.log(key, val)
    });
}

useCall('Bob Dylan', 'Bob Marley', 'Steve Vai');//Bob Dylan, Bob Marley, Steve Vai
```
<!-- more -->

>`如何理解Vue中的setter和getter`
```javascript
var Coder = function() {
        var that = this;
        return {
            get name(){
                if(that.name){
                    return that.name
                }
                return '你还没有取名'
            },
            set name(val){
                console.log('你把名字修成了'+val)
                that.name = val
            }
        }
    }
    var isMe = new Coder()
    console.log(isMe.name)
    isMe.name = '周神'
    console.log(isMe.name)
    console.log(isMe)

var Coder = function() {
    }
    Coder.prototype.__defineGetter__('name', function() {
        if (this.name) {
            return this.name
        }else{
            return '你还没有取名'
        }
    })
    Coder.prototype.__defineSetter__('name', function(val) {
        this.name = val
    })
    var isMe = new Coder()
    console.log(isMe.name)
    isMe.name = '周神'
    console.log(isMe.name)
    console.log(isMe)	
```