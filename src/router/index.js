import Vue from 'vue'
import Router from 'vue-router'
import firstScreen from '@/components/indexRouter/firstScreen'
import createWallet from '@/components/wallet/createWallet'
import importWallet from '@/components/wallet/importWallet'
import mainScreen from '@/components/indexRouter/mainScreen'
import appDetail from '@/components/applications/appDetail'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'firstScreen',
            component: firstScreen,
            children: [
                {
                    path: '',
                    name: 'createWallet',
                    component: createWallet
                },
                {
                    path:'importWallet',
                    name:'importWallet',
                    component: importWallet
                }

            ]
        },
        {
            path: '/mainScreen',
            name: 'mainScreen',
            component: mainScreen
        },
        {
            path: '/appDetail',
            name: 'appDetail',
            component: appDetail
        }
    ]
})
