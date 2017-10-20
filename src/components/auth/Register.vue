<script>

  import Api from '../../api/api';

  import Headerblock from './partials/Header.vue'
  import Footerblock from './partials/Footer.vue'

  import keythereum from 'keythereum';
  import sjcl from 'sjcl';

  export default {
    methods: {
      encryptKeypair: function (password) {
        var params = { keyBytes: 32, ivBytes: 16 };
        var dk = keythereum.create(params);

        var encryptedData = sjcl.json.encrypt(password, JSON.stringify(dk));

        return btoa(encryptedData);
      },
      createAccount: function (e) {
        let vm = this;
        e.preventDefault();

        let type = e.target.type.value;
        let name = e.target.name.value;
        let surname = e.target.surname.value;
        let login = e.target.login.value;
        let password = e.target.password.value;
        let repassword = e.target.repassword.value;
        let email = e.target.email.value;
        let cryptopair = vm.encryptKeypair(password);

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

        let data = {
          type: type,
          name: name,
          surname: surname,
          login: login,
          password: password,
          email: email,
          cryptopair: cryptopair
        };

        vm.$spinner.push();
        return Api.register(data)
            .then((response) => {
              vm.$store.dispatch('setUserData', response.data.data.account);
              vm.$router.push('/verify')
              return vm.$helpers.successMsg('Verification code was sent on your email');
            })
            .catch((err) => {
              console.error(err);
              //TODO: notification system
            })
            .then(() => {
              vm.$spinner.pop();
            })
      }
    },
    components: {
      Headerblock,
      Footerblock
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
                  <input type="text" name="login" class="form-control" placeholder="Login"
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

                <button class="btn btn-primary btn-block m-t-10 m-b-10">Send confirmation code</button>

                <div class="top-nav__auth">
                  <span>or</span>

                  <div>Sign in using</div>

                  <a href="" class="mdc-bg-blue-500">
                    <i class="zmdi zmdi-facebook"></i>
                  </a>

                  <a href="" class="mdc-bg-cyan-500">
                    <i class="zmdi zmdi-twitter"></i>
                  </a>

                  <a href="" class="mdc-bg-red-400">
                    <i class="zmdi zmdi-google"></i>
                  </a>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footerblock></footerblock>
  </div>
</template>

<style>
  @import '../../assets/css/register.css';
</style>