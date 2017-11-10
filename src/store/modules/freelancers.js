import Api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: []
};

// getters
const getters = {
  allFreelancers: state => state.all
};

// actions
const actions = {
  getFreelancers ({ commit }) {
    return Api.getFreelancers().then(response => {
      let data = response.data;
      commit(types.RECEIVE_FREELANCERS, { data })
    })
  }
};

// mutations
const mutations = {
  [types.RECEIVE_FREELANCERS] (state, { data }) {
    state.all = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
