<script>

  import Api from '../../api/api';
  import Headerblock from '../partials/Header.vue'
  import keythereum from 'keythereum';
  import sjcl from 'sjcl';

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
      createAccount: function (e) {
        let vm = this;
        e.preventDefault();

        let accepted_types = ['freelancer', 'client'];

        let type = e.target.type.value;
        let name = e.target.name.value;
        let surname = e.target.surname.value;
        let login = e.target.login.value;
        let password = e.target.password.value;
        let repassword = e.target.repassword.value;
        let email = e.target.email.value;

        if (typeof type == 'undefined' || accepted_types.indexOf(type) == -1) {
          return vm.$helpers.errorMsg("Select type of account");
        }

        if (typeof name != 'string' || name.length < 1) {
          return vm.$helpers.errorMsg("Fill name field");
        }

        if (typeof surname != 'string' || surname.length < 1) {
          return vm.$helpers.errorMsg("Fill surname field");
        }

        if (typeof login != 'string' || login.length < 1) {
          return vm.$helpers.errorMsg("Fill login field");
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
          return vm.$helpers.errorMsg("Email has incorrect format");
        }

        if (password.length < 8) {
          return vm.$helpers.errorMsg("Password should have 8 chars min");
        }

        let regex = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9]))\S{1,}$/;
        if (!regex.test(password)) {
          return vm.$helpers.errorMsg("Password must contain at least one upper case letter, one lower case letter and one digit");
        }

        if (password != repassword) {
          return vm.$helpers.errorMsg("Passwords should match");
        }

        vm.is_loading = true;

        //create crypt pair
        var params = { keyBytes: 32, ivBytes: 16 };
        var crypto_pair = keythereum.create(params);

        let encrypted_crypto_pair = vm.$helpers.encryptKeypair(crypto_pair, password);
        let crypt_address = keythereum.privateKeyToAddress(crypto_pair.privateKey);

        let data = {
          type: type,
          name: name,
          surname: surname,
          login: login,
          password: password,
          email: email,
          crypt_pair: encrypted_crypto_pair,
          crypt_address: crypt_address
        };

        return Api.register(data)
            .then((response) => {
              vm.$store.dispatch('setAccountData', response.data.account);
              localStorage.setItem('token', response.data.token);
              vm.$router.push('/verify');
              return vm.$helpers.successMsg('Verification code was sent on your email');
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
          <h2>Registration</h2>
        </header>

        <div class="col-sm-4 col-sm-offset-4">
          <div class="card">
            <div class="card__body">
              <form @submit="createAccount">
                <div class="profile-type clearfix">
                  <h5>Profile type:</h5>
                  <div class="form-group">
                    <div class="radio">
                      <label>
                        <input type="radio" value="freelancer" name="type">
                        <i class="input-helper"></i>
                        Freelancer
                      </label>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="radio">
                      <label>
                        <input type="radio" value="client" name="type">
                        <i class="input-helper"></i>
                        Client
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <input type="text" name="name" class="form-control" placeholder="First Name"
                        value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="text" name="surname" class="form-control" placeholder="Last Name"
                         value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="text" name="login" class="form-control" placeholder="Username"
                         value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="password" name="password" class="form-control" placeholder="Password"
                         value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="password" name="repassword" class="form-control" placeholder="Repeat password"
                         value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <input type="email" name="email" class="form-control" placeholder="E-mail"
                         value=""
                  >
                  <i class="form-group__bar"></i>
                </div>

                <button-spinner
                    :isLoading="is_loading"
                    :disabled="is_loading"
                    class="btn btn-primary btn-block m-t-10 m-b-10"
                >
                  <span>Send confirmation code</span>
                </button-spinner>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style>
  @import 'auth.css';
</style>