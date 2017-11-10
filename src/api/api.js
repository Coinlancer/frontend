import Vue from 'vue'
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
    if (api_response.data && api_response.data.token) {
        token = api_response.data.token;
    }

    return api_response;

}, function (error) {
    if (error.response && error.response.data) {
        return Promise.reject(Vue.errors.apiError(error.response.data.error || '', error.response.data.message || ''));
    }

    return Promise.reject(Vue.errors.innerError(Vue.errors.codes.NETWORK_ERROR));

});

// Set auth header before send
axios.interceptors.request.use(function (config) {
    //get token from localstorage
    let savedToken = localStorage.getItem('token');
    if (token) {
        // if we get token from response and its different from saved - save new token
        if (savedToken && savedToken != token) {
            localStorage.setItem('token', token);
        }
    } else if (savedToken) {
        // if we have saved token - take it
        token = savedToken;
    }

    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
});

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

    updateAccountInformation (data) {
        return axios.post('/account/update',
            querystring.stringify(data)
        );
    },

    updateAccountPassword (data) {
        return axios.post('/account/password/update',
            querystring.stringify(data)
        );
    },

    getAccountInfo () {
        return axios.get('/account');
    },


    addFreelancerSkill (skill_id) {
        return axios.post('/freelancers/skills/' + skill_id);
    },

    deleteFreelancerSkill (skill_id) {
        return axios.post('/freelancers/skills/' + skill_id + '/delete');
    },

    activateRole (data) {
        return axios.post('/account/role/activate',
            querystring.stringify(data)
        )
    },

    addSkill (project_id, data) {
        return axios.post('/projects/' + project_id + '/skills',
            querystring.stringify(data)
        )
    },

    deleteSkill (project_id, data) {
        return axios.post('/projects/' + project_id + '/skills/delete',
            querystring.stringify(data)
        )
    },

    createProject () {
        return axios.post('/projects');
    },

    updateProject (project_id, data) {
        return axios.post('/projects/' + project_id,
            querystring.stringify(data)
        );
    },

    getProjects (filters) {
        return axios.get('/projects' + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    getProjectData (id) {
        return axios.get('/projects/' + id);
    },

    getClientProjects (id, filters) {
        return axios.get('/projects/account/' + id + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    getFreelancerProjects (filters) {
        return axios.get('/freelancers/works' + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    getFreelancerSuggestions (filters) {
        return axios.get('/freelancers/suggestions' + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    getFreelancerProjectSuggestion (project_id) {
        return axios.get('/freelancers/suggestions/project/' + project_id);
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

    uploadAvatar (attachment) {

        const config = {
            headers: {'content-type': 'multipart/form-data'}
        };

        let data = new FormData();

        if (attachment) {
            data.append('attachments[0]', attachment, attachment.name);
        }

        return axios.post('/account/avatar', data, config);
    },

    //attachments
    addAttachment (project_id, attachment) {

        const config = {
            headers: {'content-type': 'multipart/form-data'}
        };

        let data = new FormData();

        if (attachment) {
            data.append('attachments[0]', attachment, attachment.name);
        }

        return axios.post('/projects/' + project_id + '/attachments', data, config);
    },

    downloadAttachment (project_id, attachment_id) {
        return axios.get('/projects/' + project_id + '/attachments/' + attachment_id);
    },

    deleteAttachment (project_id, attachment_id) {
        return axios.post('/projects/' + project_id + '/attachments/' + attachment_id + '/delete');
    },

    //steps
    deleteStep (project_id, step_id) {
        return axios.post('/projects/' + project_id + '/steps/' + step_id + '/delete');
    },

    getSteps (project_id) {
        return axios.get('/projects/' + project_id + '/steps');
    },

    saveStep (project_id, data) {
        return axios.post('/projects/' + project_id + '/steps',
            querystring.stringify(data)
        );
    },

    getProjectSteps (project_id) {
        return axios.get('/projects/' + project_id + '/steps');
    },

    getProjectSuggestions (project_id, filters) {
        return axios.get('/projects/' + project_id + '/suggestions' + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    //steps finances

    depositStep (step_id) {
        return axios.post('/projects/steps/' + step_id + '/deposit');
    },

    completeStep (step_id) {
        return axios.post('/projects/steps/' + step_id + '/complete');
    },

    markAsDoneStep (step_id) {
        return axios.post('/projects/steps/' + step_id + '/done');
    },

    refundStep (step_id) {
        return axios.post('/projects/steps/' + step_id + '/refund');
    },

    //suggestions

    createSuggestion (project_id, data) {
        return axios.post('/projects/' + project_id + '/suggestions',
            querystring.stringify(data)
        );
    },

    deleteSuggestion (project_id) {
        return axios.post('/projects/' + project_id + '/suggestions/delete');
    },

    acceptSuggestion (data) {
        return axios.post('/projects/suggestions/confirm',
            querystring.stringify(data)
        );
    },

    getFreelancers (filters) {
        return axios.get('/freelancers' + (filters ? '?' + querystring.stringify(filters) : ''));
    },

    getFreelancerData (freelancer_id) {
        return axios.get('/freelancers/' + freelancer_id);
    },

    getClientData (client_id) {
        return axios.get('/clients/' + client_id);
    },
}
