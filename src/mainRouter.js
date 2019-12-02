import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: require('./pv/pages/Sensation.vue').default
    },
    {
      path: '/nova',
      component: require('./pv/pages/Landing.vue').default
    },
    {
      path: '/about',
      component: () => import(/* webpackChunkName: "about" */ './pv/pages/About.vue')
    }
  ]
})
