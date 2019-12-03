import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'abstract',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: require('./pages/Embed.vue').default
    },
    {
      path: '/p2',
      component: require('./pages/Page2.vue').default
    }
  ]
})
