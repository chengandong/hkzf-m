import React, { Component } from 'react'

// 导入 封装的 定位插件工具
import { getCurrentCity } from '../../utils/LocalCity'

import SearchHeader from '../../components/SearchHeader/'

export default class Houselist extends Component {
  state={
    cityName:''
  }
  async componentDidMount () {
    // 获取当前 定位 城市
    const location = await getCurrentCity()
    this.setState({
      cityName: location.label
    })
  }
  render() {
    return (
      <div>
        {/* 搜素 导航部分 父-->子 */}
        <SearchHeader cityName={this.state.cityName}></SearchHeader>
      </div>
    )
  }
}
