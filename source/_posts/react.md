---
title: react
date: 2021-10-07 12:53:51
categories: react
tags: react
top_img: ../img/react/react.jpeg
cover: ../img/react/react.jpeg
---

# [react](https://react.docschina.org/docs/hello-world.html)
## 在渲染页面的时候为什么有引入React却没有使用，不引入可不可以
必须引入，jsx语法在编译时会编译成React.createElement
## setState
- 第一个参数可以是对象也可以是函数
对象会和state合并，如果是函数的话返回一个与state合并的对象
- 第二个参数是更新后的回调

### setState的更新可能是异步的
异步可以批量更新，优化性能

- setState在setTimeout中是同步的
- setState在原生事件中是同步的

### setState的更新会被覆盖
setState的更新可能是异步的，批量更新，解决的方法是setState第一个参数传入的是一个函数，参数为之前的state

## 生命周期
{% asset_img live.png This is an example image %}
- constructor()
通常，在 React 中，构造函数仅用于以下两种情况：

1. 通过给 this.state 赋值对象来初始化内部 state。
2. 为事件处理函数绑定实例
- componentDidMount()
你可以在 componentDidMount() 里直接调用 setState()。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如此保证了即使在 render() 两次调用的情况下，用户也不会看到中间状态。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况下，你可以使用此方式处理
- shouldComponentUpdate()
首次渲染或使用 forceUpdate() 时不会调用该方法。

请注意，返回 false 并不会阻止子组件在 state 更改时重新渲染。

我们不建议在 shouldComponentUpdate() 中进行深层比较或使用 JSON.stringify()。这样非常影响效率，且会损害性能。

后续版本，React 可能会将 shouldComponentUpdate 视为提示而不是严格的指令，并且，当返回 false 时，仍可能导致组件重新渲染。
- static getDerivedStateFromProps(props, state)
getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
此方法无权访问组件实例。
- getSnapshotBeforeUpdate(prevProps, prevState)
getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。

此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。
- static getDerivedStateFromError(error)
```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染可以显降级 UI
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的降级  UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```
getDerivedStateFromError() 会在渲染阶段调用，因此不允许出现副作用。 如遇此类情况，请改用 componentDidCatch()。

## redux
- store 实例
- reducer初始化、修改state
- getState 获取状态值
- action 修改state事件对象
- dispatch 派发action 修改state
- subscribe 订阅 state 变更收到通知
## react-redux
- Provider 为后代组件提供store
- connect为组件提供数据和变更方法

## react-router
Route渲染优先级：children>component>render
这三种方式互斥
- children:func
有时候，不管location是否匹配，你都需要渲染一些内容

## PureComponent
内置了shouldComponentUpdate浅层比较

## Hook
### Effect Hook
副作用，像数据获取，设置订阅以及手动更改React组件中的DOM都属于副作用

相当于 componentDidMount componentDidUpdate componentWillUnmount

第二个参数是一个数组，表示依赖项，只有依赖改变，副作用才会执行
### useMemo 
相当于vue的计算属性
### useCallback 
对于函数的惰性执行


## React.lazy
对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。

React.lazy 函数能让你像渲染常规组件一样处理动态引入（的组件）。
懒加载webpack等打包工具的写法
```
import("./utils").then(res=>{})
```
React.lazy
```
const OtherComponent = React.lazy(() => import('./DynamicComponent'));
```
此代码将会在组件首次渲染时，自动导入包含 DynamicComponent 组件的包。

React.lazy 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise，该 Promise 需要 resolve 一个 defalut export 的 React 组件。

然后应在 Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。
```
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import(/*webpackChunkName:"DynamicComponent"*/'./DynamicComponent'));

function MyComponent() {
  return (
    <div>
      <button onClick={()=>setShow(!show)}>changeShow</button>

      {show && <Suspense fallback={<div>Loading...</div>}>
        <DynamicComponent name="zjj" />
      </Suspense>}
    </div>
  );
}
```
```
export default function DynamicComponent(props) {
    const list = new Array(100000).fill("a").map(item => (<div>{item}</div>))
    return (
        <>
            <h1>{'DynamicComponent' + props.name}</h1>
            {list}
        </>
    )
}
```
fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件。


## 高阶组件
高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧取代了之前的mixins,高阶组件本身是对装饰器模式的一种运用

高阶组件是一个函数，接受一个组件，返回一个新组件

高阶组件把相同的功能抽离出去变为一个装饰器函数，不影响传入组件

[运用参考ant 3.x版本的form表单](https://3x.ant.design/components/form-cn/#components-form-demo-normal-login)

缺点：对原有组件的props有了固化的要求，高阶组件传递给被包裹组件的 props 如果重名的话，会发生覆盖


## Render Props
相当于一个函数回调，回调函数参数为复用逻辑数据，返回生成的组件

缺点：
无法在 return 语句外访问数据
嵌套

### useContext 全局变量
```
const value = useContext(MyContext);
```
```
const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```
### useReducer（处理复杂对象）仿照reduce函数，接收旧的state和action,返回新的state
```
const [state, dispatch] = useReducer(reducer, initialArg, init);
```
```
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```


## Fragments(类似vue template)
React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

短语法

你可以使用一种新的，且更简短的语法来声明 Fragments。它看起来像空标签：```<> </>```


