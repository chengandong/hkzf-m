import React, { Component } from 'react'

// 导入样式
import './map.scss'

// 当在HTML文件中引入定义全局变量的脚本并尝试在代码中使用这些变量时,可以通过从window对象显式读取全局变量来避免这种情况
const BMap=window.BMap

export default class Map extends Component {
  componentDidMount () {
    this.initMap()
  }
  // 初始化地图
  initMap () {
    // 1.创建地图实例
    var map = new BMap.Map("container")
    // 2.设置中心点坐标
    var point = new BMap.Point(111.681063, 40.764981)
    // 3.地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15)
  }
  render() {
    return (
      <div className="map">
        {/* 创建地图容器元素 */}
        <div id="container"></div>
      </div>
    )
  }
}
