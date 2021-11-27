---
title: zjj_ui
date: 2021-11-20 10:20:21
tags:
---
## 组件库依赖管理 Yarn Workspace 
Workspace 能更好的统一管理有多个项目的仓库，既可在每个项目下使用独立的 package.json 管理依赖，又可便利的享受一条 yarn 命令安装或者升级所有依赖等。更重要的是可以使多个项目共享同一个 node_modules 目录，提升开发效率和降低磁盘空间占用。

### 配置
package.json文件
```
"workspaces": ["packages/*"]
"private":true,
```
workspace仅仅是为了你的本机方便维护依赖。当你的包被发布到npm的时候，npm完全没有workspace的概念。所以为了避免你手抖发出去。yarn强制你把启用了workspace的工程的标记为私有。

## 嗯~，vite 的@vitejs/plugin-legacy好像不支持兼容性的库打包，使用rollup babel配置打包
### vite中的rollup配置
```
 rollupOptions: {
      external: ['vue'],//打包中剔除vue，不然引用依赖会组件报错
      plugins: [
        babel({
          skipPreflightCheck: true,//预检
          babelHelpers: 'runtime',//配置使用runtime，避免全局变量污染，为了避免配置runtime 和babelrc会报错，//跳过预检
          extensions: ['.js', '.jsx', 'ts', "vue"],
          exclude: '**/node_modules/**' // 只编译我们的源代码
        }),
      ]
    }
```

## vite 的jsx默认使用react渲染，所以安装插件@vitejs/plugin-vue-jsx
## 样式使用scss
### 安装局部依赖scss，不知道为啥在package.json中不能直接调用sass命令，只能通过npx执行？？
### scss 使用@use 替代@import 防止重复引用多次会生成多个重复样式
### package.json使用&顺序执行脚本

## 自动生成typescript声明文件 vite-plugin-dts 插件

## 按需导入样式插件 vite-plugin-style-import
