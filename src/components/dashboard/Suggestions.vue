<script>

  import Api from '../../api/api'
  import Config from '../../config/index'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        current_role: null,
        suggestions: [],
        account: null,
        sug_is_loading: false,
        //pagination
        suggestions_page: 1,
        is_next_page_exist: true
      }
    },
    methods: {
      loadMoreSuggestions: function () {
        let vm = this;
        vm.suggestions_page += 1;

        let filters = {
          limit: Config.limits.dashboard_suggestions,
          offset: (vm.suggestions_page - 1) * Config.limits.dashboard_suggestions
        };

        return Api.getFreelancerSuggestions(filters)
            .then((resp) => {
              if (resp.data.length < Config.limits.dashboard_suggestions) {
                vm.is_next_page_exist = false;
              }
              vm.suggestions = vm.suggestions.concat(resp.data);
            })
            .catch(vm.$errors.handle)
      },

      deleteSuggestion: function (project_id, e) {
        let vm = this;
        e.preventDefault();

        vm.sug_is_loading = true;
        return Api.deleteSuggestion(project_id)
            .then((resp) => {
              console.log(resp);
              return Api.getFreelancerSuggestions();
            })
            .then((resp) => {
              vm.suggestions = resp.data;
              vm.$helpers.successMsg('Suggestion deleted');
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.sug_is_loading = false;
            })
      }
    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);

      let filters = {
        limit: Config.limits.dashboard_suggestions,
        offset: (vm.suggestions_page - 1) * Config.limits.suggestions
      };

      Api.getFreelancerSuggestions(filters)
          .then((resp) => {
            if (resp.data.length < Config.limits.dashboard_suggestions) {
              vm.is_next_page_exist = false;
            }
            vm.suggestions = resp.data
          })
          .catch(vm.$errors.handle)
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

              <div v-for="suggestion in suggestions">
                <div class="listings-grid__item no-border-shadow">
                  <div class="media-body">
                    <router-link :to="'/project/' + suggestion.prj_id" class="media">
                      <div class="listings-grid__body">
                        <h3>{{suggestion.prj_title}}</h3>
                        <p>
                            <span v-if="suggestion.prj_budget">
                            Fixed-Price - <b>{{suggestion.prj_budget}} CL</b>
                          </span>
                          Posted <timeago :since="new Date(suggestion.prj_created_at).toString()"></timeago>
                        </p>
                        <h5>{{suggestion.prj_description}}</h5>
                        <!-- <h5>Lorem ipsum dolor sit amet.</h5> -->
                      </div>
                    </router-link>
                  </div>
                </div>
                <div class="listings-grid__item">
                  <h6 class="sugg-label">Your suggestion:</h6>
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
              <div v-if="is_next_page_exist" class="load-more m-b-30">
                <a @click="loadMoreSuggestions"><i class="zmdi zmdi-refresh-alt"></i> Load more</a>
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

  .listings-grid__body>h5 {
    text-overflow: unset;
    white-space: inherit;
  }

  .listings-grid__body>small {
    font-size: 17px;
  }

  .listings-grid__body>p{
    color: #2e353b;
  }

  .respond-btn {
    position: absolute;
    right: 0;
    top: 16px;
  }

  .media-body {
    position: relative;
  }

  a.list-group-item:focus, a.list-group-item:hover, button.list-group-item:focus, button.list-group-item:hover {
    background: none;
  }

  .listings-grid__item:hover {
    background: none;
  }

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

  .no-border-shadow{
    box-shadow: none;
  }

  .sugg-label {
    padding-left: 20px;
  }
</style>