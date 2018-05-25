import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        gasPrice: 41, // 保存gasPrice
        publicKey: '', // 保存公钥
        privateKey: '', // 保存私钥
        mnemonic:'', // 保存助记词
        cryptPercent: {      //创建或解锁账户进行中
            percent: false,
            text: ''
        },
        userPassword: '',
        passwordOfPlay: ''
    },
    mutations: {
        setGasPrice(state, data) {
            state.gasPrice = data
        },
        setPublicKey(state, data) {
            state.publicKey = data
        },
        setPrivateKey(state, data) {
            state.privateKey = data
        },
        setMnemonic(state, data){
            state.mnemonic = data
        },
        setCryptPercent(state, data){
            state.cryptPercent.percent = data.percent
            state.cryptPercent.text = data.text
        },
        setPassword(state, data){
            state.userPassword = data
        },
        setPlayPassword(state, data){
            state.passwordOfPlay = data
        },
    }
})

export default store
