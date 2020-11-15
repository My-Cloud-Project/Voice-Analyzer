import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Welcome'
import Play from '../components/Play'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },{
    path: '/play',
    name: 'Play',
    component: Play
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
