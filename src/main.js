import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueButtonSpinner from './components/button-spinner/VueButtonSpinner.vue';
import myDatepicker from 'vue-datepicker'
import store from './store'
import api from './api/api'

//plugins
import Helpers from './plugins/helpers'
import Spinner from './plugins/spinner'

import App from './components/App.vue'

//auth
import Login from './components/auth/Login.vue'
import Logout from './components/auth/Logout.vue'
import Register from './components/auth/Register.vue'
import Verify from './components/auth/Verify.vue'

import Projects from './components/Projects.vue'
import Freelancers from './components/Freelancers.vue'
import Project from './components/Project.vue'
import ProjectSuggestions from './components/ProjectSuggestions.vue'
import Freelancer from './components/Freelancer.vue'
import Client from './components/Client.vue'

import Design from './components/Design.vue'

//dashboard
import DashboardProjects from './components/dashboard/Projects.vue'
import DashboardWorks from './components/dashboard/Works.vue'
import DashboardSuggestions from './components/dashboard/Suggestions.vue'
import DashboardFinances from './components/dashboard/Finances.vue'
import DashboardProfile from './components/dashboard/ProfileSettings.vue'
// import DashboardCreateProject from './components/dashboard/CreateProject.vue'
import DashboardEditProject from './components/dashboard/EditProject.vue'
import DashboardSettings from './components/dashboard/Settings.vue'

//libraries
import VueTimeago from 'vue-timeago'
import VuejsDialog from "vuejs-dialog"

import humanize from 'humanize';
Vue.prototype.$humanize = humanize;

//CONSTS
// const MAX_FILE_SIZE_IN_BYTES = 10 * 1024 * 1024; //10MB
const MAX_FILE_SIZE_IN_BYTES = 1024; //10MB

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
Vue.component('date-picker', myDatepicker)

//allow routes
let allow_routes_name = [
  'Project',
  'Projects',
  'Freelancer',
  'Freelancers',
];

//need for routes that are able only for registered users
const checkSessionLoaded = (to, from, next) => {
  //temp hack
  $('.rmd-backdrop--dark').click();
  // Vue.prototype.$spinner.push();
  if (!store.state.session.account.acc_id) {

    return api.getAccountInfo()
        .then(resp => {
          store.dispatch('setAccountData', resp.data);
          checkSessionLoaded(to, from, next);
        })
        .catch((err) => {
          console.error(err);
          //session not exist or die
          return next('/login');
        })
  } else {
    if (allow_routes_name.indexOf(to.name) == -1 && to.name != 'Verify' && !store.state.session.account.acc_is_verified) {
      return next('/verify');
    }

    checkRoutesAllows(store.state.session.account, to, from, next)
  }
};

//need for routes that are able for unregistered users
const checkAccountData = (to, from, next) => {
  //temp hack
  $('.rmd-backdrop--dark').click();
  return api.getAccountInfo()
      .then(resp => {
        store.dispatch('setAccountData', resp.data);
        checkRoutesAllows(resp.data, to, from, next)
      })
      .catch((err) => {
        //thats normal - user are unlogged and will have guest role
        next();
      })
};

function checkRoutesAllows(account, to, from, next) {
    //temp hack
  $('.rmd-backdrop--dark').click();

    if (account.acc_id) {

      // check if account is not verified
      if (allow_routes_name.indexOf(to.name) == -1 && to.name != 'Verify' && !account.acc_is_verified) {
        return next('/verify');
      }

      //check if account is already verified
      if (to.name == 'Verify' && account.acc_is_verified) {
        return next('/projects');
      }

      //check if account is already verified
      if ((to.name == 'Login' || to.name == 'Register') && account.acc_id) {
        return next('/projects');
      }

      next()
  }
}

// route config
let routes = [
  //auth
  {
    path: '/login',
    name: 'Login',
    beforeEnter: checkAccountData,
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/design',
    name: 'Design',
    beforeEnter: checkSessionLoaded,
    component: Design
  },
  {
    path: '/register',
    name: 'Register',
    beforeEnter: checkAccountData,
    component: Register
  },
  {
    path: '/verify',
    name: 'Verify',
    beforeEnter: checkSessionLoaded,
    component: Verify
  },
  {
    path: '/freelancers',
    name: 'Freelancers',
    beforeEnter: checkAccountData,
    component: Freelancers
  },
  {
    path: '/projects',
    name: 'Projects',
    beforeEnter: checkAccountData,
    component: Projects
  },
  {
    path: '/project/:id',
    name: 'Project',
    beforeEnter: checkAccountData,
    component: Project
  },
  {
    path: '/project/:id/suggestions',
    name: 'ProjectSuggestions',
    beforeEnter: checkAccountData,
    component: ProjectSuggestions
  },
  {
    path: '/freelancer/:id',
    name: 'Freelancer',
    beforeEnter: checkAccountData,
    component: Freelancer
  },
  {
    path: '/client/:id',
    name: 'Client',
    beforeEnter: checkSessionLoaded,
    component: Client
  },
  {
    path: '/dashboard/projects',
    name: 'DashboardProjects',
    beforeEnter: checkSessionLoaded,
    component: DashboardProjects
  },
  {
    path: '/dashboard/works',
    name: 'DashboardWorks',
    beforeEnter: checkSessionLoaded,
    component: DashboardWorks
  },
  {
    path: '/dashboard/suggestions',
    name: 'DashboardSuggestions',
    beforeEnter: checkSessionLoaded,
    component: DashboardSuggestions
  },
  {
    path: '/dashboard/finances',
    name: 'DashboardFinances',
    beforeEnter: checkSessionLoaded,
    component: DashboardFinances
  },
  {
    path: '/dashboard/profile',
    name: 'DashboardProfile',
    beforeEnter: checkSessionLoaded,
    component: DashboardProfile
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
