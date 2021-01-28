import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  languages: [],
  totalItems:0,
  message:''
};

const getters = {
  allLanguages: state => state.languages,
  getLanguageMessage: state => state.message,
  getLanguagetotalItems: state => state.totalItems
};

const actions = {

async fetchLanguages({ commit }) {
    try {
        const response = await axios.get(`${apihelper.api_url}/language/all`,apihelper.setToken());
        commit('setLanguages',response.data);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
},

  async fetchLanguagePages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/language/page`,pageObj,apihelper.setToken());
      commit('setLanguagePages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addLanguage({ commit }, langObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/language/post`,langObj,apihelper.setToken());
        console.log(response.data.obj);
      commit('newLanguages', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteLanguage({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/language/delete/${_id}`,apihelper.setToken());
      commit('removeLanguage', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateLanguage({ commit }, langObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/language/put/${langObj._id}`,langObj,apihelper.setToken());
        commit('updateLanguage', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setLanguages:(state,lang) => (state.languages = lang),
    setLanguagePages:(state,lang) => (state.languages = lang),
    newLanguages: (state, lang) => state.languages.unshift(lang),
    removeLanguage: (state, _id) =>
        (state.languages = state.languages.filter(lang => lang._id !== _id)),
    updateLanguage: (state, langObj) => {
        const index = state.categorys.findIndex(lang => lang._id === langObj._id);
        if (index !== -1) {
        state.categorys.splice(index, 1, langObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};