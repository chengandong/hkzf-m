import React, { Component } from 'react'

// 导入样式
import './home.css'

// 导入 Route
import { Route } from 'react-router-dom'

// 导入 antd-mobile 中的 TabBar 标签栏
import { TabBar } from 'antd-mobile'

// 导入 四个 子路由 组件
import Index from '../Index/'
import Houselist from '../Houselist/'
import News from '../News/'
import Profile from '../Profile/'

// 底部四个标签栏数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home/index'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/houselist'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]

export default class Home extends Component {
  state = {
    selectedTab: '/home/index',
    hidden: false,
  }

  // 渲染 底部标签栏 item项
  renderTabbarItem () {
    return tabItems.map((item, index) => {
      return <TabBar.Item
               title={item.title}
               key={index}
               icon={ // 默认展示图片
                 <i className={`iconfont ${item.icon}`}></i>
               }
               selectedIcon={ // 选中后的展示图片
                 <i className={`iconfont ${item.icon}`}></i>
               }
               selected={this.state.selectedTab === item.path}
               onPress={() => {
                 this.setState({
                   selectedTab: item.path
                 })
                 // 点击 底部标签 跳转到 对应的页面
                 this.props.history.push(item.path)
               }}
               data-seed="logId"
              >
              </TabBar.Item>
      })
  }

  render() {
    return (
      <div className="home">
        {/* 显示 四个子路由 */}
        <Route exact path="/home/index" component={Index}></Route>
        <Route exact path="/home/houselist" component={Houselist}></Route>
        <Route exact path="/home/news" component={News}></Route>
        <Route exact path="/home/profile" component={Profile}></Route>

        {/* TabBar 标签栏 */}
        <TabBar
          unselectedTintColor="#bbb" // 未选中的字体颜色
          tintColor="#f20" // 选中的字体颜色
          barTintColor="white" // tabbar 背景色
          hidden={this.state.hidden} // 是否隐藏
        >
          {/* 循环遍历 TabBar.Item */}
          {
            this.renderTabbarItem()
          }
        </TabBar>
      </div>
    )
  }
}
