import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  categorys: [],
  categorySearch:[],
  totalItems:0,
  message:''
};

const getters = {
  allCategorys: state => state.categorys,
  getAllCategorys: state =>state.categorySearch,
  getCategoryMessage: state => state.message,
  getCategorytotalItems: state => state.totalItems
};

const actions = {

async fetchCategoriesWithoutLang({ commit }) {
    try {
        const response = await axios.get(`${apihelper.api_url}/category/all`,apihelper.setToken());
        commit('setCategories',response.data);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
},

async fetchCategories({ commit },langId) {
    try {
        const response = await axios.get(`${apihelper.api_url}/category/getByLangId/${langId}`,apihelper.setToken());
        commit('setCategories',response.data);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
},

async fetchCategoriesLang({ commit },filter) {
  try {
      const response = await axios.get(`${apihelper.api_url}/category/getByLangId/${filter.lang}`,apihelper.setToken());
      commit('setCategories',response.data);
      commit('setAllCategories',{data: response.data,all: filter.all});
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
    setAllCategories:(state,category) => {
      state.categorySearch = [];
      category.data.forEach(element => {
        state.categorySearch.push(element);
      });
      state.categorySearch.unshift({
        _id: '-1',
        title: category.all      
      })
    },
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