---
title: JavaScript
tags: javascript
---
# JavaScript

## 数组的展平方式
方式一：
```
ary.flat(Infinity)
```
方式二，递归：
```
function flatter(arr){
return [].concat(…arr.map(x =>
Array.isArray(x)? flatter(x) : x
))
}
```

方式三，reduce：
```
(function flatten(arr) {
    return arr.reduce((prev,next) => {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    },[])
})(arr)
```
## Promise
- 有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）
- Promise 新建后就会立即执行。
- 注意，调用resolve或reject并不会终结 Promise 的参数函数的执行。
- Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。
- catch()方法返回的还是一个 Promise 对象，因此后面还可以接着调用then()方法。
### 为什么Promise可以链式调用
then方法返回的是一个新的Promise实例,因此可以采用链式写法，即then方法后面再调用另一个then方法。
### finally
```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

### Promise.all
Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
### Promise.all Promise.race实现
### 手写实现Promise
## 常见的状态码
- 200：这个是最常见的http状态码，表示服务器已经成功接受请求，
- 301：重定向
- 304：缓存
- 400：参数有误
- 401：未认证
- 403: 权限不够 
- 404：请求失败，客户端请求的资源没有找到或者是不存在
- 500：服务器遇到未知的错误，导致无法完成客户端当前的请求。
- 503: 服务器超负载

## 如果新建一个对象
### 字面量形式
不足:创建具有相同接口的多个对象需要重复编写很多代码
### 工厂模式
不足:没有解决对象标识问题，新建的对象是什么类型的
### 构造函数模式
不足:其定义的方法会在每个实例上都创建一遍
#### new一个对象做了什么
1. 在内存中创建一个新对象
2. 把构造函数的原型赋值给新对象
3. 修改构造函数的this指向为新的对象
4. 执行构造函数
5. 如果构造函数返回非空对象,则返回该对象,否则返回刚创建的新对象

### 原型模式
每个函数都会创建一个prototype属性，包含该实例对象的共享属性和方法
#### instanceof有什么用
instanceof检查实例的原型链中是否包含指定的构造函数
#### 如果确定实例和构造函数之间的关系
- __proto__
```
person.__proto__==Person.prototype
```
- isPrototypeOf
```
Person.prototype.isPrototypeOf(person) //true
```
- Object.getPrototypeOf()
```
Object.getPrototypeOf(person)==Person.prototype//true
```
#### hasOwnProperty方法可以用于判断该属性是否来自于原型

## 继承
### 组合继承
1. 盗用构造函数
2. 新建父类的实例作为子类的原型

不足:父类构造函数要调用2次
### 原型式继承 （Object.create）
1. 函数内新声明一个构造函数
2. 设置构造函数的原型为传入的对象
3. 用该构造函数新建一个实例返回
### 寄生式继承
原型式继承的工厂模式
### 寄生式组合继承
1. 盗用父类构造函数
2. 用寄生式继承实现子类原型设置

