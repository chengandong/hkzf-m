// 导入axios
import axios from 'axios'

export const getCurrentCity = () => {
  // 获取 本地存储 中的城市信息, 并转换为对象
  let city = JSON.parse(window.localStorage.getItem('local-city'))
  // 获取 定位 城市---- IP定位
  if (!city) {
    // 百度定位 是异步操作 需封装一个 Promise 来获取
    return new Promise((resolve, reject)=>{
      var myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
          var cityName = result.name
          // console.log("当前定位城市:"+cityName)
          // 根据城市名称查询该城市信息
          let { data } = await axios.get('http://api-haoke-web.itheima.net/area/info?name=' + cityName)
          
          // 将 得到的 城市信息数据 转换为 JSON 字符串  
          let location = JSON.stringify(data.body)
          // 并 将其存储到 本地存储中
          window.localStorage.setItem('local-city', location)
          resolve(data.body)
      })
    })   
  } else { // 本地 存储中 获取城市信息数据
    return Promise.resolve(city)
  }  
}