import Vue from 'vue'
import Router from 'vue-router'
import createWallet from '@/components/createWallet'
import listContent from '@/components/listContent'
import appDetail from '@/components/applications/appDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
    },
    {
      path: '/appDetail',
      name:'appDetail',
      component:appDetail
    }
  ]
})
