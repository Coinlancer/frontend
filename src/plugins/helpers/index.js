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
            }
        }
    }
}

export default Helpers;