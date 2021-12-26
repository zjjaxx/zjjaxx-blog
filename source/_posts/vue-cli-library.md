---
title: vue-cli-library
date: 2021-12-26 10:22:11
tags:
---

# 如何(基于vue-cli)开发开源组件
## vue-cli 打包构建库命令
```
vue-cli-service build --name draggableUpload --entry ./src/index.js --target lib
```
## 引入库的入口文件地址配置
package.json
```
"main": "dist/draggableUpload.umd.min.js",
```
## ts声明文件入口配置
package.json
```
 "typings": "./types/index.d.ts",
```
## npm 发布包文件配置
package.json
```
 "files": [
        "dist",
        "types",
        "README.md"
    ]
```
## 对于库开发的babel配置
```
npm i @babel/runtime-corejs3 @babel/plugin-transform-runtime  -D
npm i @babel/runtime
```
```
module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: false,
      },
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
      },
    ],
  ],
};

```
useBuiltIns设置为false 取消导入全局的polyfill,使用@babel/runtime、@babel/plugin-transform-runtime 和 @babel/runtime-corejs3复用帮助文件和提供沙盒环境为polyfill取别名防止污染全局变量

## css inline 配置
```
module.exports = {
  // 强制css内联，不然会导致样式失效问题
  css: { extract: false },
};

```
