import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ControlPanel from '../views/ControlPanel.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Role from '../views/Role.vue'
import Autherize from '../views/Autherize.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { back: false,icon: 'mdi-folder' },
      children:[]
    },
    {
      path: '/login',
      name: 'Login',
      meta: { back: false,icon: 'mdi-folder'},
      component: Login,
      children:[],
    },
    {
      path: '/controlpanel',
      name: 'ControlPanel',
      meta: { back: true,icon: 'mdi-folder' },
      component: ControlPanel,
      children:[
        {
          // Register will be rendered inside User's <router-view>
          // when /users/register is matched
          path: 'register',
          name: 'Register',
          meta: { back: true,icon: 'mdi-account-plus',group:'Users',gicon:'mdi-folder' },
          component: Register
        },
        {
          path: 'accounts',
          name: 'Accounts',
          meta: { back: true,icon: 'mdi-account-cog',group:'Users',gicon:'mdi-folder' },
          component: Account
        },
        {
          path: 'roles',
          name: 'Roles',
          meta: { back: true,icon: 'mdi-application-cog',group:'Users',gicon:'mdi-folder' },
          component: Role
        },
        {
          path: 'autherize',
          name: 'Autherize',
          meta: { back: true,icon: 'mdi-account-switch',group:'Users',gicon:'mdi-folder' },
          component: Autherize
        }
      ],
    },
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && localStorage.getItem('token') == null) {
    if(to.name == 'Home') next()
    else next({ name: 'Login' })
  }
  else if((to.name == 'Login' && localStorage.getItem('token') != null) || 
  (to.name == 'Home' && localStorage.getItem('token') != null)){
    next({name:'ControlPanel'})
  }
  else next()
})

export default router
