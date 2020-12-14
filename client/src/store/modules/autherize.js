import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  router_screens:[],
  autherizes: [],
  message:''
};

const getters = {
  allRouter_Screen: state => state.router_screens,
  allAutherizes: state => state.autherizes,
  getAutherizeMessage: state => state.message,
  getAutherizetalItems: state => state.totalItems
};

const actions = {

 async fetchAllRouter_Screen({commit}){
   try {
    const response = await axios.get(`${apihelper.api_url}/router`,apihelper.config);
    commit('setRouterScreens',response.data);
   } catch (err) {
    commit('updateMessage',err.response.data);
   }
 },

  async fetchAutherizeearch({ commit},_search){
    try {
      const response = await axios.get(`${apihelper.api_url}/autherize/search/${_search}`,apihelper.config);
      commit('setAutherizeSearch',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addAutherize({ commit }, autherizeObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/autherize`,autherizeObj,apihelper.config);
      commit('newAutherize', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteAutherize({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/autherize/${_id}`,apihelper.config);
      commit('removeAutherize', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateAutherize({ commit }, autherizeObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/autherize/${autherizeObj._id}`,autherizeObj,apihelper.config);
        commit('updateAutherizeObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setAutherizeSearch:(state,autherizes) => (state.autherizes = autherizes),
    setRouterScreens:(state,routerscreen) => (state.router_screens = routerscreen),
    newAutherize: (state, autherize) => state.autherizes.unshift(autherize),
    removeAutherize: (state, _id) =>
        (state.autherizes = state.autherizes.filter(auth => auth._id !== _id)),
    updateAutherizeObj: (state, authObj) => {
        const index = state.autherizes.findIndex(auth => auth._id === authObj._id);
        if (index !== -1) {
            state.autherizes.splice(index, 1, authObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};