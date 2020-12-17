import axios from 'axios';
import * as apihelper from './api-helper';
import jwt_decode from "jwt-decode";

const state = {
  users: [],
  user:{},
  totalItems:0,
  message:''
};

const getters = {
  allUsers: state => state.users,
  getUser: state => state.user,
  getMessage: state => state.message,
  gettotalItems: state => state.totalItems
};

const actions = {
  async fetchUsers({ commit }) {
    try {
      const response = await axios.get(`${apihelper.api_url}/user/all`,apihelper.config);
      commit('setUsers',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchUser({ commit }) {
    try {
      var decoded = jwt_decode(localStorage.getItem("token"));
      const response = await axios.get(`${apihelper.api_url}/user/getById/${decoded._id}`,apihelper.config);
      commit('setUser',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchUserPages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/user/page`,pageObj,apihelper.config);
      commit('setUserPages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchUserSearch({ commit},_search){
    try {
      const response = await axios.get(`${apihelper.api_url}/user/search/${_search}`,apihelper.config);
      commit('setUserSearch',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addUser({ commit }, userObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/user/post`,userObj,apihelper.config);
      commit('newUsers', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteUser({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/user/delete/${_id}`,apihelper.config);
      commit('removeUser', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateUser({ commit }, userObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/user/${userObj._id}`,userObj,apihelper.config);
        commit('updateUserObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setUserPages:(state,user) => (state.users = user),
    setUsers: (state, user) => (state.users = user),
    setUser: (state, user) => (state.user = user),
    setUserSearch:(state,user) => (user.forEach(element => {
      state.users.push(element)
    })),
    newUsers: (state, user) => state.users.unshift(user),
    removeUser: (state, _id) =>
        (state.users = state.users.filter(user => user._id !== _id)),
    updateUserObj: (state, userObj) => {
        const index = state.users.findIndex(user => user._id === userObj._id);
        console.log(index);
        if (index !== -1) {
        state.users.splice(index, 1, userObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};