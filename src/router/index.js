import Vue from 'vue'
import Router from 'vue-router'
const Hello = r => require.ensure([], () => r(require('../components/Hello')), 'hello')
const Update = r => require.ensure([], () => r(require('../components/Update')), 'update')
const Calc = r => require.ensure([], () => r(require('../components/Calc')), 'calc')
const Nothing = r => require.ensure([], () => r(require('../components/Nothing')), 'nothing')
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
    },
    {
      path: '/nothing',
      name: 'nothing',
      component: Nothing
    }
  ]
})
