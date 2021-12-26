---
title: cli
date: 2021-12-26 10:25:20
tags:
---
# Webpack
![](https://b3logfile.com/file/2020/10/u24561030221558568959fm15gp0-f0314798.jpg)

## webpack 自定义配置脚手架
[demo](https://github.com/zjjaxx/zjj-webpack-cli)

### 新建bin/zjj.js 目录
作用:如果脚手架全局安装的话，可以使用bash命令执行bin目录下的js脚本
```
#!/usr/bin/env node
// 使用shell方式执行js代码
console.log("zjj cli trigger ....")
```
package.json
```
 "bin": {
    "zjj": "./bin/zjj.js"
  }
```
设置该项目的全局软链（就相当于全局安装 npm i 包名 -g）
```
npm link
```
执行命令
```
zjj
```
![](https://b3logfile.com/file/2020/11/Snipaste20201107151438-967560eb.png)
### commander(完整的 node.js 命令行解决方案)
使用commander来解析我们的命令行
```
npm install commander
```
修改zjj.js
```
#!/usr/bin/env node
// 使用shell方式执行js代码
const { program } = require('commander');
program.version(require("../package.json").version);

program
  .command('init <name>')
  .description('init a webpack demo')
  .action((name, destination) => {
    console.log(`init ${name} is called`);
  });

  program.parse(process.argv);
```
执行
```
zjj init demo
```
![](https://b3logfile.com/file/2020/11/Snipaste20201107154122-1a7b5f57.png)

命令行已被正确解析

### 配置 init 命令执行文件
1. 新建action/init.js
```
module.exports =async name =>{
        log("start init "+name)
}
```
2. 设置好看的欢迎命令行界面
```
npm i figlet
```
```
const {promisify} =require("util")
const figlet = promisify(require('figlet'));
module.exports =async name =>{
         const welcomeText=await figlet("welcome use zjj's cli")
}

```
3. 配置console.log()字体为绿色
```
npm i chalk
```
```
...
const chalk =require("chalk")
const log=content=>console.log(chalk.greenBright(content))
module.exports =async name =>{
        log("start init "+name)
        const welcomeText=await figlet("welcome use zjj's cli")
        log(welcomeText)
}
```
4. 新建下载模块
```
npm install download-git-repo
```
action/download.js
```
const {promisify}=require("util")
const download=promisify(require("download-git-repo"))
module.exports=async (repository,name)=>{
   await download(repository, name)
}
```
设置下载进度条
```
npm i ora
```
```
...
const ora = require('ora');
const chalk = require("chalk")
const log = content => console.log(chalk.greenBright(content))
module.exports = async (repository, name) => {
    const progress = ora()
    progress.start(log(`Loading ${repository}`));
    await download(repository, name)
    progress.succeed(log("download successful"))
}
```
在init.js调用
```
...
const download=require("./download")
module.exports =async name =>{
        ...
        download("zjjaxx/webpack-demo-4.44.1",name)
}
```
![](https://b3logfile.com/file/2020/11/Snipaste20201107173309-1405bdb9.png)

### 调用node的子进程执行npm i安装依赖
新建/actin/execute.js
```
const child_process = require('child_process');
module.exports=(...args)=>{
   return new Promise((resolve,reject)=>{
        const workerProcess =child_process.spawn(...args);
        workerProcess.stdout.pipe(process.stdout)
        workerProcess.stderr.pipe(process.stderr)
        workerProcess.on('close', function (code) {
            resolve("close")
         });
    })
}
```
修改init.js
```
const ora = require('ora');
  ...
  const progress = ora()
        progress.start(log(`安装${name}依赖🚀...`));
        await execute(process.platform === 'win32' ? 'npm.cmd' : "npm",["i"],{cwd:`./${name}`})
        progress.succeed(log(`安装成功！`))
```
### 启动项目
修改init.js
```
...
await execute(process.platform === 'win32' ? 'npm.cmd' : "npm",["run","dev"],{cwd:`./${name}`})
```
### 上传到npm
从淘宝镜像源切回到register
```
npx nrm use npm
```
package.json
```
"repository":"https://github.com/zjjaxx/zjj-webpack-cli.git",
```
```
npm login
npm publish
```
上传成功后就可以`npm i zjj-webpack-cli -g`全局安装了

切回淘宝镜像
```
npx nrm use taobao
```


