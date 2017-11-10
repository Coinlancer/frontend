<script>

  import Api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import keythereum from 'keythereum';

  export default {
    beforeCreate: function () {
      if (this.$store.state.session.account.acc_id) {

        if (!this.$store.state.session.account.acc_is_verified) {
          return this.$router.push('/verify');
        }

        return this.$router.push('/projects');
      }
    },
    data: function () {
      return {
        is_loading: false
      }
    },
    methods: {
      login: function (e) {
        let vm = this;
        e.preventDefault();

        let identificator = e.target.identificator.value;
        let password = e.target.password.value;

        if (!identificator.length) {
          return vm.helpers.errorMsg('Enter email or login');
        }

        let data = {
          identificator: identificator,
          password: password
        };

        vm.is_loading = true;

        return Api.login(data)
            .then((response) => {

              vm.$store.dispatch('setAccountData', response.data.account);
              localStorage.setItem('token', response.data.token);

              if (response.data.account.acc_is_verified) {
                vm.$router.push('/dashboard/settings');
              } else {
                vm.$router.push('/verify');
              }
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.is_loading = false;
            })
      }
    },
    components: {
      Headerblock,
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <section class="section">
      <div class="container">
        <header class="section__title">
          <h2>Login</h2>
        </header>

        <div class="col-sm-4 col-sm-offset-4">
          <div class="card">
            <div class="card__body">
              <form class="tab-pane fade active in" @submit="login">
                <div class="form-group">
                  <input type="text" class="form-control" name="identificator" value="" placeholder="Email or login">
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="password" class="form-control" name="password" value="" placeholder="Password">
                  <i class="form-group__bar"></i>
                </div>

                <button-spinner
                    :isLoading="is_loading"
                    :disabled="is_loading"
                    class="btn btn-primary btn-block m-t-10 m-b-10"
                >
                  <span>Login</span>
                </button-spinner>

                <div class="text-center">
                  <router-link to="/register"><small>Sign up now</small></router-link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>