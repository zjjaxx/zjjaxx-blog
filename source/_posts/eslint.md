---
title: eslint
date: 2022-01-02 10:03:39
tags:
---
# eslint
## 为什么要用ESLint
- 统一团队编码规范（命名，众多格式等）
- 统一语法，毕竟es版本已经不少了(var/let....)
- 减少git不必要的提交（如果文件格式不一样，也会被git提交的）
- 避免低级错误
- 在编译时检查语法，而不是等JS引擎运行时才检查

## vscode 扩展工具eslint (会启动eslint服务器，去检查项目代码)
## 初始化eslint配置文件(交互式)
```
npx eslint --init
```
## 配置文件 `.eslintrc.js`
```
module.exports = {
  root: true, // 表明为根结点的eslint配置，不再向上查找
  env: {
    browser: true, // 表明在浏览器中直接运行，window等全局变量可以直接调用，不需要申明
    commonjs: true,
    es2021: true, // 直接设置环境为es2021 ,自动设置ecmaVersion 为2021
  },
  // 全局变量申明，防止eslint报错
  globals: {
    withDefaults: "readonly",
    defineProps: "readonly",
  },
  // extends 申明检查时使用那些规范，可省略eslint-config-
  extends: [
    "standard", // eslint-config-standard包 标准语法规范
    "prettier", // prettier 规范 放在最后覆盖之前的规范
  ],
  parser: "vue-eslint-parser",
  // 解析器配置
  parserOptions: {
    ecmaVersion: 12, // es 12 的版本
    parser: "@typescript-eslint/parser",
  },
  plugins: ["vue", "@typescript-eslint"],
  // 使用extends中的成套规范，在rules修改部分规范
  rules: {
    camelcase: "off",
    "spaced-comment": "off",
  },
};

```