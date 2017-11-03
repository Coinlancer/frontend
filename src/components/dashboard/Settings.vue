<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        account: [],
        current_role: null,
        act_is_loading: false,
        info_is_loading: false,
        pass_is_loading: false
      }
    },
    methods: {
      updateAccountPassword: function (e) {
        let vm = this;
        e.preventDefault();

        let password = e.target.password.value;
        let new_password = e.target.new_password.value;
        let renew_password = e.target.renew_password.value;

        if (!password) {
          return vm.$helpers.errorMsg('Enter old password');
        }

        if (!new_password) {
          return vm.$helpers.errorMsg('Enter new password');
        }

        if (new_password.length < 8) {
          return vm.$helpers.errorMsg("Password should have 8 chars min");
        }

        let regex = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9]))\S{1,}$/;
        if (!regex.test(new_password)) {
          return vm.$helpers.errorMsg("Password must contain at least one upper case letter, one lower case letter and one digit");
        }

        if (renew_password != new_password) {
          return vm.$helpers.errorMsg('Passwords must be equal');
        }

        let crypto_pair = vm.account.acc_crypt_pair;

        vm.pass_is_loading = true;

        //decrypt cryptopair with old password and encrypt with new password
        let decrypted_crypto_pair = vm.$helpers.decryptKeypair(crypto_pair, password);

        if (!decrypted_crypto_pair) {
          vm.pass_is_loading = false;
          return vm.$helpers.errorMsg('Invalid old password');
        }

        let encrypted_crypto_pair = vm.$helpers.encryptKeypair(decrypted_crypto_pair, new_password);

        let data = {
          password: password,
          new_password: new_password,
          crypt_pair: encrypted_crypto_pair
        };

        return api.updateAccountPassword(data)
            .then((resp) => {
              console.log(resp);

              return api.getAccountInfo()
            })
            .then(resp => {
              vm.$store.dispatch('setAccountData', resp.data);
              vm.account = resp.data;

              return vm.$helpers.successMsg('Password changed');
            })
            .catch((err) => {
              console.error(err);

              return vm.$helpers.errorMsg('Can not change password');
            })
            .then(() => {
              vm.pass_is_loading = false;
            })
      },
      switchRole: function () {
        let vm = this;
        vm.current_role = vm.current_role == 'freelancer' ? 'client' : 'freelancer';
        localStorage.setItem('current_role', vm.current_role);
      },
      activateRole: function (role) {
        let vm = this;

        vm.act_is_loading = true;

        let data = {
          role: role
        };

        return api.activateRole(data)
            .then(() => {
              return api.getAccountInfo()
            })
            .then(resp => {
              vm.$store.dispatch('setAccountData', resp.data);
              vm.account = vm.$store.getters.accountData;
            })
            .then(() => {
              vm.$helpers.successMsg('Role activated');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not activate role');
            })
            .then(() => {
              vm.act_is_loading = false;
            })
      }
    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);
    },
    mounted () {
      this.$helpers.externalPluginsExecute();
    },
    components: {
      Headerblock,
      Sidebar
    }
  }
</script>

<template>
  <div>
    <headerblock fullwidth="true"></headerblock>

    <main id="main">
      <sidebar :role="current_role"></sidebar>

      <section id="main__content">

        <div class="main__container">
          <header class="main__title">
            <h2>Settings</h2>
          </header>

          <div class="list-group list-group--block">

            <div class="setting-block-2">
              <h2 class="m-b-20">Security settings</h2>
              <form @submit="updateAccountPassword">
                <div class="password-block clearfix">
                  <h4>Change password</h4>
                  <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                    <input type="password" class="form-control text-center" name="password">
                    <i class="form-group__bar"></i>
                    <label>Current password</label>
                  </div>
                  <div class="form-group form-group--float form-group--float-center  form-group-weight form-group-left clearfix">
                    <input type="password" class="form-control text-center" name="new_password">
                    <i class="form-group__bar"></i>
                    <label>New password</label>
                  </div>
                  <div class="form-group form-group--float form-group--float-center  form-group-weight form-group-left clearfix">
                    <input type="password" class="form-control text-center" name="renew_password">
                    <i class="form-group__bar"></i>
                    <label>New password again</label>
                  </div>
                </div>
                <button-spinner
                    :isLoading="pass_is_loading"
                    :disabled="pass_is_loading"
                    class="btn btn-sm btn-primary save-changes"
                >
                  <span>Save password</span>
                </button-spinner>
              </form>
            </div>
            <div v-if="!account.cln_id || !account.frl_id" class="setting-block-0">
              <h2>You are registered as: <span v-if="account.cln_id">Client</span> <span v-if="account.frl_id">Freelancer</span></h2>
              <div class="form-group">

                <button-spinner
                    v-if="!account.cln_id"
                    :isLoading="act_is_loading"
                    :disabled="act_is_loading"
                    class="btn btn-primary"
                    v-on:click.native="activateRole('client')"
                >
                  <span>Activate me also as a client</span>
                </button-spinner>

                <button-spinner
                    v-if="!account.frl_id"
                    :isLoading="act_is_loading"
                    :disabled="act_is_loading"
                    class="btn btn-primary"
                    v-on:click.native="activateRole('freelancer')"
                >
                  <span>Activate me also as a freelancer</span>
                </button-spinner>
              </div>
            </div>
            <div v-else class="setting-block-0">
              <h2>You are working as: <span v-if="current_role == 'client'">Client</span><span v-else>Freelancer</span></h2>
              <div class="form-group">
                <button-spinner
                    :isLoading="act_is_loading"
                    :disabled="act_is_loading"
                    class="btn btn-primary"
                    v-on:click.native="switchRole"
                >
                  <span>Switch</span>
                </button-spinner>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
  .list-group.list-group--block {
    padding: 30px;
  }

  .form-group-weight {
    /*width: 320px;*/
  }

  .form-group-left {
    float: left;
    margin-right: 20px;
  }

  .setting-block-1 {
    margin-bottom: 50px;
  }

  .setting-block-1 h2,.setting-block-2 h2 {
    margin-bottom: 35px;
  }
  .setting-block-2 h4{
    margin-bottom: 35px;
  }

  .setting-block-2 .save-changes {
    margin-bottom: 35px;
    color: #fff;
    background-color: #01bf86;
  }

  .setting-block-2 .save-changes:hover, .setting-block-2 .save-changes:active, .setting-block-2 .save-changes:focus, .setting-block-2 .save-changes:visited {
    color: #fff;
    background-color: #039368;
  }

  .visibility-block label {
    font-weight: 400;
  }
</style>