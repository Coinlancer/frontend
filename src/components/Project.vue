<script>

  import Headerblock from './partials/Header.vue'
  import ProjectSteps from './project_partials/Steps.vue'
  import SuggestionForm from './project_partials/SuggestionForm.vue'
  import Suggestions from './project_partials/Suggestions.vue'
  import Api from '../api/api'
  import Config from '../config/index'

  export default {
    data: function () {
      let vm = this;
      let current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);

      return {
        tab_index: 1,
        response: null,
        category: null,
        subcategory: null,
        skills: null,
        attachments: null,
        project: null,
        created_at: null,
        deadline: null,
        current_role: current_role,
        api_host: Config.api_host,
        is_owner: false,
        is_executor: false,
      }
    },
    created () {
      let vm = this;

      vm.$spinner.push();
      Api.getProjectData(vm.$route.params.id)
          .then(resp => {
            vm.response = resp.data;
            vm.project = resp.data.project;
            vm.created_at = resp.data.project.prj_created_at;
            vm.deadline = resp.data.project.prj_deadline;

            //temporary fix
            vm.project.prj_created_at = Date.parse(vm.project.prj_created_at.replace('-','/','g')) / 1000;
            vm.project.prj_deadline = Date.parse(vm.project.prj_deadline.replace('-','/','g')) / 1000;
            //todo get timestamp from db

            vm.category = resp.data.category || null;
            vm.subcategory = resp.data.subcategory || null;
            vm.steps = resp.data.steps || [];
            vm.skills = resp.data.skills || [];
            vm.attachments = resp.data.attachments || [];
            vm.hired_suggestion = resp.data.hired_suggestion || null;

            vm.is_owner = (vm.$store.getters.accountData.acc_id === vm.response.project.acc_id);
            vm.is_executor = vm.response.hired_suggestion && (vm.$store.getters.accountData.acc_id === vm.response.hired_suggestion.acc_id);
          })
          .catch((err) => {
            vm.$errors.handle(err);
            vm.$router.push('/projects')
          })
          .then(() => {
            vm.$spinner.pop();
          });

    },
    methods: {
      selectTab: function (index) {
        let vm = this;
        vm.tab_index = index;
      },
    },
    components: {
      Headerblock,
      'project-steps': ProjectSteps,
      'suggestion-form': SuggestionForm,
      'suggestions': Suggestions
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>
    <section class="section" v-if="project">
      <div class="container">
        <header class="section__title text-left">
          <h2>{{project.prj_title}}</h2>
          <small>{{category.cat_title}} - {{subcategory.sct_title}}</small>
        </header>

        <div class="row">
          <div v-bind:class="{'col-md-8': current_role == 'freelancer', 'col-md-12': current_role == 'client'}">
            <div class="card profile">
              <div class="profile__img">
                <router-link :to="'/client/' + project.cln_id">
                  <img v-if="project.acc_avatar" :src="api_host + '/' + project.acc_avatar" alt=""/>
                  <img v-else src="/assets/img/icons/avatar.png" alt=""/>
                </router-link>
              </div>
              <div class="profile__info">
                <strong><router-link :to="'/client/' + project.cln_id">{{project.acc_name}} {{project.acc_surname}}</router-link></strong>
                <div class="profile__review">
                  <span class="rmd-rate" data-rate-value="3" data-rate-readonly="true"></span>
                </div>
                <ul class="rmd-contact-list">
                  <li v-if="project.acc_skype"><i class="zmdi zmdi-skype"></i>{{project.acc_skype}}</li>
                  <li v-if="project.acc_phone"><i class="zmdi zmdi-phone"></i>{{$helpers.formatPhone(project.acc_phone)}}</li>
                  <li v-if="project.acc_email"><i class="zmdi zmdi-email"></i>{{project.acc_email}}</li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="tab-nav tab-nav--justified" data-rmd-breakpoint="500">
                <div class="tab-nav__inner">
                  <ul>
                    <li v-bind:class="{ active: tab_index == 1 }"><a @click="selectTab(1)" href="#">Task description</a></li>
                    <li v-bind:class="{ active: tab_index == 2 }"><a @click="selectTab(2)" href="#">Suggestions</a></li>
                  </ul>
                </div>
              </div>

              <div v-if="tab_index == 1" class="card__body">
                <div class="card__sub row rmd-stats">
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-teal-400">
                      <h2 v-if="created_at" class="capitalize">{{$moment(created_at, "YYYY-MM-DD HH:mm:ss").format('MMMM, Do')}}</h2>
                      <small>Started</small>
                    </div>
                  </div>
                  <div class="col-xs-4">
                    <div class="rmd-stats__item mdc-bg-purple-400">
                      <h2 v-if="deadline" class="capitalize">{{$moment(deadline, "YYYY-MM-DD HH:mm:ss").format('MMMM, Do')}}</h2>
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

                <project-steps :response="response" :is_owner="is_owner" :is_executor="is_executor"></project-steps>

              </div>
              <div v-else-if="tab_index == 2">
                <suggestions :response="response" :is_owner="is_owner" :is_executor="is_executor"></suggestions>
              </div>
            </div>
          </div>
          <div v-if="current_role == 'freelancer'" class="col-md-4 rmd-sidebar-mobile" id="agent-question">
            <suggestion-form :response="response" :is_owner="is_owner" :is_executor="is_executor"></suggestion-form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
  .card-steps ul {
    list-style-type: none;
  }

  .card-steps ul li {
    display: block;
  }

  .card-steps .checkbox__helper, .card-steps .checkbox--char input[type=checkbox] {
    display: none;
  }

  .card-steps  .checkbox--char label {
    padding-left: 0;
  }

  .card-steps  .price-project {
    padding-left: 25px;
  }

  .card-steps  .none {
    display: none;
  }

  .contract-steps .tasks-lists .list-group-item .checkbox input:checked + .checkbox__helper + * {
    text-decoration: none;
    cursor: auto;
  }

  .contract-steps .checkbox label {
    cursor: auto;
  }

  .list-group--block .list-group-item {
    padding: 13px 20px;
  }

  .actions > a, .actions > div {
    padding-top: 0;
    bottom: 5px;
  }

  .card-steps ul {
    padding: 0;
  }

  header.main__title.clearfix h2{
    float: left;
    margin-top: 10px;
  }

  .btn-save {
    font-size: 14px;
  }

  .card__sub p {
    margin: 15px 0;
  }

  .checked-icon {
    float: left;
    position: relative;
    padding: 10px;
  }

  .checked-icon:hover::after {
    content: attr(title); /* Выводим текст */
    position: absolute; /* Абсолютное позиционирование */
    left: 40%; top: 50%; /* Положение подсказки */
    z-index: 122; /* Отображаем подсказку поверх других элементов */
    background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
    font-size: 14px; /* Размер текста подсказки */
    padding: 5px 10px; /* Поля */
    border: 1px solid #ddd; /* Параметры рамки */
  }

  .checked-icon img{
    width: 25px;
  }

  .rmd-stats__item{
    min-height: 110px;
  }
</style>