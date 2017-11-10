import Api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allSkills: state => state.all
}

// actions
const actions = {
  getAllSkills ({ commit }) {
    return Api.getSkills().then(response => {
      let data = response.data;
      commit(types.RECEIVE_SKILLS, { data })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_SKILLS] (state, { data }) {
    state.all = data.skills
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
