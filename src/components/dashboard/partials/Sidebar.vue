<script>
  export default {
  }
</script>

<template>
  <aside id="main__sidebar">
    <a class="hidden-lg main__block-close" href="" data-rmd-action="block-close" data-rmd-target="#main__sidebar">
      <i class="zmdi zmdi-long-arrow-left"></i>
    </a>

    <ul class="main-menu">
      <li>
        <router-link to="/dashboard/finances">
          <i class="zmdi zmdi-money"></i>Finances
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard/projects">
          <i class="zmdi zmdi-assignment"></i>Projects
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard/projects/create">
          <i class="zmdi zmdi-file-plus"></i>Create project
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard/messages">
          <i class="zmdi zmdi-comment-alt"></i>Messages
        </router-link>
      </li>
      <li>
        <router-link to="/dashboard/settings/page">
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