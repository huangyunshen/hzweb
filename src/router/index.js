import Vue from 'vue'
import Router from 'vue-router'

import firstScreen from '@/components/indexRouter/firstScreen'
import createWallet from '@/components/wallet/createWallet'
import importWallet from '@/components/wallet/importWallet'

import mainScreen from '@/components/indexRouter/mainScreen'
import accountInfo from '@/components/mainBusiness/accountInfo'


import appDetail from '@/components/applications/appDetail'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: firstScreen,
            children: [
                {
                    path: '/',
                    redirect: 'createWallet'
                },
                {
                    path: 'createWallet',
                    name: 'createWallet',
                    component: createWallet
                },
                {
                    path: 'importWallet',
                    name: 'importWallet',
                    component: importWallet
                }

            ]
        },
        {
            path: '/mainScreen',
            component: mainScreen,
            children: [
                {
                    path: '/',
                    redirect: 'accountInfo'
                },
                {
                    path: 'accountInfo',
                    name: 'accountInfo',
                    component: accountInfo
                }
            ]
        },
        {
            path: '/appDetail',
            name: 'appDetail',
            component: appDetail
        }
    ]
})
