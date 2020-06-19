import React, { Component } from 'react'

import { NavBar, Icon } from 'antd-mobile'

// 导入List
import { List } from 'react-virtualized'
// 导入 样式
import './citylist.scss'

// 导入axios
import axios from 'axios'

// 导入 封装的 定位插件工具
import { getCurrentCity } from '../../utils/LocalCity'


export default class Citylist extends Component {
  state = {
    cityList: {}, // 左侧城市列表
    cityIndex: [] // 右侧城市开头字母
  }
  componentDidMount () {   
    this.getCitylist()   
  }

  // 获取城市列表数据
  async getCitylist () {
    const { data } = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
    // 1. 将获取到的 数据 进行格式化 转换为 自己需要的
    const { cityList, cityIndex } = this.formatCity(data.body)
    
    // 2. 获取 热门城市 数据
    const hotCity = await axios.get('http://api-haoke-dev.itheima.net/area/hot')
    // 添加 热门城市 这项
    cityList['hot'] = hotCity.data.body
    cityIndex.unshift('hot')

    // 3. 得到 当前定位城市 信息数据
    let location = await getCurrentCity()
    // 添加 当前定位城市 这项
    cityList['#'] = [location]
    cityIndex.unshift('#')
    // 将最终结果 赋值
    this.setState({
      cityList,
      cityIndex
    })
    // console.log('新城市数据列表', cityList)
    // console.log('右侧', cityIndex)
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

  // 渲染 每一行 数据
  rowRenderer = ({
    key, // 唯一的键
    index, // 每一行数据的索引
    isScrolling, // 该列表是否正在滚动
    isVisible, // 该行是否在列表中可见
    style, // 要应用于行的样式对象
  }) => {
    // 通过 索引得到 城市关键字
    const cityWords = this.state.cityIndex[index]
    return (   
      <div className="city" key={key} style={style}>
        <div className="city-title">{this.formatWord(cityWords)}</div>
        <div className="city-name">集宁</div>
      </div>
    )
  }

  // 城市关键字 数据格式 处理
  formatWord (cityWords) {
    // 将 # hot a b c 转换为 # -> 当前定位 hot -> 热门城市  其他abc -> 大写
    switch (cityWords) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'    
      default:
        return cityWords.toUpperCase()
    }
  }

  render() {
    return (
      <div className="citylist">
        <NavBar
          className="navbar"
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.go(-1)
          }}
        >城市选择</NavBar>
        {/* 城市列表 */}
        <List
          width={375}
          height={622}
          rowCount={this.state.cityIndex.length} // 列表 总条数
          rowHeight={100} // 每行盒子的高度
          rowRenderer={this.rowRenderer}
        />
      </div>
    )
  }
}
