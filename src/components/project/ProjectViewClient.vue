<script>
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'

  //libraries
  import keythereum from 'keythereum';
  import sjcl from 'sjcl';

  export default {
    data: function () {
      let vm = this;

      let accountData = vm.$store.getters.accountData;

      return {
        accountData: accountData,
        project: null,
        attachments: null,
        freelancers: null,
        skills: null,
        steps: null,
        client: accountData,
        category: null,
        subcategory: null,
        is_owner: false
      }
    },
    computed: mapGetters({
      categories: 'allCategories',
    }),
    methods: {
      deleteStep: function (step_id, event) {
        let vm = this;
        let dialog_context = null;
        if (event) event.preventDefault()

        if (!step_id) {
          return false;
        }

        vm.$dialog.confirm("Confirm step deleting")
            .then((dialog) => {
              dialog_context = dialog;
              return api.deleteStep(step_id);
            })
            .then(() => {
              return api.getProjectSteps(vm.$route.params.id);
            })
            .then((steps) => {
              vm.steps = steps;
              return vm.$helpers.successMsg('Step deleted');
            })
            .catch((err) => {
              console.error(err);
              return vm.$helpers.errorMsg('Step deleting aborted');
            })
            .then(() => {
              dialog_context.close();
            });
      }
    },
    beforeCreate: function () {
      let vm = this;

      return api.getProjectData(vm.$route.params.id)
          .then(resp => {
            vm.project = resp.data.project;

            //temporary fix
            vm.project.prj_created_at = Date.parse(vm.project.prj_created_at.replace('-','/','g')) / 1000
            vm.project.prj_deadline = Date.parse(vm.project.prj_deadline.replace('-','/','g')) / 1000
            //todo get timestamp from db

            vm.skills = resp.data.skills || [];
            vm.attachments = resp.data.attachments || [];
            vm.subcategory = resp.data.subcategory || null;
            vm.category = resp.data.category || null;
            vm.steps = resp.data.steps || [];
            vm.is_owner = (vm.$store.getters.accountData.acc_id === vm.project.acc_id);
          })
          .catch((err) => {
            console.error(err);
            vm.$router.push('/projects')
          })
    },
    created () {
      this.$store.dispatch('getCategories');
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
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <section v-if="project && client" class="section">
      <div class="container">
        <header class="section__title text-left clearfix">
          <h2>{{project.prj_title}}</h2>
          <small>{{category.cat_title}} - {{subcategory.sct_title}}</small>
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
                <img src="/assets/img/default_user.png" alt="">
              </div>
              <!--<div class="profile__info">-->
                <!--<div class="profile__review">-->
                  <!--<span class="rmd-rate" :data-rate-value="client.rating" data-rate-readonly="true"></span>-->
                  <!--<span>({{client.review_count}} Review)</span>-->
                <!--</div>-->
                <!--<ul class="rmd-contact-list">-->
                  <!--<li v-if="client.contacts && client.contacts.skype"><i class="zmdi zmdi-skype"></i>{{client.contacts.skype}}</li>-->
                  <!--<li v-if="client.contacts && client.contacts.phone"><i class="zmdi zmdi-phone"></i>{{client.contacts.phone}}</li>-->
                  <!--<li v-if="client.contacts && client.contacts.email"><i class="zmdi zmdi-email"></i>{{client.contacts.email}}</li>-->
                <!--</ul>-->
              <!--</div>-->
              <div class="profile__info">
                <strong><a href="#">{{project.acc_name}} {{project.acc_surname}}</a></strong>
                <div class="profile__review">
                  <span class="rmd-rate" data-rate-value="3" data-rate-readonly="true"></span>
                  <span>(263 Review)</span>
                </div>
                <ul class="rmd-contact-list">
                  <li><i class="zmdi zmdi-skype"></i>Skeper_200</li>
                  <li><i class="zmdi zmdi-phone"></i>308-360-8938</li>
                  <li><i class="zmdi zmdi-email"></i>malinda@inbound.plus</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                <div class="tab-nav__inner">
                  <ul>
                    <li class="active"><a href="#">Task description</a></li>
                    <li><router-link :to="'/project/' + project.prj_id + '/suggestions/'">Suggestions</router-link></li>
                  </ul>
                </div>
              </div>

              <div class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2 class="capitalize">{{$humanize.naturalDay(project.prj_created_at, 'F, d')}}</h2>
                      <small>Started</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2 class="capitalize">{{$humanize.naturalDay(project.prj_deadline, 'F, d')}}</h2>
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

                <div v-if="skills && skills.length" class="card__sub">
                  <h4>Specialties</h4>
                  <p>{{ skills.map((skill) => { return skill.skl_title } ).join(', ')}}</p>
                </div>

                <div v-if="steps && steps.length" class="card__sub">
                  <h4>Steps of project</h4>
                  <div class="card-steps">
                    <ul>
                      <li v-for="step in steps">
                        <div class="list-group list-group--block tasks-lists">
                          <div v-if="step.step_is_completed" class="checked-icon" title="Ldfnnfffnf">
                            <img src="/assets/img/icons/checked.png" alt="">
                          </div>
                          <div class="list-group-item">
                            <div class="checkbox checkbox--char">
                              <label>
                                <input type="checkbox">
                                <span class="checkbox__helper"></span>
                                <span class="tasks-list__info">
                                    {{step.stp_title}}
                                    <span class="price-project">{{step.stp_budget}} CLN</span>
                                </span>
                              </label>
                            </div>

                            <div v-if="is_owner" class="actions list-group__actions">
                              <div class="dropdown">
                                <a href="#" data-toggle="dropdown"><i
                                    class="zmdi zmdi-more-vert"></i></a>

                                <ul class="dropdown-menu pull-right">
                                  <li><a href="#">Mark as done</a></li>
                                  <li><a href="#">Edit</a></li>
                                  <li><a href="#" @click="deleteStep(step.stp_id, $event)">Delete</a>
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

  </div>
</template>