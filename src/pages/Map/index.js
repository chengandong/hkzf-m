import React, { Component } from 'react'

// 导入样式
import './map.scss'

// 导入 顶部导航栏 组件
import NavHeader from '../../components/NavHeader/'

// 导入 封装的 定位插件工具
import { getCurrentCity } from '../../utils/LocalCity'

// 当在HTML文件中引入定义全局变量的脚本并尝试在代码中使用这些变量时,可以通过从window对象显式读取全局变量来避免这种情况
const BMap=window.BMap

export default class Map extends Component {
  componentDidMount () {
    this.initMap()
  }
  // 初始化地图
  async initMap () {
    // 获取 当前定位 城市
    const location = await getCurrentCity()
    // 1.创建地图实例
    var map = new BMap.Map("container")
    // 2.创建地址解析器实例     
    var myGeo = new BMap.Geocoder();      
    // 3.将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(location.label, function(point){     
        if (point) {
          // 3.地图初始化，同时设置地图展示级别   
          map.centerAndZoom(point, 11)
          
          // 向地图添加控件
          map.addControl(new BMap.NavigationControl()) // 平移缩放控件 
          map.addControl(new BMap.ScaleControl()) // 比例尺
          map.addControl(new BMap.OverviewMapControl()) // OverviewMapControl
          map.addControl(new BMap.MapTypeControl()) // 地图类型  卫星三维
        }      
    }, 
    location.label)
  }
  render() {
    return (
      <div className='map'>
        {/* 顶部 地图 导航栏 */}
        <NavHeader>地图找房</NavHeader>
        {/* 创建地图容器元素 */}
        <div id="container"></div>
      </div>
    )
  }
}
