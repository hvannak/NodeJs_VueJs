import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  screens: [],
  localizations: [],
  constants: [],
  localLang: [],
  totalItems:0,
  message:''
};

const getters = {
  allScreen: state => state.screens,
  allLocalizations: state => state.localizations,
  allContants: state => state.constants,
  getLocalizationMessage: state => state.message,
  getLocalizationtotalItems: state => state.totalItems,
  getLocalLang: state => state.localLang,
};

const actions = {

 async fetchAllScreen({commit}){
        try {
            const response = await axios.get(`${apihelper.api_url}/router`,apihelper.setToken());
            let screnData = response.data.map(x=>({
               id: x.id,
               children: x.children.filter(y=>y.name == 'props'),
               name: x.name
            }));
            commit('setScreens',screnData);
        } catch (err) {
            commit('updateMessage',err.response.data);
        }
    },

  async fetchLocalization({ commit},_searchObj){
      try {
        const response = await axios.post(`${apihelper.api_url}/localization/getByLocal`,_searchObj,apihelper.setToken());
        commit('setLocalization',response.data);
      } catch (err) {
        commit('updateMessage',err.response.data);
      }
    },

  async fetchConstant({ commit}){
      try {
        const response = await axios.get(`${apihelper.api_url}/localization/getByConstant`,apihelper.setToken());
        commit('setConstant',response.data);
      } catch (err) {
        commit('updateMessage',err.response.data);
      }
    },

  async fetchLocalLanguage({ commit},langId){
      try {
        const response = await axios.get(`${apihelper.api_url}/localization/getByLang/${langId}`);
        commit('setLangId',response.data);
      } catch (err) {
        commit('updateMessage',err.response.data);
      }
    },

  async addLocalization({ commit }, localObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/localization/post`,localObj,apihelper.setToken());
      commit('newLocalizations', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateLocalization({ commit }, localObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/localization/put/${localObj._id}`,localObj,apihelper.setToken());
        commit('updateLocalization', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    setScreens: (state,screen) => (state.screens = screen),
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setLanguages:(state,lang) => (state.languages = lang),
    setLocalization:(state,local) => (state.localizations = local),
    setConstant:(state,cst) => (state.constants = cst),
    setLangId:(state,lang) => (state.localLang = lang),
    newLocalizations: (state, local) => state.localizations.unshift(local),
    updateLocalization: (state, localObj) => {
        const index = state.localizations.findIndex(local => local._id === localObj._id);
        if (index !== -1) {
            state.localizations.splice(index, 1, localObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};