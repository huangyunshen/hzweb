//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import {Wallet} from 'ethers'
import axios from './js/api'
import $router from "./router"
import $store from './js/store'

const HOST = 'ws://39.104.81.103:8561'
// const HOST = 'http://127.0.0.1:7545'
// const HOST = 'ws://192.168.1.107:8562'
// const HOST = 'ws://192.168.1.124:8561'
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

            // linkToFirstScreenRep() {     //转到登录 / replace模式
            //     $router.replace({name: 'importWallet'})
            // },

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
                    $router.replace({name: 'importWallet'})
                    return false
                }
            },
            loadWallet(pwd) {
                return WEB3OBJ.eth.accounts.wallet.load(pwd)
            },
            loadActivWallet() {
                let wallet = this.getActiveAccount()
                this.getBalance()
                $store.commit('setLock', false)
                $store.commit('setAddress', wallet.address)
            },
            setActiveAccount(index) {
                localStorage.setItem('active_account', index)
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
                let privateKey = this.getActiveAccount().privateKey
                let myWallet = new Wallet(privateKey)
                return myWallet.encrypt(this.getActiveAccountPwd())
            },
            /**
             * 上传KeyStore
             */
            uploadKeyStore() {
                return new Promise((resolve, reject) => {
                    this.getKeyStore().then((data) => {
                        let ts = new Date()
                        let name = ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', this.getActiveAccount().address.toString('hex')].join('')
                        // console.log(this.getActiveAccount().address)
                        // return false
                        axios.post('http://39.104.81.103:8551', {
                            "jsonrpc": "2.0",
                            "method": "eth_uploadkeyfile",
                            "params": [name, data],
                            "id": 1
                        }).then((res) => {
                            if (res.status === 200) {
                                if (res.data.id === 1) {
                                    // this.unlockAccount()
                                    resolve(true)
                                }
                            }
                        }).catch((error) => {
                            console.log(error)
                        })
                    })
                })
            },
            /**
             * 解锁
             */
            unlockAccount() {
                return new Promise((resolve, reject) => {
                    WEB3OBJ.eth.personal.unlockAccount(this.getActiveAccount().address, this.getActiveAccountPwd(), (error, res) => {
                        // Returned error: no key for given address or file             没有keystore
                        // Returned error: could not decrypt key with given passphrase  密码错误
                        if (error) {
                            // 没有keystore
                            if (error.message.indexOf('file') !== -1) {
                                this.uploadKeyStore().then((flag) => {
                                    if (flag) {
                                        WEB3OBJ.eth.personal.unlockAccount(this.getActiveAccount().address, this.getActiveAccountPwd(), (error, res) => {
                                            resolve(res)
                                            reject(error)
                                        })
                                    }
                                })
                            } else {
                                // 密码错误
                                reject(error.message)
                            }
                        }
                        if (res) {
                            resolve(res)
                        }
                    })
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
