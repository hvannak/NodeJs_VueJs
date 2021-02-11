import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import Role from './modules/role'
import Autherize from './modules/autherize'
import Category from './modules/category'
import ClientPost from './modules/clientpost'
import ManagePost from './modules/managepost'
import Language from './modules/language'
import Localization from './modules/localization'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    User,
    Role,
    Autherize,
    Category,
    ClientPost,
    ManagePost,
    Language,
    Localization
  }
})
