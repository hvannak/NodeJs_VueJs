import axios from 'axios';

const state = {
  users: [],
  message:''
};

const getters = {
  allUsers: state => state.users,
  getMessage: state => state.message
};

const actions = {
  async fetchUsers({ commit }) {
    let token = localStorage.getItem('token');
    if(token != null){
      const config = {
        headers: { 
            'auth-token': token,
            Accept: 'application/json'
          }
      };
      const response = await axios.get('http://localhost:3000/api/user',config);
      console.log(response.data);
      commit('setUsers',response.data);
    }
  },
  async addTodo({ commit }, title) {
    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/todos',
      { title, completed: false }
    );

    commit('newTodo', response.data);
  },
  async deleteUser({ commit }, _id) {
    let token = localStorage.getItem('token');
    if(token != null){
      const config = {
        headers: { 
            'auth-token': token,
            Accept: 'application/json'
          }
      };
      await axios.delete(`http://localhost:3000/api/user/${_id}`,config);
      commit('removeUser', _id);
    }
  },
  async filterTodos({ commit }, e) {
    // Get selected number
    const limit = parseInt(
      e.target.options[e.target.options.selectedIndex].innerText
    );

    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`
    );

    commit('setTodos', response.data);
  },

  async updateUser({ commit }, userObj) {
    try {
        let token = localStorage.getItem('token');
        if(token != null){
            const config = {
                headers: { 
                    'auth-token': token,
                    Accept: 'application/json'
                }
            };
            const response = await axios.put(
            `http://localhost:3000/api/user/${userObj._id}`,userObj,config);
            commit('updateUserObj', response.data);
        }
    } catch (err) {
        commit('updateMessage',err.response.data);
    }
  }
};

const mutations = {
    updateMessage:(state,message) => (state.message = message),
    setUsers: (state, users) => (state.users = users),
    newTodo: (state, todo) => state.todos.unshift(todo),
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