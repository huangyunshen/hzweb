// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import '../theme/index.css'
import App from './App'
import store from './js/store'
import router from './router'
import global from './global'

Vue.use(ElementUI)
Vue.use(global)

/*  i18n  */
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale:'zh-CN',
    messages:{
        'zh-CN':require('./common/lang/zh-CN'),
        'zh-TW':require('./common/lang/zh-TW'),
        'en-US':require('./common/lang/en-US'),
    }
})

Vue.config.productionTip = false

//单位过滤器
Vue.filter('amountUnit',function (value) {
    if(!value) return '0 FOF'
    return value.toString() + ' FOF'
})

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: {App},
    template: '<App/>'
})

