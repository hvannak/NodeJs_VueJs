import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import Role from './modules/role'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    User,
    Role
  }
})
