import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  sub: []
};

// getters
const getters = {
  parentCategories: state => state.all,
  getChildCategories: state => state.sub,
};

// actions
const actions = {
  getAllCategories ({ commit }) {
    return api.getCategories().then(response => {
      let data = response.data.data;
      commit(types.RECEIVE_CATEGORIES, { data })
    })
  },
  getSubCategories ({ commit }) {
    return api.getSubCategories().then(response => {
      let data = response.data.data;
      commit(types.RECEIVE_SUBCATEGORIES, { data })
    })
  }
};

// mutations
const mutations = {
  [types.RECEIVE_CATEGORIES] (state, { data }) {
    state.all = data.categories
  },
  [types.RECEIVE_SUBCATEGORIES] (state, { data }) {
    state.sub = data.subcategories
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
