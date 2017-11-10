<script>
  import Api from '../../../api/api'

  export default {

    props: ['role'],
    data: function () {
      let vm = this;

      if (!vm.role) {
        let account = vm.$store.getters.accountData;
        vm.role = vm.$helpers.getCurrentRole(account)
      }

      return {
        current_role: vm.role
      }
    },
    watch: {
      role: function(role) {
        this.current_role = role
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
        <router-link to="/dashboard/finances">
          <i class="zmdi zmdi-money"></i>Finances
        </router-link>
      </li>
      <li v-if="current_role == 'freelancer'">
        <router-link to="/dashboard/works">
          <i class="zmdi zmdi-assignment"></i>Works
        </router-link>
      </li>
      <li v-if="current_role == 'freelancer'">
        <router-link to="/dashboard/suggestions">
          <i class="zmdi zmdi-assignment"></i>Suggestions
        </router-link>
      </li>
      <li v-if="current_role == 'client'">
        <router-link to="/dashboard/projects">
          <i class="zmdi zmdi-assignment"></i>Projects
        </router-link>
      </li>
      <!--<li>-->
        <!--<router-link to="#">-->
          <!--<i class="zmdi zmdi-comment-alt"></i>Messages-->
        <!--</router-link>-->
      <!--</li>-->
      <!--<li>-->
        <!--<router-link to="#">-->
          <!--<i class="zmdi zmdi-check-circle"></i>Page settings-->
        <!--</router-link>-->
      <!--</li>-->
      <li>
        <router-link to="/dashboard/profile">
          <i class="zmdi zmdi-file-text"></i>Profile settings
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