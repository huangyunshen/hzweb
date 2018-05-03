import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        gasPrice: 41, // 保存gasPrice
        publicKey: '', // 保存公钥
        privateKey: '', // 保存私钥
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
    }
})

export default store
