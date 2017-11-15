<script>
  import Api from '../api/api'
  import Headerblock from './partials/Header.vue'

  export default {
    data: function () {
      return {
        client: null
      }
    },
    created: function () {
      let vm = this;

      vm.$spinner.push();
      return Api.getClientData(vm.$route.params.id)
          .then(resp => {
            vm.client = resp.data;
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

    <section v-if="client" class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{client.acc_name}} {{client.acc_surname}}</h2>
          <small>Client</small>
        </header>

        <div class="row">
          <div class="col-md-12">
            <div class="card profile">
              <div class="profile__img">
                <img v-if="client.acc_avatar" :src="$config.api_host + '/' + client.acc_avatar" alt=""/>
                <img v-else src="/assets/img/icons/avatar.png" alt=""/>
              </div>

              <div class="profile__info">

                <ul class="rmd-contact-list">
                  <li v-if="client.acc_skype"><i class="zmdi zmdi-skype"></i>{{client.acc_skype}}</li>
                  <li v-if="client.acc_phone"><i class="zmdi zmdi-phone"></i>{{$helpers.formatPhone(client.acc_phone)}}</li>
                  <li v-if="client.acc_email"><i class="zmdi zmdi-email"></i>{{client.acc_email}}</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                <div class="tab-nav__inner">
                  <ul>
                    <li class="active">
                      <router-link to="#">Summary</router-link>
                    </li>
                    <!--<li><a href="freelancer-closed-pr-page.html">Closed projects</a></li> -->
                    <!--<li>-->
                      <!--<router-link to="#reviews">Reviews</router-link>-->
                    <!--</li>-->
                  </ul>
                </div>
              </div>

              <div class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-4 col-xs-offset-2">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2>{{client.projects_counters.active_projects}}</h2>
                      <small>Active Projects</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2>{{client.projects_counters.completed_projects}}</h2>
                      <small>completed projects</small>
                    </div>
                  </div>
                </div>

                <div v-if="client.acc_description" class="card__sub">
                  <h4>About {{client.acc_name}} {{client.acc_surname}}</h4>
                  {{client.acc_description}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>