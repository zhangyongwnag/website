import Vue from 'vue'
import App from './App'
import element from 'element-ui'
import './assets/css/index.css'
import './assets/css/common.less'
import request from '@/api/request'
import router from '@/router'
import store from '@/store'
import './utils/flexible'
import importDirective from '@/directive'

Vue.config.productionTip = false

Vue.prototype.http = request

Vue.use(element)

importDirective(Vue)

new Vue({
  el: '#root',
  router,
  store,
  render: h => h(App)
})

