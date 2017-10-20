import Axios from 'axios'
import Config from '../config'

import querystring from 'query-string';

let axios = Axios.create();
let token = null;
axios.defaults.baseURL = Config.api_host;
axios.defaults.timeout = Config.request_ttl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.response.use(function (response) {

  let api_response = response.data;

  if (api_response.data.token) {
    token = api_response.data.token;
  }

  return response;
}, function (error) {

  if (error.response && error.response.data) {
    return Promise.reject(Vue.errors.apiError(error.response.data.error || '', error.response.data.message || ''));
  }

  return Promise.reject(Vue.errors.innerError(Vue.errors.codes.NETWORK_ERROR));
});

// Set auth header before send
axios.interceptors.request.use(function (config) {
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  return config;
});

/**
 * Mocking client-server processing
 */
const _freelancers = [
  {
    id: 1,
    name: "Robert B. Osborne",
    about: "I have developed desktop / web applications for 5+ years. I'm using: PHP, JavaScript, HTML, CSS, MySQL, and Python.",
    rating: 4.5,
    review_count: 2,
    contacts: {
      phone: "093123123123",
      skype: "testskype",
      email: "test@test.com"
    },
    skills: [
      {
        title: "PHP",
        years: "6"
      },
      {
        title: "JavaScript",
        years: "5"
      },
    ],
    projects: {
        active: 2,
        completed: 20
    }
  },
  {
    id: 2,
    name: "Terminator",
    about: "I\ll be back, bitches",
    rating: 4.5,
    review_count: 100,
    contacts: {
      phone: "666 666 66 66",
      skype: "termy",
      email: "termy@yahoo.com"
    },
    skills: [
      {
        title: "Minigun",
        years: "100500"
      }
    ],
    projects: {
      active: 13,
      completed: 666
    }
  }
]

const _clients = [
  {
    id: 1,
    name: "Robert B. Osborne",
    about: "I have developed desktop / web applications for 5+ years. I'm using: PHP, JavaScript, HTML, CSS, MySQL, and Python.",
    rating: 4.5,
    review_count: 2,
    contacts: {
      phone: "093123123123",
      skype: "testskype",
      email: "test@test.com"
    },
    projects: {
        active: 2,
        completed: 20
    }
  },
  {
    id: 2,
    name: "Terminator",
    about: "I\ll be back, bitches",
    rating: 4.5,
    review_count: 100,
    contacts: {
      phone: "666 666 66 66",
      skype: "termy",
      email: "termy@yahoo.com"
    },
    projects: {
      active: 13,
      completed: 666
    }
  }
]

const _projects = [
  {
    prj_id: 1,
    prj_title: "test work1 multiskills",
    prj_description: "test description",
    prj_skill_ids: [1, 2, 3],
    prj_category_ids: [1, 2, 3],
    prj_client_id: 1,
    prj_steps: [
      {
        title: 'Technical Support',
        budget: 200,
      },
      {
        title: 'Controller and Administration',
        budget: 300,
      },
      {
        title: 'Marketing Communications',
        budget: 200,
      },
      {
        title: 'Product Management',
        budget: 300,
      }
    ],
    prj_budget: 123.45,
    prj_created_at: 1507723956,
    prj_start_at: 1507763956,
    prj_end_at: 1517923956,
  },
  {
    prj_id: 2,
    prj_title: "test work2",
    prj_description: "test description",
    prj_skill_ids: [1],
    prj_category_ids: [1, 2, 3],
    prj_client_id: 1,
    prj_steps: [
      {
        title: 'Technical Support',
        budget: 200,
      },
      {
        title: 'Controller and Administration',
        budget: 300,
      },
      {
        title: 'Marketing Communications',
        budget: 200,
      },
      {
        title: 'Product Management',
        budget: 300,
      }
    ],
    prj_budget: 123.45,
    prj_created_at: 1507723956,
    prj_start_at: 1507763956,
    prj_end_at: 1517923956,
  },
  {
    prj_id: 3,
    prj_title: "test work3",
    prj_description: "test description",
    prj_skill_ids: [2],
    prj_category_ids: [1, 2, 3],
    prj_client_id: 1,
    prj_steps: [
      {
        title: 'Technical Support',
        budget: 200,
      },
      {
        title: 'Controller and Administration',
        budget: 300,
      },
      {
        title: 'Marketing Communications',
        budget: 200,
      },
      {
        title: 'Product Management',
        budget: 300,
      }
    ],
    prj_budget: 123.45,
    prj_created_at: 1507723956,
    prj_start_at: 1507763956,
    prj_end_at: 1517923956,
  },
  {
    prj_id: 4,
    prj_title: "test work4",
    prj_description: "test description",
    prj_skill_ids: [3],
    prj_category_ids: [1, 2, 3],
    prj_client_id: 1,
    prj_steps: [
      {
        title: 'Technical Support',
        budget: 200,
      },
      {
        title: 'Controller and Administration',
        budget: 300,
      },
      {
        title: 'Marketing Communications',
        budget: 200,
      },
      {
        title: 'Product Management',
        budget: 300,
      }
    ],
    prj_budget: 123.45,
    prj_created_at: 1507723956,
    prj_start_at: 1507763956,
    prj_end_at: 1517923956,
  }
]

const _languages = [
  {lng_id: 1, lng_title: "English", lng_code: "EN"},
  {lng_id: 2, lng_title: "Russian", lng_code: "RU"},
  {lng_id: 3, lng_title: "Ukrainian", lng_code: "UA"}
]

const _userdata = {
  id: 1,
  name: "Robert B. Osborne",
  about: "I have developed desktop / web applications for 5+ years. I'm using: PHP, JavaScript, HTML, CSS, MySQL, and Python.",
  rating: 4.5,
  review_count: 2,
  contacts: {
    phone: "093123123123",
    skype: "testskype",
    email: "test@test.com"
  },
  skills: [
    {
      title: "PHP",
      years: "6"
    },
    {
      title: "JavaScript",
      years: "5"
    },
  ],
  projects: {
    active: 2,
    completed: 20
  }
}

let handleToken = function (token) {
  if (!token) {
    return;
  }

  axios.defaults.headers.post['Authorization'] = 'Bearer ' + token;
}
export default {

  //ready methods
  register (data) {
    return axios.post('/register',
        querystring.stringify(data)
      )
  },

  login (data) {
    return axios.post('/login',
        querystring.stringify(data)
      );
  },

  verifyAccount (data) {
    return axios.post('/verify',
        querystring.stringify(data)
      );
  },

  createProject (formdata) {

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    // return axios.post('/project/test', formdata, config);
    return axios.post('/projects/create', formdata, config);

    // return axios.post('/project/create',
    //     querystring.stringify(data, {arrayFormat: 'bracket'})
    // );
  },

  getProjects () {
    return axios.get('/projects');
  },

  getClientProjects (id) {
    return axios.get('/projects/account/' + id);
  },

  getCategories () {
    return axios.get('/categories');
  },

  getSubCategories () {
    return axios.get('/subcategories');
  },

  getSkills () {
    return axios.get('/skills');
  },

  //mock methods
  getFreelancers (cb) {
    setTimeout(() => cb(_freelancers), 100)
  },

  getClients (cb) {
    setTimeout(() => cb(_clients), 100)
  },

  getFreelancerData (id) {
    return new Promise((resolve, reject) => {
      let data = _freelancers.filter((freelancer) => {
        return freelancer.id == id
      });
      if (data.length) {
        return resolve(data[0]);
      }

      return reject('Not found');
    })
  },

  getClientData (id) {
    return new Promise((resolve, reject) => {
      let data = _clients.filter((client) => {
        return client.id == id
      });
      if (data.length) {
        return resolve(data[0]);
      }

      return reject('Not found');
    })
  },

  getProjectData (id) {
    return axios.get('/projects/' + id);
  },
}
