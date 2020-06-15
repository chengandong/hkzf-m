// 根组件 APP.js
// 导入 react 结构出来的 Component
import React, { Component } from 'react'

// 导入路由的三个核心组件： Router / Route / Link
import {BrowserRouter as Router, Route} from 'react-router-dom'

// 导入 Home 组件
import Home from './pages/Home/'

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          {/* 指定路由展示组件相关信息 */}
          <Route path="/home" component={Home}></Route>
        </div>
      </Router>    
    )
  }
}
