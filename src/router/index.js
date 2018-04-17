import Vue from 'vue'
import Router from 'vue-router'
import createWallet from '@/components/createWallet'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'createWallet',
      components: {
        default:createWallet,
      }
    }
  ]
})
