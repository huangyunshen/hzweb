//全局变量和全局方法中间件；
import Web3 from 'web3'
import msg from './js/message'
import {Wallet} from 'ethers'
import axios from './js/api'
import $router from "./router";

const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://39.104.81.103:8101'))
// const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://192.168.1.135:8553'))
// const WEB3OBJ = new Web3(new Web3.providers.HttpProvider('http://192.168.1.124:8551'))
export default {
    install(Vue, options) {
        Vue.prototype.$web3 = WEB3OBJ
        Vue.prototype.$Wallet = Wallet
        Vue.prototype.$msg = msg
        Vue.prototype.$axios = axios
        Vue.prototype.$funs = {
            validatePwd(rule, value, callback) {     //验证创建钱包的密码强度
                // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)\w{8,}$/g;
                if (value) {
                    if (value.trim().length<9) {
                        return callback(new Error(msg.createPwd));
                    } else {
                        return callback()
                    }
                }
            },
            validateFloatNum(num){      //验证浮点数
                let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/g
                return reg.test(num)
            },
            validateIntNum(num){      //验证正整数
                let reg = /^\d*[1-9]+\d*$/g
                return reg.test(num)
            },
            onlyEnterNum(n){
                console.log(n);
                let reg = /^[1-9]+\d*$/g
                return n.replace(reg,'')
            },

            linkToFirstScreenRep(){     //转到登录 / replace模式
                $router.replace({name: 'importWallet'})
            },

            linkToMainScreenRep(params){     //转到主页面 / replace模式
                if(params && (typeof params !=='object')){
                    return new Error('Param Error')
                }
                params = params ? params : {}
                $router.replace({name: 'accountInfo',params: params})
            },


            getLocalAddress(){
                let json = localStorage.getItem('userAddress')
                if(json){
                    return JSON.parse(json)
                } else {
                    return null
                }
            },
            setLocalAddress(wallet){
                let obj = localStorage.getItem('userAddress')
                if (obj) {
                    obj = JSON.parse(obj)
                }
                let addresses = obj ? obj.addresses : []
                let index = addresses.indexOf(wallet.address)
                if (index === -1) {
                    index = obj ? addresses.length : 0
                    addresses.push(wallet.address)
                }
                obj = {active: index, addresses: addresses}
                localStorage.setItem('userAddress',JSON.stringify(obj))
            },
            getBalanceByWei(addr){        //获取余额 bywei
                if (addr) {
                    let balance = WEB3OBJ.eth.getBalance(addr, 'latest').toJSON()
                    return Number(balance)
                } else {
                    return callback(new Error(msg.invalidBalanceAddr));
                }
            },
            getBalance(addr){        //获取余额 fromwei
                let balance = this.getBalanceByWei(addr)
                balance = WEB3OBJ.fromWei(balance, 'ether')
                return Number(balance)
            }
        }
    }
}
