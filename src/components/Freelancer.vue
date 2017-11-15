<script>
  import Api from '../api/api'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        freelancer: null
      }
    },
    created: function () {
      let vm = this;

      vm.$spinner.push();
      return Api.getFreelancerData(vm.$route.params.id)
        .then(resp => {
          vm.freelancer = resp.data;
        })
        .catch((err) => {
          vm.$errors.handle(err);
          vm.$router.push('/projects')
        })
        .then(() => {
          vm.$spinner.pop();
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

    <section class="section" v-if="freelancer">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{freelancer.acc_name}} {{freelancer.acc_surname}}</h2>
          <small>Freelancer</small>
        </header>

        <div class="row">
          <div class="col-md-12">
            <div class="card profile">
              <div class="profile__img">
                <img v-if="freelancer.acc_avatar" :src="$config.api_host + '/' + freelancer.acc_avatar" alt=""/>
                <img v-else src="/assets/img/icons/avatar.png" alt=""/>
              </div>

              <div class="profile__info">

                <!--<div class="profile__review">-->
                  <!--<span class="rmd-rate" data-rate-value="5" data-rate-readonly="true"></span>-->
                  <!--<span>(2 Review)</span>-->
                <!--</div>-->

                <ul class="rmd-contact-list">
                  <li v-if="freelancer.acc_skype"><i class="zmdi zmdi-skype"></i>{{freelancer.acc_skype}}</li>
                  <li v-if="freelancer.acc_phone"><i class="zmdi zmdi-phone"></i>{{$helpers.formatPhone(freelancer.acc_phone)}}</li>
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
                      <h2>{{freelancer.projects_counters.active_projects}}</h2>
                      <small>Active Projects</small>
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6 col-lg-4 col-lg-offset-1">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2>{{freelancer.projects_counters.completed_projects}}</h2>
                      <small>completed projects</small>
                    </div>
                  </div>

                </div>

                <div v-if="freelancer.acc_description" class="card__sub">
                  <h4>About {{freelancer.acc_name}} {{freelancer.acc_surname}}</h4>
                  {{freelancer.acc_description}}
                </div>

                <div class="card__sub" v-if="freelancer.skills && freelancer.skills.length">
                  <h4>Skills</h4>
                  <div class="list-group list-group--condensed list-group--bordered list-group--striped">

                    <div v-for="skill in freelancer.skills" class="list-group-item clearfix">
                      <div class="pull-left text-muted">{{skill.skl_title}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>