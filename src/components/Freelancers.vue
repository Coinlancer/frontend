<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'
  import Api from '../api/api'

  export default {
    data: function () {
      let vm = this;
      return {
        freelancers: [],
        skills: [],
        //filter
        is_next_page_exist: true,
        selected_skills: [],
        filter_is_loading: false,
        cancel_filter_is_loading: false,
        default_filter: {
          page: 1,
          limit: vm.$config.limits.freelancers
        },
        filter: {
          page: 1,
          limit: vm.$config.limits.freelancers
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

        return prepared_filter;
      },

      loadDataWithFilters: function () {
        let vm = this;

        let filter = vm.prepareFilter();

        return Api.getFreelancers(filter)
            .then(response => {
              vm.freelancers = response.data;

              if (response.data.length != vm.$config.limits.freelancers) {
                vm.is_next_page_exist = false;
              }
            })
            .catch(vm.$errors.handle)
      },
      loadMore: function () {
        let vm = this;
        vm.filter.page += 1;

        let filter = vm.prepareFilter();

        return Api.getFreelancers(filter)
            .then(response => {
              vm.freelancers = vm.freelancers.concat(response.data);

              if (response.data.length != vm.$config.limits.freelancers) {
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

        vm.selected_skills = [];
        vm.is_next_page_exist = true;
        vm.filter.page = 1;

        return vm.loadDataWithFilters().then(() => {vm.cancel_filter_is_loading = false});
      }
    },
    created () {
      let vm = this;

      vm.$spinner.push();

      vm.$store.dispatch('getAllSkills').then(() => {
        let skills = vm.$store.getters.allSkills;
        skills.map(skill => {
          vm.skills.push({
            value: skill.skl_id,
            label: skill.skl_title
          })
        });
      });

      vm.loadDataWithFilters()
          .then(() => {
            vm.$spinner.pop();
          })
    },
    mounted () {
      let vm = this;
      vm.$helpers.externalPluginsExecute()
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
        <div class="col-sm-4">
          <form class="card">
            <div class="card__header">
              <h2>Advanced Freelancer Search</h2>
            </div>

            <div class="card__body">
              <!--<div class="form-group form-group&#45;&#45;float">-->
                <!--<input type="text" class="form-control" value="New York, NY">-->
                <!--<label>Location</label>-->
                <!--<i class="form-group__bar"></i>-->
              <!--</div>-->

              <!--<div class="form-group form-group&#45;&#45;range">-->
                <!--<label>Works in Price Range</label>-->
                <!--<div class="input-slider-values clearfix">-->
                  <!--<div class="pull-left"><span id="property-price-upper"></span><span> CL</span></div>-->
                  <!--<div class="pull-right"><span id="property-price-lower"></span><span> CL</span></div>-->
                <!--</div>-->
                <!--<div id="property-price-range"></div>-->
              <!--</div>-->

              <div class="form-group">
                <label>Skills</label>
                <v-select :closeOnSelect="false" multiple v-model="selected_skills" :options="skills"></v-select>
              </div>

              <!--<div class="form-group">-->
                <!--<label>Languages</label>-->

                <!--<select class="select2" multiple>-->
                  <!--<option value="" selected>English</option>-->
                  <!--<option value="">Spanish</option>-->
                  <!--<option value="">French</option>-->
                  <!--<option value="">Russian</option>-->
                  <!--<option value="">Chinese</option>-->
                <!--</select>-->
              <!--</div>-->
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
        <div v-if="freelancers && freelancers.length" class="col-md-8">
          <div class="row listings-grid">
            <div class="col-sm-6 col-md-3" v-for="freelancer in freelancers">
              <div class="listings-grid__item">
                <router-link :to="'/freelancer/' + freelancer.frl_id">
                  <div class="listings-grid__main">
                    <img v-if="freelancer.acc_avatar" :src="$config.api_host + '/' + freelancer.acc_avatar" alt=""/>
                    <img v-else src="/assets/img/icons/avatar.png" alt=""/>
                  </div>
                  <div class="listings-grid__body">
                    <h5>{{freelancer.acc_name}} {{freelancer.acc_surname}}</h5>
                    <small>{{freelancer.acc_email}}</small>
                    <small v-if="freelancer.acc_phone">{{$helpers.formatPhone(freelancer.acc_phone)}}</small>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div class="load-more" v-if="is_next_page_exist">
            <a href="javascript:void(0);" @click="loadMore"><i class="zmdi zmdi-refresh-alt"></i> Load more freelancers</a>
          </div>
        </div>

        <div v-else>
          <h2>No freelancers are registered yet</h2>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
  .listings-grid__item{
    min-height: 280px;
  }
</style>
