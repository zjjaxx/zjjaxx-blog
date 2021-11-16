---
title: interview_vue.md
date: 2021-11-16 15:48:53
tags: vue
---
# VUE
## v-if 和 v-for 哪个优先级更高 ，如果2个同时出现，应该怎么优化得到更好的性能
v-for 比 v-if优先级更高,如果同时出现,渲染函数会先去遍历v-for中的数组，再去执行v-if的条件判断(可以输出this.$options.render查看)

如果同时出现,如果是整个数组的显示隐藏，用v-if包裹v-for,如果是数组里item的条件判断,可以用computed计算属性先过滤v-if条件返回新的数组

## vue组件的data为什么必须是个函数而vue根实例则没有这个限制
vue组件存在多个实例,如果每个组件实例的data都是同一对象的话,状态变更会影响所有组件实例,工厂函数会返回一个全新的对象,vue的根实例则只有一个

## vue中key的作用和工作原理
vue在patch的时候可以通过key精准的判断2个节点是否是同一个,减少DOM操作（首尾patch比较）

## vue中的diff算法
如果data中的一个key对应一个watcher,会有很多watcher，占用内存大,所以一个组件实例对应一个watcher，在发生更新时，使用diff算法得出哪里发生变化，执行更新。

整体策略：深度优先，同层比较
先看有无孩子，如果都有，递归比较孩子节点，然后同级比较

## vue 组件化的理解
组件化能大幅提高效率、测试性、复用性
## vue组件化通信
- 父子组件通信:(props $emit) $parent $children(不能保证子元素顺序) $slots $listeners $attrs(包含除了props以外的自定义属性,通常配合inheritAttrs使用,class、style除外) $refs
- 兄弟组件通信 事件总线
- 跨层组件通信 vuex 事件总线(手写一个发布订阅事件监听)、$on provide、inject

## vue性能优化
- 路由懒加载
- keep-alive
- 频繁切换显示隐藏并且渲染时间比较长的组件使用v-show
- 避免v-if和v-for一起使用
- 长列表只是显示不变化，不需要响应式处理,使用`Object.freeze(list)`冻结
- 图片懒加载（2中实现方法 `clientHeight(可视区高度)+scrollTop>=offsetTop(递归+=)`或则 `getBoundingClientRect<clientHeight(可视区高度)`）
- 无状态组件标记为函数式组件

## vue3.0新特性
- 静态元素和静态属性跳过patch,优化diff算法
- 基于proxy的数据响应式，vue 基于defineProperty的数据响应式 会递归data,产生很多闭包，proxy只是在外部套壳，速度更快，内存更少
- typescript
- composition api (逻辑复用)
## nextTick原理
vue 当数据发生改变的时候使用的是异步更新,微任务触发nextTick最为合理
## 有没有自己封装过组件
弹窗插槽,高内聚低耦合，功能单一 

### 通用表单设计
分三个组件(form:提供表单数据和表单规则 formItem表单校验 input表单数据填充),每个组件功能单一

- input 使用inheritAttrs+$attrs ,v-model实现,数据变化则向上递归找到formItem组件实例，触发校验事件
- formItem prop传入的属性作为key来获取要校验的规则和value，在mounted中监听校验事件
- form 向下提供表单数据和表单规则,validate方法提供全局校验，向下递归查找formItem,触发校验事件，返回Promise,使用Promise.all处理结果

### 弹窗组件设计
组件配置对象->构造函数->组件实例

```
var Profile = Vue.extend(options)
var instance=new Profile({
    propsData: {
        msg: 'hello'
    }
}).$mount()//如果指定就会替换
document.body.appendChild(instance.$el)

Profile.prototype.remove=()=>{
    document.body.removeChild(instance.$el)
    instance.$destroy()
}
```
提供插件形式

## vue-router
### 为什么在new Vue的时候把router传进去
为了在全局调用router,用全局混入
```
install=(vue)=>{
    Vue.mixin({
        beforeCreate(){
            if(this.$options.router){
                Vue.propotype.$router=router
            }
        }
    })
}

```
### router-view原理
- 获取router中的routes,根据当前的url截取#之后的路径,取出相对应的component,渲染出component
- 监听hashchange事件，设置当前的url相对应的响应式的值
- 刷新后失效,监听load事件

### hash模式和history模式（HTML5 模式）的区别
它在内部传递的实际 URL 之前使用了一个哈希字符（#）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。不过，它在 SEO 中确实有不好的影响。如果你担心这个问题，可以使用 HTML5 模式。
### html5模式
去掉了#，但是如果没有适当的服务器配置，用户在浏览器中直接访问 https://example.com/user/id，就会得到一个 404 错误。
要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 index.html 相同的页面。
## vue组件中render、template、el的优先级问题
render>template>el

如果使用el则不需要手动$mount

## vue 异步更新队列
data数据发生变化时，不立即更新渲染视图,而是等整个宏任务结束之后，统一去做渲染

当data中的函数发生变化时,会触发setter方法，把watcher添加到队列中(去重), 异步执行队列里的watcher

异步函数优先级
Promise > MutationObserver >setImmediate >setTimeout(0)

## 虚拟DOM
虚拟DOM是js对象，对原生DOM的映射，js的执行效率大于dom操作, 新旧DOM对比可得出最小的DOM操作，

## ssr
首屏由后端渲染完整的html直接返回，前端拿到首屏以及完整的spa结构，应用激活后按照spa方式运行