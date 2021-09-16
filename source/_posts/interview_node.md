---
title: NODE
---
# NODE
## koa特点
- 对原生的node api的封装
- 业务中切面描述需要，在执行某一方法前后做统一的拦截处理，中间件架构

### koa 中间件实现原理
- 接收多个use的回调函数组成一个数组
- 将数组中的回调函数组合成一个新函数(函数内部会顺序执行数组中的回调函数,并将自定义的next函数作为参数传入)
- 在http.createSever的回调函数中执行新函数


### koa-router原理（策略模式）
router.get router.post 构成一个映射表 ，获取路径，匹配映射表执行函数
### koa-static 原理
读取请求路径是目录还是文件,是目录显示目录列表,是文件显示文件内容
### Bodyparse原理 
```
req.on("data",fn) req.on("end",fn)
```
### 上传文件
```
request.on("data",data=>{
    fis.write(data)
})
request.on("end",data=>{
    fis.end()
    response.end()
})
```

## 网络
### 网络分层
网络层 -> 传输层 -> 应用层

#### IP协议(网络层)
包含 源 IP 地址、目标 IP 地址等
#### UDP 协议（传输层）
UDP 中一个最重要的信息是端口号，端口号其实就是一个数字，每个想访问网络的程序都需要绑定一个端口号。通过端口号 UDP 就能把指定的数据包发送给指定的程序了,所以IP 通过 IP 地址信息把数据包发送给指定的电脑，而 UDP 通过端口号把数据包分发给正确的程序。
#### TCP协议（传输层）
使用 UDP 来传输会存在两个问题：

1. 数据包在传输过程中容易丢失；
2. 大文件会被拆分成很多小的数据包来传输，这些小的数据包会经过不同的路由，并在不同的时间到达接收端，而 UDP 协议并不知道如何组装这些数据包，从而把这些数据包还原成完整的文件。

TCP协议
1. 对于数据包丢失的情况，TCP 提供重传机制；
2. TCP 引入了数据包排序机制，用来保证把乱序的数据包组合成一个完整的文件。

####  浏览器端发起 HTTP 请求流程
1. 查找缓存
2. 浏览器会请求 DNS 返回域名对应的 IP
3. 建立 TCP 连接
4. 发送 HTTP 请求
5. 渲染进程解析HTML内容转化为DOM树结构，解析CSS为CSSDOM
6. 把DOM和CSSDOM结合生成渲染树
7. 布局
8. 绘制

浏览器会解析一部分就渲染绘制一部分

css会阻塞"其后的"DOM树(页面)的渲染，css会阻塞"其后的"js执行

DOMContentLoaded(就是当页面的内容解析完成后，则触发该事件)
- 如果页面中同时存在css和js，并且存在js在css后面，则DOMContentLoaded事件会在css加载完后才执行。
- 其他情况下，DOMContentLoaded都不会等待css加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。
[demo](https://gitee.com/zjjaxx/css-render)

### 常见的http请求方式
- axios ajax 基于(XMLHttpRequest)的封装
- jsonp script标签请求,返回并执行执行html中定义的方法,传入其需要的data参数
- 埋点 
```
const img=new Image()
img.src="http://localhost:3000/test.png"
```
- fetch
### 跨域方式
- jsonp
- img标签
- Access-Control-Allow-Origin:http://localhost:3000
适用于简单请求 get head post content-type为表单、文件、text/plain
- Access-Control-Allow-(其他配置Headers、PUT) 预检options请求的配置
除了简单请求外的其他请求：自定义header、put、delete
- Access-Control-Allow-Credentials  设置允许携带Cookie

### HTTP缓存机制
#### 作用
- 提高首屏加载速度,优化用户体验
- 减少流量消耗
- 减轻服务器压力

#### 强缓存策略
##### expires http1.0
在response header中添加expires表示资源过期时间
##### cache-control http1.1
当 expires和cache-control都存在时，cache-control优先级较高,该值为一个时间长度,表示资源过了多久失效,
- no-cache 需要使用协商缓存来验证缓存数据
- no-store 所有内容都不会缓存
- max-age=xxx 多少秒失效 
#### 协商缓存(需要设置cache-control:no-cache)
如果设置了no-cache和no-store则本地缓存会被忽略,回去请求服务器验证资源是否更新,如果没更新才继续使用本地缓存,此时返回304，虽然需要后端应答但是后端既不需要生成内容也不需要传输内容

协商缓存主要包括last-modified 和 etag

##### 协商时间
- last-modified
- if-modified-since

##### 协商内容 (形式类似)
- etag
- if-none-match