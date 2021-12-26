---
title: github
date: 2021-12-26 10:13:44
tags:
---
# Github 

![](https://b3logfile.com/file/2020/10/timg1-5235ca89.jpg)

**GitHub的核心是一个协作平台。GitHub也是一个强大的版本控制工具。**

## Rebase
多人在同一个分支上协作时，很容易出现冲突。即使没有冲突，后push的童鞋不得不先pull，在本地合并，然后才能push成功。总之看上去很乱，有强迫症的童鞋会问：为什么Git的提交历史不能是一条干净的直线？
`git rebase`
再用`git log --graph --pretty=oneline --abbrev-commit`看看：
发现Git把我们本地的提交“挪动”了位置，
## .gitigonre
通常，文件有两种类型：文本文件和二进制文件。

文本文件和大多数代码文件一样，可以使用Git轻松跟踪，并且非常轻巧。

但是，二进制文件（如电子表格，带幻灯片的演示文稿和视频）在Git中不能很好地工作。如果您的存储库中已经有这些文件，那么最好在启用Git版本控制之前制定一个计划。

为此Git将使用.gitignore来忽略那些文件，不记录到版本控制器中，也不上传到github上

[Node.gitignore 模板](https://github.com/github/gitignore/blob/master/Node.gitignore)


### 配置语法：
- /开始的模式匹配项目跟目录
- / 结束的模式只匹配文件夹以及在该文件夹路径下的内容，但是不匹配该文件
- 以星号*通配多个字符；
- 以问号?通配单个字符
- 以方括号[]包含单个字符的匹配列表；
- 以叹号!表示不忽略(跟踪)匹配到的文件或目录；
- 此外，git 对于 .ignore 配置文件是按行从上到下进行规则匹配的，意味着如果前面的规则匹配的范围更大，则后面的规则将不会生效；

### 常用匹配示例：
- bin/: 忽略当前路径下的bin文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件
- /bin: 忽略根目录下的bin文件
- /*.c: 忽略 cat.c，不忽略 build/cat.c
- debug/*.obj: 忽略 debug/io.obj，不忽略 debug/common/io.obj 和 tools/debug/io.obj
- **/foo: 忽略/foo, a/foo, a/b/foo等
- a/**/b: 忽略a/b, a/x/b, a/x/y/b等
- !/bin/run.sh: 不忽略 bin 目录下的 run.sh 文件
- *.log: 忽略所有 .log 文件
- config.php: 忽略当前路径的 config.php 文件

### .gitignore规则不生效
.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。

解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:
```
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```



## GitHub flow
- 创建分支
- 修改代码并提交
- Create a pull request （base is master , compare is 新建分支）
- Respond to a review (Files changed tab)
- Merge the pull request

## GitHub Actions
GitHub Actions是一种灵活的方式，可以将团队软件工作流程的几乎所有方面自动化。
- 自动化测试（CI）
- 持续交付和部署
- 使用问题，@提及，标签等来响应工作流触发器
- 触发代码审查
- 管理分支
- 分类问题和请求请求
### 概述
![](https://b3logfile.com/file/2020/10/overviewactionsdesign-41a2926c.png)
workflows(工作流)由一个或多个job组成，多个job默认会并发执行,你也可以配置job按顺序执行，job 可以定时触发或则有event触发，工作流可以构建、测试、打包、发布、部署
step（步骤）：每个 job 由多个 step 构成，一步步完成。
action （动作）：action是工作流中最小的便携式构建块，每个 step 可以依次执行一个或多个命令（action）。

示例
```
name: learn-github-actions
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
      - run: npm install -g bats
      - run: bats -v
```
### yml或yaml语法
#### YAML元素主要基于键值对。我们可能会将其视为严格的KV：
```
Name: Value
```
#### YAML是JSON的超集，因此我们可以在构造中利用JSON样式序列和映射：
```
a_json_style_map：{“ K”：“ V”}
a_json_style_sequence：[“粉红色”，“红色”，“红色”，“猫”，123、234、345]
```
#### 空格/缩进
例如，这是正确的：
```
Key: Value
```
但这会失败：
```
Key:Value
```
  ^^冒号后没有空格！
  
#### 开始/结束文件

 To  start a document insert '---' at the top of the document, to end it, insert '...'
 
#### 注释
 `#`可以在该行中任何位置的行的开头进行注释：
#### 数组
```
Fancy-Cars
   - Porsche
   - Aston Martin
   - Bentley
  ```
#### 多行
可以使用|来进行多行组合
#### 嵌套
```
# Car information
- Driver
      name: Francis Black
      age: 21
      Driving license type:
          - full car license
          - racing license formula V : details
            license id: ABC12345
            expiry date: 2017-12-28
```
#### 对象
```
CarDetails:
     make: Porsche
     model: 911
     fuel: Petrol
```
### workflow工作流组成
必须将工作流程文件存储在仓库的 .github/workflows 目录中。
GitHub 只要发现.github/workflows目录里面有.yml文件，就会自动运行该文件。
#### name 
工作流程的名称。 GitHub 在仓库的操作页面上显示工作流程的名称。 如果省略 name，GitHub 将其设置为相对于仓库根目录的工作流程文件路径
#### on(required)
触发工作流程的 GitHub 事件的名称。 您可以提供单一事件 string、事件的 array、事件 types 的 array 或事件配置 map，以安排工作流程的运行，或将工作流程的执行限于特定文件、标记或分支更改。 
- 使用单一事件的示例
```
# Triggered when code is pushed to any branch in a repository
on: push
```
- 使用事件列表的示例
```
# Triggers the workflow on push or pull request events
on: [push, pull_request]
```
- 使用具有活动类型或配置的多个事件示例

```
on:
  # Trigger the workflow on push or pull request,
  # but only for the main branch
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  # Also trigger on page_build, as well as release created events
  page_build:
  release:
    types: # This configuration does not affect the page_build event above
      - created
```
- on.schedule
此示例每隔 15 分钟触发工作流程：
```
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  '*/15 * * * *'
```

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌───────────── day of the week (0 - 6 or SUN-SAT)
│ │ │ │ │                                   
│ │ │ │ │
│ │ │ │ │
```
![](https://b3logfile.com/file/2020/10/Snipaste20201027155923-88e933b7.png)

[更多事件](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#webhook-events)
#### Jobs
默认情况下，具有多个作业的工作流将并行运行这些作业。您还可以配置工作流来按顺序运行作业。
- jobs.job_id
jobs字段里面，需要写出每一项任务唯一的job_id，具体名称自定义。
- jobs.job_id.name
job_id里面的name字段是任务的说明。

```
jobs:
  my_first_job:
    name: My first job
  my_second_job:
    name: My second job
```
- jobs.job_id.needs
needs字段指定当前任务的依赖关系，即运行顺序。

```
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]
```
- jobs.job_id.runs-on(required)

runs-on字段指定运行所需要的虚拟机环境。它是必填字段。目前可用的虚拟机如下。
```
ubuntu-latest，ubuntu-18.04或ubuntu-16.04
windows-latest，windows-2019或windows-2016
macOS-latest或macOS-10.14
```
- jobs.job_id.outputs
输出可用于所有依赖的job

示例
```
jobs:
  job1:
    runs-on: ubuntu-latest
    # Map a step output to a job output
    outputs:
      output1: ${{ steps.step1.outputs.test }}
      output2: ${{ steps.step2.outputs.test }}
    steps:
    - id: step1
      run: echo "::set-output name=test::hello"
    - id: step2
      run: echo "::set-output name=test::world"
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
    - run: echo ${{needs.job1.outputs.output1}} ${{needs.job1.outputs.output2}}
```
[更多表达式语法](https://docs.github.com/cn/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#needs-context)
- jobs.job_id.env
job环境变量
- jobs.job_id.if
if 条件的示例表达式
```
steps:
  - uses: actions/hello-world-javascript-action@v1.1
    if: ${{ <expression> }}
```
- jobs.job_id.timeout-minutes
在 GitHub 自动取消运行之前可让作业运行的最大分钟数。 默认值：360
- jobs.job_id.strategy
策略创建作业的构建矩阵。 您可以定义要在其中运行每项作业的环境的不同变种。

使用 Node.js 多个版本运行的示例
```
strategy:
  matrix:
    node: [6, 8, 10]
steps:
  # Configures the node version used on GitHub-hosted runners
  - uses: actions/setup-node@v1
    with:
      # The Node.js version to configure
      node-version: ${{ matrix.node }}
```
- jobs.job_id.container
用于运行作业中尚未指定容器的任何步骤的容器,如有步骤同时使用脚本和容器操作，则容器操作将运行为同一网络上使用相同卷挂载的同级容器。

若不设置 container，所有步骤将直接在 runs-on 指定的主机上运行，除非步骤引用已配置为在容器中运行的操作。

示例
```
jobs:
  my_job:
    container:
      image: node:10.16-jessie
      env:
        NODE_ENV: development
      ports:
        - 80
      volumes:
        - my_docker_volume:/volume_mount
      options: --cpus 1
```
只指定容器映像时，可以忽略 image 关键词。
```
jobs:
  my_job:
    container: node:10.16-jessie
```
- jobs.job_id.services

示例
```
services:
  nginx:
    image: nginx
    # Map port 8080 on the Docker host to port 80 on the nginx container
    ports:
      - 8080:80
  redis:
    image: redis
    # Map TCP port 6379 on Docker host to a random free port on the Redis container
    ports:
      - 6379/tcp
```
- jobs.job_id.steps
作业包含一系列任务，称为 steps,步骤可以运行命令、运行设置任务，或者运行您的仓库、公共仓库中的操作或 Docker 注册表中发布的操作
- jobs.job_id.steps.id
步骤的唯一标识符
- jobs.job_id.steps.if

使用状态检查功能的

示例
```
steps:
  - name: My first step
    uses: monacorp/action-name@main
  - name: My backup step
    if: ${{ failure() }}
    uses: actions/heroku@master
```
- jobs.job_id.steps.name
步骤显示在 GitHub 上的名称。
- jobs.job_id.steps.uses
选择要作为作业中步骤的一部分运行的操作,可以使用公共仓库也可以自定义action,
- jobs.job_id.steps.run
使用操作系统 shell 运行命令行程序。 如果不提供 name，步骤名称将默认为 run 命令中指定的文本。

单行命令：
```
- name: Install Dependencies
  run: npm install
```
多行命令：
```
- name: Clean install dependencies and build
  run: |
    npm ci
    npm run build
```
使用 working-directory 关键词，您可以指定运行命令的工作目录位置。
```
- name: Clean temp directory
  run: rm -rf *
  working-directory: ./temp
```
- jobs.job_id.steps.with
 每个输入参数都是一个键/值对。 输入参数被设置为环境变量。 该变量的前缀为 INPUT_，并转换为大写。 
 在js中使用`process.env.INPUT_KEY`
 
示例
 
定义 hello_world 操作所定义的三个输入参数（first_name、middle_name 和 last_name）。 这些输入变量将被 hello-world 操作作为 INPUT_FIRST_NAME、INPUT_MIDDLE_NAME 和 INPUT_LAST_NAME 环境变量使用。
```
jobs:
  my_first_job:
    steps:
      - name: My first step
        uses: actions/hello_world@main
        with:
          first_name: Mona
          middle_name: The
          last_name: Octocat   
```
- jobs.job_id.steps.with.args
string 定义 Docker 容器的输入。 GitHub 在容器启动时将 args 传递到容器的 ENTRYPOINT

示例
```
steps:
  - name: Explain why this job ran
    uses: monacorp/action-name@main
    with:
      entrypoint: /bin/echo
      args: The ${{ github.event_name }} event triggered this step.
```
- jobs.job_id.steps.env
设置供步骤用于运行器环境的环境变量。
调用`process.env.GITHUB_TOKEN`
示例
```
steps:
  - name: My first action
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      FIRST_NAME: Mona
      LAST_NAME: Octocat
```
- jobs.job_id.steps.timeout-minutes
终止进程之前运行该步骤的最大分钟数。
#### actions

元数据文件名必须是 action.yml 或 action.yaml。 元数据文件中的数据定义操作的输入、输出和主要进入点。
- name(required)操作的名称。 GitHub 在 Actions（操作）选项卡中显示 name
- author 作者
- description(required)简要描述
- inputs
GitHub 存储 input 参数作为环境变量,大写的输入 ID 在运行时转换为小写。 建议使用小写输入 ID。

示例
```
inputs:
  numOctocats:
    description: 'Number of Octocats'
    required: false
    default: '1'
  octocatEyeColor:
    description: 'Eye color of the Octocats'
    required: true
```
  - inputs.input_id(required)
  参数KEY
  - inputs.input_id.description(required)
  input 参数描述
  - inputs.input_id.required
  参数是否必填
  - inputs.input_id.default
  参数默认值
- outputs
可以输出一个变量给接下来执行的action作为输入
- outputs.output_id（required）
- outputs.output_id.description(required)
- outputs.output_id.value(required)
- runs(required)
配置action 的代码文件路径

Example using Node.js
```
runs:
  using: 'node12'
  main: 'main.js'
```
##### runs for JavaScript actions
- runs.using(required)
运行环境
- runs.main(required)
action 代码路径
- runs.pre
允许你在main之前执行一个script
- runs.pre-if
允许你定义条件为pre,默认always()

示例
```
  pre: 'cleanup.js'
  pre-if: 'runner.os == linux'
```
- runs.post
设置执行的脚本一旦action执行完毕
- runs.post-if
允许你定义条件为post
##### runs for composite run steps actions
- runs.using(required)
为了去使用一个组合的run,把这个设置为composite
- runs.steps(required)
- runs.steps.run(required)
你想执行的命令，可以内联或则一个脚本

示例
```
runs:
  using: "composite"
  steps: 
    - run: $/test/script.sh
      shell: bash
```
- runs.steps.shell(required)
The shell where you want to run the command,[shell列表](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#using-a-specific-shell)
- runs.steps.name
- runs.steps.id
- runs.steps.env

##### runs for Docker actions
示例
```
runs: 
  using: 'docker'
  image: 'Dockerfile'
```
- runs.using(required)
必须设置为docker
- runs.image
docker 镜像
- runs.env
- runs.entrypoint
覆盖docker镜像的ENTRYPOINT
- pre-entrypoint
在entrypoint 执行前调用
- post-entrypoint
在entrypoint 执行后调用
- runs.args
gitubs passes the args to the container's ENTRYPOINT when the container starts up

the args are used in place of the CMD instruction in a Dockerfile

### workflow 简单示例
1. 新建Dockerfile
```
FROM centos
RUN yum -y install git
RUN echo "centos"
ENTRYPOINT echo "entry point"
```
2. 新建action.yml
```
name: "Hello Actions"
description: "Greet someone"
author: "octocat@github.com"

inputs:
  MY_NAME:
    description: "Who to greet"
    required: true
    default: "World"

runs:
  using: "docker"
  image: "Dockerfile"

branding:
  icon: "mic"
  color: "purple"
```
3. 新建.github/workflows/main.yml
```
name: A workflow for my Hello World file
on: push
jobs:
  build:
    name: Hello world action
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: ./action-a
        with:
          MY_NAME: "Mona"
```



