<script>

  import Api from '../../api/api'

  import Headerblock from './partials/Header.vue'
  import Footerblock from './partials/Footer.vue'

  export default {
    methods: {
      confirmAccount: function (e) {
        let vm = this;
        e.preventDefault();

        let verification_key = e.target.verification_key.value;

        let data = {
          verification_key: verification_key
        };

        //TODO: validation data
        vm.$spinner.push();
        return Api.verifyAccount(data)
            .then((response) => {
              vm.$router.push('/dashboard/projects');
              return vm.$helpers.successMsg('Account confirmed');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Invalid code');
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

                <button type="submit" class="btn btn-primary btn-block m-t-10 m-b-10">Confirm</button>

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