<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'
  import Api from '../api/api'

  export default {
    data: function () {
      let vm = this;
      return {
        projects: [],
        skills: [],
        categories: [],

        //filter
        is_next_page_exist: true,
        has_content: '',
        selected_skills: [],
        selected_category: null,
        filter_is_loading: false,
        cancel_filter_is_loading: false,

        selected_deadline_filter: null,
        deadline_filter: [
          {
            value: 1,
            label: 'Less than week'
          },
          {
            value: 2,
            label: 'Less than month'
          },
          {
            value: 3,
            label: 'From 1 to 3 month'
          },
          {
            value: 4,
            label: 'More than 3 month'
          },
        ],

        slider: null,
        min_budget: 0,
        max_budget: 0,
        min_budget_selected: 0,
        max_budget_selected: 0,

        default_filter: {
          page: 1,
          limit: vm.$config.limits.projects
        },
        filter: {
          page: 1,
          limit: vm.$config.limits.projects
        }
      }
    },
    methods: {
      prepareFilter: function () {
        let vm = this;
        let prepared_filter = {};

        prepared_filter.limit = vm.filter.limit;
        prepared_filter.offset = vm.filter.limit * (vm.filter.page - 1);

        let skills = [];
        if (vm.selected_skills.length) {
          vm.selected_skills.map(skill => {
            skills.push(skill.value);
          })
        }

        if (skills.length) {
          prepared_filter.skills = skills.join(',');
        }

        if (vm.selected_category) {
          prepared_filter.subcategory_id = vm.selected_category.value;
        }

        if (vm.has_content.length) {
          prepared_filter.content = vm.has_content;
        }

        if (vm.min_budget_selected) {
          prepared_filter.min_budget = vm.min_budget_selected;
        }

        if (vm.max_budget_selected) {
          prepared_filter.max_budget = vm.max_budget_selected;
        }

        if (vm.selected_deadline_filter && vm.selected_deadline_filter.value) {
          switch (vm.selected_deadline_filter.value) {
            case 1:
              prepared_filter.deadline_to = 7;
              break;
            case 2:
              prepared_filter.deadline_to = 30;
              break;
            case 3:
              prepared_filter.deadline_from = 30;
              prepared_filter.deadline_to = 90;
              break;
            case 4:
              prepared_filter.deadline_from = 90;
              break;
          }
        }

        return prepared_filter;
      },

      loadDataWithFilters: function () {
        let vm = this;

        let filter = vm.prepareFilter();

        return Api.getProjects(filter)
            .then(response => {
              vm.projects = response.data.projects;

              if (response.data.projects.length != vm.$config.limits.projects) {
                vm.is_next_page_exist = false;
              }

              return response;
            })
            .catch(vm.$errors.handle)
      },
      loadMore: function () {
        let vm = this;
        vm.filter.page += 1;

        let filter = vm.prepareFilter();

        return Api.getProjects(filter)
            .then(response => {
              vm.projects = vm.projects.concat(response.data.projects);

              if (response.data.projects.length != vm.$config.limits.projects) {
                vm.is_next_page_exist = false;
              }
            })
            .catch(vm.$errors.handle)
      },

      applyFilters: function (e) {
        e.preventDefault();
        let vm = this;
        vm.filter_is_loading = true;

        vm.is_next_page_exist = true;
        vm.filter.page = 1;

        return vm.loadDataWithFilters().then(() => {vm.filter_is_loading = false});
      },

      dropFilters: function (e) {
        e.preventDefault();
        let vm = this;

        vm.cancel_filter_is_loading = true;
        vm.filter = vm.default_filter;

        vm.has_content = '';
        vm.selected_skills = [];
        vm.selected_category = null;
        vm.selected_deadline_filter = null;
        vm.is_next_page_exist = true;

        if (vm.slider) {
          vm.slider.noUiSlider.set([vm.min_budget, vm.max_budget]);
        }
        vm.filter.page = 1;

        return vm.loadDataWithFilters().then(() => {vm.cancel_filter_is_loading = false});
      }
    },
    created () {
      let vm = this;

      vm.$spinner.push();

      if (vm.$route.query.subcategory_id) {
        vm.selected_category = vm.$route.query.subcategory_id;
      }

      vm.$store.dispatch('getAllSkills').then(() => {
        let skills = vm.$store.getters.allSkills;
        skills.map(skill => {
          vm.skills.push({
            value: skill.skl_id,
            label: skill.skl_title
          })
        });
      });

      vm.$store.dispatch('getCategories').then(() => {
        let child_categories = vm.$store.getters.subcategories;

        child_categories.map((cat) => {

          if (vm.selected_category && vm.selected_category == cat.sct_id) {
            vm.selected_category = {
              value: cat.sct_id,
              label: cat.sct_title
            };
          }

          vm.categories.push({
            value: cat.sct_id,
            label: cat.sct_title
          })
        });

        vm.loadDataWithFilters()
            .then((response) => {

              if (response.data.min_budget) {
                vm.min_budget = response.data.min_budget;
                vm.min_budget_selected = response.data.min_budget;
              }

              if (response.data.max_budget) {
                vm.max_budget = response.data.max_budget;
                vm.max_budget_selected = response.data.max_budget;
              }

              if (vm. max_budget && vm.min_budget) {
                var propertyPriceRange = document.getElementById('property-price-range');

                var propertyPriceRangeValues = [
                  document.getElementById('property-price-upper'),
                  document.getElementById('property-price-lower')
                ];

                noUiSlider.create(propertyPriceRange, {
                  start: [vm.min_budget, vm.max_budget],
                  connect: true,
                  range: {
                    'min': vm.min_budget,
                    'max': vm.max_budget
                  }
                });

                propertyPriceRange.noUiSlider.on('update', function (values, handle) {
                  if (handle == 0) {
                    vm.min_budget_selected = values[handle]
                  } else if (handle == 1) {
                    vm.max_budget_selected = values[handle]
                  }
                  propertyPriceRangeValues[handle].innerHTML = values[handle];
                });

                vm.slider = propertyPriceRange;
              } else {
                $('#filter').hide();
              }

              vm.$spinner.pop();
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
                <div class="form-group form-group--float">
                  <input type="text" v-model="has_content" class="form-control" value="">
                  <label class="fg-float">Find the job</label>
                  <i class="form-group__bar"></i>
                </div>

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

                  <v-select :closeOnSelect="false" multiple v-model="selected_skills" :options="skills"></v-select>
                </div>

                <div class="form-group">
                  <label>Category</label>

                  <v-select v-model="selected_category" :options="categories"></v-select>
                </div>

                <div class="form-group">
                  <label>Project length</label>

                  <v-select v-model="selected_deadline_filter" :options="deadline_filter"></v-select>
                </div>

                <div class="form-group form-group--range" id="filter">
                  <label>Price Range</label>
                  <div class="input-slider-values clearfix">
                    <div class="pull-left"><span id="property-price-upper"></span><span> CL</span></div>
                    <div class="pull-right"><span id="property-price-lower"></span></span><span> CL</span></div>
                  </div>
                  <div id="property-price-range"></div>
                </div>

              </div>

              <div class="card__footer">
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
                    class="btn btn-sm btn-link"
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
                          <b>{{project.prj_budget}} CL</b>
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
            <div class="load-more" v-if="is_next_page_exist">
              <a href="javascript:void(0);" @click="loadMore"><i class="zmdi zmdi-refresh-alt"></i> Load more projects</a>
            </div>
          </div>

          <div class="text-center" v-else>
            <h2>No projects</h2>
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
