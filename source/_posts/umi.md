---
title: umi
date: 2021-12-18 11:50:17
tags:
---
# umi
## patchRoutes
可以动态注册路由，但无法动态加载
## render(oldRender: Function)
先执行render方法渲染，在调用olderRender回调触发patchRoutes方法

## 可以使用render和patchRoutes配合做权限控制
在render中请求权限列表,在patchRoutes中动态注册路由

## onRouteChange 在初始加载和路由切换时做一些事情。
在路由变更完之后触发，执行时机是 render->patchRoutes->执行函数组件->onRouteChange