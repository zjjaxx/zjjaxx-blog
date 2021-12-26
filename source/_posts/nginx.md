---
title: nginx
date: 2021-12-26 10:20:08
tags:
---
# NGINX
![](https://b3logfile.com/file/2020/11/u829075437291521136fm26gp0-001f8b96.jpg)

> Nginx("engine x")是一款是由俄罗斯的程序设计师Igor Sysoev所开发高性能的 Web和 反向代理 服务器，也是一个 IMAP/POP3/SMTP 代理服务器。

## 相关概念
### 正向代理
配置海外的vps代理服务器，代理网络请求，实现翻墙
### 反向代理
浏览器访问反向代理服务器，由反向代理服务器去请求目标服务器
### 负载均衡
请求数据量较大，高并发时，可以将请求分发给多个服务器（分流），实现负载均衡
![](https://b3logfile.com/file/2020/11/Snipaste20201121140532-74b85816.png)

### 动静分离
为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务器的压力
![](https://b3logfile.com/file/2020/11/Snipaste20201121141606-f3901a7a.png)
## nginx 常用命令（在docker 容器中）
在/usr/sbin目录下
### 查看nginx版本号
```
./nginx -v
```
### 关闭nginx命令
```
./nginx -s stop
```
### 启动nginx
```
./nginx
```
### 重新加载 刷新更改
```
./nginx -s reload
```
## nginx 配置文件
在docker 容器中的配置文件目录为

/etc/nginx/nginx.conf
```
user  nginx;
worker_processes  1;//nginx服务器并发处理服务的关键配置，worker_processes值越大，可以支持并发处理量也越多

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;//影响nginx服务器于用户的网络连接
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```
include 字段加载conf.d目录下的任意以.conf结尾的配置问价，即default.conf

/etc/nginx/config.d/default.conf
```
server {
    listen       80; //监听端口
    listen  [::]:80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

## nginx 反向代理示例
规则

语法形式
```
location   [ = | ~ | ~* | ^~ | @]   /uri/     { configuration }
```
匹配模式及顺序

匹配字符串分为两种：普通字符串（literal string）和正则表达式（regular expression），其中 ~ 和 ~* 用于正则表达式， 其他前缀和无任何前缀都用于普通字符串。

匹配顺序是：1、先匹配普通字符串，将最精确的匹配暂时存储；2、然后按照配置文件中的声明顺序进行正则表达式匹配，只要匹配到一条正则表达式，则停止匹配，取正则表达式为匹配结果；3、如果所有正则表达式都匹配不上，则取1中存储的结果；4、如果普通字符串和正则表达式都匹配不上，则报404 NOT FOUND。

- location   =   /uri         =开头表示精确前缀匹配，只有完全匹配才能生效。

- location   ^~   /uri        ^~开头表示普通字符串匹配上以后不再进行正则匹配。

- location   ~   pattern     ~开头表示区分大小写的正则匹配。

- location   ~*   pattern    ~*开头表示不区分大小写的正则匹配。

- location   /uri            不带任何修饰符，表示前缀匹配。

- location   /               通用匹配，任何未匹配到其他location的请求都会匹配到。

注意：正则匹配会根据匹配顺序，找到第一个匹配的正则表达式后将停止搜索。普通字符串匹配则无视顺序，只会选择最精确的匹配。


常用配置指令alias、root、proxy_pass

1. alias——别名配置，用于访问文件系统，在匹配到location配置的URL路径后，指向alias配置的路径，如：
```
location   /test/  {
        alias    /usr/local/;
}

```
请求/test/1.jpg（省略了协议和域名），将会返回文件/usr/local/1.jpg。

2. root——根路径配置，用于访问文件系统，在匹配到location配置的URL路径后，指向root配置的路径，并把请求路径附加到其后，如：
```
location   /test/  {

        root    /usr/local/;

}
```

请求/test/1.jpg，将会返回文件/usr/local/test/1.jpg。

3. proxy_pass——反向代理配置，用于代理请求，适用于前后端负载分离或多台机器、服务器负载分离的场景，在匹配到location配置的URL路径后，转发请求到proxy_pass配置额URL，是否会附加location配置路径与proxy_pass配置的路径后是否有"/"有关，有"/"则不附加，如：
```
location   /test/  {

        proxy_pass    http://127.0.0.1:8080/;

}
```

请求/test/1.jpg，将会被nginx转发请求到http://127.0.0.1:8080/1.jpg（未附加/test/路径）。


把nginx的9898端口代理到tomcat的8888端口

修改
```
 location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
```
为
```
   location / {
        root   /usr/share/nginx/html;
        proxy_pass http://47.99.33.177:8888;
        index  index.html index.htm;
    }

```
添加多个反向代理
```
   location / {
        root   /usr/share/nginx/html;
        proxy_pass http://47.99.33.177:8888;
        index  index.html index.htm;
    }
    location ~/test {
        root   /usr/share/nginx/html;
        proxy_pass http://47.99.33.177:8898;
        index  index.html index.htm;
    }
}
```

## nginx 负载均衡
nginx.conf
```
...
upstream myServer{
  server 47.99.33.177:8888;
  server 47.99.33.177:8898;
}
```
default.conf
```
 location / {
        root   /usr/share/nginx/html;
        proxy_pass http://myServer;
        index  index.html index.htm;
    }
```

几种分配方式（策略）
- 轮询（默认）
每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除
- weight
weight 代表权重，默认为1，权重越高被分配得客户端越多
- ip_hash
每个请求按访问ip的hash结果分配，这样每个访问固定访问一个后端服务器，可以解决session的问题
```
upstream server_pool{
  ip_hash
  server 47.99.33.177:8888;
  server 47.99.33.177:8898;
}
```
- fair(第三方)
按后端服务器的响应时间来分配请求，响应时间短的优先分配
```
upstream server_pool{
  server 47.99.33.177:8888;
  server 47.99.33.177:8898;
  fair
}
```

## 动静分离
把动态请求跟静态请求分开

使用nginx处理静态页面，Tomcat处理动态页面

动静分离从目前实现角度来讲分为2种
- 一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案
- 另一种方法就是动态跟静态文件混合在一起发布，通过nginx来分开

### 示例
通过nginx 处理静态请求
```
 location /image/ {
        root   /usr/share/nginx/html;
        autoindex on;#请求目录时会把文件都列出来
        index  index.html index.htm;
    }
```
![](https://b3logfile.com/file/2020/11/Snipaste20201123162657-faf3377a.png)

## 使用nginx配置高可用的集群

nginx可能宕机，挂掉

配置多台nginx服务器，一台主服务器，多台从服务器

请求先发送主服务器，如果主服务器宕机，则发给从服务器,2个nginx对外提供虚拟IP

要用到[keepalived](https://www.keepalived.org/)软件

![](https://b3logfile.com/file/2020/11/Snipaste20201123165709-e8aad87e.png)

安装keepalived

不想看了太难了
...待续

[哔哩哔哩链接](https://www.bilibili.com/video/BV1zJ411w7SV?p=14)

