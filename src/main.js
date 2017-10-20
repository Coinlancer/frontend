import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import store from './store'

//libraries
import humanize from 'humanize';
Vue.prototype.$humanize = humanize;

//plugins
import Helpers from './plugins/helpers'
import Spinner from './plugins/spinner'

import App from './components/App.vue'

//auth
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Verify from './components/auth/Verify.vue'

import Projects from './components/Projects.vue'
import Project from './components/Project.vue'
import Freelancer from './components/Freelancer.vue'
import Client from './components/Client.vue'

//dashboard
import DashboardProjects from './components/dashboard/Projects.vue'
import DashboardCreateProject from './components/dashboard/CreateProject.vue'
import DashboardEditProject from './components/dashboard/EditProject.vue'

import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

// Install plugins
Vue.use(Router)
Vue.use(Resource)
Vue.use(Notifications)
Vue.use(Helpers)
Vue.use(Spinner)

//Add components
Vue.component('v-select', vSelect)

// route config
let routes = [
  //auth
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/verify',
    name: 'verify',
    component: Verify
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects
  },
  {
    path: '/project/:id',
    name: 'project',
    component: Project
  },
  {
    path: '/freelancer/:id',
    name: 'freelancer',
    component: Freelancer
  },
  {
    path: '/client/:id',
    name: 'client',
    component: Client
  },
  {
    path: '/dashboard/projects',
    name: 'dashboardProjects',
    component: DashboardProjects
  },
  {
    path: '/dashboard/projects/create',
    name: 'dashboardCreateProject',
    component: DashboardCreateProject
  },
  {
    path: '/dashboard/projects/edit/:id',
    name: 'DashboardEditProject',
    component: DashboardEditProject
  },
  {
    path: '*',
    redirect: '/login'
  }
]

// Set up a new router
let router = new Router({
  mode: 'history',
  routes: routes
})

// Start up our app
new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
