// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import '../theme/index.css'
import App from './App'

import router from './router'
import global from './global'

// Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(global);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

