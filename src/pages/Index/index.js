import React, { Component } from 'react'

// 导入样式
import './index.scss'

// 导入 封装 后的 搜素导航栏组件
import SearchHeader from '../../components/SearchHeader/'

// 导入 轮播图 组件
import { Carousel, Flex, Grid } from 'antd-mobile'

// 导入 封装的 定位插件工具
import { getCurrentCity } from '../../utils/LocalCity'

// 导入 封装后的 axios
import request from '../../utils/request'

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
    isPlay: false, // 是否自动切换
    groups: [], // 租房小组数据
    news: [], // 最新资讯数据
    cityName: '' // 当前定位城市
  }

  // 页面 初次渲染
  componentDidMount() {
    this.getSwiperdata()
    this.getGroupsdata()
    this.getNewsdata()
    // 定位 
    this.getLocalCity()  
  }

  // 使用 百度地图 进行ip定位
  async getLocalCity () {
    const location = await getCurrentCity()
    // 设置 当前 城市
    this.setState({
      cityName: location.label
    })
  }

  // 获取 轮播图数据
  async getSwiperdata () {
    const { data } = await request.get("/home/swiper")
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

  // 获取 租房小组数据
  async getGroupsdata () {
    const { data } = await request.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // 判断 是否请求获取 成功
    if (data.status !== 200) {
      return
    }
    this.setState({
      groups: data.body
    })
  }

  // 获取 最新资讯数据
  async getNewsdata () {
    const { data } = await request.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // 判断 是否请求获取 成功
    if (data.status !== 200) {
      return
    }
    this.setState({
      news: data.body
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
          src={`http://api-haoke-web.itheima.net${SwiperImg.imgSrc}`}
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

  // 渲染 最新资讯
  renderNews () {
    return this.state.news.map((item) => {
            return <li key={item.id}>
                    <img src={"http://api-haoke-web.itheima.net" + item.imgSrc} alt="" />
                    <div className="item-right">
                      <h3>{item.title}</h3>
                      <p>
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                      </p>
                    </div>
                  </li>
          })
  }

  render() {
    return (
      <div className="index">
        {/* 顶部导航 */}
        {/* 搜素 导航部分 父-->子 */}
        <SearchHeader cityName={this.state.cityName}></SearchHeader>

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

        {/* 租房小组 */}
        <div className="groups">
          {/* 标题 */}
          <div className="groups-title">
            <h2>租房小组</h2>
            <span>更多</span>
          </div>
          {/* 主体区域 */}
          <Grid
            data={this.state.groups} // 传入的菜单数据
            columnNum={2} // 列数
            square={false} // 每个格子是否固定为正方形
            activeStyle // 点击反馈的自定义样式 (设为 false 时表示禁止点击反馈)
            hasLine={false} // 是否有边框
            renderItem={group => ( // 自定义每个 grid 条目的创建函数
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{group.title}</h3>
                  <p>{group.desc}</p>
                </div>
                <img src={`http://api-haoke-web.itheima.net${group.imgSrc}`} alt="" />
              </Flex>
            )}
          />
          </div>
        
        {/* 最新资讯 */}
        <div className="news">
          {/* 标题区域 */}
          <div className="news-title">最新资讯</div>
          {/* 主体区域 */}
          <ul className="news-content">
            {
              // 最新资讯 数据项
              this.renderNews()
            }       
          </ul>
        </div>

      </div>
    )
  }
}
