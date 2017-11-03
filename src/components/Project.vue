<script>
  import Projectc from './project/ProjectViewClient.vue'
  import Projectf from './project/ProjectViewFreelancer.vue'

  export default {
    data: function () {
      let vm = this;
      let current_role = vm.$helpers.getCurrentRole(vm.$store.getters.accountData);
      return {
        current_role: current_role
      }
    },
    components: {
      Projectc,
      Projectf
    }
  }
</script>

<template>
  <div>
    <projectc v-if="!current_role || current_role == 'client'"></projectc>
    <projectf v-else></projectf>
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

</style>