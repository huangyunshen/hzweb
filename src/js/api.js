import axios from 'axios'

const HOST = 'http://39.104.81.103:8088'

// axios.defaults.baseURL = HOST

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
