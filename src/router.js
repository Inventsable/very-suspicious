import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/keypad',
      name: 'codes',
      component: () => import('./components/touchpad.vue')
    },
    {
      path: '/screen',
      name: 'screen',
      component: () => import('./views/screen.vue')
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('./views/graph.vue')
    },
    {
      path: '/chat',
      name: 'messages',
      // beforeEnter: (to, from, next) => {
      //   // ...

      // },
      component: () => import('./views/messages.vue')
    },
    {
      path: '/link',
      name: 'link',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/About.vue')
    }
  ]
})



export default router