import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeRouter from './module/main'

Vue.use(VueRouter)

const routes = [
  ...HomeRouter,
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
