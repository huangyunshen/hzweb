import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        gasPrice: 41, // 保存gasPrice
        address: '', // 保存账户地址
        cryptPercent: {      //loading modal
            percent: false,
            text: ''
        },
        balance: '0', //账户余额
        isLock:true,
        appInfo:null
    },
    mutations: {
        setGasPrice(state, data) {
            state.gasPrice = data
        },
        setAddress(state, data) {
            state.address = data
        },
        setCryptPercent(state, data) {
            state.cryptPercent.percent = data.percent
            state.cryptPercent.text = data.text
        },
        setBalance(state, data) {
            state.balance = data
        },
        setLock(state, data) {
            state.isLock = data
        },
        setAppInfo(state, data){
            state.appInfo = data
        }
    }
})

export default store
