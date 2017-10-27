<script>
  import api from '../api/api'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        client: null
      }
    },
    beforeCreate: function () {
      let vm = this;

      return api.getClientData(vm.$route.params.id)
          .then(resp => {
            vm.client = resp;
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

    <section v-if="client" class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{client.name}}</h2>
          <small>Client</small>

          <div class="actions actions--section">
            <div class="actions__toggle">
              <input type="checkbox">
              <i class="zmdi zmdi-favorite-outline"></i>
              <i class="zmdi zmdi-favorite"></i>
            </div>

            <div class="dropdown">
              <a href="#" data-toggle="dropdown"><i class="zmdi zmdi-share"></i></a>

              <div class="dropdown-menu pull-right rmd-share">
                <div></div>
              </div>
            </div>
          </div>
        </header>

        <div class="row">
          <div class="col-md-12">
            <div class="card profile">
              <div class="profile__img">
                <img src="http://www.iconsfind.com/wp-content/uploads/2016/10/20161014_58006be216aa3.png" alt="">
              </div>

              <div class="profile__info">

                <div class="profile__review">
                  <span class="rmd-rate" :data-rate-value="client.rating" data-rate-readonly="true"></span>
                  <span>({{client.review_count}} Review)</span>
                </div>

                <ul class="rmd-contact-list">
                  <li v-if="client.contacts && client.contacts.skype"><i class="zmdi zmdi-skype"></i>{{client.contacts.skype}}</li>
                  <li v-if="client.contacts && client.contacts.phone"><i class="zmdi zmdi-phone"></i>{{client.contacts.phone}}</li>
                  <li v-if="client.contacts && client.contacts.email"><i class="zmdi zmdi-email"></i>{{client.contacts.email}}</li>
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
                      <h2>{{client.projects.active}}</h2>
                      <small>Active Projects</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2>{{client.projects.completed}}</h2>
                      <small>completed projects</small>
                    </div>
                  </div>

                </div>

                <div class="card__sub">
                  <h4>About {{client.name}}</h4>

                  {{client.about}}
                </div>

                <!--<div class="card__sub">
                    <h4>Specialties</h4>
                    <p>PHP, HTML5, JavaScript, CSS, Linux System Administration</p>
                </div>
    -->

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

    <!-- Contact Button for mobile -->
    <button class="btn btn--action btn--circle visible-sm visible-xs" data-rmd-action="block-open"
            data-rmd-target="#agent-question">
      <i class="zmdi zmdi-comment-alt-text"></i>
    </button>

  </div>
</template>