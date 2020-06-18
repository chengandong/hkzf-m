import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'
// 导入 样式
import './citylist.scss'

// 导入axios
import axios from 'axios'

export default class Citylist extends Component {
  state = {
    cityList: {} // 左侧城市列表
  }
  componentDidMount () {   
    this.getCitylist()   
  }

  // 获取城市列表数据
  async getCitylist () {
    const { data } = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
    // 讲获取到的 数据 进行格式化 转换为 自己需要的
    const { cityList, cityIndex } = this.formatCity(data.body)
    console.log('新城市数据列表', cityList)
    console.log('右侧', cityIndex)
  }

  // 格式化 城市数据
  formatCity (citys) {
    // 定义 一个空对象 存放新的城市列表数据
    let cityList = {}
    // 遍历 城市列表数据
    citys.forEach((item)=>{
      // 设置 城市 关键字 例如：a b c d
      const cityWords = item.short.substr(0, 1)
      // 判断 当前 新城市列表对象 中有无 城市 关键字
      if (cityList[cityWords]) {
        // 新城市列表对象 有该城市 则继续追加城市
        cityList[cityWords].push(item)
      } else {
        // 第一次 没有 添加这个 属性以及 对应的城市
        cityList[cityWords] = [item]
      }
    })  
    // Object.keys(对象) 把对象里面的 属性名 取出组成一个数组
    let cityIndex = Object.keys(cityList).sort() // sort()排序

    return { cityList, cityIndex }
  }

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
