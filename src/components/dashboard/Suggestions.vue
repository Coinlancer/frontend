<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        current_role: null,
        suggestions: [],
        account: null,
        sug_is_loading: false
      }
    },
    methods: {
      deleteSuggestion: function (project_id, e) {
        let vm = this;
        e.preventDefault();

        vm.sug_is_loading = true;
        return api.deleteSuggestion(project_id)
            .then((resp) => {
              console.log(resp);
              return api.getFreelancerSuggestions();
            })
            .then((resp) => {
              vm.suggestions = resp.data
              vm.$helpers.successMsg('Suggestion deleted');
            })
            .catch((err) => {
              console.error(err);

              vm.$helpers.errorMsg('Can not delete suggestion');
            })
            .then(() => {
              vm.sug_is_loading = false;
            })
      }
    },
    beforeCreate () {
      let vm = this;
      api.getFreelancerSuggestions()
          .then((resp) => {
            vm.suggestions = resp.data
          })
    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);
    },
    mounted () {
      this.$helpers.externalPluginsExecute();
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
      <sidebar :role="current_role"></sidebar>
      <section id="main__content">
        <div class="main__container">
          <div class="row">
            <div class="col-md-12" v-if="suggestions.length">
              <header class="main__title clearfix">
                <h2>Suggestions</h2>
              </header>

              <div v-for="suggestion in suggestions" class="listings-grid__item">
                  <router-link :to="'/project/' + suggestion.prj_id" class="list-group-item media">
                    <div class="pull-left">
                      <img src="/assets/img/default_user.png" alt="" class="list-group__img img-circle" width="65" height="65">
                    </div>
                    <div class="media-body list-group__text">
                      <strong>{{suggestion.acc_name}} {{suggestion.acc_surname}}</strong>
                      <small v-if="account.acc_email" class="list-group__text">{{account.acc_email}}</small>
                      <small v-if="account.acc_phone" class="list-group__text">{{account.acc_phone}}</small>
                    </div>
                  </router-link>

                  <div class="media-body">
                    <div class="listings-grid__body">
                      <small>{{suggestion.prf_hours}} hours | {{suggestion.prf_price}} CL</small>
                      <h5>{{suggestion.prf_message}}</h5>
                    </div>
                  </div>
                <div class="listings-grid__attrs">
                  <button-spinner v-if="!suggestion.prf_is_hired"
                      v-on:click.native="deleteSuggestion(suggestion.prj_id, $event)"
                      :isLoading="sug_is_loading"
                      :disabled="sug_is_loading"
                      class="btn btn-xs btn-danger m-t-10 m-b-10"
                  >
                    <span>Delete</span>
                  </button-spinner>
                  <button v-else class="disabled btn btn-xs btn-success m-t-10 m-b-10">In work</button>
                </div>
              </div>
            </div>
            <div v-else>
              <header class="main__title clearfix">
                <h2>You have not suggestions yet</h2>
              </header>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
  .card-steps ul {
    list-style-type: none;
  }

  .card-steps ul li {
    display: block;
  }

  .card-steps .checkbox__helper, .card-steps .checkbox--char input[type=checkbox] {
    display: none;
  }

  .card-steps  .checkbox--char label {
    padding-left: 0;
  }

  .card-steps  .price-project {
    padding-left: 25px;
  }

  .card-steps  .none {
    display: none;
  }

  .contract-steps .tasks-lists .list-group-item .checkbox input:checked + .checkbox__helper + * {
    text-decoration: none;
    cursor: auto;
  }

  .contract-steps .checkbox label {
    cursor: auto;
  }

  .list-group--block .list-group-item {
    padding: 13px 30px;
  }

  .actions > a, .actions > div {
    padding-top: 0;
    bottom: 5px;
  }

  .card-steps ul {
    padding: 0;
  }

  header.main__title.clearfix h2{
    float: left;
    margin-top: 10px;
  }
</style>