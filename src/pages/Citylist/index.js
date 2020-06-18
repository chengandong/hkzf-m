import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'
// 导入 样式
import './citylist.scss'
export default class Citylist extends Component {
  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
        >城市选择</NavBar>
      </div>
    )
  }
}
