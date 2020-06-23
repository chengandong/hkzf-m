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

// 导入 Toast轻提示 组件
import { Toast } from 'antd-mobile'

// 当在HTML文件中引入定义全局变量的脚本并尝试在代码中使用这些变量时,可以通过从window对象显式读取全局变量来避免这种情况
const BMap=window.BMap

export default class Map extends Component {
  state = {
    houseCount: 0, // 小区房屋 数量
    houseList: [], // 小区房屋 信息列表
    isShow: false // 默认 不显示房屋列表
  }
  componentDidMount () {
    this.initMap()
  }

  // 发送请求获取数据 生成 地图 覆盖物
  async renderOverlays (id, type) {
    // 发送请求之前 开启loading
    Toast.loading('加载中...', 0)
    const { data } = await request.get('/area/map?id=' + id)
    // 成功之后 开启loading
    Toast.hide()
    // 循环 生成 覆盖物 到地图
    data.body.forEach((item) => {
      // longitude 经度 latitude 纬度
      const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35) // 设置文本偏移量
      }
      var label = new BMap.Label('', opts);  // 创建文本标注对象
        // 判断 是矩形 还是 圆形 ---- 只要 小区是 矩形
        if (type === 'cycle') {
          // 设置信息窗口内容
          label.setContent(
            `
              <div class="${styles.bubble}">
                <p class="${styles.name}">${item.label}</p>
                <p>${item.count}套</p>
              </div>
            `
            )
        } else if (type === 'rect') {
          // 设置信息窗口内容
          label.setContent(
            `
            <div class="${styles.rect}">
              <span class="${styles.housename}">${item.label}</span>
              <span class="${styles.housenum}">${item.count}套</span>
              <i class="${styles.arrow}"></i>
            </div>
            `
            )
        }
        
        // label标签样式 覆盖掉 原有的
        label.setStyle({
          padding:0,
          border:'none'
        })
        // 给label覆盖物 添加 点击事件
        label.addEventListener('click', (e) => {
          //点击时候的 地图级别  
          const zoom=this.map.getZoom() // 11 13 15 ..
          // 判断 当前地图 级别
          if (zoom === 11) {
            // 1.设置地图展示级别----去县级
            this.map.centerAndZoom(point, 13)
            // 2.清除之前的那些覆盖物 ---- 百度地图的bug(需要延时一下)
            window.setTimeout(() => {
              this.map.clearOverlays()
            }, 1)  
            // 3.发送请求 获取区级房子套数 并循环生成覆盖物
            this.renderOverlays(item.value, 'cycle')
          } else if (zoom === 13) {
            // 1.设置地图展示级别---去小区
            this.map.centerAndZoom(point, 15)
            // 2.清除之前的那些覆盖物 ---- 百度地图的bug(需要延时一下)
            window.setTimeout(() => {
              this.map.clearOverlays()
            }, 1)  
            // 3.发送请求 获取区级房子套数 并循环生成覆盖物
            this.renderOverlays(item.value, 'rect')
          } else if (zoom === 15) {
            // 1. 获取 点击时的 x,y 坐标
            const clickX = e.changedTouches[0].clientX
            const clickY = e.changedTouches[0].clientY
            // 2. 获取 当前屏幕中心点位置
            const centerX = window.innerWidth / 2
            const centerY = (window.innerHeight - 330) / 2
            // 3. 需要移动 的距离
            const distanceX=clickX-centerX
            const distanceY=clickY-centerY
            // 4. 移动地图
            this.map.panBy(-distanceX, -distanceY)
            // 获取 房屋信息
            this.getHousesList(item.value)
          }
          
        })
        // 添加label覆盖物
        this.map.addOverlay(label)
      })   
  }

  // 获取 房屋列表 数据
  async getHousesList (id) {
    const { data } = await request.get('/houses/?cityId=' + id)
    // 赋值 房屋信息
    this.setState({
      houseCount: data.body.count,
      houseList: data.body.list,
      isShow: true // 显示 房屋列表
    })
  }

  // 渲染 房屋列表 
  renderHouseslist () {
    return this.state.houseList.map((house) => {
            return <div className={styles.house} key={house.houseCode}>
                    <div className={styles.imgWrap}>
                      <img className={styles.img} src={`http://api-haoke-web.itheima.net${house.houseImg}`} alt="" />
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.title}>{house.title}</h3>
                      <div className={styles.desc}>{house.desc}</div>
                      <div>
                          {/* ['近地铁', '随时看房'] */}
                          <span className={[styles.tag,styles.tag1 ].join(' ')} >
                            {
                              house.tags.map((value, index) => {
                                return <span key={index} className={[styles.tag,styles.tag1 ].join(' ')}>
                                  {value}
                                </span>
                              })
                            }
                          </span>
                      </div>
                      <div className={styles.price}>
                        <span className={styles.priceNum}>{house.price}</span> 元/月
                      </div>
                    </div>
                  </div>
    })
  }

  // 初始化地图
  async initMap () {
    // 获取 当前定位 城市
    const location = await getCurrentCity()
    // 1.创建地图实例
    this.map = new BMap.Map("container")

    // 地图开始移动时movestart 隐藏房子列表
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })
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
          this.renderOverlays(location.value, 'cycle')        
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

        {/* 房屋列表 */}
        <div
          className={[styles.houseList, this.state.isShow ? styles.show : '' ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
                更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {/* 渲染 房屋信息 */}
            {
              this.renderHouseslist()
            }
          </div>     
        </div>
        
      </div>
    )
  }
}
