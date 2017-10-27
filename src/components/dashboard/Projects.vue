<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        projects: []
      }
    },
    methods: {
      createProject: function () {
        let vm = this;
        vm.$spinner.push();
        return api.createProject()
            .then((resp) => {
              console.log(resp);
              vm.$router.push('/dashboard/projects/edit/' + resp.data.prj_id);
            })
            .catch((err) => {
              console.log(err);
              vm.$helpers.errorMsg('Can not create project')
            })
            .then(() => {
              vm.$spinner.pop();
            })
      }
    },
    created () {
      let vm = this;
      let accountData = vm.$store.getters.accountData;
      vm.$store.dispatch('getClientProjects', accountData.acc_id).then(() => {
        vm.projects = vm.$store.getters.clientProjects;
      })
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
          <div class="row">
            <div class="col-md-12" v-if="projects.length">
              <header class="main__title clearfix">
                <h2>Contract list</h2>
                <button class="btn btn-primary btn-sm" style="float: right;" @click="createProject">
                  Create project</button>
              </header>

              <div v-for="project in projects" class="listings-grid__item">
                  <div class="media-body">
                    <router-link :to="'/project/' + project.prj_id" class="media">
                      <div class="listings-grid__body">
                        <h3>{{project.prj_title}}</h3>
                        <p>
                          <span v-if="project.prj_budget">
                          Fixed-Price - <b>{{project.prj_budget}} CLN</b>
                        </span>
                          Posted <timeago :since="new Date(project.prj_created_at).toString()"></timeago>
                        </p>
                        <h5>{{project.prj_description}}</h5>
                        <!-- <h5>Lorem ipsum dolor sit amet.</h5> -->
                      </div>
                    </router-link>
                    <ul class="listings-grid__attrs">
                      <li>
                        <router-link :to="'/dashboard/projects/edit/' + project.prj_id">
                          <span class="label label-success">Update</span>
                        </router-link>
                      </li>
                      <li><span class="label label-warning">Stop</span></li>
                      <li><span class="label label-danger">Delete</span></li>
                    </ul>
                  </div>
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