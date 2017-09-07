import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Update from '@/components/Update'
import Calc from '@/components/Calc'
import init from '../utils/init'
console.log('----------------init=', init)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/hello'
    },
    {
      path: '/update',
      name: 'Update',
      component: Update
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/calc',
      name: 'Calc',
      component: Calc
    }
  ]
})
