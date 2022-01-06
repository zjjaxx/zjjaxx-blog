---
title: sports_boy
date: 2021-11-20 10:20:21
tags:
---

## 组件库技术选型
- yarn workspace(统一管理有多个项目的仓库)
- vue3.x
- typescript
- vite 打包js、vue等后缀文件
- gulp 打包scss等文件
- jest 单元测试
- eslint+prettier 代码规范
- husky 添加在每次代码提交前的执行的钩子函数 包括git代码提交规范 eslint代码规范 单元测试
## 管理整个项目包 + 初始化vue3.x+typescript组件库项目 + 预览website项目
## 组件库依赖管理 Yarn Workspace 
Workspace 能更好的统一管理有多个项目的仓库，既可在每个项目下使用独立的 package.json 管理依赖，又可便利的享受一条 yarn 命令安装或者升级所有依赖等。更重要的是可以使多个项目共享同一个 node_modules 目录，提升开发效率和降低磁盘空间占用。

### 配置
package.json文件
```
"workspaces": ["packages/*"]
"private":true,
```
workspace仅仅是为了你的本机方便维护依赖。当你的包被发布到npm的时候，npm完全没有workspace的概念。所以为了避免你手抖发出去。yarn强制你把启用了workspace的工程的标记为私有。
### 项目目录结构划分
```
sports_boy
  _ packages(管理子包)
    - sports_boy(组件库子包)
    - website (预览子包)
```
### 相关命令
#### 初始化vue3.x+typescript
```
yarn create vite sports_boy --template vue-ts
yarn create vite website --template vue-ts
```
#### 安装依赖
```
yarn workspace + 子包名 + add + 相关依赖库
```
#### 执行子包脚本
```
yarn workspace + 子包名 + 相关命令
```
### 预览website项目本地引用组件库
因为配置了yarn workspace关系(相当于npm link软链的形式)，可以直接在website子包中的package.json中配置
```
  "dependencies": {
    "sports_boy": sports_boy子包中定义的版本号,
  }
```
## 组件库打包工具选用vite
### vite.config.js esm语法中使用node相关api，需要安装 @types/node
### 安装@vitejs/plugin-vue-jsx，在开发组件库时使用jsx语法
vite 的jsx默认使用react渲染，所以安装插件@vitejs/plugin-vue-jsx
### vite的库打包模式配置
```
  build: {
    //...
    lib: {
      entry: path.resolve(__dirname, './src/main.ts'),
      name: 'sports_boy'//name 则是暴露的全局变量 在umd格式下是必须的 默认打包es 和 umd格式
    },
    rollupOptions: {
      external: ['vue'], //一定不能把vue打包进去，否则在引入组件库时会报错
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        exports:"named" //rollup导出模式。默认为auto，它根据entry模块导出的内容猜测你的意图,如果是导出多个东西，适合用named,区别在于commonjs的引入方式上。。主要是为了解决rollup打包警告
      },
  }
}
 
```
### 组件库包的输出配置
package.json中
```
  "main": "./dist/sports_boy.umd.js",  //在所有规范中都适配,可以直接在浏览器运行
  "module": "./dist/sports_boy.es.js", //在esm中使用
```
#### 上传npm包是配置我们需要上传的哪些文件
```
  "files": [
    "dist",
    "src",
    "types",
    "README.md"
  ],
```
### vite打包的兼容性配置
vite 的@vitejs/plugin-legacy不支持库的兼容性打包，使用rollup babel配置打包
#### vite中的rollup配置 使用@rollup/plugin-babel插件
```
 rollupOptions: {
      external: ['vue'],//打包中剔除vue，不然引用依赖会组件报错
      plugins: [
        babel({
          skipPreflightCheck: true,//跳过预检，不配置会报错
          babelHelpers: 'runtime',//配置使用runtime，避免全局变量污染
          extensions: ['.js', '.jsx', 'ts', "vue"], //可识别的后缀名文件
          exclude: '**/node_modules/**' // 只编译我们的源代码
        }),
      ]
    }
```
#### babel配置（这里使用.babelrc和rollup中的babel配置进行合并,否则使用babel.config.js全局配置这种方式会报错）

```
{
  "presets": [
    [
      "@babel/env",
      {
        "useBuiltIns": false
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}
```
相关babel 依赖
```
@babel/core //babel核心库必须安装
@babel/runtime //以下3个为一些polyfill提供沙盒环境(为一些polyfill取别名防治污染全局变量)和复用帮助文件
@babel/runtime-corejs3
@babel/plugin-transform-runtime
```

## gulp 打包scss等文件 (缺点公共样式会重复，暂未解决)
为了组件库的按需导入,不能把样式内嵌到vue文件中,需一个组件对应一个样式文件,单独打包
### 采用gulp-sass 支持scss打包
### 所有的对css处理都放到postcss插件中
gulp相关postcss插件 gulp-postcss
#### 对css兼容性处理 和 压缩
postcss.config.js
```
module.exports = {
    plugins: [
        require('autoprefixer'),
        require("cssnano")
    ]
}
```
相关依赖
```
autoprefixer
cssnano
```
### gulpfile.js配置
```
const { src, watch, dest } = require("gulp")
var postcss = require('gulp-postcss');
var sass = require('gulp-sass')(require('sass'));
function buildStyles() {
    return src('./src/theme/*.scss') //导入文件夹下所有的scss文件进行处理
        .pipe(sass().on('error', sass.logError)) //编译scss
        .pipe(postcss()) //对css兼容性处理,压缩
        .pipe(dest('./theme'));//打包输出路径
};

exports.build = buildStyles;
exports.watch = function () {
    watch('./src/theme/*.scss',{ ignoreInitial: false }, buildStyles);
};
```
### 上面我们只处理了支持组件库按需导入的方式，还没有处理全部导入
#### 在我们打包css时,先使用node为我们生成一份包含所有组件样式引入的index.scss文件,然后在进行打包
package.json使用&顺序执行脚本

[代码](https://github.com/zjjaxx/sports_boy/blob/main/packages/sports_boy/scripts/autoBuildIndexScss.js)
对于公共样式的引入:在生成的index.scss中使用@use 替代@import 防止重复引用多次会生成多个重复样式
### 在项目中引入组件库
全局引入
```
import SportsBoy from 'sports_boy'
import "sports_boy/theme/index.css"
```
按需引入  安装vite-plugin-style-import插件

在vite.config.js中配置
```
 plugins: [
    //...
    styleImport({
      libs: [
        {
          libraryName: 'sports_boy',
          esModule: true,
          resolveStyle: name => {
            return `../theme/${name}.css` 
          },
        }
      ]
    })
  ]
```
## 组件库兼容性配置(必须配，不然babel和autoprefixer不生效)
所有对兼容配置都放到.browserslistrc
```
> 1% //兼容大于1%的市场占有率的浏览器
last 2 versions //兼容浏览器最近的2个版本
not dead //不兼容不维护的浏览器
```
## 自动生成typescript声明文件 vite-plugin-dts 插件
在组件库包的package.json中配置
```
"typings": "./dist/src/main.d.ts",
```

## jest作为单元测试 (无法使用jsx语法，暂未解决)
### 使用vue官方提供的插件 @vue/test-utils
### 配置jest.config.js
```
module.exports = {
  preset: 'ts-jest', //处理ts
  testEnvironment: 'jsdom', //vue组件挂载需要jsdom
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest', // .vue文件用 vue-jest 处理
    '^.+\\.js$': 'babel-jest',   // .js或者.jsx用 babel-jest处理 （默认jest 只支持commonjs语法 ,不支持esmodule,使用babel做语法转换）
  }
}
```
相关依赖
```
jest
babel-jest //（默认jest 只支持commonjs语法 ,不支持esmodule,使用babel做语法转换）
@types/jest  //声明文件
@vue/vue3-jest //处理vue后缀的文件
ts-jest //处理ts后缀的文件
```

## eslint + prettier作为代码规范
- 首先安装eslint
- 再执行eslint 初始化 选择好对应的规范配置
```
npx eslint --init
```
### [eslint-plugin-vue 相关配置项](https://eslint.vuejs.org/user-guide)
```
module.exports = {
  root: true, // 表明为根结点的eslint配置，不再向上查找
  env: {
    browser: true, // 表明在浏览器中直接运行，window等全局变量可以直接调用，不需要申明
    commonjs: true,
    es2021: true,  // 直接设置环境为es2021 ,自动设置ecmaVersion 为2021
  },
  // 全局变量申明，防止eslint报错
  globals: {
    withDefaults: "readonly",
    defineProps: "readonly",
  },
  // extends 申明检查时使用那些规范，可省略eslint-config-
  extends: [
    "plugin:vue/base", // 启用正确 ESLint 解析的设置和规则。
    "plugin:vue/vue3-essential", // 以及防止错误或意外行为的规则。
    "plugin:vue/vue3-strongly-recommended", // 加上可显着提高代码可读性和/或开发体验的规则。
    "plugin:vue/vue3-recommended", // 加上强制执行主观社区默认值的规则，以确保一致性。
    "standard", // eslint-config-standard包 标准语法规范
    "prettier", // prettier 规范 放在最后覆盖之前的规范
  ],
  parser: "vue-eslint-parser",
  // 解析器配置
  parserOptions: {
    ecmaVersion: 12, // es 12 的版本
    ecmaFeatures: { // 如果您使用 JSX，则需要在 ESLint 配置中启用 JSX。
      jsx: true,
    },
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
### vscode 相关插件为prettier + eslint
vscode 只会读取项目根节点的.eslintignore
## husky
### 初始化 [代码](https://github.com/zjjaxx/sports_boy/blob/main/scripts/verifyCommit.js)
```
  "initHusky": "husky install && husky add .husky/commit-msg 'node scripts/verifyCommit.js \n yarn run lint \n yarn run start:test '",

```
### lint-staged 每次提交只校验git缓存修改的文件

```
//...
    "initHusky": "husky install && husky add .husky/commit-msg 'node scripts/verifyCommit.js\nyarn run lint-staged\nyarn run start:test'",
//...
 "lint-staged":{
    "packages/sports_boy/src/**/*.{vue,js,ts}":"yarn run lint"
  },
```

### prettier 提交时为git缓存修改的文件自动格式化
```
 "lint-staged": {
    //...
    "packages/sports_boy/src/**/*.{vue,js,ts,css,scss}": "prettier --write"
  },
```
