<script>
  import api from '../api/api'
  import Headerblock from './partials/Header.vue'
  import Footerblock from './partials/Footer.vue'

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
          vm.freelancer = resp;
        })
        .catch(() => {
          vm.$router.push('/projects')
        })
    },
    components: {
      Headerblock,
      Footerblock
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <section v-if="freelancer" class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{freelancer.name}}</h2>
          <small>Freelancer</small>

          <div class="actions actions--section">
            <div class="actions__toggle">
              <input type="checkbox">
              <i class="zmdi zmdi-favorite-outline"></i>
              <i class="zmdi zmdi-favorite"></i>
            </div>

            <div class="dropdown">
              <a href="" data-toggle="dropdown"><i class="zmdi zmdi-share"></i></a>

              <div class="dropdown-menu pull-right rmd-share">
                <div></div>
              </div>
            </div>
          </div>
        </header>

        <div class="row">
          <div class="col-md-8">
            <div class="card profile">
              <div class="profile__img">
                <img src="http://www.iconsfind.com/wp-content/uploads/2016/10/20161014_58006be216aa3.png" alt="">
              </div>

              <div class="profile__info">

                <div class="profile__review">
                  <span class="rmd-rate" :data-rate-value="freelancer.rating" data-rate-readonly="true"></span>
                  <span>({{freelancer.review_count}} Review)</span>
                </div>

                <!--<div class="profile__review">-->
                  <!--<span class="rmd-rate" :data-rate-value="freelancer.rating" data-rate-readonly="true"></span>-->
                  <!--<span>({{freelancer.review_count}} Review)</span>-->
                <!--</div>-->

                <ul class="rmd-contact-list">
                  <li v-if="freelancer.contacts && freelancer.contacts.skype"><i class="zmdi zmdi-skype"></i>{{freelancer.contacts.skype}}</li>
                  <li v-if="freelancer.contacts && freelancer.contacts.phone"><i class="zmdi zmdi-phone"></i>{{freelancer.contacts.phone}}</li>
                  <li v-if="freelancer.contacts && freelancer.contacts.email"><i class="zmdi zmdi-email"></i>{{freelancer.contacts.email}}</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                <div class="tab-nav__inner">
                  <ul>
                    <li class="active">
                      <router-link to="#summary">Summary</router-link>
                    </li>
                    <!--<li><a href="freelancer-closed-pr-page.html">Closed projects</a></li> -->
                    <li>
                      <router-link to="#reviews">Reviews</router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-4 col-xs-offset-2">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2>{{freelancer.projects.active}}</h2>
                      <small>Active Projects</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2>{{freelancer.projects.completed}}</h2>
                      <small>completed projects</small>
                    </div>
                  </div>

                </div>

                <div class="card__sub">
                  <h4>About {{freelancer.name}}</h4>

                  {{freelancer.about}}
                </div>

                <!--<div class="card__sub">
                    <h4>Specialties</h4>
                    <p>PHP, HTML5, JavaScript, CSS, Linux System Administration</p>
                </div>
    -->

                <div v-if="freelancer.skills" class="card__sub">
                  <h4>Skills</h4>
                  <div class="list-group list-group--condensed list-group--bordered list-group--striped">

                    <div v-for="skill in freelancer.skills" class="list-group-item clearfix">
                      <div class="pull-left text-muted">{{skill.title}}</div>
                      <div class="pull-right"><strong class="text-strong">{{skill.years}} Year</strong></div>
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

          <div class="col-md-4 rmd-sidebar-mobile" id="agent-question">
            <form class="card">
              <div class="card__header">
                <h2>Send message</h2>
              </div>

              <div class="card__body m-t-10">

                <div class="form-group form-group--float">
                  <textarea class="form-control textarea-autoheight" rows="8"></textarea>
                  <i class="form-group__bar"></i>
                  <label>Message</label>
                </div>
              </div>

              <div class="card__footer">
                <button class="btn btn-primary">Send</button>
                <button class="btn btn-sm btn-link">Reset</button>
                <button class="btn btn-sm btn-link visible-sm-inline visible-xs-inline" data-rmd-action="block-close" data-rmd-target="#agent-question">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Button for mobile -->
    <button class="btn btn--action btn--circle visible-sm visible-xs" data-rmd-action="block-open"
            data-rmd-target="#agent-question">
      <i class="zmdi zmdi-comment-alt-text"></i>
    </button>

    <footerblock></footerblock>
  </div>
</template>