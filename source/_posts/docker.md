---
title: docker
date: 2021-12-26 10:09:20
tags:
---
![](https://b3logfile.com/file/2020/10/u15898182932913011842fm26gp0-35c7c0cd.jpg)
# docker 

docker 解决了不同环境下配置不同的问题，docker可以把运行环境(系统、代码、配置、数据、依赖等)都打包到一个沙盒中(容器)，部署到任何流行的Linux机器上

### docker vs 虚拟机

上图：

<img style="display:inline-block;" src="https://img.hacpai.com/file/2019/12/Container2x-c6633470.png" width="300" height="280"></img>
<img style="display:inline-block;" src="https://img.hacpai.com/file/2019/12/VM2x-97403df8.png" width="300" height="280"></img>

虚拟机属于虚拟化技术。而Docker这样的容器技术，也是虚拟化技术，属于轻量级的虚拟化。

区别：虚拟机虽然可以隔离出很多“子电脑”，但占用空间更大，启动更慢，虚拟机软件可能还要花钱，但是docker不需要虚拟出整个操作系统，容器内的应用进程直接运行于宿主的内核。容器没有自己的内核，仅包含运行时的所需的runtime环境，所以占用资源少，启动快

## docker 核心概念
### 上图
![](https://b3logfile.com/file/2020/10/u793314303480081697fm26gp0-150f58e3.jpg)
### 仓库（Repository）
存放镜像地址的远程仓库（github类似）
### 镜像（Image）
镜像轻量级可执行的软件包，相当于是一个模板，它除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（例如环境变量）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
### 容器（Container）
按镜像生成的实例,每个容器相互隔离，可以把容器看成一个精简版的linux环境

## docker 安装
首先换源 (yum或者apt) 

根据官网安装，略~


### 阿里云上下载docker安装环境命令
```
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
替换成
```
sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
### Docker安装时出现requires containerd.io >= 1.2.2-3错误
```
wget http://mirrors.aliyun.com/docker-ce/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.13-3.1.el7.x86_64.rpm

yum -y install ./containerd.io-1.2.13-3.1.el7.x86_64.rpm
```

## docker 镜像相关概念
### UnionFS(联合文件系统)
Union文件系统（UnionFS）是一种分层、轻量级并且高并发的文件系统，它支持**对文件系统的修改作为一次提交来一层层的叠加**,同时可以将不同目录挂载到同一个虚拟文件系统下。Union文件系统时Docker镜像的基础，镜像可以通过分层来进行继承，基于基础镜像，可以制作各种具体的应用镜像
### docker 镜像的加载原理
liunx 系统分为两个部分：
- bootfs 主要包含bootloader和kernel,bootloader主要时引导加载kernel,linux刚启动时会加载bootfs文件系统，**docker镜像的最底层是bootfs,镜像没有内核，所有镜像公用宿主机内核**
- rootfs 在bootfs之上，包含liunx系统中的/dev,/proc,/bin等标准目录，不同的Linux系统各不相同，所有每个容器为其提供不同的rootfs，对于一个精简的os，rootfs可以很小，所有docker比虚拟机小得多
### 镜像分层
镜像分层为了复用共享
## 数据卷
功能：实现容器数据持久化，容器之间共享数据
### 容器数据持久化
- 命令行
```
 docker volume create todo-db
 docker run -dp 3000:3000 -v todo-db:/etc/todos getting-started
```
停止并删除容器

重新执行上面命令行,数据依旧存在

- docker-compose.yml
```
version: "3.7"

services:
  mysql:
    image: mysql:5.7
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```
### 容器之间共享数据
```
docker run -it -v /宿主机绝对路径目录:/容器内目录 镜像名
```

```
 docker run -it -d -v /tomcatVolume:/containerVolume --name myTomcat -p 8888:8080 tomcat
```
```
 docker run -it -d -v /tomcatVolume:/containerVolume:ro --name myTomcat -p 8888:8080 tomcat
```
`:ro`options 表示read-only,在容器中只读，只允许主机中修改
## Dockerfile

Dockerfile是用来构建Docker镜像的构建文件,是由一些列命令和参数构成的脚本

### Dockerfile基本规则
- 每条保留字指令都必须为大写字母且后面要跟随至少一个参数
- 指令按照从上到下，顺序执行
- #表示注释
- 每条指令都会创建一个新的镜像层，并对镜像进行提交

### Dockerfile的大致流程
1. docker从基础镜像运行一个容器
2. 执行一条指令并对容器做出修改
3. 执行类似docker commit 的操作提交一个新的镜像层
4. docker在基于刚提交的镜像运行一个新的容器
5. 执行Dockerfile中的下一条指令直到所有指令都执行完成

### Dockerfile保留关键字
#### FROM
基础镜像，表示当前新镜像是基于哪个镜像的
#### MAINTAINER
镜像的维护人员的姓名+邮箱地址
#### RUN
容器构建时需要运行的命令
#### EXPOSE
当前容器对外暴露出的端口
#### WORKDIR
指定在创建容器后，终端默认登入进来的工作目录(cd)
#### ENV 
用来在构建镜像过程中设置的环境变量(process.env.)
#### ADD
将宿主机目录下的文件拷贝进镜像且ADD命令会自动处理URL和解压tar压缩包
#### COPY
只拷贝不解压
#### CMD 
指定一个容器启动时要运行的命令，可以有多个CMD指令，但只有最后一个生效，会被docker run 之后的参数替换(同时也会被docker-compose.yml中的command替换)
#### ENTRYPOINT
和CMD不同的是 docker run 之后的参数会在ENTRYPOINT后面追加
#### ONBUILD 
当构建一个被继承的Dockerfile时运行命令,父镜像在被继承后父镜像的ONBUILD被触发

## Docker Compose
一次性启动多个镜像
- build
通常指定要构建镜像的dockerfile目录
- restart
1. no：是默认的重启策略，在任何情况下都不会重启容器。
2. always：容器总是重新启动。
3. on-failure：在容器非正常退出时（退出状态非0），才会重启容器。
4. unless-stopped：在容器退出时总是重启容器，但是不考虑在Docker守护进程启动时就已经停止了的容器
- command 
运行命令
- volumes 
数据卷
- ports
映射端口 主机:容器
示例
```
version: '3.1'
services:
  app-pm2:
      container_name: app-pm2
      #构建容器
      build: ./backend
      ports:
        - "3000:3000"
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  nginx:
    restart: always
    image: nginx
    ports:
      - 8888:80
    volumes:
      - ./nginx/conf.d/:/etc/nginx/conf.d
      - ./frontend/dist:/var/www/html/
      - ./static/:/static/
```
### 安装
[官网链接](https://docs.docker.com/compose/install/)


### vscode插件deploy 把本地代码同步到远程服务器

![](https://b3logfile.com/file/2020/11/Snipaste20201121085002-302a953c.png)
在项目根目录创建.vscode/settings.json文件

示例：
```
{
    "deploy": {
        // 要部署的包
        "packages": [
            {
                "name": "Version 2.3.4",
                "description": "Package version 2.3.4",
                "files": [
                    "**/*.php",
                    "/*.json"
                ],
                "exclude": [
                    "tests/**"
                ],
                //设置为true时，文件修改完就部署,默认为false
                "deployOnSave": true
            },
            {
                "name": "Version 2.3.5 (anything)",
                "description": "Package version 2.3.5"
            }
        ],
        //部署的设备
        "targets": [
            {
                "type": "sftp",
                "name": "My SFTP folder",
                "description": "A SFTP folder",
                //deploy上传到远程服务器目录
                "dir": "/my_package_files",
                "host": "localhost", "port": 22,
                "user": "tester", "password": "password"
            }
        ],
        //您可以运行您的VS代码实例到主机模式，这意味着您可以通过TCP网络连接从远程机器接收文件。
        "host": [
            {
                "dir": "./files_from_remotes"
            }
        ]
    }
}
```

/**和/* 和？作用

- `?    匹配任何单字符   `      

- `*    匹配0或者任意数量的字符`

- `**    匹配0或者更多的目录 ``

示例
```
/app/*.x    匹配(Matches)所有在app路径下的.x文件         

/app/p?ttern    匹配(Matches) /app/pattern 和 /app/pXttern,但是不包括/app/pttern         

/**/example    匹配(Matches) /app/example, /app/foo/example, 和 /example         

/app/**/dir/file.    匹配(Matches) /app/dir/file.jsp, /app/foo/dir/file.html,/app/foo/bar/dir/file.pdf, 和 /app/dir/file.java         

/**/*.jsp    匹配(Matches)任何的.jsp 文件   
```
在目录中右键发布
![](https://b3logfile.com/file/2020/11/Snipaste20201124085309-4422bd74.png)

