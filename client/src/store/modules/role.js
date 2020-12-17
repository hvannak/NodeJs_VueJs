import axios from 'axios';
import * as apihelper from './api-helper';

const state = {
  roles: [],
  totalItems:0,
  message:''
};

const getters = {
  allRoles: state => state.roles,
  getRoleMessage: state => state.message,
  getRoletotalItems: state => state.totalItems
};

const actions = {

  async fetchRolePages({ commit },pageObj) {
    try {
      const response = await axios.post(`${apihelper.api_url}/role/page`,pageObj,apihelper.config);
      commit('setRolePages',response.data.objList);
      commit('setTotalItems',response.data.totalDoc);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async fetchRoleSearch({ commit},_search){
    try {
      const response = await axios.get(`${apihelper.api_url}/role/search/${_search}`,apihelper.config);
      commit('setRoleSearch',response.data);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async addRole({ commit }, roleObj) {
    try {
      const response = await axios.post(
        `${apihelper.api_url}/role/post`,roleObj,apihelper.config);
      commit('newRoles', response.data.obj);
      commit('updateMessage',response.data.message);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async deleteRole({ commit }, _id) {
    try {
      await axios.delete(`${apihelper.api_url}/role/delete/${_id}`,apihelper.config);
      commit('removeRole', _id);
    } catch (err) {
      commit('updateMessage',err.response.data);
    }
  },

  async updateRole({ commit }, roleObj) {
    try {
        const response = await axios.put(
        `${apihelper.api_url}/role/put/${roleObj._id}`,roleObj,apihelper.config);
        commit('updateRoleObj', response.data.obj);
        commit('updateMessage',response.data.message);
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setTotalItems:(state,total) => (state.totalItems = total),
    setRolePages:(state,role) => (state.roles = role),
    setRoles: (state, role) => (state.roles = role),
    setRoleSearch:(state,role) => (role.forEach(element => {
      state.roles.push(element)
    })),
    newRoles: (state, role) => state.roles.unshift(role),
    removeRole: (state, _id) =>
        (state.roles = state.roles.filter(role => role._id !== _id)),
    updateRoleObj: (state, roleObj) => {
        const index = state.roles.findIndex(role => role._id === roleObj._id);
        console.log(index);
        if (index !== -1) {
        state.roles.splice(index, 1, roleObj);
        }
    }
};

export default {
  state,
  getters,
  actions,
  mutations
};