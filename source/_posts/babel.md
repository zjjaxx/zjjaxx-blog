---
title: babel
date: 2021-12-26 10:06:42
tags:
---
# Babel
![](https://b3logfile.com/file/2020/10/Snipaste20200819083914-0f278240.png)
直接引用官方文档[官网链接](https://www.babeljs.cn/docs/)
>Babel 是一个 JavaScript 编译器
Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。


**总结**

**1. Babel将es6的语法通过编译器转换为es5的语法**

**2. 同时Babel通过polyfills这个垫片来提供es6新增的api**
>🚨 从Babel 7.4.0开始，polyfills这个包已经被弃用，取而代之的是直接包含core-js/stable(用于填充ECMAScript特性)和regenerator-runtime/runtime(需要使用经过置换的生成器函数)

### Babel的原理是什么？
#### Babel工作流程
分为如下三步
1. Parser 解析源文件

2. Transfrom 转换

3. Generator 生成新文件

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34aa33f96d2f4b4fbeb9666fbc5f9187~tplv-k3u1fbpfcp-zoom-1.png)
#### Babel组成部分
Babel根据模块话思维拆分成多个模块组成，所有Babel模块都作为单独的npm软件包发布，其范围为@babel（自版本7起）

上图
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b60334dd498349299e92fe5887f55bfe~tplv-k3u1fbpfcp-zoom-1.png)

- @babel/core`将源码转化为抽象语法树 (AST)`
- @babel/cli`可以使Babel使用命令行编译文件。`
- @babel/plugin*   `   babel语法转化插件`

  只是语法转化，如箭头函数、let、class、模板字符串、解构等等,不包括API），相当于@babel/core提供插槽，而是用Babel插件转化成相对应的语法
- @babel/preset-env `通用的转ES6的插件集合`

@babel/preset-env是给我们提供了一个通用的转ES6的插件集合


>@babel/preset-env是一个智能预设，可让您使用最新的JavaScript，而无需微观管理目标环境所需的语法转换
- core-js `ES6新增API的补丁`

  core-js 是ES6新增API的补丁（用ES5实现）[es6API补丁-官方链接](https://www.babeljs.cn/docs/learn),自@babel/polyfill 7.4.0 起已弃用，建议您core-js通过corejs选项直接添加和设置版本。但是不幸的像Proxy、Symbols由于ES5的局限性，无法对代理进行转译或填充

- @babel/plugin-transform-runtime 复用帮助文件，为代码创建一个沙盒环境

  core-js新增API 如Promise，会污染全局环境，对库开发者很不友好,试想下如果引入一个库，但是库中定义了全局变量Promise,而且这个Promise版本很旧，这对应用者来说就很糟糕了，还有Babel编译时使用很小的帮助器来完成class类申明，如_classCallCheck、_defineProperties等，默认情况下，它将被添加到需要它的每个文件中，这将造成代码大量的重复变得臃肿。上图
 ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2ff5f476c1944aca9b315654f2362da~tplv-k3u1fbpfcp-zoom-1.image)
  @babel/runtime 作为一个帮助文件的库 往往和@babel/plugin-transform-runtime 一起使用，可以复用帮助文件。
  
  效果上图！
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be3cd7f306c7431fa6de235c37b9b0af~tplv-k3u1fbpfcp-zoom-1.image)
  
  还有一个污染全局环境没解决滴呢🙄
[官方文档链接](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)
  
options中有个corejs字段参数
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09e6fd0b335f4babb5dffab35ee0e60f~tplv-k3u1fbpfcp-zoom-1.image)
  大致上就是说@babel/plugin-transform-runtime默认不提供api垫片功能，但是我们可以手动配置，
  我们不使用上面提到的core-js补丁，因为他会引入全局变量，而是安装另一个插件@babel/runtime-corejs3,效果如下图所示：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/735d5d3bf05e4660a1e3f5f0cd3c366b~tplv-k3u1fbpfcp-zoom-1.image)
会把Promise api取个别名_Promise
  
### Babel怎么用

#### 第一步安装核心模块
1. @babel/core肯定要装（没它怎么编译源码转成抽象语法树呀）
2. @babel/preset-env肯定要装（新语法仅靠它了）
3. @babel/cli 肯定要装(命令行执行呀，不然怎么执行😂)
4. core-js 不是库开发的话，用core-js问题也不大嘛
5. @babel/plugin-transform-runtime @babel/runtime 优化代码要要要🤗
```javascript
npm init -y
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/plugin-transform-runtime
npm i @babel/runtime core-js
```
#### 第二步 配置文件 
.babelrc.js
```
module.exports = {
    presets: [["@babel/env", {
        useBuiltIns: "usage",
        corejs:3
    }]],
    plugins: ["@babel/plugin-transform-runtime"]
}
```
package.json
```
"scripts": {
    "babel": "babel src --out-dir dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
几个个问题
1. presets是什么？ @babel/env又是什么？

    presets表示一个预设，表示插件集合，小伙伴们一定很奇怪@babel/env是什么，@babel/env是@babel/preset-env的简称，babel规定如果 preset 名称的前缀为 babel-preset-，你可以使用它的短名称。
2.[详细介绍官方链接](https://www.babeljs.cn/docs/babel-preset-env)

    官方文档上写着`其实是 preset 都可以接受参数，参数由插件名和参数对象组成一个数组`
  也就是说如果要给preset设置参数就要写成数组的形式，第一个参数表示插件集合，第二个参数表示options对象，上图
  ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/343674d37a234cfc89511a82140e5fd4~tplv-k3u1fbpfcp-zoom-1.image)
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/280bbe7cbbf44c9eb0ddd29a558b5d24~tplv-k3u1fbpfcp-zoom-1.image)
 options.useBuiltIns 这个选项是配合core-js 来为ES6新增API提供垫片的，当useBuiltIns:"entry",会把所有的ES6新增API导入，并且要在index.js手动引入core-js
 运行结果上图
 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c65c1b9a7f045528ac7da73887289d9~tplv-k3u1fbpfcp-zoom-1.image)
 
 当useBuiltIns: 'usage'时，会按需导入，并且不需要全局import，结果上图
 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a64235b8f841b19f3f9cf5604cb188~tplv-k3u1fbpfcp-zoom-1.image)
 3 只看到@babel/plugin-transform-runtime 没看到@babel/runtime,@babel/runtime和@babel/plugin-transform-runtime是绑定在一起的，不需要配置
##### 关于配置文件 [官方链接](https://www.babeljs.cn/docs/config-files)
Babel有两种并行的配置文件格式，可以一起使用，也可以独立使用。

如果是Monorepos的项目的话，就要考虑使用babel.config.*的配置文件类型

如果对于普通项目来说，推荐使用.babelrc.*的配置文件类型

简单来说Monorepos的项目就是项目中包含多个package包，每个package包中都有一个package.json文件
- 项目范围的配置--也可以叫全局配置（Babel 7.x中的新增功能）
 

  babel.config.json 文件，具有不同的扩展名(可以为.json， .js，.cjs和.mjs后缀)

  首先Babel具有“根”目录的概念，该目录默认为当前工作目录。对于项目范围的配置，Babel将在此根目录中自动搜索一个babel.config.json文件或使用受支持的扩展名的等效文件，也就是说当命令行执行babel命令的时候会自动查找babel.config.*的配置文件，如果没有配置babelrcRoots字段，它默认不会加载合并子包中的.babelrc.*文件，也就是收对于子包的编译用的是全局的配置文件，对项目中的node_modules依赖包也进行编译，除非配置exclude剔除,值得注意的一点是他必须在项目的根目录
- 相对文件配置

  - .babelrc.json 文件，具有不同的扩展名(可以为.json， .js，.cjs和.mjs后缀)
  
  作用域的范围与待编译的文件位置有关，对于Monorepos的项目来说，在子包中的.babelrc.json只能作用与当前子包，它允许你为每个子包单独设置配置文件，公共的配置可提取到全局的配置文件中(babel.config.*)
  - package.json中的babel参数配置

##### Monorepos的项目配置文件规则
Monorepos目录结构,上图
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e5ac342e9fc423babe5c2fa50610345~tplv-k3u1fbpfcp-zoom-1.image)
这时候就需要全局配置的能力了，首先在根目录下的babel.config.js作为全局配置的通用配置，而在子包中的.babelrc.js作为子包的单独配置，babel可以在全局编译，也可以在子包中单独编译

- babel在全局编译

   当命令行执行babel命令的时候会自动查找babel.config.*的配置文件，这时如果要合并使用子包中的单独配置文件，则需要配置`babelrcRoots: ["package1"]`,但是实际过程中会遇到问题，就是会把子包中的node_module也进行编译，这是可以使用 `ignore:[/node_modules/]`忽视对其的编译
   
- 在子包中单独编译
    由于子包中的.babelrc.js只能作用于当前子包，无法使用全局配置文件，所以执行命令行时需要添加--root-mode upward
    ```
        "babel": "babel --root-mode upward src --out-dir dist",
    ```
#### 第三步测试

index.js
```

class Person{
    constructor(name,age){
        this.name=name
        this.age=age
    }
    getName(){
        return this.name
    }
}
let zjj=new Person("zjj",10)
console.log(zjj)
console.log(new Promise((resolve,reject)=>resolve(10)))
```

### 如果要避免污染全局变量
#### 第一步安装@babel/runtime-corejs3
```
npm install --save @babel/runtime-corejs3
```
#### 第二步修改.babelrc.js
```
module.exports = {
    presets: ["@babel/env"],
    plugins: [
       [ "@babel/plugin-transform-runtime",{
        corejs:3
       }]
    ]
}
```
删除 `useBuiltIns: "usage"`，也就是不使用core-js,而是使用@babel/runtime-corejs3
#### 第三步
输入`npm run babel`

## 参考资料
[1][前端科普系列（4）：Babel —— 把 ES6 送上天的通天塔](https://juejin.im/post/6854573211586150413)

[2][一文读懂 babel7 的配置文件加载逻辑](https://segmentfault.com/a/1190000018358854)