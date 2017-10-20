<script>
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'
  import Footerblock from '../partials/Footer.vue'

  //libraries
  import keythereum from 'keythereum';
  import sjcl from 'sjcl';

  export default {
    data: function () {
      let vm = this;

      let userData = vm.$store.getters.userData;

      return {
        userData: userData,
        project: null,
        client: userData,
        is_owner: false
      }
    },
    computed: mapGetters({
      categories: 'allCategories',
      skills: 'allSkills'
    }),
    methods: {
      getCategoryNameById: function (id) {
        let vm = this;
        let category = vm.categories.filter((category) => {
          return category.cat_id == id
        });
        if (category.length) {
          return category[0].cat_title;
        }
      }
    },
    beforeCreate: function () {
      let vm = this;

      return api.getProjectData(vm.$route.params.id || null)
          .then(resp => {
            vm.project = resp.data.data;
            vm.is_owner = (vm.$store.getters.userData.acc_id === vm.project.acc_id);
          })
          .catch((err) => {
            console.error(err);
            vm.$router.push('/projects')
          })
    },
    created () {
      this.$store.dispatch('getAllCategories');
      this.$store.dispatch('getAllSkills');

//      //init all jquery operations
//      var params = { keyBytes: 32, ivBytes: 16 };
//      var dk = keythereum.create(params);
//
//      var encryptedData = sjcl.json.encrypt(password, JSON.stringify(dk));
//      encryptedData = btoa(encryptedData);
//
//      try {
//        let dk_decrypted = sjcl.json.decrypt(password, atob(encryptedData));
//        console.log('decrypted');
//        console.log(dk_decrypted);
//      } catch (e) {
//        console.error(r);
//        return false;
//      }

      $(".rmd-rate")[0] && $(".rmd-rate").each(function () {
        var rate = $(this).data("rate-value"), readOnly = $(this).data("rate-readonly");
        $(this).rateYo({
          rating: rate,
          fullStar: !0,
          starWidth: "18px",
          ratedFill: "#fcd461",
          normalFill: "#eee",
          readOnly: readOnly || "false"
        })
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

    <section v-if="project && client" class="section">
      <div class="container">
        <header class="section__title text-left clearfix">
          <h2>{{project.project.prj_title}}</h2>
          <small>
            <!--<span v-for="category_id in project.prj_category_ids">-->
              <!--{{getCategoryNameById(category_id)}}&nbsp;-->
            <!--</span>-->
          </small>
          <!--<div class="actions actions&#45;&#45;section">-->
          <!--<div class="actions__toggle">-->
          <!--<input type="checkbox">-->
          <!--<i class="zmdi zmdi-favorite-outline"></i>-->
          <!--<i class="zmdi zmdi-favorite"></i>-->
          <!--</div>-->

          <!--<div class="dropdown">-->
          <!--<a href="" data-toggle="dropdown"><i class="zmdi zmdi-share"></i></a>-->

          <!--<div class="dropdown-menu pull-right rmd-share">-->
          <!--<div></div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
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
                    <li class="active"><a href="contract-c.html">Task description</a></li>
                    <li><a href="contract-suggestions-c.html">Suggestions</a></li>
                    <!--<li><a href="agent-detail-reviews.html">Reviews</a></li>-->
                  </ul>
                </div>
              </div>

              <div class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2 class="capitalize">{{$humanize.naturalDay(project.prj_start_at)}}</h2>
                      <small>Started</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2 class="capitalize">{{$humanize.naturalDay(project.prj_end_at, 'F, d')}}</h2>
                      <small>Finish</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-red-400">
                      <h2>{{project.prj_budget}} CLN</h2>
                      <small>Price</small>
                    </div>
                  </div>
                </div>

                <div class="card__sub">
                  <h4>{{project.prj_title}}</h4>

                  {{project.prj_description}}
                </div>

                <div v-if="project.prj_skill_ids.length" class="card__sub">
                  <h4>Specialties</h4>
                  <p>{{ project.prj_skill_ids.map((skill_id) => { return getSkillNameById(skill_id) } ).join(', ')}}</p>
                </div>

                <div v-if="project.prj_steps.length" class="card__sub">
                  <h4>Steps of project</h4>
                  <div class="card-steps">
                    <ul>
                      <li v-for="step in project.prj_steps">
                        <div class="list-group list-group--block tasks-lists">
                          <div class="list-group-item">
                            <div class="checkbox checkbox--char">
                              <label>
                                <input type="checkbox">
                                <span class="checkbox__helper"></span>
                                <span class="tasks-list__info">
                                    {{step.title}}
                                    <span class="price-project">{{step.budget}} CLN</span>
                                </span>
                              </label>
                            </div>

                            <div v-if="is_owner" class="actions list-group__actions">
                              <div class="dropdown">
                                <a href="" data-toggle="dropdown"><i
                                    class="zmdi zmdi-more-vert"></i></a>

                                <ul class="dropdown-menu pull-right">
                                  <li><a href="">Mark as done</a></li>
                                  <li><a href="">Edit</a></li>
                                  <li><a href="" data-demo-action="delete-listing">Delete</a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!--<div class="card__sub">-->
                <!--<h4>Contact Information</h4>-->

                <!--<ul class="rmd-contact-list">-->
                <!--<li><i class="zmdi zmdi-phone"></i>308-360-8938</li>-->
                <!--<li><i class="zmdi zmdi-email"></i>robertbosborne@inbound.plus</li>-->
                <!--<li><i class="zmdi zmdi-facebook"></i>robertbosborne</li>-->
                <!--<li><i class="zmdi zmdi-twitter"></i>@robertbosborne</li>-->
                <!--<li><i class="zmdi zmdi-pin"></i>5470 Madison Street Severna Park, MD 21146</li>-->
                <!--</ul>-->
                <!--</div>-->
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

    <footerblock></footerblock>
  </div>
</template>