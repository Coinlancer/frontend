<script>

  import Api from '../../api/api'
  import Config from '../../config/index'

  export default {
    props: ['response', 'is_owner', 'is_executor'],
    data: function () {
      let vm = this;

      let current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);
      return {
        current_role: current_role,
        hired_suggestion: vm.response.hired_suggestion,
        suggestions: [],
        respond_is_loading: false,
        //pagination
        suggestions_page: 1,
        is_next_page_exist: true,
        api_host: Config.api_host,
      }
    },
    methods: {
      loadMoreSuggestions: function () {
        let vm = this;
        vm.suggestions_page += 1;

        let filters = {
          limit: Config.limits.suggestions,
          offset: (vm.suggestions_page - 1) * Config.limits.suggestions
        };

        return Api.getProjectSuggestions(vm.response.project.prj_id, filters)
            .then((resp) => {
              if (resp.data.length < Config.limits.suggestions) {
                vm.is_next_page_exist = false;
              }
              vm.suggestions = vm.suggestions.concat(resp.data);
            })
            .catch(vm.$errors.handle)

      },

      acceptSuggestion: function (freelancer_id, e) {
        let vm = this;
        let dialog_context = null;
        if (e) e.preventDefault();

        freelancer_id = parseInt(freelancer_id);

        if (!freelancer_id) {
          return false;
        }

        vm.respond_is_loading = true;
        vm.$dialog.confirm("Confirm suggestion accepting")
            .then((dialog) => {
              dialog_context = dialog;

              let data = {
                project_id: vm.$route.params.id,
                freelancer_id: freelancer_id
              };

              return Api.acceptSuggestion(data)
                  .catch(vm.$errors.handle);
            })
            .then((resp) => {
              vm.hired_suggestion = resp.data;

              return vm.$helpers.successMsg('Suggestion accepted');
            })
            .catch((err) => {
              console.error(err);
              return vm.$helpers.errorMsg('Can not accept suggestion');
            })
            .then(() => {
              vm.respond_is_loading = false;
              dialog_context.close();
            });
      },
    },
    created () {
      let vm = this;

      let filters = {
        limit: Config.limits.suggestions,
        offset: (vm.suggestions_page - 1) * Config.limits.suggestions
      };

      return Api.getProjectSuggestions(vm.response.project.prj_id, filters)
          .then((resp) => {
              if (resp.data.length < Config.limits.suggestions) {
                vm.is_next_page_exist = false;
              }
              vm.suggestions = resp.data;
            })
          .catch(vm.$errors.handle)
    }
  }
</script>

<template>
  <div v-if="suggestions && suggestions.length" class="listings-list listings-list--alt">
    <div v-for="freelancer in suggestions" class="listings-grid__item">
      <router-link :to="'/freelancer/' + freelancer.frl_id" class="list-group-item media">
        <div class="pull-left">
          <img v-if="freelancer.acc_avatar" :src="api_host + '/' + freelancer.acc_avatar" alt="" class="list-group__img img-circle" width="65" height="65"/>
          <img v-else src="/assets/img/icons/avatar.png" alt="" class="list-group__img img-circle" width="65" height="65"/>
        </div>
        <div class="media-body list-group__text">
          <strong>{{freelancer.acc_name}} {{freelancer.acc_surname}}</strong>
          <small v-if="freelancer.acc_phone" class="list-group__text">{{$helpers.formatPhone(freelancer.acc_phone)}}</small>
          <small v-if="freelancer.acc_email" class="list-group__text">{{freelancer.acc_email}}</small>
          <!--<small v-if="freelancer.acc_skype" class="list-group__text">{{freelancer.acc_skype}}</small>-->
          <small v-if="freelancer.prf_created_at" class="list-group__text">{{freelancer.prf_created_at}}</small>

          <button-spinner v-if="is_owner && !hired_suggestion"
                          :isLoading="respond_is_loading"
                          :disabled="respond_is_loading"
                          v-on:click.native="acceptSuggestion(freelancer.frl_id, $event)"
                          class="btn btn-primary respond-btn"
          >
            <span>Respond</span>
          </button-spinner>
          <button v-if="hired_suggestion && hired_suggestion.frl_id == freelancer.frl_id"
                  class="disabled btn btn-success respond-btn"
          >Hired</button>

        </div>
      </router-link>

      <div class="media-body">
        <div class="listings-grid__body">
          <small>{{freelancer.prf_hours}} hours</small>
          <h5>{{freelancer.prf_message}}</h5>
        </div>
      </div>
    </div>
    <div v-if="is_next_page_exist" class="load-more m-b-30">
      <a @click="loadMoreSuggestions"><i class="zmdi zmdi-refresh-alt"></i> Load more</a>
    </div>
  </div>
  <div v-else class="listings-list listings-list--alt">
    <h4 style="text-align: center; margin: 30px;">No suggestions yet</h4>
  </div>
</template>

<style scoped>
  .respond-btn {
    position: absolute;
    right: 0;
    top: 16px;
  }
</style>