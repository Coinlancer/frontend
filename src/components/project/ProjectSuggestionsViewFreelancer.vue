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

      return {
        account: vm.$store.getters.accountData,
        project: null,
        suggestion: null,
        attachments: null,
        freelancers: null,
        skills: null,
        steps: null,
        sug_isLoading: false,
        categories: null,
        subcategories: null,
        is_owner: false
      }
    },
    computed: mapGetters({
      categories: 'allCategories',
    }),
    methods: {
      createSuggestion: function (event) {
        let vm = this;
        vm.sug_isLoading = true;

        event.preventDefault();

        let price = event.target.price ? event.target.price.value : null;
        let hours = event.target.hours ? event.target.hours.value : null;
        let message = event.target.message ? event.target.message.value : null;

        return api.createSuggestion(vm.$route.params.id, {
              price: price,
              hours: hours,
              message: message
            })
            .then((resp) => {
              console.log(resp);
              vm.suggestion = true; //todo: load sugestion data
              //vm.$helpers.successMsg('Suggestion was sent');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not send suggestion');
            })
            .then(() => {
              vm.sug_isLoading = false;
            })
      }
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
            vm.freelancers = resp.data.freelancers || [];
            vm.suggestion = resp.data.suggestion || null;
            vm.subcategory = resp.data.subcategory || null;
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

    <section class="section">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{project.prj_title}}</h2>
          <small>{{category.cat_title}} - {{subcategory.sct_title}}</small>
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
          <div v-if="project" class="col-md-8">
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
                    <li><router-link :to="'/project/' + project.prj_id">Task description</router-link></li>
                    <li class="active"><a href="#">Suggestions</a></li>
                  </ul>
                </div>
              </div>

              <div v-if="freelancers && freelancers.length" class="listings-list listings-list--alt">
                <div v-for="freelancer in freelancers" class="listings-grid__item">
                  <a href="#" class="media">
                    <a class="list-group-item media" href="#">
                      <div class="pull-left">
                        <img src="/assets/img/default_user.png" alt="" class="list-group__img img-circle" width="65" height="65">
                      </div>
                      <div class="media-body list-group__text">
                        <strong>{{freelancer.acc_name}} {{freelancer.acc_surname}}</strong>
                        <small class="list-group__text">+1-202-555-0121</small>
                        <div class="rmd-rate jq-ry-container" data-rate-value="5" data-rate-readonly="true" readonly="readonly" style="width: 90px;"><div class="jq-ry-group-wrapper"><div class="jq-ry-normal-group jq-ry-group"><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#eee"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#eee" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#eee" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#eee" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#eee" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg></div><div class="jq-ry-rated-group jq-ry-group" style="width: 100%;"><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#fcd461"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#fcd461" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#fcd461" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#fcd461" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg><!--?xml version="1.0" encoding="utf-8"?--><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 12.705 512 486.59" x="0px" y="0px" xml:space="preserve" width="18px" height="18px" fill="#fcd461" style="margin-left: 0px;"><polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566 "></polygon></svg></div></div></div>
                      </div>
                    </a>

                    <div class="media-body">
                      <div class="listings-grid__body">
                        <small>{{freelancer.prf_hours}} hours | {{freelancer.prf_price}} CLN</small>
                        <h5>{{freelancer.prf_message}}</h5>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <div v-else class="listings-list listings-list--alt">
                <h2 style="text-align: center;">No suggestions yet</h2>
              </div>

            </div>
          </div>

          <div v-if="suggestion" class="col-md-4 rmd-sidebar-mobile" id="agent-question">
            <div class="card" style="text-align: center;">
              <div class="submit-property__success">
                <i class="zmdi zmdi-check"></i>

                <h2>Successful!</h2>
                <p>You have successfully sent a bid</p>
              </div>
            </div>
          </div>
          <div v-else class="col-md-4 rmd-sidebar-mobile" id="agent-question">
            <form class="card" @submit="createSuggestion">
              <div class="card__header">
                <h2>Suggest an offer</h2>
              </div>

              <div class="card__body m-t-10">
                <div class="form-group form-group--float">
                  <input type="text" name="price" class="form-control" placeholder="Price">
                  <i class="form-group__bar"></i>
                </div>
                <div class="form-group form-group--float">
                  <input type="text" name="hours" class="form-control" placeholder="Working hours">
                  <i class="form-group__bar"></i>
                </div>
                <div class="form-group form-group--float">
                  <textarea name="message" class="form-control textarea-autoheight" placeholder="Message"></textarea>
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
    <button class="btn btn--action btn--circle visible-sm visible-xs" data-rmd-action="block-open"
            data-rmd-target="#agent-question">
      <i class="zmdi zmdi-comment-alt-text"></i>
    </button>

  </div>
</template>