import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        gasPrice: 41, // 保存登录用户信息
    },
    mutations: {
        setGasPrice(state, data) {
            state.gasPrice = data
        }
    }
})

export default store
