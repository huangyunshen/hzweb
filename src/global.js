//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import {Wallet} from 'ethers'
import axios from './js/api'
import $router from "./router"
import $store from './js/store'

const HOST = 'http://39.104.81.103:8101'
// const HOST = 'http://127.0.0.1:7545'
const WEB3OBJ = new Web3(HOST)

export default {
    install(Vue, options) {
        Vue.prototype.$web3 = WEB3OBJ
        Vue.prototype.$Wallet = Wallet
        Vue.prototype.$msg = msg
        Vue.prototype.$axios = axios
        Vue.prototype.$funs = {
            validatePwd(rule, value, callback) {     //验证创建钱包的密码强度
                if (value) {
                    if (value.trim().length < 9) {
                        return callback(new Error(msg.createPwd))
                    } else {
                        return callback()
                    }
                }
            },
            validateFloatNum(num) {      //验证浮点数
                let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/g
                return reg.test(num)
            },
            validateIntNum(num) {      //验证正整数
                let reg = /^\d*[1-9]+\d*$/g
                return reg.test(num)
            },
            onlyEnterNum(n) {
                let reg = /^[1-9]+\d*$/g
                return n.replace(reg, '')
            },

            linkToFirstScreenRep() {     //转到登录 / replace模式
                $router.replace({name: 'importWallet'})
            },

            // linkToMainScreenRep() {     //转到主页面 / replace模式
            //     if(!this.ifWalletExist()){
            //         return
            //     }
            //     $router.replace({name: 'accountInfo'})
            // },
            ifWalletExist() {
                let walletJSON = localStorage.getItem('web3js_wallet')
                if (walletJSON) {
                    return walletJSON
                } else {
                    $router.replace({name: 'createWallet'})
                    return false
                }
            },
            loadWallet(pwd) {
                return WEB3OBJ.eth.accounts.wallet.load(pwd)
            },
            loadActivWallet(){
                let wallet = this.getActiveAccount()
                this.getBalance()
                $store.commit('setPrivKey', wallet.privateKey)
                $store.commit('setLock',false)
                $store.commit('setAddress', wallet.address)
            },
            setActiveAccount(index){
                localStorage.setItem('active_account',index)
            },
            getActiveAccount() {
                let wallet = WEB3OBJ.eth.accounts.wallet
                let index = localStorage.getItem('active_account')
                let activeAccount = wallet[index] || new Error('Wallet Is Locked')
                return activeAccount
            },
            /**
             * 截取当前活动账户的私钥最后9位为密码
             */
            getActiveAccountPwd() {
                let privateKey = this.getActiveAccount().privateKey
                return privateKey.substring(privateKey.length - 9)
            },
            /**
             * 得到KeyStore文件的字符串
             */
            getKeyStore() {
                return this.getActiveAccount().encrypt(this.getActiveAccount().privateKey, this.getActiveAccountPwd())
            },
            /**
             * 上传KeyStore
             */
            uploadKeyStore(){
                console.log(this.getKeyStore())
                return
                axios.post('http://39.104.81.103:8101', {
                    "jsonrpc": "2.0",
                    "method": "eth_uploadkeyfile",
                    "params": this.getKeyStore(),
                    "id": 1
                }).then((res) => {
                    console.log(res)
                }).catch((error) => {
                    console.log(error)
                })
            },
            getAddress() {
                let addr = this.getActiveAccount().address
                if (WEB3OBJ.utils.isAddress(addr)) {
                    $store.commit('setAddress', addr)
                    return addr
                }
            },
            getBalanceByWei(callback) {        //获取余额 bywei
                let addr = this.getActiveAccount().address
                if (addr) {
                    WEB3OBJ.eth.getBalance(addr).then((balance) => {
                        if (callback)
                            callback(balance)
                    })
                } else {
                    return callback(new Error(msg.invalidBalanceAddr))
                }
            },
            getBalance(callback) {        //获取余额 fromwei
                this.getBalanceByWei((balance) => {
                    if (typeof balance === 'string') {
                        balance = WEB3OBJ.utils.fromWei(balance, 'ether')
                        $store.commit('setBalance', balance)
                    } else {
                        $store.commit('setBalance', '0')
                    }
                    if (callback)
                        callback(balance)
                })
            }
        }
    }
}
