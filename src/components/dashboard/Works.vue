<script>

  import Api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        current_role: null,
        projects: [],
        //pagination
        projects_page: 1,
        is_next_page_exist: true
      }
    },
    methods: {
      loadMoreWorks: function () {
        let vm = this;
        vm.projects_page += 1;

        let filters = {
          limit: vm.$config.limits.dashboard_works,
          offset: (vm.projects_page - 1) * vm.$config.limits.dashboard_works
        };

        return Api.getFreelancerProjects(filters)
            .then((resp) => {
                if (resp.data.length < vm.$config.limits.dashboard_works) {
                  vm.is_next_page_exist = false;
                }
                vm.projects = vm.projects.concat(resp.data);
              })
            .catch(vm.$errors.handle)
      },
    },
    created () {
      let vm = this;
      vm.current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);

      let filters = {
        limit: vm.$config.limits.dashboard_works,
        offset: (vm.projects_page - 1) * vm.$config.limits.dashboard_works
      };

      return Api.getFreelancerProjects(filters)
          .then((resp) => {
              if (resp.data.length < vm.$config.limits.dashboard_works) {
                vm.is_next_page_exist = false;
              }
              vm.projects = resp.data
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
            <div class="col-md-12" v-if="projects.length">
              <header class="main__title clearfix">
                <h2>Works list</h2>
              </header>

              <div v-for="project in projects" class="listings-grid__item">
                <div class="media-body">
                  <router-link :to="'/project/' + project.prj_id" class="media">
                    <div class="listings-grid__body">
                      <h3>{{project.prj_title}}</h3>
                      <p>
                          <span v-if="project.prj_budget">
                          <b>{{project.prj_budget}} CL</b>
                        </span>
                        Posted <timeago :since="new Date(project.prj_created_at).toString()"></timeago>
                      </p>
                      <h5>{{project.prj_description}}</h5>
                      <!-- <h5>Lorem ipsum dolor sit amet.</h5> -->
                    </div>
                  </router-link>
                  <button v-if="project.prj_status == $config.project_statuses.STATUS_ACTIVE" class="disabled btn btn-xs btn-success m-t-10 m-b-10 m-l-20">Active</button>
                  <button v-if="project.prj_status == $config.project_statuses.STATUS_COMPLETED" class="disabled btn btn-xs btn-primary m-t-10 m-b-10 m-l-20">Completed</button>
                  <button v-if="project.prj_status == $config.project_statuses.STATUS_CANCELED" class="disabled btn btn-xs btn-warning m-t-10 m-b-10 m-l-20">Canceled</button>
                </div>
              </div>
              <div v-if="is_next_page_exist" class="load-more m-b-30">
                <a @click="loadMoreWorks"><i class="zmdi zmdi-refresh-alt"></i> Load more</a>
              </div>
            </div>
            <div v-else>
              <header class="main__title clearfix">
                <h2>You have not works yet</h2>
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


<style scoped>
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
</style>