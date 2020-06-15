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

export default class Home extends Component {
  state = {
    selectedTab: 'redTab',
    hidden: false,
  }

  render() {
    return (
      <div className="home">
        {/* 显示 四个子路由 */}
        <Route path="/home/index" component={Index}></Route>
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
          <TabBar.Item
            title="首页"
            key="Life"
            icon={ // 默认展示图片
              <i className="iconfont icon-ind"></i>
            }
            selectedIcon={ // 选中后的展示图片
              <i className="iconfont icon-ind"></i>
            }
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab'
              })
              // 点击 底部标签 跳转到 对应的页面
              this.props.history.push('/home/index')
            }}
            data-seed="logId"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-findHouse"></i>
            }
            selectedIcon={
              <i className="iconfont icon-findHouse"></i>
            }
            title="找房"
            key="Koubei"
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab'
              })
              // 点击 底部标签 跳转到 对应的页面
              this.props.history.push('/home/houselist')
            }}
            data-seed="logId1"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-infom"></i>
            }
            selectedIcon={
              <i className="iconfont icon-infom"></i>
            }
            title="资讯"
            key="Friend"
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab'
              })
              // 点击 底部标签 跳转到 对应的页面
              this.props.history.push('/home/news')
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <i className="iconfont icon-my"></i>
            }
            selectedIcon={
              <i className="iconfont icon-my"></i>
            }
            title="我的"
            key="my"
            selected={this.state.selectedTab === 'yellowTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'yellowTab'
              })
              // 点击 底部标签 跳转到 对应的页面
              this.props.history.push('/home/profile')
            }}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}
