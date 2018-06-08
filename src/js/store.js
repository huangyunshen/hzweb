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
        userPassword: '',
        passwordOfPlay: '',
        balance: '0' //账户余额
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
        setPassword(state, data) {
            state.userPassword = data
        },
        setPlayPassword(state, data) {
            state.passwordOfPlay = data
        },
        setBalance(state, data) {
            state.balance = data
        }
    }
})

export default store
