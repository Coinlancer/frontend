import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueButtonSpinner from './components/button-spinner/VueButtonSpinner.vue';
import store from './store'
import api from './api/api'

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
import ProjectSuggestions from './components/ProjectSuggestions.vue'
import Freelancer from './components/Freelancer.vue'
import Client from './components/Client.vue'

import Design from './components/Design.vue'

//dashboard
import DashboardProjects from './components/dashboard/Projects.vue'
import DashboardWorks from './components/dashboard/Works.vue'
// import DashboardCreateProject from './components/dashboard/CreateProject.vue'
import DashboardEditProject from './components/dashboard/EditProject.vue'
import DashboardSettings from './components/dashboard/Settings.vue'

//libraries
import VueTimeago from 'vue-timeago'
import VuejsDialog from "vuejs-dialog"

import humanize from 'humanize';
Vue.prototype.$humanize = humanize;

// Install plugins
Vue.use(Router)
Vue.use(Resource)
Vue.use(Notifications)
Vue.use(Helpers)
Vue.use(Spinner)

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

Vue.use(VuejsDialog, {
  html: true,
  loader: true,
  okText: 'Proceed',
  cancelText: 'Cancel',
  animation: 'bounce',
})

//Add components
Vue.component('v-select', vSelect)
Vue.component('button-spinner', VueButtonSpinner)

const checkSessionLoaded = (to, from, next) => {
  // Vue.prototype.$spinner.push();
  function proceed () {
    if (store.state.session.account.acc_id) {
      next()
    }
  }
  if (!store.state.session.account.acc_id) {

    store.watch(
        (state) => state.session.account,
        (value) => {
          if (value.acc_id) {
            proceed()
          }
        }
    );

    return api.getAccountInfo()
        .then(resp => {
          store.dispatch('setAccountData', resp.data);
        })
        .catch((err) => {
          console.error(err);
          //session not exist or die
          return next('/login');
        })
  } else {
    proceed()
  }
};

// route config
let routes = [
  //auth
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/design',
    name: 'design',
    beforeEnter: checkSessionLoaded,
    component: Design
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/verify',
    name: 'Verify',
    beforeEnter: checkSessionLoaded,
    component: Verify
  },
  {
    path: '/projects',
    name: 'Projects',
    beforeEnter: checkSessionLoaded,
    component: Projects
  },
  {
    path: '/project/:id',
    name: 'Project',
    beforeEnter: checkSessionLoaded,
    component: Project
  },
  {
    path: '/project/:id/suggestions',
    name: 'ProjectSuggestions',
    beforeEnter: checkSessionLoaded,
    component: ProjectSuggestions
  },
  {
    path: '/freelancer/:id',
    name: 'freelancer',
    beforeEnter: checkSessionLoaded,
    component: Freelancer
  },
  {
    path: '/client/:id',
    name: 'client',
    beforeEnter: checkSessionLoaded,
    component: Client
  },
  {
    path: '/dashboard/projects',
    name: 'dashboardProjects',
    beforeEnter: checkSessionLoaded,
    component: DashboardProjects
  },
  {
    path: '/dashboard/works',
    name: 'dashboardWorks',
    beforeEnter: checkSessionLoaded,
    component: DashboardWorks
  },
  // {
  //   path: '/dashboard/projects/create',
  //   name: 'dashboardCreateProject',
  //   component: DashboardCreateProject
  // },
  {
    path: '/dashboard/projects/edit/:id',
    name: 'DashboardEditProject',
    beforeEnter: checkSessionLoaded,
    component: DashboardEditProject
  },
  {
    path: '/dashboard/settings',
    name: 'DashboardSettings',
    beforeEnter: checkSessionLoaded,
    component: DashboardSettings
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
