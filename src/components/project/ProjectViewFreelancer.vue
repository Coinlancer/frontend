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

      return {
        account: vm.$store.getters.accountData,
        project: null,
        attachments: null,
        freelancers: null,
        suggestion: null,
        skills: null,
        steps: null,
        sug_isLoading: false,
        category: null,
        subcategory: null,
        is_owner: false,
        is_suggestion_exist: false,
      }
    },
    computed: mapGetters({
      categories: 'allCategories',
    }),
    methods: {
      createSuggestion: function (e) {
        let vm = this;
        e.preventDefault();

        let price = event.target.price ? event.target.price.value : null;
        let hours = event.target.hours ? event.target.hours.value : null;
        let message = event.target.message ? event.target.message.value : null;

        price = parseFloat(price);
        hours = parseInt(hours);

        if (!price || price <= 0) {
          return vm.$helpers.errorMsg('Enter suggestion price');
        }

        if (!hours || price <= 0) {
          return vm.$helpers.errorMsg('Enter suggestion hours');
        }

        if (!message || !message.length) {
          return vm.$helpers.errorMsg('Enter suggestion message');
        }

        vm.sug_isLoading = true;

        return api.createSuggestion(vm.$route.params.id, {
              price: price,
              hours: hours,
              message: message
            })
            .then((resp) => {
              console.log(resp);
              vm.is_suggestion_exist = true; //todo: load suggestion data
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not send suggestion');
            })
            .then(() => {
                vm.sug_isLoading = false;
            })
      },

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
    },
    beforeCreate: function () {
      let vm = this;

      vm.$spinner.push();
      return api.getProjectData(vm.$route.params.id)
          .then(resp => {
            vm.project = resp.data.project;

            //temporary fix
            vm.project.prj_created_at = Date.parse(vm.project.prj_created_at.replace('-','/','g')) / 1000
            vm.project.prj_deadline = Date.parse(vm.project.prj_deadline.replace('-','/','g')) / 1000
            //todo get timestamp from db

            vm.skills = resp.data.skills || [];
            vm.attachments = resp.data.attachments || [];
            vm.suggestion = resp.data.suggestion || null;
            vm.subcategory = resp.data.subcategory || null;

            if (vm.account && resp.data.freelancers) {
              resp.data.freelancers.map(suggestion => {
                if (suggestion.frl_id == vm.account.frl_id) {
                  vm.is_suggestion_exist = true;
                }
              })
            }

            vm.category = resp.data.category || null;
            vm.steps = resp.data.steps || [];
            vm.is_owner = (vm.$store.getters.accountData.acc_id === vm.project.acc_id);
          })
          .catch((err) => {
            console.error(err);
            vm.$router.push('/projects')
          })
          .then(() => {
            vm.$spinner.pop();
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

    <section v-if="project" class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{project.prj_title}}</h2>
          <small>{{category.cat_title}} - {{subcategory.sct_title}}</small>
        </header>

        <div class="row">
          <div v-if="project" :class="is_owner ? 'col-md-12' : 'col-md-8'">
            <div class="card profile">
              <div class="profile__img">
                <img src="/assets/img/default_user.png" alt="">
              </div>
              <!--<div class="profile__info">-->
              <!--<div class="profile__review">-->
              <!--<span class="rmd-rate" :data-rate-value="account.rating" data-rate-readonly="true"></span>-->
              <!--<span>({{account.review_count}} Review)</span>-->
              <!--</div>-->
              <!--<ul class="rmd-contact-list">-->
              <!--<li v-if="account.contacts && account.contacts.skype"><i class="zmdi zmdi-skype"></i>{{account.contacts.skype}}</li>-->
              <!--<li v-if="account.contacts && account.contacts.phone"><i class="zmdi zmdi-phone"></i>{{account.contacts.phone}}</li>-->
              <!--<li v-if="account.contacts && account.contacts.email"><i class="zmdi zmdi-email"></i>{{account.contacts.email}}</li>-->
              <!--</ul>-->
              <!--</div>-->
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

          <div v-if="!is_owner" class="col-md-4 rmd-sidebar-mobile" id="agent-question">
            <div v-if="suggestion" class="card" style="text-align: center;">
              <div class="submit-property__success">
                <i class="zmdi zmdi-check"></i>
                <p>Project already active</p>
              </div>
            </div>
            <div v-else-if="is_suggestion_exist" class="card" style="text-align: center;">
              <div class="submit-property__success">
                <i class="zmdi zmdi-check"></i>

                <h2>Successful!</h2>
                <p>You have successfully sent a bid</p>
              </div>
            </div>
            <form v-else class="card" @submit="createSuggestion">
              <div class="card__header">
                <h2>Suggest an offer</h2>
              </div>

              <div class="card__body m-t-10">
                <div class="form-group form-group--float">
                  <input type="number" min="0" required name="price" class="form-control" placeholder="Price">
                  <i class="form-group__bar"></i>
                </div>
                <div class="form-group form-group--float">
                  <input type="number" min="1" step="1" required name="hours" class="form-control" placeholder="Working hours">
                  <i class="form-group__bar"></i>
                </div>
                <div class="form-group form-group--float">
                  <textarea name="message" required class="form-control textarea-autoheight" placeholder="Message"></textarea>
                  <i class="form-group__bar"></i>
                </div>
              </div>

              <div class="card__footer">
                <button-spinner
                    :isLoading="sug_isLoading"
                    :disabled="sug_isLoading"
                    class="btn btn-primary"
                >
                  <span>Submit</span>
                </button-spinner>
                <button type="reset" class="btn btn-sm btn-link">Reset</button>
                <button class="btn btn-sm btn-link visible-sm-inline visible-xs-inline"
                        data-rmd-action="block-close" data-rmd-target="#agent-question">Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Button for mobile -->
    <button v-if="!is_owner" class="btn btn--action btn--circle visible-sm visible-xs" data-rmd-action="block-open"
            data-rmd-target="#agent-question">
      <i class="zmdi zmdi-comment-alt-text"></i>
    </button>

  </div>
</template>