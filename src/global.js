//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import verify from './js/verify'
import axios from './js/api'

const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:8101'))
export default {
    install(Vue, options) {
        Vue.prototype.$web3 = WEB3OBJ
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
        Vue.prototype.$unlock = {
            /**
             * 私钥解锁
             */
            privateKeyUnlock() {

            },
            /**
             * 钱包文件解锁
             */
            keyStoreUnlock() {

            },
            /**
             * 助记词解锁
             */
            mnemonicUnlock() {

            },
            /**
             * 公钥地址解锁
             */
            publicKeyUnlock(address, pwd) {
                try {
                    let key = WEB3OBJ.personal.unlockAccount(address, pwd)
                    if (key === true) {
                        sessionStorage.setItem('publicKey', address)
                        return true
                    } else {
                        return false
                    }
                } catch (e) {
                    return false
                }
            }
        }
    }
}
