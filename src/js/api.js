import axios from 'axios'

const PRODUCT = location.origin
const LOCAL = '/url'

axios.defaults.baseURL = LOCAL

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
