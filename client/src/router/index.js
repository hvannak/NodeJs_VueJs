import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ControlPanel from '../views/ControlPanel.vue'
import Register from '../views/Register.vue'
import Account from '../views/Account.vue'
import Role from '../views/Role.vue'
import Autherize from '../views/Autherize.vue'
import Category from '../views/Category.vue'
import HelloWorld from "@/components/HelloWorld.vue";
import SearchData from "@/components/SearchData.vue";
import LoginClient from "@/components/LoginClient.vue";
import RegisterClient from "@/components/RegisterClient.vue";
import Post from "@/components/Post.vue";

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { back: false,icon: 'mdi-folder' },
      children:[{
        path: '/welcome',
        name: 'Welcome',
        meta: { back: true,icon: 'mdi-account-reactivate',group:'Front',gicon:'mdi-folder' },
        component: HelloWorld
      },
      {
        path: '/searchdata',
        name: 'Search Data',
        meta: { back: true,icon: 'mdi-cloud-search',group:'Front',gicon:'mdi-folder' },
        component: SearchData
      }, 
      {
        path: '/loginclient',
        name: 'Login Client',
        meta: { back: false,icon: 'mdi-cloud-search',group:'Front',gicon:'mdi-folder' },
        component: LoginClient
      },
      {
        path: '/registerclient',
        name: 'Register Client',
        meta: { back: false,icon: 'mdi-cloud-search',group:'Front',gicon:'mdi-folder' },
        component: RegisterClient
      },
      {
        path: '/post',
        name: 'Post',
        meta: { back: false,icon: 'mdi-cloud-search',group:'Front',gicon:'mdi-folder' },
        component: Post
      }]
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
          path: 'register',
          name: 'Register',
          meta: { back: true,icon: 'mdi-account-plus',group:'Authentication',gicon:'mdi-folder' },
          component: Register
        },
        {
          path: 'accounts',
          name: 'Accounts',
          meta: { back: true,icon: 'mdi-account-cog',group:'Authentication',gicon:'mdi-folder' },
          component: Account
        },
        {
          path: 'roles',
          name: 'Roles',
          meta: { back: true,icon: 'mdi-application-cog',group:'Authentication',gicon:'mdi-folder' },
          component: Role
        },
        {
          path: 'autherize',
          name: 'Autherize',
          meta: { back: true,icon: 'mdi-account-switch',group:'Authentication',gicon:'mdi-folder' },
          component: Autherize
        },
        {
          path: 'category',
          name: 'Category',
          meta: { back: true,icon: 'mdi-alpha-c-circle-outline',group:'Configurations',gicon:'mdi-folder' },
          component: Category
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
  // if (to.name !== 'Login' && localStorage.getItem('token') == null) {
  //   if(to.name == 'Home') next()
  //   else next({ name: 'Login' })
  // }
  // else if((to.name == 'Login' && localStorage.getItem('token') != null) || 
  // (to.name == 'Home' && localStorage.getItem('token') != null)){
  //   next({name:'ControlPanel'})
  // }
  // else next()
  if(to.name == 'Home') {
    next({name: 'Welcome'})
  }
  if((to.name == 'Login' && localStorage.getItem('token') != null)){
    next({name:'ControlPanel'});
  }
  if(to.name == 'ControlPanel' && localStorage.getItem('token') == null ){
    next({name:'Welcome'});
  }
  else next()
})

export default router
