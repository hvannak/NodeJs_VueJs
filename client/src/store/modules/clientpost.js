import axios from 'axios';
import * as apihelper from './api-helper';
import  router from '../../router';

const state = {
  posts: [],
  post:{},
  totalItems:0,
  message:'',
  waiting: false,
  searchObj: {},
  currentPage: 1,
  firstPostImage: {},
  postImages: []
};

const getters = {
  allPosts: state => state.posts,
  getPostMessage: state => state.message,
  getPosttotalItems: state => state.totalItems,
  getWaiting: state => state.waiting,
  getSearchObj: state => state.searchObj,
  getCurrentPage: state => state.currentPage,
  getFirstPostImage: state => state.firstPostImage,
  getPostImages: state => state.postImages
};

const actions = {

  async fetchPostByCat({ commit },pageObj) {
    try {
      commit('setWaiting',true);
      commit('setPostPages',[]);
       axios.post(`${apihelper.api_url}/posts/searchByCat`,pageObj).then(response => {
        for (const [index,itm] of response.data.objList.entries()) {
          axios.get(`${apihelper.api_url}/posts/getFirstImage/${itm._id}`,apihelper.setclientToken()).then(respone1 => {
              let imagedata = respone1.data.image;
              response.data.objList[index].firstimage = apihelper.readBufferImg(imagedata);
          });
        }
        commit('setPostPages',response.data.objList);
        commit('setWaiting',false);
        commit('setTotalItems',response.data.totalDoc);
      });

      router.push({ name: 'Searchdata'}).catch(() => {
        console.log('the same router');
      });
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchPostByDetails({ commit },pageObj) {
    try {
      commit('setWaiting',true);
      commit('setPostPages',[]);
       axios.post(`${apihelper.api_url}/posts/searchdetails`,pageObj).then(response => {
        for (const [index,itm] of response.data.objList.entries()) {
          axios.get(`${apihelper.api_url}/posts/getFirstImage/${itm._id}`,apihelper.setclientToken()).then(respone1 => {
              let imagedata = respone1.data.image;
              response.data.objList[index].firstimage = apihelper.readBufferImg(imagedata);
          });
        }
        commit('setPostPages',response.data.objList);
        commit('setWaiting',false);
        commit('setTotalItems',response.data.totalDoc);
      });

      router.push({ name: 'Searchdata'}).catch(() => {
        console.log('the same router');
      });
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchPostPages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/posts/page`,pageObj,apihelper.setclientToken());
      commit('setPostPages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchPostById({ commit},_postId){
    try {
      const response = await axios.get(`${apihelper.api_url}/posts/getById/${_postId}`,apihelper.setclientToken());
      commit('setPostObj',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchFirstPostImage({ commit},_postId){
    try {
      const response = await axios.get(`${apihelper.api_url}/posts/getFirstImage/${_postId}`,apihelper.setclientToken());
      commit('setPostImageObj',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchPostImage({ commit},_postId){
    try {
      commit('setPostImages',[]);
      const response = await axios.get(`${apihelper.api_url}/posts/getImageByPostId/${_postId}`,apihelper.setclientToken());
      for (const [index,item] of response.data.entries()) {
        response.data[index].image = apihelper.readBufferImg(item.image);
      }
      commit('setPostImages',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addPost({ commit }, postObj) {
    try {
      console.log(postObj);
      const response = await axios.post(
        `${apihelper.api_url}/posts/post`,postObj,apihelper.setclientToken());
      commit('newPost', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deletePost({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/posts/delete/${_id}`,apihelper.setclientToken());
      commit('removePost', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updatePost({ commit }, postObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/posts/put/${postObj._id}`,postObj,apihelper.setclientToken());
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
    setPostImageObj: (state,imgpost) => (state.firstPostImage = imgpost),
    setPostImages: (state,imgposts) => (state.postImages = imgposts),
    setWaiting: (state,wait) => (state.waiting = wait),
    newPost: (state, post) => state.posts.unshift(post),
    removePost: (state, _id) =>
        (state.posts = state.posts.filter(post => post._id !== _id)),
    updatePostObj: (state, postObj) => {
        const index = state.posts.findIndex(post => post._id === postObj._id);
        console.log(index);
        if (index !== -1) {
        state.roles.splice(index, 1, postObj);
        }
    },
    setSearchObj: (state,searchObj) => (state.searchObj = searchObj),
    setCurrentPage: (state,page) => (state.currentPage = page)
};

export default {
  state,
  getters,
  actions,
  mutations
};