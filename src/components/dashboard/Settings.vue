<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        account: [],
        current_role: null,
        act_isLoading: false
      }
    },
    methods: {
      switchRole: function () {
        let vm = this;
        vm.current_role = vm.current_role == 'freelancer' ? 'client' : 'freelancer';
        localStorage.setItem('current_role', vm.current_role);
      },
      activateRole: function (role) {
        let vm = this;

        vm.act_isLoading = true;

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
              vm.act_isLoading = false;
            })
      }
    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);
    },
    components: {
      Headerblock,
      Sidebar,
    }
  }
</script>

<template>
  <div>
    <headerblock fullwidth="true"></headerblock>

    <main id="main">
      <sidebar></sidebar>

      <section id="main__content">

        <div class="main__container">
          <header class="main__title">
            <h2>Settings</h2>
          </header>

          <div class="list-group list-group--block">
            <div v-if="!account.cln_id || !account.frl_id" class="setting-block-0">
              <h2>You are registered as: <span v-if="account.cln_id">Client</span> <span v-if="account.frl_id">Freelancer</span></h2>
              <div class="form-group">

                <button-spinner
                    v-if="!account.cln_id"
                    :isLoading="act_isLoading"
                    :disabled="act_isLoading"
                    class="btn btn-primary"
                    v-on:click.native="activateRole('client')"
                >
                  <span>Activate me also as a client</span>
                </button-spinner>

                <button-spinner
                    v-if="!account.frl_id"
                    :isLoading="act_isLoading"
                    :disabled="act_isLoading"
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
                    :isLoading="act_isLoading"
                    :disabled="act_isLoading"
                    class="btn btn-primary"
                    v-on:click.native="switchRole"
                >
                  <span>Switch</span>
                </button-spinner>
              </div>
            </div>
            <div class="setting-block-1">
              <h2>Notification settings</h2>
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox">
                    <i class="input-helper"></i>
                    New private messages (e-mail)
                  </label>
                </div>
              </div>
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox">
                    <i class="input-helper"></i>
                    Service newsletter (e-mail)
                  </label>
                </div>
              </div>
            </div>
            <div class="setting-block-2">
              <h2>Security settings</h2>
              <div class="password-block clearfix">
                <h4>Change password</h4>
                <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                  <input type="text" class="form-control text-center">
                  <i class="form-group__bar"></i>
                  <label>Current password</label>
                </div>
                <div class="form-group form-group--float form-group--float-center  form-group-weight form-group-left clearfix">
                  <input type="text" class="form-control text-center">
                  <i class="form-group__bar"></i>
                  <label>New password</label>
                </div>
                <div class="form-group form-group--float form-group--float-center  form-group-weight form-group-left clearfix">
                  <input type="text" class="form-control text-center">
                  <i class="form-group__bar"></i>
                  <label>New password again</label>
                </div>
              </div>
              <button class="btn btn-sm btn-primary save-changes">Save password</button>
              <div class="visibility-block clearfix">
                <h4>Visibility</h4>
                <div class="form-group form-group-weight form-group-left">
                  <label>E-mail</label>
                  <select class="select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                    <option value="">Only me</option>
                    <option value="">Only registered users</option>
                  </select>
                </div>

                <!--<div class=" form-group form-group-weight form-group-left">-->
                <!--<label>Phone number</label>-->
                <!--<select class="select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true">-->
                <!--<option value="">Only me</option>-->
                <!--<option value="">Only registered users</option>-->
                <!--</select>-->
                <!--</div>-->
              </div>
            </div>
            <div style="max-width: 112px;margin: 25px auto;">
              <button class="save-changes btn btn-sm btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer-alt">
        © 2017 Coinlancer

        <ul class="footer-alt__menu">
          <li><a href="#">Home</a></li>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Support</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </footer>


    </main>
  </div>
</template>

<style scoped>
  .list-group.list-group--block {
    padding: 30px;
  }

  .form-group-weight {
    width: 320px;
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