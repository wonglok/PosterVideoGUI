import Vue from 'vue'
import App from './App.vue'
import router from './embedRouter'
// import store from './store'

import '../css/util.css'
import '../css/main.css'
import '../assets/postcss/shared.postcss'

Vue.config.productionTip = false

export const Canvas = ({ element = 'body' } = { element: '#app' }) => {
  let app = new Vue({
    router,
    // store,
    render: h => h(App)
  }).$mount(element)

  app.$nextTick(() => {
    app.$router.push('/')
  })

  return {
    app,
    router
  }
}

export default Canvas
