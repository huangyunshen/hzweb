import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        gasPrice: 41, // 保存gasPrice
        address: '', // 保存账户地址
        privKey:'',
        mnemonic:'',
        cryptPercent: {      //loading modal
            percent: false,
            text: ''
        },
        userPassword: '',
        passwordOfPlay: '',
        balance: '0', //账户余额
        isLock:true,
    },
    mutations: {
        setGasPrice(state, data) {
            state.gasPrice = data
        },
        setAddress(state, data) {
            state.address = data
        },
        setPrivKey(state, data) {
            state.privKey = data
        },
        setMnemonic(state, data) {
            state.mnemonic = data
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
        },
        setLock(state, data) {
            state.isLock = data
        }
    }
})

export default store
