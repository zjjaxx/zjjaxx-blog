---
title: interview_project.md
date: 2021-11-16 23:02:54
tags:
---
# 项目
## typescript相关
### 使用typescript有什么好处
- 静态类型检查
- 代码提示
### 类型别名和接口之间的差异
- 关键区别在于不能重新打开类型以添加​​新属性与始终可扩展的接口。
- 接口只能用于声明对象的形状，不能重命名基元。
```
type new_string=string

//error
interface new_number extends number{

}
```
### 如果表达一个函数类型
```
type GreetFunction = (a: string) => void;
//或则(函数属性) 箭头变成:
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
//或则(构造函数) 箭头变成:
type SomeConstructor = {
  new (s: string): SomeObject;
};
```
### 泛型的好处
函数复用，可以通过使用泛型函数来完全避免重载。
### 泛型约束 用 extends

### 在通用约束中使用类型参数
```
Key extends keyof Type
```
### Keyof 类型运算符
是将一个类型映射为它所有成员名称的联合类型
### 属性映射 用 in keyof
```
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
```
### Typeof 类型运算符
您可以在类型上下文中使用它来引用变量或属性的类型
### Partial 把一个对象类型属性都变为可选
### Required  把一个对象类型属性都变为必选 -？
### Omit 移除对象类型中某个属性
### 元组是什么
一个元组类型是另一种形式的Array类型，知道它到底有多少元素包含，和它到底包含在特定的位置，其类型
### this在函数中声明
```
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
```
### unknown和any有什么不同
该unknown类型表示任何值。这类似于any类型，但更安全，因为对unknown值执行任何操作都是不合法的
### typescript申明文件有什么用？
在ts文件中引入打包后的js开源库，需要申明文件申明引用库的类型,在tsconfig.json文件中可配置declaration打包时自动生成申明文件
### 三斜线指令
path指源文件，type指依赖包申明

它用作文件之间依赖关系的声明。

## 后台管理系统
### 权限
1. 是否需要登录判断
2. 如果要登录，没登录跳转登录页
3. 如果已登录，接口请求返回路由表
4. 根据返回的路由表映射成真实本地的路由表
5. 将嵌套路由表展平
6. addRoute添加路由

## webpack打包优化
### 缓存
cache-group 把node_modules中的依赖单独打包，利于缓存
filename 使用contenthash
### 把大的依赖不打包进去，使用cdn引入,配置externals
### 图片小于40KB用base64处理
### 打包后的html、css、js进行一个压缩处理
## webpack打包速度优化
- 使用别名加快目标依赖的搜索
- loader中exclude node_modules
- 用 Happypack 来加速代码构建(从单一进程的形式扩展多进程模式)
- 大的依赖不打包进文件中，采用cdn引入
- 缓存cache

