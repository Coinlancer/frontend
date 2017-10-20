import Component from './component.vue'

const selector = 'spinner';

const Spinner = {
    install (Vue, options) {
        let cmp = Vue.extend(Component),
            vm;

        Vue.prototype.$spinner = {

            push: function () {
                if (!vm) {
                    let el = document.createElement('div');
                    el.setAttribute('id', selector);
                    document.querySelector('body').appendChild(el);

                    vm = new cmp().$mount('#' + selector);
                }
                vm.stack++;
            },

            pop: function () {
                if (!vm || vm.stack == 0) {
                    return;
                }

                vm.stack--;
            },
        }
    }
}

export default Spinner;