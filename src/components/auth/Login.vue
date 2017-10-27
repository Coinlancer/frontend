<script>

  import Api from '../../api/api'

  import Headerblock from '../partials/Header.vue'

  export default {
    beforeCreate: function () {
      if (!!this.$store.state.session.account.acc_id) {
        this.$router.push('/projects');
      }
    },
    methods: {
      login: function (e) {
        let vm = this;
        e.preventDefault();

        let email = e.target.email.value;
        let password = e.target.password.value;

        let data = {
          email: email,
          password: password
        };

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(data.email)) {
          return vm.$helpers.errorMsg('Check email field');
        }

        vm.$spinner.push();
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
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Invalid email/password');
            })
            .then(() => {
              vm.$spinner.pop();
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
                  <input type="text" class="form-control" name="email" placeholder="Email Address">
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="password" class="form-control" name="password" placeholder="Password">
                  <i class="form-group__bar"></i>
                </div>

                <button class="btn btn-primary btn-block m-t-10 m-b-10">Login</button>

                <div class="text-center">
                  <router-link to="/register"><small>Sign up now</small></router-link>
                </div>

                <div class="top-nav__auth">
                  <span>or</span>

                  <div>Sign in using</div>

                  <a href="#" class="mdc-bg-blue-500">
                    <i class="zmdi zmdi-facebook"></i>
                  </a>

                  <a href="#" class="mdc-bg-cyan-500">
                    <i class="zmdi zmdi-twitter"></i>
                  </a>

                  <a href="#" class="mdc-bg-red-400">
                    <i class="zmdi zmdi-google"></i>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>