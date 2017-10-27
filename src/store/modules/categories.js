import api from '../../api/api'
import * as types from '../mutation-types'

// initial state
const state = {
  categories: [],
  subcategories: []
};

// getters
const getters = {
  categories: state => state.categories,
  subcategories: state => state.subcategories,
  subcategoriesByCategory: (state, getters) => (cat_id) => {
    return state.subcategories.filter(subcategory => subcategory.cat_id === cat_id)
  }
};

// actions
const actions = {
  getCategories ({ commit }) {
    return api.getCategories().then(response => {
      let data = response.data;
      commit(types.RECEIVE_CATEGORIES, { data })
    })
  }
};

// mutations
const mutations = {
  [types.RECEIVE_CATEGORIES] (state, { data }) {
    state.categories = data.categories;
    state.subcategories = data.subcategories;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
