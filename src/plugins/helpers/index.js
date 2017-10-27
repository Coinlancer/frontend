const Helpers = {
    install (Vue, options) {
        Vue.helpers = Vue.prototype.$helpers = {

            errorMsg: function (msg) {
                return Vue.prototype.$notify({
                    type: 'error',
                    text: msg,
                    title: 'Error'
                })
            },

            successMsg: function (msg) {
                return Vue.prototype.$notify({
                    type: 'success',
                    text: msg,
                    title: 'Success'
                })
            },

            getCurrentRole: function (account) {

                let current_role = localStorage.getItem('current_role');

                switch (current_role) {
                    case 'freelancer':
                        if (!account.frl_id) {
                            current_role = null;
                        }
                        break;
                    case 'client':
                        if (!account.cln_id) {
                            current_role = null;
                        }
                        break;
                    default:
                        current_role = null;
                }

                if (!current_role) {
                    if (account.frl_id) {
                        current_role = 'freelancer';
                    } else {
                        current_role = 'client';
                    }
                }

                if (localStorage.getItem('current_role') != current_role) {
                    localStorage.setItem('current_role', current_role);
                }

                return current_role;
            }
        }
    }
}

export default Helpers;