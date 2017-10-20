<script>

  import api from '../../api/api'
  import Headerblock from './partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'
  import Footerblock from './partials/Footer.vue'

  export default {
    data: function () {
      return {
        projects: []
      }
    },
    created () {
      let vm = this;
      let userData = vm.$store.getters.userData;
      vm.$store.dispatch('getClientProjects', userData.acc_id).then(() => {
        vm.projects = vm.$store.getters.clientProjects;
      })
    },
    components: {
      Headerblock,
      Sidebar,
      Footerblock
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <main id="main">
      <sidebar></sidebar>
      <section id="main__content">
        <div class="main__container">
          <div class="row">
            <div class="col-md-12" v-if="projects.length">
              <header class="main__title clearfix">
                <h2>Contract list</h2>
                <router-link class="btn btn-primary btn-sm" style="float: right;" to="/dashboard/projects/create">
                Create progect</router-link>
              </header>

              <div v-for="project in projects" class="listings-grid__item">
                <router-link :to="'/project/' + project.prj_id" class="media">
                  <div class="media-body">
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
                    <ul class="listings-grid__attrs">
                      <li><span class="label label-success">Update</span></li>
                      <li><span class="label label-warning">Stop</span></li>
                      <li><span class="label label-danger">Delete</span></li>
                    </ul>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else>
              <header class="main__title clearfix">
                <h2>You have not created any projects yet</h2>
                <router-link class="btn btn-primary btn-sm" style="float: right;" to="/dashboard/projects/create">
                  Create progect</router-link>
              </header>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
  @import '../../assets/css/contract.css';
</style>