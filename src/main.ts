import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'github-markdown-css'

import './assets/styles/main.scss'
import './assets/styles/main-dark.scss'
import { initColorMode } from './store/util/common'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('numberWithCommas', function (num: number) {
  if (!num) return ''
  return num.toLocaleString('en-US')
})

initColorMode('', true)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
