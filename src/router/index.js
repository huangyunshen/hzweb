import Vue from 'vue'
import Router from 'vue-router'
import createWallet from '@/components/createWallet'
import listContent from '@/components/listContent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'createWallet',
      component:createWallet
    },
    {
      path: '/listContent',
      name:'listContent',
      component:listContent
    }
  ]
})
