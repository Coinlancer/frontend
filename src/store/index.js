import Vue from 'vue'
import Vuex from 'vuex'
import projects from './modules/projects'
import skills from './modules/skills'
import categories from './modules/categories'
import session from './modules/session'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    projects,
    skills,
    categories,
    session
  },
  strict: debug
})
