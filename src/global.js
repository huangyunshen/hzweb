//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import functions from './js/functions'
import axios from './js/api'
import {Wallet} from 'ethers'

const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:8101'))
export default {
    install(Vue, options) {
        Vue.prototype.$web3 = WEB3OBJ
        Vue.prototype.$Wallet = Wallet
        Vue.prototype.$funs = functions
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
