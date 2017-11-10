<script>

  import Api from '../../api/api'

  import Headerblock from '../partials/Header.vue'

  export default {
    data: function () {
      return {
        is_loading: false
      }
    },
    beforeCreate: function () {
      if (!this.$store.state.session.account.acc_id) {
        return this.$router.push('/login');
      }

      if (this.$store.state.session.account.acc_is_verified) {
        return this.$router.push('/projects');
      }
    },
    methods: {
      confirmAccount: function (e) {
        let vm = this;
        e.preventDefault();

        let verification_key = e.target.verification_key.value;

        if (!verification_key) {
          return vm.$helpers.errorMsg('Enter verification key')
        }

        let data = {
          verification_key: verification_key
        };

        vm.is_loading = true;
        return Api.verifyAccount(data)
            .then(() => {
              return Api.getAccountInfo()
            })
            .then(resp => {
              return vm.$store.dispatch('setAccountData', resp.data);
            })
            .then(() => {
              vm.$router.push('/dashboard/settings');

              return vm.$helpers.successMsg('Account confirmed');
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

    <section class="section" style="flex: 1 1 auto;min-height:100%; padding: 110px 0;">
      <div class="container">
        <header class="section__title">
          <h2>Confirmation code</h2>
        </header>
        <div class="col-sm-4 col-sm-offset-4">
          <div class="card">
            <div class="card__body">
              <form @submit="confirmAccount">
                <div class="form-group">
                  <input type="text" name="verification_key" class="form-control" placeholder="Code">
                  <i class="form-group__bar"></i>
                </div>

                <button-spinner
                    :isLoading="is_loading"
                    :disabled="is_loading"
                    class="btn btn-primary btn-block m-t-10 m-b-10"
                >
                  <span>Confirm</span>
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