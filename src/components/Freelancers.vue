<script>
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        freelancers: []
      }
    },
    beforeCreate () {
      let vm = this;
      vm.$store.dispatch('getFreelancers').then(() => {
        vm.freelancers = vm.$store.getters.allFreelancers;
      });
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
        <!--<div class="col-sm-4">-->
          <!--<form class="card">-->
            <!--<div class="card__header">-->
              <!--<h2>Advanced Agent Search</h2>-->
            <!--</div>-->

            <!--<div class="card__body">-->
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

              <!--<div class="form-group">-->
                <!--<label>Specialities</label>-->

                <!--<select class="select2" multiple>-->
                  <!--<option value="" selected>Web programming</option>-->
                  <!--<option value="" selected>C/C++</option>-->
                  <!--<option value="" selected>JavaScript</option>-->
                  <!--<option value="" selected>PHP</option>-->
                  <!--<option value="" selected>Python</option>-->
                <!--</select>-->
              <!--</div>-->

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
            <!--</div>-->

            <!--<div class="card__footer">-->
              <!--<button class="btn btn-sm btn-primary">Search</button>-->
              <!--<a href="" class="btn btn-sm btn-link" data-rmd-action="block-close"-->
                 <!--data-rmd-target="#agent-search">Cancel</a>-->
            <!--</div>-->
          <!--</form>-->
        <!--</div>-->
        <div v-if="freelancers && freelancers.length" class="col-md-12">
          <div class="row listings-grid">
            <div class="col-sm-6 col-md-2" v-for="freelancer in freelancers">
              <div class="listings-grid__item">
                <router-link :to="'/freelancer/' + freelancer.frl_id">
                  <div class="listings-grid__main">
                    <img src="/assets/img/default_user.png" alt="">
                  </div>
                  <div class="listings-grid__body">
                    <h5>{{freelancer.acc_name}} {{freelancer.acc_surname}}</h5>
                    <small>{{freelancer.acc_email}}</small>
                    <small>{{freelancer.acc_phone}}</small>
                  </div>

                  <ul class="listings-grid__attrs">
                    <li class="rmd-rate" data-rate-value="3" data-rate-readonly="true"></li>
                  </ul>
                </router-link>
              </div>
            </div>
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
    min-height: 330px;
  }
</style>
