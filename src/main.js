import Vue from 'vue'
import Resource from 'vue-resource'
import Router from 'vue-router'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueButtonSpinner from './components/button-spinner/VueButtonSpinner.vue';
import myDatepicker from 'vue-datepicker'
import store from './store'
import Api from './api/api'

import Config from './config/index'
Vue.prototype.$config = Config

//plugins
import Errors from './plugins/errors'
import Helpers from './plugins/helpers'
import Spinner from './plugins/spinner'

import App from './components/App.vue'

//auth
import Login from './components/auth/Login.vue'
import Logout from './components/auth/Logout.vue'
import Register from './components/auth/Register.vue'
import Verify from './components/auth/Verify.vue'

//pages
import Projects from './components/Projects.vue'
import Freelancers from './components/Freelancers.vue'
import Project from './components/Project.vue'
import Freelancer from './components/Freelancer.vue'
import Client from './components/Client.vue'

//dashboard
import DashboardProjects from './components/dashboard/Projects.vue'
import DashboardWorks from './components/dashboard/Works.vue'
import DashboardSuggestions from './components/dashboard/Suggestions.vue'
import DashboardFinances from './components/dashboard/Finances.vue'
import DashboardProfile from './components/dashboard/ProfileSettings.vue'
import DashboardEditProject from './components/dashboard/EditProject.vue'
import DashboardSettings from './components/dashboard/Settings.vue'

//libraries
import VModal from 'vue-js-modal'

Vue.use(VModal)

import VueTimeago from 'vue-timeago'
import VuejsDialog from "vuejs-dialog"

import humanize from 'humanize';
import moment from 'moment';


Vue.prototype.$humanize = humanize;
Vue.prototype.$moment = moment;

import phoneFormatter from 'phone-formatter';
Vue.prototype.$phoneformatter = phoneFormatter;

// Install plugins
Vue.use(Router)
Vue.use(Resource)
Vue.use(Notifications)
Vue.use(Errors)
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
let unregistered_allow_routes_names = [
  'Project',
  'Projects',
  'Freelancer',
  'Freelancers',
  'Login',
  'Register'
];

const routerGuard = (to, from, next) => {
  //on mobile view background still show after menu click
  //temp hack
  $('.rmd-backdrop--dark').click();

  //if session not loaded
  if (!store.state.session.account.acc_id) {

    //load session
    return Api.getAccountInfo()
        .then(resp => {
          store.dispatch('setAccountData', resp.data);
        })
        .catch((err) => {
          //user not logged - continue
        })
        .then(() => {
          return checkIsRouteAllow(to, from, next);
        })
  }

  return checkIsRouteAllow(to, from, next);

};

function checkIsRouteAllow(to, from, next) {

  //if auth not required
  if (unregistered_allow_routes_names.indexOf(to.name) != -1) {
    return next();
  }

  //if acc exist but not verified
  if (to.name != 'Verify' && store.state.session.account.acc_id && !store.state.session.account.acc_is_verified) {
    return next('/verify');
  }

  //if acc not exist - go to login
  if (to.name != 'Login' && !store.state.session.account.acc_id) {
    return next('/login');
  }

  //if all ok
  next();
}

// route config
let routes = [
  //auth
  {
    path: '/login',
    name: 'Login',
    beforeEnter: routerGuard,
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/register',
    name: 'Register',
    beforeEnter: routerGuard,
    component: Register
  },
  {
    path: '/verify',
    name: 'Verify',
    beforeEnter: routerGuard,
    component: Verify
  },
  {
    path: '/freelancers',
    name: 'Freelancers',
    beforeEnter: routerGuard,
    component: Freelancers
  },
  {
    path: '/projects',
    name: 'Projects',
    beforeEnter: routerGuard,
    component: Projects
  },
  {
    path: '/project/:id',
    name: 'Project',
    beforeEnter: routerGuard,
    component: Project
  },
  {
    path: '/freelancer/:id',
    name: 'Freelancer',
    beforeEnter: routerGuard,
    component: Freelancer
  },
  {
    path: '/client/:id',
    name: 'Client',
    beforeEnter: routerGuard,
    component: Client
  },
  {
    path: '/dashboard/projects',
    name: 'DashboardProjects',
    beforeEnter: routerGuard,
    component: DashboardProjects
  },
  {
    path: '/dashboard/works',
    name: 'DashboardWorks',
    beforeEnter: routerGuard,
    component: DashboardWorks
  },
  {
    path: '/dashboard/suggestions',
    name: 'DashboardSuggestions',
    beforeEnter: routerGuard,
    component: DashboardSuggestions
  },
  {
    path: '/dashboard/finances',
    name: 'DashboardFinances',
    beforeEnter: routerGuard,
    component: DashboardFinances
  },
  {
    path: '/dashboard/profile',
    name: 'DashboardProfile',
    beforeEnter: routerGuard,
    component: DashboardProfile
  },
  {
    path: '/dashboard/projects/edit/:id',
    name: 'DashboardEditProject',
    beforeEnter: routerGuard,
    component: DashboardEditProject
  },
  {
    path: '/dashboard/settings',
    name: 'DashboardSettings',
    beforeEnter: routerGuard,
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
