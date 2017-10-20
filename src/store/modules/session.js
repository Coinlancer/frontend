import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  user: {},
  server_time: Math.round(Date.now() / 1000)
}

// getters
const getters = {
  userData: state => state.user
}

// actions
const actions = {
  setUserData ({ commit }, userdata) {
    commit(types.SET_USER_DATA, { userdata });
  }
}

// mutations
const mutations = {
  [types.SET_USER_DATA] (state, { userdata }) {
    state.user = userdata
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
