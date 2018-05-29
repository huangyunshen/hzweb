import axios from 'axios'

const PRODUCT = 'http://39.104.81.103:8080'
const TEST = 'http://120.79.88.105'
const LOCAL = '/url'

const HOST = TEST

axios.defaults.baseURL = HOST

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
