<script>

  import Api from '../../api/api'
  import Config from '../../config/index'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        account: [],
        skills: [],
        current_role: null,
        info_is_loading: false,
        selected_skills: [],
        last_selected_skills_ids: [], //required for get difference between existed and added/removed skills,
        api_host: Config.api_host
      }
    },
    methods: {
      onUploadAvatar: function (e) {
        let vm = this;
        e.preventDefault();

        if (e.target.files && e.target.files[0]) {
          let file = e.target.files[0];

          if (file.size > Config.MAX_FILE_SIZE_IN_BYTES) {
            vm.$helpers.errorMsg('File ' + file.name + ' is too big. Limit is ' + vm.$humanize.filesize(Config.MAX_FILE_SIZE_IN_BYTES));
          } else {

            return Api.uploadAvatar(file)
                .then(() => {
                  return Api.getAccountInfo();
                })
                .then((resp) => {
                  vm.$store.dispatch('setAccountData', resp.data);
                  vm.account = vm.$store.getters.accountData;
                })
                .catch(vm.$errors.handle)
                .then(() => {
                  e.target.value = '';
                })
          }
        }
      },

      updateAccountInformation: function (e) {
        let vm = this;
        e.preventDefault();

        let name = e.target.name.value;
        let surname = e.target.surname.value;
        let skype = e.target.skype.value;
        let phone = e.target.phone.value;
        let description = e.target.description.value;

        //TODO validate data
        
        let data = {
          name: name,
          surname: surname,
          skype: skype,
          phone: phone,
          description: description
        };

        vm.info_is_loading = true;
        return Api.updateAccountInformation(data)
            .then(() => {
              return Api.getAccountInfo()
            })
            .then(resp => {
              vm.$store.dispatch('setAccountData', resp.data);
              vm.account = vm.$store.getters.accountData;

              return vm.$helpers.successMsg('Information saved');
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.info_is_loading = false;
            })
      },

      onchangeSkill: function () {
        let vm = this;

        //skill was added
        if (vm.last_selected_skills_ids.length < vm.selected_skills.length) {
          vm.selected_skills.map(skill => {
            if (vm.last_selected_skills_ids.indexOf(skill.value) == -1) {
              vm.addSkill(skill.value);
            }
          })
        } else if (vm.last_selected_skills_ids.length > vm.selected_skills.length) {
          //skill was removed
          vm.selected_skills.map(skill => {
            if (vm.last_selected_skills_ids.indexOf(skill.value) != -1) {
              delete vm.last_selected_skills_ids[vm.last_selected_skills_ids.indexOf(skill.value)];
            }
          });
          vm.last_selected_skills_ids.map(skill_id => {
            vm.deleteSkill(skill_id);
          })
        }

        //remember new skills
        vm.last_selected_skills_ids = [];
        vm.selected_skills.map(skill => {
          vm.last_selected_skills_ids.push(skill.value);
        })
      },

      addSkill: function (skill_id) {
        let vm = this;

        return Api.addFreelancerSkill(skill_id)
            .then((resp) => {
              console.log(resp);
              vm.$helpers.successMsg('Skill saved');
            })
            .catch(vm.$errors.handle)
      },

      deleteSkill: function (skill_id) {
        let vm = this;

        return Api.deleteFreelancerSkill(skill_id)
            .then((resp) => {
              console.log(resp);
              vm.$helpers.successMsg('Skill deleted');
            })
            .catch(vm.$errors.handle)
      },

    },
    created () {
      let vm = this;
      vm.account = vm.$store.getters.accountData;
      vm.current_role = vm.$helpers.getCurrentRole(vm.account);

      vm.$store.dispatch('getAllSkills').then(() => {
        let skills = vm.$store.getters.allSkills;
        skills.map(skill => {
          vm.skills.push({
            value: skill.skl_id,
            label: skill.skl_title
          })
        });

        if (vm.current_role == 'freelancer' && typeof vm.account.skills != 'undefined' && vm.account.skills.length) {
          vm.account.skills.map(skill => {
            vm.selected_skills.push({
              value: skill.skl_id,
              label: skill.skl_title
            });

            vm.last_selected_skills_ids.push(skill.skl_id);
          })
        }
      });
    },
    mounted () {
      this.$helpers.externalPluginsExecute();
    },
    components: {
      Headerblock,
      Sidebar
    }
  }
</script>

<template>
  <div>
    <headerblock fullwidth="true"></headerblock>

    <main id="main">
      <sidebar :role="current_role"></sidebar>

      <section id="main__content">

        <div class="main__container">
          <header class="main__title">
            <h2>Profile settings</h2>
          </header>

          <div class="list-group list-group--block">
            <div class="settings-information">
              <div class="avatar-block">
                <h3>Photo</h3>
                <div class="profile-portrait clearfix">
                  <div class="photo-wrap">
                    <img v-if="account.acc_avatar" :src="api_host + '/' + account.acc_avatar" alt=""/>
                    <img v-else src="/assets/img/icons/avatar.png" alt=""/>
                  </div>
                  <div class="photo-details">
                    <p>Freelancers with a friendly, professional-looking portrait are
                      hired 5 times more often than those without a photo.</p>
                    <a class="add-photo"><i class="zmdi zmdi-plus-circle"></i>Change a photo
                      now
                      <input class="upload-link__inp" @change="onUploadAvatar" name="photo" type="file" accept=".jpg,.jpeg,.png" />
                    </a>
                  </div>
                </div>
              </div>

              <!--<div class="setting-block-1">-->
                <!--<h2 class="m-b-20">Account information</h2>-->
                <!--<form @submit="updateAccountInformation">-->
                  <!--<div class="password-block clearfix">-->
                    <!--<div class="form-group form-group&#45;&#45;float form-group&#45;&#45;float-center form-group-weight clearfix">-->
                      <!--<input type="text" name="name" class="form-control" :value="account.acc_name">-->
                      <!--<i class="form-group__bar"></i>-->
                      <!--<label>Name</label>-->
                    <!--</div>-->
                    <!--<div class="form-group form-group&#45;&#45;float form-group&#45;&#45;float-center form-group-weight clearfix">-->
                      <!--<input type="text" name="surname" class="form-control" :value="account.acc_surname">-->
                      <!--<i class="form-group__bar"></i>-->
                      <!--<label>Surname</label>-->
                    <!--</div>-->
                    <!--<div class="form-group form-group&#45;&#45;float form-group&#45;&#45;float-center form-group-weight clearfix">-->
                      <!--<input type="text" name="skype" class="form-control" :value="account.acc_skype">-->
                      <!--<i class="form-group__bar"></i>-->
                      <!--<label>Skype</label>-->
                    <!--</div>-->
                    <!--<div class="form-group form-group&#45;&#45;float form-group&#45;&#45;float-center  form-group-weight clearfix">-->
                      <!--<input type="text" name="phone" class="form-control" :value="account.acc_phone">-->
                      <!--<i class="form-group__bar"></i>-->
                      <!--<label>Phone</label>-->
                    <!--</div>-->
                    <!--<div class="form-group form-group&#45;&#45;float">-->
                        <!--<textarea-->
                            <!--name="description"-->
                            <!--class="form-control textarea-autoheight"-->
                            <!--rows="10"-->
                        <!--&gt;{{account.acc_description}}</textarea>-->
                      <!--<i class="form-group__bar"></i>-->
                      <!--<label>CV</label>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<button-spinner-->
                      <!--:isLoading="info_is_loading"-->
                      <!--:disabled="info_is_loading"-->
                      <!--class="btn btn-sm btn-primary save-changes m-t-20"-->
                  <!--&gt;-->
                    <!--<span>Save</span>-->
                  <!--</button-spinner>-->
                <!--</form>-->
              <!--</div>-->

              <form @submit="updateAccountInformation">
                <div class="private-inform">
                  <h3>Private information</h3>
                  <div class="block-inform clearfix">
                    <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                      <input type="text" required name="name" class="form-control" :value="account.acc_name" id="firstname">
                      <i class="form-group__bar"></i>
                      <label>First name</label>
                    </div>
                    <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                      <input type="text" required name="surname" class="form-control" :value="account.acc_surname" id="lastname">
                      <i class="form-group__bar"></i>
                      <label>Last name</label>
                    </div>
                  </div>
                  <!--<h5>Date of birth</h5>-->
                  <!--<div class="date-birth">-->
                    <!--<div class="form-group">-->
                      <!--<input type="date" class="form-control" placeholder="Deadline project">-->
                      <!--<i class="form-group__bar"></i>-->
                    <!--</div>-->
                  <!--</div>-->
                </div>
                <div class="contact-inform">
                  <h3 class="margin-top">Contact Information</h3>
                  <div class="block-inform clearfix">
                    <!--<div class="form-group">-->
                      <!--<input type="email" name="email" class="form-control" :value="account.acc_phone" id="email" placeholder="E-mail">-->
                      <!--<i class="form-group__bar"></i>-->
                    <!--</div>-->
                    <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                      <input type="tel" name="phone" class="form-control" pattern="\d*" :value="account.acc_phone" id="phone">
                      <i class="form-group__bar"></i>
                      <label>Phone (format: 3801234567890)</label>
                    </div>
                  </div>
                </div>
                <!--<div class="location-inform">-->
                  <!--<h3 class="margin-top">Location</h3>-->
                  <!--<div class="block-inform clearfix">-->
                    <!--<div class="form-group">-->
                      <!--<input type="text" class="form-control" id="country" placeholder="Country">-->
                      <!--<i class="form-group__bar"></i>-->
                    <!--</div>-->
                    <!--<div class="form-group margin-left">-->
                      <!--<input type="text" class="form-control" id="city" placeholder="City">-->
                      <!--<i class="form-group__bar"></i>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="block-inform clearfix">-->
                    <!--<div class="form-group">-->
                      <!--<input type="text" class="form-control" id="address" placeholder="Address">-->
                      <!--<i class="form-group__bar"></i>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
                <h3 class="margin-top">Social network</h3>
                <div class="block-inform clearfix">
                  <!--<div class="form-group">-->
                    <!--<input type="text" class="form-control" id="website" placeholder="Website">-->
                    <!--<i class="form-group__bar"></i>-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--<div class="form-group margin-left">-->
                    <!--<input type="text" class="form-control" id="skype" placeholder="Skype">-->
                    <!--<i class="form-group__bar"></i>-->
                  <!--</div>-->
                  <div class="form-group form-group--float form-group--float-center form-group-weight clearfix">
                    <input type="text" name="skype" class="form-control" id="skype" :value="account.acc_skype">
                    <i class="form-group__bar"></i>
                    <label>Skype</label>
                  </div>
                </div>
                <h3 class="margin-top">CV</h3>
                <div class="resume-block">
                  <div class="form-group form-group--float form-group--float-center">
                    <textarea name="description" class="form-control textarea-autoheight" style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible;">{{account.acc_description}}</textarea>
                    <i class="form-group__bar"></i>
                    <label>Description</label>
                  </div>
                </div>
                <h3 v-if="current_role == 'freelancer'" class="margin-top">Skills</h3>
                <div v-if="current_role == 'freelancer'" class="skills-block clearfix">
                  <div class="form-group">
                    <label>Skills</label>
                    <v-select :on-change="onchangeSkill" multiple v-model="selected_skills" :options="skills"></v-select>
                  </div>
                </div>
                <div style="max-width: 112px;margin: 25px auto;">
                  <button-spinner
                      :isLoading="info_is_loading"
                      :disabled="info_is_loading"
                      class="save-changes btn btn-sm btn-primary"
                  >
                    <span>Save changes</span>
                  </button-spinner>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
  .margin-left {
    margin-left: 25px;
  }

  .margin-top {
    margin-top: 20px;
  }

  .list-group.list-group--block {
    padding: 30px;
  }

  .profile-portrait .photo-wrap {
    width: 120px;
    display: block;
  }

  .profile-portrait .photo-wrap img {
    width: 100%;
    border-radius: 50%;
  }

  .profile-portrait {
    display: inline-block;
  }

  .profile-portrait .photo-wrap, .photo-details {
    float: left;
  }

  .profile-portrait .photo-details {
    max-width: 400px;
    margin-left: 30px;
  }

  .profile-portrait .photo-details a {
    color: #37a000;
    text-decoration: none;
    font-weight: 500;
    font-size: 12px;
  }

  .profile-portrait .photo-details i {
    padding-right: 5px;
    font-size: 14px;
  }

  .avatar-block h3 {
    margin-bottom: 25px;
  }

  .date-birth input {
    color: #8a8a8a;
  }

  .settings-information form h3 {
    margin-bottom: 35px;
  }

  .settings-information .form-group {
    max-width: 320px;
  }

  .private-inform, .contact-inform, .location-inform, .avatar-block, .resume-block  {
    margin-bottom: 40px;
  }

  .block-inform .form-group {
    float: left;
    margin-bottom: 15px;
  }


  .skills-block .form-group {
    float: left;
  }


  .select2-container .select2-selection--single .select2-selection__rendered {
    color: #8a8a8a;
  }

  .save-steps {
    margin-top: 35px;
  }


  #steps-form .form-group--float {
    float: left;
  }

  #steps-form .step-form-group {
    margin-left: 15px;
  }

  #steps-form .count-form-group {
    margin-left: 15px;
    margin-top: 75px;
  }

  #steps-form span{
    display: block;
    float: left;
    font-size: 14px;
    margin-top: 8px;
    margin-left: -20px;
  }
  #steps-form textarea {
    height: 110px;
  }
  .add-photo {
    position:relative;
  }
  .upload-link__inp {
    top: -10px;
    right: -40px;
    z-index: 2;
    position: absolute;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
    font-size: 50px;
  }
</style>