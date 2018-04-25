//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import verify from './js/verify'
import axios from './js/api'

export default {
    install(Vue, options) {
        Vue.prototype.$web3 = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:8101'))
        Vue.prototype.$verify = verify
        Vue.prototype.$msg = msg
        Vue.prototype.$axios = (data) => {
            if (typeof data === "object") {
                return axios({
                    method: 'POST',
                    url: '/',
                    data: {"jsonrpc": "2.0", "method": data.method, "params": data.params, "id": data.id},
                })
            } else {
                alert('参数不是对象')
            }
        }
    }
}
