<script>

  import api from '../../api/api'
  import Headerblock from '../partials/Header.vue'
  import Sidebar from './partials/Sidebar.vue'

  export default {
    data: function () {
      return {
        works: []
      }
    },
    methods: {

    },
    created () {
      let vm = this;
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
          <div class="row">
            <div class="col-md-12" v-if="works.length">
              <header class="main__title clearfix">
                <h2>Works list</h2>
              </header>

            </div>
            <div v-else>
              <header class="main__title clearfix">
                <h2>You have not active works yet</h2>
              </header>
            </div>
          </div>
        </div>
      </section>
    </main>
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
      padding: 13px 30px;
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
</style>