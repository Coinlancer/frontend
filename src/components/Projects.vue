<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      let vm = this;
      return {
        projects: [],
        skills: [],
        categories: [],
        filter_is_loading: false,
        cancel_filter_is_loading: false,
        default_filter: {
          min_budget: 0,
          max_budget: 0,
          selected_min_budget: 0,
          selected_max_budget: 0,
          skills: [],
          category: null,
        },
        filter: {
          min_budget: 0,
          max_budget: 0,
          selected_min_budget: 0,
          selected_max_budget: 0,
          skills: [],
          category: null,
        }
      }
    },
    methods: {
      onchangeSkill: function () {
        let vm = this;

      },
      applyFilters: function (e) {
        e.preventDefault();
        let vm = this;
        vm.filter_is_loading = true;

        let skills = [];

        vm.filter.skills.map(skill => {
          skills.push(skill.value);
        });

        let filters = {};

        if (vm.filter.category && vm.filter.category.value) {
          filters.subcategory_id = vm.filter.category.value;
        }

        if (skills) {
          filters.skills = skills.join(',')
        }

        vm.$store.dispatch('getProjects', filters)
            .then(() => {
              vm.projects = vm.$store.getters.allProjects;
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not apply filters');
            })
            .then(() => {
              vm.filter_is_loading = false;
            })
      },

      dropFilters: function (e) {
        e.preventDefault();
        let vm = this;
        vm.cancel_filter_is_loading = true;

        vm.filter = vm.default_filter;

        vm.$store.dispatch('getProjects')
            .then(() => {
              vm.projects = vm.$store.getters.allProjects;
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not cancel filters');
            })
            .then(() => {
              vm.cancel_filter_is_loading = false;
            })
      }
    },
    created () {
      let vm = this;

      let filters = {};

      if (vm.$route.query.subcategory_id) {
        filters.subcategory_id = vm.$route.query.subcategory_id;
      }

      vm.$store.dispatch('getProjects', filters).then(() => {
        vm.projects = vm.$store.getters.allProjects;
        vm.filter.min_budget = vm.$store.getters.minBudget;
        vm.filter.max_budget = vm.$store.getters.maxBudget;
      })
      vm.$store.dispatch('getAllSkills').then(() => {
        let skills = vm.$store.getters.allSkills;
        skills.map(skill => {
          vm.skills.push({
            value: skill.skl_id,
            label: skill.skl_title
          })
        });
      })

      vm.$store.dispatch('getCategories').then(() => {
        let child_categories = vm.$store.getters.subcategories;

        child_categories.map((cat) => {

          if (filters.subcategory_id && filters.subcategory_id == cat.sct_id) {
            vm.filter.category = {
              value: cat.sct_id,
              label: cat.sct_title
            };
          }

          vm.categories.push({
            value: cat.sct_id,
            label: cat.sct_title
          })
        })
      });
    },
    mounted () {
      this.$helpers.externalPluginsExecute();
    },
    components: {
      Headerblock,
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <section class="section">
      <div class="container">

        <div class="row">
          <div class="col-sm-4">
            <form class="card">
              <div class="card__header">
                <h2>Advanced Property Search</h2>
              </div>

              <div class="card__body m-t-20">
                <!--<div class="form-group form-group&#45;&#45;float">-->
                  <!--<input type="text" class="form-control" value="New York, NY">-->
                  <!--<label class="fg-float">Location</label>-->
                  <!--<i class="form-group__bar"></i>-->
                <!--</div>-->

                <!--<div class="form-group">-->
                  <!--<label>Job Type</label>-->
                  <!--<div class="btn-group btn-group-justified" data-toggle="buttons">-->
                    <!--<label class="btn active">-->
                      <!--<input type="radio" name="advanced-search-beds" id="rent" checked="">Permanent job-->
                    <!--</label>-->
                    <!--<label class="btn">-->
                      <!--<input type="radio" name="advanced-search-beds" id="buy">Single orders-->
                    <!--</label>-->
                  <!--</div>-->
                <!--</div>-->

                <div class="form-group">
                  <label>Skills Required</label>

                  <v-select :closeOnSelect="false" :on-change="onchangeSkill" multiple v-model="filter.skills" :options="skills"></v-select>
                </div>

                <div class="form-group">
                  <label>Category</label>

                  <v-select v-model="filter.category" :options="categories"></v-select>
                </div>

                <!--<div class="form-group form-group&#45;&#45;range">-->
                  <!--<label>Price Range</label>-->
                  <!--<div class="input-slider-values clearfix">-->
                    <!--<div class="pull-left"><span id="property-price-upper"></span><span> CL</span></div>-->
                    <!--<div class="pull-right"><span id="property-price-lower"></span></span><span> CL</span></div>-->
                  <!--</div>-->
                  <!--<div id="property-price-range"></div>-->
                <!--</div>-->

              </div>

              <div class="card__footer text-center">
                <button-spinner
                    :isLoading="filter_is_loading"
                    :disabled="filter_is_loading"
                    class="btn btn-sm btn-primary"
                    v-on:click.native="applyFilters($event)"
                >
                  <span>Search</span>
                </button-spinner>
                <!--<a href="#" class="btn btn-link" data-rmd-action="block-close"-->
                   <!--data-rmd-target="#advanced-search">Save</a>-->
                <button-spinner
                    :isLoading="cancel_filter_is_loading"
                    :disabled="cancel_filter_is_loading"
                    class="btn btn-sm btn-warning"
                    v-on:click.native="dropFilters($event)"
                >
                  <span>Clear</span>
                </button-spinner>
              </div>
            </form>
          </div>
          <div v-if="projects && projects.length" class="col-sm-8 listings-list">
            <div v-for="project in projects">
              <div v-if="project.prj_title"  class="listings-grid__item">
                <router-link :to="'/project/' + project.prj_id" class="media">
                  <div class="media-body">
                    <div class="listings-grid__body">
                      <small>{{project.prj_title}}</small>
                      <p>
                        <span v-if="project.prj_budget">
                          Fixed-Price - <b>{{project.prj_budget}} CL</b>
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
