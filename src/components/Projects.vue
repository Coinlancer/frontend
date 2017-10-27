<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        projects: []
      }
    },
    methods: {
      setFilters: function (e) {
        let vm = this;
        console.log(e);
      },
      getSkillNameById: function (id) {
        let vm = this;
        let skill = vm.skills.filter((skill) => {
          return skill.skl_id == id
        });
        if (skill.length) {
          return skill[0].skl_title;
        }
      }
    },
    created () {
      let vm = this;
      vm.$store.dispatch('getProjects').then(() => {
        console.log(vm.$store.getters);
        vm.projects = vm.$store.getters.allProjects;
      })
    },
    components: {
      Headerblock,
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <div class="action-header">
      <div class="container">
        <div class="action-header__item action-header__item--search">
          <form>
            <input class="hidden-xs" type="text" placeholder="Search by neighborhood, city, zip or address...">
            <!-- For desktop -->
            <input class="visible-xs" type="text" placeholder="Search..."><!-- For mobile -->
          </form>
        </div>

        <div class="action-header__item action-header__views hidden-xs">
          <a href="#" class="zmdi zmdi-apps"></a>
          <a href="#" class="zmdi zmdi-view-list active"></a>
          <a href="#" class="zmdi zmdi-map"></a>
        </div>

        <div class="action-header__item action-header__item--sort hidden-xs">
          <span class="action-header__small">Sort by :</span>

          <select class="select2">
            <option>Featured listings</option>
            <option>Newest to oldest</option>
            <option>Oldest to Newest</option>
            <option>Price hight to low</option>
            <option>Price low to high</option>
            <option>Newest to Oldest</option>
            <option>No. of photos</option>
          </select>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <div class="row">
          <div class="col-sm-4">
            <form class="card">
              <div class="card__header">
                <h2>Advanced Property Search</h2>
              </div>

              <div class="card__body m-t-20">
                <div class="form-group form-group--float">
                  <input type="text" class="form-control" value="New York, NY">
                  <label class="fg-float">Location</label>
                  <i class="form-group__bar"></i>
                </div>

                <div class="form-group">
                  <label>Job Type</label>
                  <div class="btn-group btn-group-justified" data-toggle="buttons">
                    <label class="btn active">
                      <input type="radio" name="advanced-search-beds" id="rent" checked="">Permanent job
                    </label>
                    <label class="btn">
                      <input type="radio" name="advanced-search-beds" id="buy">Single orders
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label>Skills Required</label>

                  <select class="select2 select2-hidden-accessible" tabindex="-1" aria-hidden="true">
                    <option value="">1C:ENTERPRISE</option>
                    <option value="">360 VIEW</option>
                    <option value="">3D MODELING </option>
                    <option value="">3D RENDERING </option>
                    <option value="">ADOBE ANALYTICS</option>
                    <option value="">ANDROID STUDIO</option>
                    <option value="">ANGULARJS</option>
                    <option value="">ASP.NET</option>
                    <option value="">JAVA</option>
                    <option value="">JAVASCRIPT</option>
                    <option value="">PHP 5.X</option>
                    <option value="">POSTGRESQL</option>
                    <option value="">MYSQL</option>
                    <option value="">C++</option>
                    <option value="">PYTHON</option>
                  </select>
                </div>

                <div class="form-group form-group--range">
                  <label>Price Range</label>
                  <div class="input-slider-values clearfix">
                    <div class="pull-left"><span id="property-price-upper"></span><span> CLN</span></div>
                    <div class="pull-right"><span id="property-price-lower"></span></span><span> CLN</span></div>
                  </div>
                  <div id="property-price-range"></div>
                </div>

              </div>

              <div class="card__footer">
                <button class="btn btn-sm btn-primary">Search</button>
                <a href="#" class="btn btn-link" data-rmd-action="block-close"
                   data-rmd-target="#advanced-search">Save</a>
                <a href="#" class="btn btn-link" data-rmd-action="block-close"
                   data-rmd-target="#advanced-search">Cancel</a>
              </div>
            </form>
          </div>
          <div v-if="projects && projects.length" class="col-sm-8 listings-list">
            <div class="listings-grid__item" v-for="project in projects">
              <router-link :to="'/project/' + project.prj_id" class="media">
                <div class="media-body">
                  <div class="listings-grid__body">
                    <small>{{project.prj_title}}</small>
                    <p>
                      <span v-if="project.prj_budget">
                        Fixed-Price - <b>{{project.prj_budget}} CLN</b>
                      </span>
                       Posted <timeago :since="new Date(project.prj_created_at).toString()"></timeago></p>
                    <h5>{{project.prj_description}}</h5>
                  </div>

                  <ul v-if="project.skills && project.skills.length" class="listings-grid__attrs">
                    <li>Skills:</li>

                    <li v-for="skill in project.skills">
                      <span class="label label-success">{{skill.skl_title}}</span>
                    </li>
                  </ul>
                </div>
              </router-link>

              <div class="actions listings-grid__favorite">
                <div class="actions__toggle">
                  <input type="checkbox">
                  <i class="zmdi zmdi-favorite-outline"></i>
                  <i class="zmdi zmdi-favorite"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <h2>No projects are created yet</h2>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>
