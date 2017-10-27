import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  account: {},
  server_time: Math.round(Date.now() / 1000)
}

// getters
const getters = {
  accountData: state => state.account
}

// actions
const actions = {
  setAccountData ({ commit }, account_data) {
    commit(types.SET_ACCOUNT_DATA, { account_data });
  }
}

// mutations
const mutations = {
  [types.SET_ACCOUNT_DATA] (state, { account_data }) {
    state.account = account_data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
