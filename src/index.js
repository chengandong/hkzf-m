// 项目 入口文件
import React from 'react';
import ReactDOM from 'react-dom';

// 导入全局初始化样式
import './index.css'

// 导入antd-mobile 的样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入 字体图标 样式
import './assets/fonts/iconfont.css'

// 导入 根组件
import App from './App'

// 渲染到页面
ReactDOM.render(<App />,document.getElementById('root'));


