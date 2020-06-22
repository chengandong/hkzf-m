import React, { Component } from 'react'

// 导入样式
import './map.scss'

// 导入 局部样式
import styles from './map.module.scss'

// 导入 封装后的 axios
import request from '../../utils/request'

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

  // 发送请求获取数据 生成 地图 覆盖物
  async renderOverlays (id) {
    const { data } = await request.get('/area/map?id=' + id)
    // 循环 生成 覆盖物 到地图
    data.body.forEach((item) => {
      // longitude 经度 latitude 纬度
      const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35) // 设置文本偏移量
      }
      var label = new BMap.Label('', opts);  // 创建文本标注对象
        // 设置信息窗口内容
        label.setContent(
        `
          <div class="${styles.bubble}">
            <p class="${styles.name}">${item.label}</p>
            <p>${item.count}套</p>
          </div>
        `
        )
        // label标签样式 覆盖掉 原有的
        label.setStyle({
          padding:0,
          border:'none'
        })
      // 添加label覆盖物
      this.map.addOverlay(label)
    })
    
  }
  // 初始化地图
  async initMap () {
    // 获取 当前定位 城市
    const location = await getCurrentCity()
    // 1.创建地图实例
    this.map = new BMap.Map("container")
    // 2.创建地址解析器实例     
    var myGeo = new BMap.Geocoder();      
    // 3.将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(location.label, (point) => {     
        if (point) {
          // 3.地图初始化，同时设置地图展示级别   
          this.map.centerAndZoom(point, 11)
          
          // 向地图添加控件
          this.map.addControl(new BMap.NavigationControl()) // 平移缩放控件 
          this.map.addControl(new BMap.ScaleControl()) // 比例尺
          this.map.addControl(new BMap.OverviewMapControl()) // OverviewMapControl
          this.map.addControl(new BMap.MapTypeControl()) // 地图类型  卫星三维

          // 生成 地图覆盖物
          this.renderOverlays(location.value)        
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
