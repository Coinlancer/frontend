<script>
  import api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  import pretty from 'prettysize'

  export default {
    data: function () {

      return {
        account: null,
        parent_categories: [],
        selected_parent_category: null,
        child_categories: [],
        selected_child_category: null,
        title: '',
        budget: null,
        description: '',
        deadline: null,
        skills: [],
        last_selected_skills_ids: [],
        selected_skills: [],
        category: null,
        attachments: null,
        steps: []
      }
    },
    beforeCreate: function () {
      let vm = this;

      return api.getProjectData(vm.$route.params.id)
          .then(resp => {

            vm.account = vm.$store.getters.accountData;

            if (resp.data.project.acc_id != vm.account.acc_id) {
              vm.$router.push('/dashboard/projects');
            }

            let project_data = resp.data.project;

            vm.title = project_data.prj_title;
            vm.budget = project_data.prj_budget;
            vm.description = project_data.prj_description;
            vm.deadline = project_data.prj_deadline ? project_data.prj_deadline.split(' ')[0] : null;

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

          })
          .catch((err) => {
            console.error(err);
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
        vm.attachments = e.target.files;
      },
      getChildrenCategories: function (parent_cat) {

        let vm = this;
        let child_categories = vm.$store.getters.subcategoriesByCategory(parent_cat.value);

        console.log(child_categories);

        if (!child_categories) {
          return vm.$helpers.errorMsg('Can not load subcategories list');
        }
        vm.child_categories = [];
        child_categories.map(cat => {
          vm.child_categories.push({
            value: cat.sct_id,
            label: cat.sct_title
          })
        })
      },
      calculateStepBudget: function () {
        let vm = this;
        let steps_budget = 0;

        vm.steps.map((step) => {
          steps_budget += parseFloat(step.budget);
        });

        return steps_budget;
      },

      stepsHasErrors: function () {
        let vm = this;
        let errors = false;

        vm.steps.map((step, index) => {
          if (!step.title) {
            errors = true;
            vm.$helpers.errorMsg('Title of step #' + (index + 1) + ' is empty');
          }
          if (!step.budget) {
            errors = true;
            return vm.$helpers.errorMsg('Budget of step #' + (index + 1) + ' is empty');
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

        if (vm.calculateStepBudget() >= vm.budget) {
          vm.$helpers.errorMsg('Budget project already used by steps.');
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
        return api.getSteps(vm.$route.params.id)
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
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not load project steps');
            })
      },

      saveStep: function (index, e) {
        e.preventDefault();
        let vm = this;

        let data = {
          budget: parseFloat(vm.steps[index].budget),
          title: vm.steps[index].title,
          description: vm.steps[index].description
        };

        return api.saveStep(vm.$route.params.id, data)
            .then((resp) => {
              console.log(resp);
              return vm.getSteps();
            })
            .then((resp) => {
              vm.$helpers.successMsg('Step saved');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not save step');
            })
      },

      deleteStep: function (index, e) {
        e.preventDefault();
        let vm = this;

        return api.deleteStep(vm.steps[index].id)
            .then((resp) => {
              console.log(resp);
              return vm.getSteps();
            })
            .then((resp) => {
              vm.$helpers.successMsg('Step deleted');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Can not delete step');
            })
      },

      updateProject: function (e) {
        e.preventDefault();
        let vm = this;

        vm.$spinner.push();

        let data = new FormData();

        if (vm.attachments) {
          for (var i = 0; i < vm.attachments.length; i++) {
            let file = vm.attachments[i];
            data.append('attachments[' + i + ']', file, file.name);
          }
        }

        data.append('title', vm.title);
        data.append('budget', vm.budget);
        data.append('description', vm.description);
        data.append('deadline', vm.deadline);
        data.append('subcategory_id', vm.selected_child_category.value);

        return api.updateProject(vm.$route.params.id, data)
            .then(() => {
              vm.$router.push('/dashboard/projects');
              return vm.$helpers.successMsg('Project updated');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Cannot update project. Check fields');
            })
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
        };

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

        return api.addSkill(vm.$route.params.id, data);
      },

      deleteSkill: function (skill_id) {
        let vm = this;

        let data = {
          skill_id: skill_id
        };

        return api.deleteSkill(vm.$route.params.id, data);
      },
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
      <sidebar></sidebar>
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
                      <input type="text" v-model="title" class="form-control" placeholder="Name project">
                      <i class="form-group__bar"></i>
                    </div>
                    <div class="form-group">
                      <input type="number" v-model="budget" class="form-control" placeholder="Budget">
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
                      <input type="date" v-model="deadline" class="form-control" placeholder="Deadline project">
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

                      <div class="steps" v-if="budget">
                        <div v-for="(step, index) in steps" class="form-group clearfix">

                          <div class="form-group form-group--float" style="width: 320px;">
                            <input type="text"
                                   class="form-control step"
                                   :placeholder="'Enter the title of step #' + (index + 1)"
                                   v-model="steps[index].title"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float step-left" style="width: 320px;">
                            <input type="number"
                                   class="form-control step"
                                   :placeholder="'Enter the budget of step #' + (index + 1)"
                                   v-model="steps[index].budget"
                            >
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float" style="width: 500px;">
                              <textarea
                                  class="form-control textarea-autoheight"
                                  style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible;"
                                  :placeholder="'Enter the description of step #' + (index + 1)"
                                  v-model="steps[index].description"
                              ></textarea>
                            <i class="form-group__bar"></i>
                          </div>
                          <div class="form-group form-group--float step-left">
                            <button v-if="steps[index].id && !steps[index].is_completed" @click="deleteStep(index, $event)" class="btn btn-sm btn-danger">Delete step</button>
                            <button v-else @click="saveStep(index, $event)" class="generate-button btn btn-sm btn-success">Save step</button>
                          </div>
                        </div>
                        <button @click="addStep" class="generate-button btn btn-sm btn-primary">Add step</button>
                      </div>

                      <div v-else><span class="text-warning">For adding steps set budget at first</span></div>

                    </div>
                    <div class="contracts-button">
                      <div class="fileUpload btn btn-warning">
                        <span>Upload files</span>
                        <input type="file" @change="addAttachments" class="upload" multiple/>
                      </div>
                      <span v-if="attachments">
                        {{attachments.length}} files: <span v-for="att in attachments">[{{att.name}} {{pretty(att.size)}}] </span>
                      </span>
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

      <!-- View Contact -->
      <div class="modal fade" id="view-contact">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body text-center">
              <div class="view-contact__img">
                <img src="/assets/img/demo/people/2.jpg" class="img-circle" width="150" height="150" alt="">
              </div>

              <div class="m-t-25">
                <h4>Mallinda Hollaway</h4>
                <small>421 Walnut St. Hartford, CT 06106, United States</small>
              </div>

              <div class="m-t-25">
                <small>Email Address</small>
                <div class="text-strong m-t-5">mallinda-h@gmail.com</div>
              </div>

              <div class="m-t-25">
                <small>Mobile Phone</small>
                <div class="text-strong m-t-5">(203) 991-4171</div>
              </div>

              <div class="m-t-25">
                <small>Home Phone</small>
                <div class="text-strong m-t-5">(902) 093-3923</div>
              </div>
            </div>

            <div class="modal-footer text-center modal-footer--bordered">
              <button type="button" class="btn btn-link" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add to group modal -->
      <div class="modal fade" id="add-to-group" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Add to group</h4>
            </div>

            <div class="contact-highlight media">
              <div class="pull-left">
                <img src="/assets/img/demo/people/1.jpg" class="img-circle" width="50" height="50" alt="">
              </div>
              <div class="media-body">
                <strong>Mallinda Hollaway</strong>

                <div class="list-group__attrs m-t-5">
                  <div>mallinda-h@hmail.com</div>
                  <div>(203) 991-4171</div>
                </div>
              </div>
            </div>

            <div class="modal-body">
              <div class="form-group m-0">
                <input type="text" class="form-control" placeholder="Group name...">
                <i class="form-group__bar"></i>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-link" data-dismiss="modal">Dismiss</button>
              <button type="button" class="btn btn-link">Add</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
  @import 'contracts.css';
</style>