---
title: interview_css.md
date: 2021-11-17 19:10:59
tags: css
categories: css
---
## BFC是什么?
块级格式化上下文
- 每一个BFC区域只包括其子元素，不包括其子元素的子元素
- 每一个BFC区域都是独立隔绝的,互不影响

### 触发BFC的条件
- body根元素
- 设置浮动，不包括none
- 设置定位，absoulte或者fixed
- 行内块显示模式，inline-block
- 设置overflow，即hidden，auto，scroll
- 表格单元格，table-cell
- 弹性布局，flex

### BFC解决什么问题
- 解决外边距的塌陷问题(垂直塌陷)
- 利用BFC解决包含塌陷
- 可以利用BFC来清除浮动的影响
- 做自动适应

## opacity:0、visibility:hidden、display:none。这三个属性的区别
- display:none 节点存在，不显示，不占据空间
- visibility:hidden 节点存在，不显示，占据空间，不触发事件
- opacity:none 节点存在，不显示，占据空间，触发事件

## 圆
### css 半圆
宽度为高度的一半，相应的圆角值，right 和top或bottom 值为0。
### css 1/4圆
宽高相同，圆角值和宽高相同，其他为0。

## 伪元素和伪类的区别
伪元素有新的元素 after before
伪类只是选择器

## 什么是回流，什么是重绘，有什么区别？
### 什么是回流
当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。
完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。
### 什么事重绘
当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。
### 区别：
他们的区别很大：
回流必将引起重绘，而重绘不一定会引起回流。比如：只有颜色改变的时候就只会发生重绘而不会引起回流
当页面布局和几何属性改变时就需要回流
比如：添加或者删除可见的DOM元素，元素位置改变，元素尺寸改变——边距、填充、边框、宽度和高度，内容改变

### 优化
回流比重绘的代价要更高，
- 最小化重绘和重排 多次修改变为一次，
1. 先隐藏，改完之后再显示，
2. 用className
3. 使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档。
- 避免触发同步布局事件
```
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = box.offsetWidth + 'px';
    }
}
```
在每次循环的时候，都读取了box的一个offsetWidth属性值，然后利用它来更新p标签的width属性。这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列。
- 对于复杂动画效果,使用绝对定位让其脱离文档流
- css3硬件加速（GPU加速）
1. transform
2. opacity
3. filters
4. Will-change
