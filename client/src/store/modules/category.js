import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  categorys: [],
  totalItems:0,
  message:''
};

const getters = {
  allCategorys: state => state.categorys,
  getCategoryMessage: state => state.message,
  getCategorytotalItems: state => state.totalItems
};

const actions = {

async fetchCategories({ commit }) {
    try {
        const response = await axios.get(`${apihelper.api_url}/category/all`,apihelper.setToken());
        commit('setCategories',response.data);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
},

  async fetchCategoryPages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/category/page`,pageObj,apihelper.setToken());
      commit('setCategoryPages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchCategorySearch({ commit},_search){
    try {
      const response = await axios.get(`${apihelper.api_url}/category/search/${_search}`,apihelper.setToken());
      commit('setCategorySearch',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addCategory({ commit }, categoryObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/category/post`,categoryObj,apihelper.setToken());
        console.log(response.data.obj);
      commit('newCategorys', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteCategory({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/category/delete/${_id}`,apihelper.setToken());
      commit('removeCategory', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateCategory({ commit }, categoryObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/category/put/${categoryObj._id}`,categoryObj,apihelper.setToken());
        commit('updateCategoryObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setCategories:(state,category) => (state.categorys = category),
    setCategoryPages:(state,category) => (state.categorys = category),
    setCategorys: (state, category) => (state.categorys = category),
    setCategorySearch:(state,category) => (category.forEach(element => {
      state.categorys.push(element)
    })),
    newCategorys: (state, category) => state.categorys.unshift(category),
    removeCategory: (state, _id) =>
        (state.categorys = state.categorys.filter(category => category._id !== _id)),
    updateCategoryObj: (state, categoryObj) => {
        const index = state.categorys.findIndex(category => category._id === categoryObj._id);
        console.log(index);
        if (index !== -1) {
        state.categorys.splice(index, 1, categoryObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};