import React, { Component } from 'react'
// 导入 axios
import axios from 'axios'
// 导入 轮播图 组件
import { Carousel, Flex } from 'antd-mobile'
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
        href="http://www.alipay.com"
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
  render() {
    return (
      <div className="index">
        <Carousel
          autoplay={this.state.isPlay} // 是否自动切换
          infinite // 是否循环播放
        >
          {/* 循环生成 轮播图项 */}
          {
            this.renderSwiper()
          }
          {/* nav导航栏 */}
        </Carousel>
      </div>
    )
  }
}
