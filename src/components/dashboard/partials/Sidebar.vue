<script>
  import api from '../../../api/api'

  export default {

    data: function () {
      let vm = this;

      let account = vm.$store.getters.accountData;

      return {
        current_role: vm.$helpers.getCurrentRole(account)
      }
    }
  }
</script>

<template>
  <aside id="main__sidebar">
    <a class="hidden-lg main__block-close" href="#" data-rmd-action="block-close" data-rmd-target="#main__sidebar">
      <i class="zmdi zmdi-long-arrow-left"></i>
    </a>

    <ul class="main-menu">
      <li>
        <router-link to="#">
          <i class="zmdi zmdi-money"></i>Finances
        </router-link>
      </li>
      <li v-if="current_role == 'freelancer'">
        <router-link to="/dashboard/works">
          <i class="zmdi zmdi-assignment"></i>Works
        </router-link>
      </li>
      <li v-else>
        <router-link to="/dashboard/projects">
          <i class="zmdi zmdi-assignment"></i>Projects
        </router-link>
      </li>
      <li>
        <router-link to="#">
          <i class="zmdi zmdi-comment-alt"></i>Messages
        </router-link>
      </li>
      <li>
        <router-link to="#">
          <i class="zmdi zmdi-check-circle"></i>Page settings
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard/settings">
          <i class="zmdi zmdi-file-text"></i>Settings
        </router-link>
      </li>
    </ul>
  </aside>
</template>