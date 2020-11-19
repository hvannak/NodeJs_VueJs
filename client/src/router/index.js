import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ControlPanel from '../views/ControlPanel.vue'
import Users from '../views/Users.vue'
import Register from '../views/Register.vue'

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
    children:[],
    component: Login
  },
  {
    path: '/controlpanel',
    name: 'ControlPanel',
    meta: { back: false,icon: 'mdi-folder' },
    children:[],
    component: ControlPanel
  },
  {
    path: '/about',
    name: 'About',
    meta: { back: true,icon: 'mdi-information-outline' },
    children:[],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '/users', component: Users,
    name: 'Users',
    meta: { back: true,icon: 'mdi-account-group' },
    children: [
        {
          // UserPosts will be rendered inside User's <router-view>
          // when /users/register is matched
          path: 'register',
          name: 'Register',
          meta: { back: true,icon: 'mdi-account-plus' },
          component: Register
        }
      ]
    }
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
