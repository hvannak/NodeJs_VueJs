import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  users: [],
  totalItems:0,
  message:''
};

const getters = {
  allUsers: state => state.users,
  getMessage: state => state.message,
  gettotalItems: state => state.totalItems
};

const actions = {
  async fetchUsers({ commit }) {
      const response = await axios.get(`${apihelper.api_url}/user`,apihelper.config);
      commit('setUsers',response.data);
  },

  async fetchUserPages({ commit },pageObj) {
    const response = await axios.post(`${apihelper.api_url}/user/page`,pageObj,apihelper.config);
    commit('setUserPages',response.data.objList);
    commit('setTotalItems',response.data.totalDoc);
  },

  async fetchUserSearch({ commit},_search){
    const response = await axios.get(`${apihelper.api_url}/user/search/${_search}`,apihelper.config);
    commit('setUserSearch',response.data);
  },

  async addUser({ commit }, userObj) {
    const response = await axios.post(
      `${apihelper.api_url}/user`,userObj,apihelper.config);
    commit('newUsers', response.data.obj);
    commit('updateMessage',response.data.message);
  },

  async deleteUser({ commit }, _id) {
      await axios.delete(`${apihelper.api_url}/user/${_id}`,apihelper.config);
      commit('removeUser', _id);
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
    setUserSearch:(state,user) => (state.users = user),
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