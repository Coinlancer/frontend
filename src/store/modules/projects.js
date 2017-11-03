import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  client: [],
  freelancer: [],
  min_budget: 0,
  max_budget: 0,
};

// getters
const getters = {
  allProjects: state => state.all,
  minBudget: state => state.min_budget,
  maxBudget: state => state.max_budget,
  clientProjects: state => state.client,
  freelancerProjects: state => state.freelancer
};

// actions
const actions = {
  getProjects ({ commit }, filters) {
    return api.getProjects(filters).then(response => {
      let data = response.data;
      commit(types.RECEIVE_PROJECTS, { data })
    })
  },
  getClientProjects ({ commit }, client_id) {
    return api.getClientProjects(client_id).then(response => {
      let data = response.data;
      commit(types.RECEIVE_CLIENT_PROJECTS, { data })
    })
  },
  getFreelancerProjects ({ commit }, freelancer_id) {
    return api.getFreelancerProjects(freelancer_id).then(response => {
      let data = response.data;
      commit(types.RECEIVE_FREELANCER_PROJECTS, { data })
    })
  },
};

// mutations
const mutations = {
  [types.RECEIVE_PROJECTS] (state, { data }) {
    state.all = data.projects;
    state.min_budget = data.min_budget;
    state.max_budget = data.max_budget;
  },
  [types.RECEIVE_CLIENT_PROJECTS] (state, { data }) {
    state.client = data;
  },
  [types.RECEIVE_FREELANCER_PROJECTS] (state, { data }) {
    state.freelancer = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
