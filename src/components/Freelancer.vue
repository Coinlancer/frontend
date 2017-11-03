<script>
  import api from '../api/api'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        freelancer: null
      }
    },
    beforeCreate: function () {
      let vm = this;

      return api.getFreelancerData(vm.$route.params.id)
        .then(resp => {
          vm.freelancer = resp.data;
        })
        .catch(() => {
          vm.$router.push('/projects')
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

    <section class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{freelancer.acc_name}} {{freelancer.acc_surname}}</h2>
          <small>Freelancer</small>
        </header>

        <div class="row">
          <div class="col-md-12">
            <div class="card profile">
              <div class="profile__img">
                <img src="/assets/img/default_user.png" alt="" />
              </div>

              <div class="profile__info">

                <!--<div class="profile__review">-->
                  <!--<span class="rmd-rate" data-rate-value="5" data-rate-readonly="true"></span>-->
                  <!--<span>(2 Review)</span>-->
                <!--</div>-->

                <ul class="rmd-contact-list">
                  <li v-if="freelancer.acc_skype"><i class="zmdi zmdi-skype"></i>{{freelancer.acc_skype}}</li>
                  <li v-if="freelancer.acc_phone"><i class="zmdi zmdi-phone"></i>{{freelancer.acc_phone}}</li>
                  <li v-if="freelancer.acc_email"><i class="zmdi zmdi-email"></i>{{freelancer.acc_email}}</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                <div class="tab-nav__inner">
                  <ul>
                    <li class="active"><a href="#">Summary</a></li>
                    <!--<li><a href="freelancer-closed-pr-page.html">Closed projects</a></li> -->
                    <!--<li><a href="freelancer-profile-reviews-pr-page.html">Reviews</a></li>-->
                  </ul>
                </div>
              </div>

              <div class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-12 col-md-6 col-lg-4 col-lg-offset-1">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2>{{freelancer.active_projects_count}}</h2>
                      <small>Active Projects</small>
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6 col-lg-4 col-lg-offset-1">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2>0</h2>
                      <small>completed projects</small>
                    </div>
                  </div>

                </div>

                <div class="card__sub">
                  <h4>About {{freelancer.acc_name}} {{freelancer.acc_surname}}</h4>
                  {{freelancer.acc_description}}
                </div>

                <div class="card__sub" v-if="freelancer.skills && freelancer.skills.length">
                  <h4>Skills</h4>
                  <div class="list-group list-group--condensed list-group--bordered list-group--striped">

                    <div v-for="skill in freelancer.skills" class="list-group-item clearfix">
                      <div class="pull-left text-muted">{{skill.skl_title}}</div>
                      <!--<div class="pull-right"><strong class="text-strong">6 Year</strong></div>-->
                    </div>
                  </div>
                </div>

                <!--<div class="card__sub">
                    <h4>Contact Information</h4>

                    <ul class="rmd-contact-list">
                        <li><i class="zmdi zmdi-phone"></i>308-360-8938</li>
                        <li><i class="zmdi zmdi-email"></i>robertbosborne@inbound.plus</li>
                        <li><i class="zmdi zmdi-facebook"></i>robertbosborne</li>
                        <li><i class="zmdi zmdi-twitter"></i>@robertbosborne</li>
                        <li><i class="zmdi zmdi-pin"></i>5470 Madison Street Severna Park, MD 21146</li>
                    </ul>
                </div>
                -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>