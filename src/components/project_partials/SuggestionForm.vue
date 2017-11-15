<script>

  import Api from '../../api/api'

  export default {
    props: ['response', 'is_owner', 'is_executor'],
    data: function () {
      let vm = this;

      return {
        is_suggestion_exist: false,
        hired_suggestion: vm.response.hired_suggestion || false,
        sug_is_loading: false, //loader for button
      }
    },
    created () {
      let vm = this;

      return Api.getFreelancerProjectSuggestion(vm.response.project.prj_id)
          .then((resp) => {
            if (resp.data) {
              vm.is_suggestion_exist = true;
            }
          })
          .catch(vm.$errors.handle)
    },
    methods: {
      createSuggestion: function (event) {
        let vm = this;
        event.preventDefault();

        let hours = event.target.hours ? event.target.hours.value : null;
        let message = event.target.message ? event.target.message.value : null;

        hours = parseInt(hours);

        if (!hours || hours <= 0) {
          return vm.$helpers.errorMsg('Enter suggestion hours');
        }

        if (!message || !message.length) {
          return vm.$helpers.errorMsg('Enter suggestion message');
        }

        vm.sug_is_loading = true;

        return Api.createSuggestion(vm.$route.params.id, {
              hours: hours,
              message: message
            })
            .then(() => {
              vm.is_suggestion_exist = true;
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.sug_is_loading = false;
            })
      }
    }
  }
</script>

<template>
    <div v-if="hired_suggestion" class="card" style="text-align: center;">
      <div class="submit-property__success">
        <i class="zmdi zmdi-check"></i>
        <p>Project has been started</p>
      </div>
    </div>
    <div v-else-if="is_owner" class="card" style="text-align: center;">
      <div class="submit-property__success">
        <i class="zmdi zmdi-check"></i>
        <p>You are project creator</p>
      </div>
    </div>
    <div v-else-if="is_suggestion_exist" class="card" style="text-align: center;">
      <div class="submit-property__success">
        <i class="zmdi zmdi-check"></i>

        <h2>Successful!</h2>
        <p>You have successfully sent a bid</p>
      </div>
    </div>
    <form v-else class="card" @submit="createSuggestion">
      <div class="card__header">
        <h2>Suggest an offer</h2>
      </div>

      <div class="card__body m-t-10">
        <!--<div class="form-group form-group&#45;&#45;float">-->
        <!--<input type="number" min="0" required name="price" class="form-control" placeholder="Price">-->
        <!--<i class="form-group__bar"></i>-->
        <!--</div>-->
        <div class="form-group form-group--float">
          <input type="number" min="1" step="1" required name="hours" class="form-control" placeholder="Working hours">
          <i class="form-group__bar"></i>
        </div>
        <div class="form-group form-group--float">
          <textarea name="message" required class="form-control textarea-autoheight" placeholder="Message"></textarea>
          <i class="form-group__bar"></i>
        </div>
      </div>

      <div class="card__footer">
        <button-spinner
            :isLoading="sug_is_loading"
            :disabled="sug_is_loading"
            class="btn btn-primary"
        >
          <span>Submit</span>
        </button-spinner>
        <button type="reset" class="btn btn-sm btn-link">Reset</button>
      </div>
    </form>
</template>

