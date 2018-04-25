import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

const PRODUCT = 'http://39.104.81.103:8101'
const HOST = PRODUCT

axios.defaults.baseURL = HOST  // 设置请求地址，后面的接口都将基于这个基本请求地址

// 设置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios
