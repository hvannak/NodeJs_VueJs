import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  posts: [],
  post:{},
  totalItems:0,
  message:''
};

const getters = {
  allManagePosts: state => state.posts,
  getManagePostMessage: state => state.message,
  getManagePosttotalItems: state => state.totalItems,
};

const actions = {

  async fetchManagePostPages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/posts/page`,pageObj,apihelper.setToken());
      commit('setPostPages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addManagePost({ commit }, postObj) {
    try {
      console.log(postObj);
      const response = await axios.post(
        `${apihelper.api_url}/posts/post`,postObj,apihelper.setToken());
      commit('newPost', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteManagePost({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/posts/delete/${_id}`,apihelper.setToken());
      commit('removePost', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateManagePost({ commit }, postObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/posts/put/${postObj._id}`,postObj,apihelper.setToken());
        commit('updatePostObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setPostPages:(state,post) => (state.posts = post),
    setPostObj: (state, role) => (state.role = role),
    newPost: (state, post) => state.posts.unshift(post),
    removePost: (state, _id) =>
        (state.posts = state.posts.filter(post => post._id !== _id)),
    updatePostObj: (state, postObj) => {
        const index = state.posts.findIndex(post => post._id === postObj._id);
        console.log(index);
        if (index !== -1) {
        state.roles.splice(index, 1, postObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};