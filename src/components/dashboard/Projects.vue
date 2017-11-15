<script>

  import Api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        account: null,
        current_role: null,
        projects: [],
        //pagination
        projects_page: 1,
        is_next_page_exist: true
      }
    },
    methods: {
      loadMoreProjects: function () {
        let vm = this;
        vm.projects_page += 1;

        let filters = {
          limit: vm.$config.limits.dashboard_projects,
          offset: (vm.projects_page - 1) * vm.$config.limits.dashboard_projects
        };

        return Api.getClientProjects(vm.account.acc_id, filters)
            .then((resp) => {
              if (resp.data.length < vm.$config.limits.dashboard_projects) {
                vm.is_next_page_exist = false;
              }
              vm.projects = vm.projects.concat(resp.data);
            })
            .catch(vm.$errors.handle)
      },

      cancelProject: function (project_id, e) {
        e.preventDefault();
        let vm = this;

        let dialog_context = null;

        vm.$dialog.confirm("Confirm refund process. It will cancel project and refund all uncompleted operations.")
            .then((dialog) => {
              dialog_context = dialog;

              return Api.cancelProject(project_id);
            })
            .then(() => {
              let filters = {
                limit: vm.$config.limits.dashboard_projects,
                offset: (vm.projects_page - 1) * vm.$config.limits.dashboard_projects
              };

              return Api.getClientProjects(vm.account.acc_id, filters);
            })
            .then((resp) => {
              if (resp.data.length < vm.$config.limits.dashboard_suggestions) {
                vm.is_next_page_exist = false;
              }
              vm.projects = resp.data

              return vm.$helpers.successMsg('Project canceled');
            })
            .catch((err) => {
              if (!err) {
                return;
              }
              vm.$errors.handle(err);
            })
            .then(() => {
              dialog_context.close();
            });
      },

      createProject: function () {
        let vm = this;
        vm.$spinner.push();
        return Api.createProject()
            .then((resp) => {
              console.log(resp);
              vm.$router.push('/dashboard/projects/edit/' + resp.data.prj_id);
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.$spinner.pop();
            })
      }
    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);

      let filters = {
        limit: vm.$config.limits.dashboard_projects,
        offset: (vm.projects_page - 1) * vm.$config.limits.dashboard_projects
      };

      Api.getClientProjects(vm.account.acc_id, filters)
          .then((resp) => {
            if (resp.data.length < vm.$config.limits.dashboard_suggestions) {
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
                <h2>Contract list</h2>
                <button class="btn btn-primary btn-sm hidden-xs hidden-sm" style="float: right;" @click="createProject">
                  Create project</button>
              </header>

              <div v-for="project in projects" class="listings-grid__item">
                  <div class="media-body">
                    <router-link :to="project.prj_title ? '/project/' + project.prj_id : '/dashboard/projects/edit/' + project.prj_id" class="media">
                      <div class="listings-grid__body">
                        <h3>{{project.prj_title}}
                          <span v-if="project.prj_status == $config.project_statuses.STATUS_CREATED" class="label label-primary">Open</span>
                          <span v-if="project.prj_status == $config.project_statuses.STATUS_ACTIVE" class="label label-success">Active</span>
                          <span v-if="project.prj_status == $config.project_statuses.STATUS_COMPLETED" class="label label-primary">Completed</span>
                          <span v-if="project.prj_status == $config.project_statuses.STATUS_CANCELED" class="label label-warning">Canceled</span>
                        </h3>
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
                    <ul class="listings-grid__attrs">
                      <li v-if="project.prj_status != $config.project_statuses.STATUS_COMPLETED && project.prj_status != $config.project_statuses.STATUS_CANCELED">
                        <router-link :to="'/dashboard/projects/edit/' + project.prj_id">
                          <span class="label label-success">Update</span>
                        </router-link>
                      </li>
                      <li v-if="project.prj_status != $config.project_statuses.STATUS_COMPLETED && project.prj_status != $config.project_statuses.STATUS_CANCELED">
                        <a href="#" @click="cancelProject(project.prj_id, $event)">
                          <span class="label label-danger">Cancel</span>
                        </a>
                      </li>
                      <!--<li><span class="label label-warning">Stop</span></li>-->
                      <!--<li><span class="label label-danger">Delete</span></li>-->
                    </ul>
                  </div>
              </div>
              <div v-if="is_next_page_exist" class="load-more m-b-30">
                <a @click="loadMoreProjects"><i class="zmdi zmdi-refresh-alt"></i> Load more</a>
              </div>
            </div>
            <div v-else>
              <header class="main__title clearfix">
                <h2>You have not created any projects yet</h2>
                <button class="btn btn-primary btn-sm" style="float: right;" @click="createProject">
                  Create project</button>
              </header>
            </div>
          </div>
        </div>
      </section>

      <button class="btn btn--action btn--circle btn-success visible-sm visible-xs" @click="createProject">
        <i class="zmdi zmdi-plus-circle-o"></i>
      </button>
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
</style>