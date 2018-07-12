import Vue from 'vue'
import Router from 'vue-router'

import firstScreen from '@/components/indexRouter/firstScreen'
import createWallet from '@/components/wallet/createWallet'
import importWallet from '@/components/wallet/importWallet'

import mainScreen from '@/components/indexRouter/mainScreen'
import accountInfo from '@/components/accountInfo/accountInfo'
import tradeRecord from '@/components/tradeRecord/tradeRecord'
import transaction from '@/components/transaction/transaction'
import applications from '@/components/applications/appList'
import createApp from '@/components/createApp/createApp'
import myApps from '@/components/myApps/myApps'
import appInfo from '@/components/myApps/appInfo'
import assetManage from '@/components/assetManage/assetManage'
import createInterval from '@/components/createApp/createInterval'


import appDetail from '@/components/applications/appDetail'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: firstScreen,
            children: [
                {
                    path: '/',
                    redirect: 'importWallet'
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
                    path: 'accountInfo',
                    name: 'accountInfo',
                    component: accountInfo,
                },
                {
                    path: 'tradeRecord',
                    name: 'tradeRecord',
                    component: tradeRecord
                },
                {
                    path: 'transaction',
                    name: 'transaction',
                    component: transaction
                },
                {
                    path: 'applications',
                    name: 'applications',
                    component: applications
                },
                {
                    path: 'createApp',
                    name: 'createApp',
                    component: createApp
                },
                {
                    path: 'myApps',
                    name: 'myApps',
                    component: myApps
                },
                {
                    path: 'appInfo',
                    name: 'appInfo',
                    component: appInfo
                },
                {
                    path: 'assetManage',
                    name: 'assetManage',
                    component: assetManage
                },
                {
                    path: 'createInterval',
                    name: 'createInterval',
                    component: createInterval
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
