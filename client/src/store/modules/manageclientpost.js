import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  posts: [],
  post:{},
  totalItems:0,
  message:''
};

const getters = {
  allManageClientPosts: state => state.posts,
  getManageClientPostMessage: state => state.message,
  getManageClientPosttotalItems: state => state.totalItems,
  getClientPostImage: state => state.post
};

const actions = {

  async fetchManageClientPostPages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/posts/pageclient`,pageObj,apihelper.setclientToken());
      commit('setPostPages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchClientPostImages({ commit },_id) {
    try {
      const response = await axios.get(`${apihelper.api_url}/posts/getImageByPostId/${_id}`,apihelper.setclientToken());
      commit('setPost',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addManageClientPost({ commit }, postObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/posts/post`,postObj,apihelper.setclientToken());
      commit('newPost', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteManageClientPost({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/posts/delete/${_id}`,apihelper.setclientToken());
      commit('removePost', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateManageClientPost({ commit }, postObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/posts/put/${postObj._id}`,postObj,apihelper.setclientToken());
        console.log(response.data);
        commit('updateManagePostObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
      console.log(err);
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setPostPages:(state,post) => (state.posts = post),
    setPost: (state, post) => (state.post = post),
    newPost: (state, post) => {
      console.log(state.posts);
      state.posts.unshift(post)
    },
    removePost: (state, _id) =>
        (state.posts = state.posts.filter(post => post._id !== _id)),
    updateManagePostObj: (state, postObj) => {
        const index = state.posts.findIndex(post => post._id === postObj._id);
        if (index !== -1) {
        state.posts.splice(index, 1, postObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};