import axios from 'axios'

const HOST = 'http://39.104.81.103:8088'

axios.defaults.baseURL = HOST  // 设置请求地址，后面的接口都将基于这个基本请求地址

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
