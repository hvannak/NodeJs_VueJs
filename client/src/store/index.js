import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import Role from './modules/role'
import Autherize from './modules/autherize'
import Category from './modules/category'
import ClientPost from './modules/clientpost'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    User,
    Role,
    Autherize,
    Category,
    ClientPost
  }
})
