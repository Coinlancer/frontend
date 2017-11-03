<script>
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'
  import config from '../../config/index'

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

      downloadAttachment: function (attachment_id, e) {
        let vm = this;
        e.preventDefault();

        attachment_id = parseInt(attachment_id);

        if (attachment_id) {
          //temporary hack
          let url = config.api_host + '/projects/' + vm.$route.params.id + '/attachments/' + attachment_id;
          var win = window.open(url, '_blank');

          return win.focus();
        }
      },

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
              return api.deleteStep(vm.$route.params.id, step_id);
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
    },
    mounted: function () {
      let vm = this;
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        vm.$helpers.externalPluginsExecute();
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
              <div class="profile__info">
                <strong><a href="#">{{project.acc_name}} {{project.acc_surname}}</a></strong>
                <div class="profile__review">
                  <span class="rmd-rate" data-rate-value="3" data-rate-readonly="true"></span>
                </div>
                <ul class="rmd-contact-list">
                  <li><i v-if="project.acc_skype" class="zmdi zmdi-skype"></i>{{project.acc_skype}}</li>
                  <li><i v-if="project.acc_phone" class="zmdi zmdi-phone"></i>{{project.acc_phone}}</li>
                  <li><i v-if="project.acc_email" class="zmdi zmdi-email"></i>{{project.acc_email}}</li>
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
                      <h2>{{project.prj_budget}} CL</h2>
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
                                    <span class="price-project">{{step.stp_budget}} CL</span>
                                </span>
                              </label>
                            </div>

                            <div v-if="is_owner" class="actions list-group__actions">
                              <div class="dropdown">
                                <a href="#" data-toggle="dropdown"><i
                                    class="zmdi zmdi-more-vert"></i></a>

                                <ul class="dropdown-menu pull-right">
                                  <!--<li><a href="#">Mark as done</a></li>-->
                                  <!--<li><a href="#">Edit</a></li>-->
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

                <div v-if="attachments && attachments.length" class="card__sub">
                  <h4>Uploaded files</h4>
                  <span></span>
                  <div class="steps">
                    <div v-for="(attachment, index) in attachments" class="form-group clearfix">
                      <a href="#" @click="downloadAttachment(attachment.tch_id, $event)">{{attachment.tch_title}}</a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Button for mobile -->
    <button v-if="account && account.acc_id" class="btn btn--action btn--circle visible-sm visible-xs" data-rmd-action="block-open"
            data-rmd-target="#agent-question">
      <i class="zmdi zmdi-comment-alt-text"></i>
    </button>

  </div>
</template>