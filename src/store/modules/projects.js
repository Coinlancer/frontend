import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  account: []
};

// getters
const getters = {
  allProjects: state => state.all,
  clientProjects: state => state.account
};

// actions
const actions = {
  getAllProjects ({ commit }) {
    return api.getProjects().then(response => {
      let data = response.data.data;
      commit(types.RECEIVE_PROJECTS, { data })
    })
  },
  getClientProjects ({ commit }, client_id) {
    return api.getClientProjects(client_id).then(response => {
      console.log(response);
      let data = response.data.data;
      commit(types.RECEIVE_ACCOUNT_PROJECTS, { data })
    })
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PROJECTS] (state, { data }) {
    state.all = data.projects
  },
  [types.RECEIVE_ACCOUNT_PROJECTS] (state, { data }) {
    state.account = data
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
