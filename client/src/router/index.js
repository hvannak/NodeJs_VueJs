import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ControlPanel from '../views/ControlPanel.vue'
import Account from '../views/Account.vue'
import Role from '../views/Role.vue'
import Autherize from '../views/Autherize.vue'
import Category from '../views/Category.vue'
import Language from '../views/Language.vue'
import ManagePost from '../views/ManagePost.vue'
import Localization from '../views/Localization.vue'
import HelloWorld from "@/components/HelloWorld.vue";
import SearchData from "@/components/SearchData.vue";
import LoginClient from "@/components/LoginClient.vue";
import RegisterClient from "@/components/RegisterClient.vue";
import Post from "@/components/Post.vue";
import ManageClientPost from "@/components/ManageClientPost.vue";

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
        name: 'Searchdata',
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
      },
      {
        path: '/manageclientpost',
        name: 'Manage Client Post',
        meta: { back: false,icon: 'mdi-cloud-search',group:'Front',gicon:'mdi-folder' },
        component: ManageClientPost
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
          path: 'managepost',
          name: 'Manage Post',
          meta: { back: true,icon: 'mdi-account-cog',group:'Work Area',gicon:'mdi-folder' },
          component: ManagePost
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
        },
        {
          path: 'language',
          name: 'Language',
          meta: { back: true,icon: 'mdi-alpha-c-circle-outline',group:'Configurations',gicon:'mdi-folder' },
          component: Language
        },
        {
          path: 'localization',
          name: 'Localization',
          meta: { back: true,icon: 'mdi-alpha-c-circle-outline',group:'Configurations',gicon:'mdi-folder' },
          component: Localization
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
  if(to.name == 'Home') {
    next({name: 'Welcome'})
  }
  if((to.name == 'Login' && localStorage.getItem('token') != null)){
    next({name:'ControlPanel'});
  }
  if(to.fullPath.startsWith('/controlpanel') && localStorage.getItem('token') == null ){
    next({name:'Welcome'});
  }
  else next()
});

export default router
