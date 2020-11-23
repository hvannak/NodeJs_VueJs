import axios from 'axios';

const state = {
    users:[]
};
const getters = {
    allUsers: state => state.users
};
const actions = {
    async fetchUsers({commit}){
        try {
            let token = localStorage.getItem('token');
            if(token != null){
              const config = {
                headers: { 
                    'auth-token': token,
                    Accept: 'application/json'
                  }
              };
              const response = await axios.get('http://localhost:3000/api/user',config);
              commit('setUsers',response.data);
            }
        } catch (error) {
            console.log('message');
        }
    }
};
const mutations = {
    setUsers: (state,users) => (state.users = users)
};


export default {
    state,
    getters,
    actions,
    mutations
}