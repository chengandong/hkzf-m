// 封装 axios 请求模块
import axios from 'axios'

const baseURL = process.env.REACT_APP_URL
const request = axios.create({
  baseURL
})

export default request