//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import functions from './js/functions'
import {Wallet} from 'ethers'
import axios from './js/api'

// const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:8101'))
const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://192.168.1.124:8101'))
export default {
    install(Vue, options) {
        Vue.prototype.$web3 = WEB3OBJ
        Vue.prototype.$Wallet = Wallet
        Vue.prototype.$funs = functions
        Vue.prototype.$msg = msg
        Vue.prototype.$axios = axios
    }
}
