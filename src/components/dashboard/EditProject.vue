<script>
  import Api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  import pretty from 'prettysize'
  import moment from 'moment'
  import Config from '../../config/index'

  export default {
    data: function () {

      return {
        account: null,
        add_step_is_loading: false,
        del_attach_is_loading: false,
        parent_categories: [],
        selected_parent_category: null,
        child_categories: [],
        selected_child_category: null,
        title: '',
        description: '',
        skills: [],
        last_selected_skills_ids: [],
        selected_skills: [],
        category: null,
        attachments: [],
        steps: [],
        //for date picker
        deadline: {
          time: ''
        },
        limit: [{
          type: 'fromto',
          from: moment().format('YYYY-MM-DD'),
          to: '2999-01-01'
        }],
        option: {
          type: 'day',
          week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
          month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          format: 'YYYY-MM-DD',
          placeholder: 'Deadline',
          inputStyle: {
            'display': 'inline-block',
            'padding': '6px',
            'line-height': '22px',
            'font-size': '16px',
            'border': '2px solid #fff',
            'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
            'border-radius': '2px',
            'color': '#5F5F5F'
          },
          color: {
            header: '#ccc',
            headerText: '#f00'
          },
          buttons: {
            ok: 'Ok',
            cancel: 'Cancel'
          },
          overlayOpacity: 0.5, // 0.5 as default
          dismissible: true // as true as default
        },
      }
    },
    beforeCreate: function () {
      let vm = this;

      return Api.getProjectData(vm.$route.params.id)
          .then(resp => {

            vm.account = vm.$store.getters.accountData;

            if (resp.data.project.acc_id != vm.account.acc_id) {
              vm.$router.push('/dashboard/projects');
            }

            let project_data = resp.data.project;

            vm.title = project_data.prj_title;
            vm.description = project_data.prj_description;
            vm.deadline.time = project_data.prj_deadline ? project_data.prj_deadline.split(' ')[0] : null;

            if (typeof resp.data.category != 'undefined' && resp.data.category && resp.data.category.cat_id) {
              vm.selected_parent_category = {
                value: resp.data.category.cat_id,
                label: resp.data.category.cat_title
              };

              if (vm.selected_parent_category) {
                let child_categories = vm.$store.getters.subcategoriesByCategory(resp.data.category.cat_id);
                vm.child_categories = [];
                child_categories.map(cat => {
                  vm.child_categories.push({
                    value: cat.sct_id,
                    label: cat.sct_title
                  })
                })
              }
            }

            if (typeof resp.data.subcategory != 'undefined' && resp.data.subcategory && resp.data.subcategory.sct_id) {
              vm.selected_child_category = {
                value: resp.data.subcategory.sct_id,
                label: resp.data.subcategory.sct_title
              };
            }

            //load steps
            if (typeof resp.data.steps != 'undefined' && resp.data.steps.length) {
              resp.data.steps.map(step => {
                vm.steps.push({
                  title: step.stp_title,
                  description: step.stp_description,
                  budget: step.stp_budget,
                  id: step.stp_id,
                  is_completed: step.stp_is_completed,
                })
              })
            }

            //load skills
            if (typeof resp.data.skills != 'undefined' && resp.data.skills.length) {
              resp.data.skills.map(skill => {
                vm.selected_skills.push({
                  value: skill.skl_id,
                  label: skill.skl_title
                })

                vm.last_selected_skills_ids.push(skill.skl_id);
              })
            }

            //load attachments
            if (typeof resp.data.attachments != 'undefined' && resp.data.attachments.length) {
              vm.attachments = resp.data.attachments;
            }

          })
          .catch((err) => {
            vm.$errors.handle(err)
            vm.$router.push('/dashboard/projects')
          })
    },
    created () {
      let vm = this;

      vm.$store.dispatch('getCategories').then(() => {
        let parent_categories = vm.$store.getters.categories;
        vm.parent_categories = [];
        parent_categories.map(cat => {
          vm.parent_categories.push({
            value: cat.cat_id,
            label: cat.cat_title
          })
        })
      });

      vm.$store.dispatch('getAllSkills').then(() => {
        let skills = vm.$store.getters.allSkills;
        skills.map(skill => {
          vm.skills.push({
            value: skill.skl_id,
            label: skill.skl_title
          })
        });
      });

    },
    methods: {

      pretty: function (size) {
        return pretty(size);
      },

      addAttachments: function (e) {
        let vm = this;
        e.preventDefault();

        if (e.target.files) {
          for (var i = 0; i < e.target.files.length; i++) {
            let file = e.target.files[i];
            if (file.size > Config.MAX_FILE_SIZE_IN_BYTES) {
              vm.$helpers.errorMsg('File ' + file.name + ' is too big. Limit is ' + vm.$humanize.filesize(Config.MAX_FILE_SIZE_IN_BYTES));
            } else {

              Api.addAttachment(vm.$route.params.id, file)
                .then((resp) => {
                  vm.attachments.push(resp.data);
                })
                .catch((err) => {
                  vm.$helpers.errorMsg('Can not add attachment ' + file.name);
                  vm.$errors.handle(err);
                })
                .then(() => {
                  e.target.value = '';
                })
            }
          }
        }
      },

      deleteAttachment: function (attachment_id, e) {
        let vm = this;
        e.preventDefault();

        attachment_id = parseInt(attachment_id);

        if (!attachment_id) {
          return;
        }

        vm.del_attach_is_loading = true;

        return Api.deleteAttachment(vm.$route.params.id, attachment_id)
            .then(() => {
              //todo remove after getAttachments method will added
              console.log(vm.attachments);
              vm.attachments.map((file, index) => {
                if (file.tch_id == attachment_id) {
                  vm.attachments.splice(index, 1);
                }
              })
            })
            .catch((err) => {
              vm.$helpers.errorMsg('Can not delete attachment ' + file.name);
              vm.$errors.handle(err);
            })
            .then(() => {
              vm.del_attach_is_loading = false;
            })
      },

      downloadAttachment: function (attachment_id, e) {
        let vm = this;
        e.preventDefault();

        attachment_id = parseInt(attachment_id);

        if (attachment_id) {
          //temporary hack
          let url = Config.api_host + '/projects/' + vm.$route.params.id + '/attachments/' + attachment_id;
          var win = window.open(url, '_blank');

          return win.focus();
          //return Api.downloadAttachment(vm.$route.params.id, attachment_id);
        }
      },

      getChildrenCategories: function (parent_cat) {
        let vm = this;
        let child_categories = vm.$store.getters.subcategoriesByCategory(parent_cat.value);

        if (!child_categories) {
          return vm.$helpers.errorMsg('Can not load subcategories list');
        }

        vm.child_categories = [];

        child_categories.map((cat) => {
          vm.child_categories.push({
            value: cat.sct_id,
            label: cat.sct_title
          })
        })
      },

      stepsHasErrors: function () {
        let vm = this;
        let errors = false;

        vm.steps.map((step, index) => {
          if (!step.title) {
            errors = true;
            vm.$helpers.errorMsg('Title of step #' + (index + 1) + ' is empty');
          }
          if (!step.budget || parseFloat(step.budget) <= 0) {
            errors = true;
            vm.$helpers.errorMsg('Budget of step #' + (index + 1) + ' is empty');
          }
        });

        return errors;
      },

      addStep: function (e) {
        e.preventDefault();
        let vm = this;

        if (vm.stepsHasErrors()) {
          return false;
        }

        vm.steps.push({
          title: null,
          description: null,
          budget: null
        });
      },

      getSteps: function () {
        let vm = this;
        return Api.getSteps(vm.$route.params.id)
            .then((resp) => {
              console.log(resp);
              vm.steps = [];
              if (typeof resp.data != 'undefined' && resp.data.length) {
                resp.data.map(step => {
                  vm.steps.push({
                    title: step.stp_title,
                    description: step.stp_description,
                    budget: step.stp_budget,
                    id: step.stp_id,
                    is_completed: step.stp_is_completed,
                  })
                })
              }
            })
            .catch(vm.$errors.handle)
      },

      saveStep: function (index, e) {
        e.preventDefault();
        let vm = this;

        if (vm.stepsHasErrors()) {
          return;
        }

        vm.add_step_is_loading = true;

        let data = {
          budget: parseFloat(vm.steps[index].budget),
          title: vm.steps[index].title,
          description: vm.steps[index].description
        };

        return Api.saveStep(vm.$route.params.id, data)
            .then((resp) => {
              console.log(resp);
              return vm.getSteps();
            })
            .then((resp) => {
              vm.$helpers.successMsg('Step saved');
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.add_step_is_loading = false;
            })
      },

      deleteStep: function (index, e) {
        e.preventDefault();
        let vm = this;

        return Api.deleteStep(vm.$route.params.id, vm.steps[index].id)
            .then((resp) => {
              console.log(resp);
              return vm.getSteps();
            })
            .then((resp) => {
              vm.$helpers.successMsg('Step deleted');
            })
            .catch(vm.$errors.handle)
      },

      updateProject: function (e) {
        e.preventDefault();
        let vm = this;

        if (!vm.title || !vm.title.length) {
          return vm.$helpers.errorMsg('Enter project title');
        }

        if (!vm.description || !vm.description.length) {
          return vm.$helpers.errorMsg('Enter project description');
        }

        if (!vm.deadline || !vm.deadline.time || !vm.deadline.time.length) {
          return vm.$helpers.errorMsg('Enter project deadline');
        }

        if (!vm.selected_child_category || !vm.selected_child_category.value) {
          return vm.$helpers.errorMsg('Select project category and subcategory');
        }

        if (!vm.steps.length) {
          return vm.$helpers.errorMsg('Add at least one step');
        }

        vm.$spinner.push();

        let data = {
          title: vm.title,
          description: vm.description,
          deadline: vm.deadline.time,
          subcategory_id: vm.selected_child_category.value,
        };

        return Api.updateProject(vm.$route.params.id, data)
            .then(() => {
              vm.$router.push('/dashboard/projects');
              return vm.$helpers.successMsg('Project updated');
            })
            .catch(vm.$errors.handle)
            .then(() => {
              vm.$spinner.pop();
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

        let data = {
          skill_id: skill_id
        };

        return Api.addSkill(vm.$route.params.id, data)
            .catch(vm.$errors.handle);
      },

      deleteSkill: function (skill_id) {
        let vm = this;

        let data = {
          skill_id: skill_id
        };

        return Api.deleteSkill(vm.$route.params.id, data)
            .catch(vm.$errors.handle);
      },
    },
    mounted () {
      this.$helpers.externalPluginsExecute();
    },
    components: {
      Headerblock,
      Sidebar,
    }
  }
</script>

<template>
  <div>
    <headerblock fullwidth="true"></headerblock>

    <main id="main">
      <sidebar role="client"></sidebar>
      <section id="main__content">

        <div class="main__container">
          <header class="main__title">
            <h2>Edit project details</h2>
          </header>

          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card__body">
                  <form enctype="multipart/form-data" @submit="updateProject">
                    <div class="form-group">
                      <input type="text" v-model="title" class="form-control" placeholder="Project name">
                      <i class="form-group__bar"></i>
                    </div>
                    <div class="form-group form-group--float">
                      <textarea
                          placeholder="Description"
                          v-model="description"
                          class="form-control textarea-autoheight"
                          rows="10"
                      ></textarea>
                      <i class="form-group__bar"></i>
                    </div>
                    <div class="form-group">
                      <h3>Deadline</h3>
                      <date-picker :date="deadline" :option="option" :limit="limit"></date-picker>
                      <i class="form-group__bar"></i>
                    </div>

                    <div class="form-group">
                      <h3>Skills</h3>

                      <v-select :on-change="onchangeSkill" multiple v-model="selected_skills" :options="skills"></v-select>
                    </div>

                    <div class="form-group">
                      <h3>Category</h3>

                      <v-select :on-change="getChildrenCategories" v-model="selected_parent_category" :options="parent_categories"></v-select>

                    </div>

                    <div v-if="child_categories && child_categories.length" class="form-group">
                      <h3>Subcategories</h3>
                      <v-select v-model="selected_child_category" :options="child_categories"></v-select>
                    </div>

                    <div class="form-group">
                      <h3>Steps of project</h3>
                      <span></span>

                      <div class="steps">
                        <div v-for="(step, index) in steps" class="form-group clearfix">

                          <div class="form-group form-group--float hidden-xs hidden-sm" style="width: 320px;">
                            <input type="text"
                                   class="form-control step"
                                   :placeholder="'Enter the title of step #' + (index + 1)"
                                   v-model="steps[index].title"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float step-left hidden-xs hidden-sm" style="width: 320px;">
                            <input type="number"
                                   min="0"
                                   class="form-control step"
                                   :placeholder="'Enter the budget of step #' + (index + 1)"
                                   v-model="steps[index].budget"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float hidden-xs hidden-sm" style="width: 500px;">
                              <textarea
                                  rows="5"
                                  class="form-control textarea-autoheight"
                                  style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible;"
                                  :placeholder="'Enter the description of step #' + (index + 1)"
                                  v-model="steps[index].description"
                              ></textarea>
                            <i class="form-group__bar"></i>
                          </div>

                          <div class="form-group form-group--float col-sm-12 visible-xs visible-sm">
                            <input type="text"
                                   class="form-control step"
                                   :placeholder="'Enter the title of step #' + (index + 1)"
                                   v-model="steps[index].title"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float col-sm-12 visible-xs visible-sm">
                            <input type="number"
                                   min="0"
                                   class="form-control step"
                                   :placeholder="'Enter the budget of step #' + (index + 1)"
                                   v-model="steps[index].budget"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float col-sm-12  clearfix visible-xs visible-sm">
                              <textarea
                                  rows="5"
                                  class="form-control textarea-autoheight"
                                  style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible;"
                                  :placeholder="'Enter the description of step #' + (index + 1)"
                                  v-model="steps[index].description"
                              ></textarea>
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float col-lg-12">
                            <button v-if="steps[index].id && !steps[index].is_completed" @click="deleteStep(index, $event)" class="btn btn-sm btn-danger" style="margin-left: -12px;">Delete step</button>
                            <button-spinner v-else
                                            :isLoading="add_step_is_loading"
                                            :disabled="add_step_is_loading"
                                            class="generate-button btn btn-sm btn-success"
                                            v-on:click.native="saveStep(index, $event)"
                                            style="margin-left: -12px;"
                            >
                              <span>Save step</span>
                            </button-spinner>
                          </div>
                        </div>
                        <button @click="addStep" class="generate-button btn btn-sm btn-primary">Add step</button>
                      </div>

                    </div>

                    <div v-if="attachments && attachments.length" class="form-group">
                      <h3>Uploaded files</h3>
                      <span></span>
                      <div class="steps">
                        <div v-for="(attachment, index) in attachments" class="form-group clearfix">
                          <a href="#" @click="downloadAttachment(attachment.tch_id, $event)">{{attachment.tch_title}}</a>
                          <button-spinner
                              v-on:click.native="deleteAttachment(attachment.tch_id, $event)"
                              :isLoading="del_attach_is_loading"
                              :disabled="del_attach_is_loading"
                              class="btn btn-xs btn-danger m-l-10"
                          >
                            <span>Delete</span>
                          </button-spinner>
                        </div>
                      </div>
                    </div>

                    <div class="contracts-button">
                      <div class="fileUpload btn btn-warning">
                        <span>Upload files</span>
                        <input type="file" @change="addAttachments" class="upload" multiple/>
                      </div>
                      <div class="contracts-button">
                        <button class="btn btn-primary">Update</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
  @import 'contracts.css';
</style>