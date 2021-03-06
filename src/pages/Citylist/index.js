import React, { Component } from 'react'

import { Toast } from 'antd-mobile'

// 导入List 组件
import { AutoSizer, List } from 'react-virtualized'
// 导入 样式
import './citylist.scss'

// 导入 封装后的 axios
import request from '../../utils/request'

// 导入 封装的 定位插件工具
import { getCurrentCity } from '../../utils/LocalCity'

// 导入 顶部导航栏 组件
import NavHeader from '../../components/NavHeader/'

export default class Citylist extends Component {
  listRef = React.createRef() // 创建 ref

  state = {
    cityList: {}, // 左侧城市列表
    cityIndex: [], // 右侧城市开头字母
    activeIndex: 0 // 默认索引为0的 选中
  }
  componentDidMount () {   
    this.getCitylist()   
  }

  // 获取城市列表数据
  async getCitylist () {
    const { data } = await request.get('/area/city?level=1')
    // 1. 将获取到的 数据 进行格式化 转换为 自己需要的
    const { cityList, cityIndex } = this.formatCity(data.body)
    
    // 2. 获取 热门城市 数据
    const hotCity = await request.get('/area/hot')
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
    // 通过 城市关键字 拿到 对应的城市数组
    const citys = this.state.cityList[cityWords]
    return (   
      <div className="city" key={key} style={style}>
        {/* 城市关键字 */}
        <div className="city-title">{this.formatWord(cityWords)}</div>
        {/* 城市列表 */}
        {
          citys.map((city) => {
            return <div
                     className="city-name"
                     key={city.value}
                     onClick={() => {
                      // 定义 一个数组 保存 北上广深 城市
                      const first_cities = ['北京', '上海', '广州', '深圳']

                      // 判断 是否是 北上广深 城市
                      if (first_cities.indexOf(city.label) !== -1) {
                        // 北上广深 城市 将其存入 本地存储中
                        window.localStorage.setItem('local-city', JSON.stringify(city))
                        // 跳转到 首页
                        this.props.history.push('/home/index')
                      } else {
                        Toast.info('该城市 暂无房源哦 ^_^', 2)
                      }
                     }}
                    >{city.label}</div>
          })
        }
      </div>
    )
  }

  // 解决 右边 城市关键字列表 高亮问题
  // ({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number })
  // : void 不需要返回值
  onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
    // 判断  减少性能消耗
    if (startIndex !== this.state.activeIndex) {
      // 修改activeIndex索引 对应城市关键字
      this.setState({
        activeIndex: startIndex
      })
    }    
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

  // 动态 计算每行高度
  // ({ index: number }): number  : number 函数返回值 类型number
  getHeight = ({index}) => {
    // 通过 索引得到 城市关键字
    const cityWords = this.state.cityIndex[index]
    // 通过 城市关键字 拿到 对应的城市数组
    const citys = this.state.cityList[cityWords]
    // 必须返回 number数字类型
    return 36 + citys.length * 50
  }

  // 渲染 右侧 城市关键字列表
  renderCityIndex () {
    return this.state.cityIndex.map((item, index) => {
            return <li
                    key={index}
                    className={index === this.state.activeIndex ? 'active' : ''}
                    onClick={() => {
                      // 让List组件 滚动到对应的位置
                      // scrollToRow (index: number)
                      this.listRef.current.scrollToRow(index)
                    }}
                    >
                      {/* 转换格式 */}
                      { item==='hot'?'热':item.toUpperCase() }
                    </li>
                  })
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部 导航栏 */}
        <NavHeader></NavHeader>
        {/* 城市列表 */}
        {/* AutoSizer 计算屏幕剩余宽高 */}
        <AutoSizer> 
          {({height, width}) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length} // 列表 总条数
              rowHeight={this.getHeight} // 每行盒子的高度
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered} // 函数
              scrollToAlignment= 'start' // 控制滚动到行的对齐方式
              ref={this.listRef}
            />
          )}
        </AutoSizer>
        
        {/* 右侧 城市关键字列表 */}
        <ul className="city-index">
          {
            this.renderCityIndex()
          }
        </ul>
      </div>
    )
  }
}
