import React, { Component } from 'react'
// 导入 axios
import axios from 'axios'

// 导入样式
import './index.css'

// 导入 轮播图 组件
import { Carousel, Flex } from 'antd-mobile'

// 导入 nav 导航栏 所需的图片
import nav1 from "../../assets/images/nav-1.png"
import nav2 from "../../assets/images/nav-2.png"
import nav3 from "../../assets/images/nav-3.png"
import nav4 from "../../assets/images/nav-4.png"

// 导航菜单的数据
const navs = [{
  id: 0,
  img: nav1,
  title: '整租',
  path: '/home/houselist'
}, {
  id: 1,
  img: nav2,
  title: '合租',
  path: '/home/houselist'
}, {
  id: 2,
  img: nav3,
  title: '地图找房',
  path: '/map'
}, {
  id: 3,
  img: nav4,
  title: '去出租',
  path: '/rent/add'
}]
export default class Index extends Component {
  state = {
    SwiperData: [], // 轮播图数据
    imgHeight: 176,
    isPlay: false // 是否自动切换
  }

  // 页面 初次渲染
  componentDidMount() {
    this.getSwiperdata()
  }

  // 获取 轮播图数据
  async getSwiperdata () {
    const { data } = await axios.get("http://api-haoke-dev.itheima.net/home/swiper")
    // 判断 是否请求获取 成功
    if (data.status !== 200) {
      return
    }
    this.setState({
      SwiperData: data.body
    },()=>{ // 此时 轮播图的数据 已经赋值上去
      this.setState({
        isPlay: true
      })
    })
  }

  // 渲染 轮播图
  renderSwiper () {
    return this.state.SwiperData.map(SwiperImg => (
      <a
        key={SwiperImg.id}
        href="https://github.com/chengandong"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://api-haoke-dev.itheima.net${SwiperImg.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }

  // 渲染 导航菜单整租合租
  renderNavs () {
    return navs.map(nav => {
            return <Flex.Item
                    key={nav.id}
                    onClick={()=>{
                        // 跳转到 对应的 页面 
                        this.props.history.push(nav.path)
                      }                         
                    }
                  >
                    <img src={nav.img} alt=""/>
                    <p>{nav.title}</p>
                  </Flex.Item>
            })
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <Carousel
          autoplay={this.state.isPlay} // 是否自动切换
          infinite // 是否循环播放
        >
          {/* 循环生成 轮播图项 */}
          {
            this.renderSwiper()
          }         
        </Carousel>

        {/* nav导航栏 */}
        <Flex className="navs">
          {
            // 导航菜单整租合租项
            this.renderNavs()
          }
        </Flex>
      </div>
    )
  }
}
