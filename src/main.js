import Vue from 'vue'
import App from './App.vue'
import router from './mainRouter.js'

import './css/util.css'
import './css/main.css'
import './assets/postcss/shared.postcss'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
