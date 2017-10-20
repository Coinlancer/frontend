<script>
  import Api from '../../api/api'
  import { mapGetters } from 'vuex'
  import Headerblock from './partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'
  import Footerblock from './partials/Footer.vue'

  import pretty from 'prettysize'

  export default {
    data: function () {

      return {
        parent_categories: [],
        selected_parent_category: null,
        child_categories: null,
        selected_child_categories: [],
        title: 'test',
        budget: 100,
        description: 'test',
        deadline: null,
        skills: [],
        selected_skills: [],
        category: null,
        attachments: null,
        steps: [{
          title: null,
          description: null,
          budget: null
        }]
      }
    },
    created () {
      let vm = this;

      vm.$store.dispatch('getAllCategories').then(() => {
        let parent_categories = vm.$store.getters.parentCategories;
        parent_categories.map(category => {
          vm.parent_categories.push({
            value: category.cat_id,
            label: category.cat_title
          })
        });
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
        this.child_categories = this.$store.getters.getChildCategory(parent_cat.value);
      },

      calculateStepBudget: function () {
        let vm = this;
        let steps_budget = 0;

        vm.steps.map((step) => {
          steps_budget += step.budget;
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

        if (vm.calculateStepBudget() >= vm.budget) {
          vm.$helpers.errorMsg('Budget project already used by steps.');
          errors = true;
        }

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

      createProject: function (e) {
        e.preventDefault();
        let vm = this;
        //TODO: validate data

        if (vm.stepsHasErrors()) {
          return false;
        }

        if (vm.calculateStepBudget() > vm.budget) {
          return vm.$helpers.errorMsg('Budget of steps overflow project budget');
        }

        let categories = [];

        vm.selected_child_categories.map(cat => {
          categories.push(cat.value);
        });

        let skills = [];

        vm.selected_skills.map(skl => {
          skills.push(skl.value);
        });

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
        data.append('skills', skills);
        data.append('categories', categories);
        data.append('steps', JSON.stringify(vm.steps));

        return Api.createProject(data)
            .then(() => {
              vm.$router.push('/dashboard/projects');
              return vm.$helpers.successMsg('Project created');
            })
            .catch((err) => {
              console.error(err);
              vm.$helpers.errorMsg('Cannot create project. Check fields');
            })
      },
    },
    components: {
      Headerblock,
      Sidebar,
      Footerblock
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <main id="main">
      <sidebar></sidebar>
      <section id="main__content">

        <div class="main__container">
          <header class="main__title">
            <h2>Create contract</h2>
          </header>

          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card__body">
                  <form enctype="multipart/form-data" @submit="createProject">
                    <h3>Add Contacts</h3>
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

                      <v-select multiple v-model="selected_skills" :options="skills"></v-select>
                    </div>

                    <div class="form-group">
                      <h3>Category</h3>

                      <v-select :on-change="getChildrenCategories" v-model="selected_parent_category" :options="parent_categories"></v-select>

                    </div>

                    <div v-if="child_categories" class="form-group">
                      <h3>Subcategories</h3>
                      <v-select multiple v-model="child_category" :options="child_categories"></v-select>
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
                            <div class="form-group step-form-group" style="width: 500px;">
                              <textarea
                                  class="form-control textarea-autoheight"
                                  style="overflow-x: hidden; word-wrap: break-word; overflow-y: visible;"
                                  :placeholder="'Enter the description of step #' + (index + 1)"
                                  v-model="steps[index].description"
                              ></textarea>
                              <i class="form-group__bar"></i>
                            </div>
                        </div>
                        <button @click="addStep" class="generate-button btn btn-sm btn-primary">Add step</button>
                      </div>

                      <div v-else><span class="text-warning">For adding steps set budget at first</span></div>

                    </div>
                    <div class="contracts-button">
                      <div class="fileUpload btn btn-danger">
                        <span>Upload files</span>
                        <input type="file" @change="addAttachments" class="upload" multiple/>
                      </div>
                      <span v-if="attachments">
                        {{attachments.length}} files: <span v-for="att in attachments">[{{att.name}} {{pretty(att.size)}}] </span>
                      </span>
                      <div class="contracts-button">
                        <button class="btn btn-primary">Create</button>
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
      <footerblock></footerblock>
    </main>
  </div>
</template>

<style>
  @import '../../assets/css/dashboard_contracts.css';
</style>

<style scoped>
  .fileUpload {
    position: relative;
    overflow: hidden;
    margin-right: 10px;
  }
  .fileUpload input.upload {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
  }
</style>