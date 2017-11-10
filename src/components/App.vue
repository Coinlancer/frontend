<script>
  import Api from '../api/api'

  export default {
    name: "app"
  }
</script>

<template>
  <div class="main-content">
    <router-view></router-view>
    <notifications position="top left"/>
  </div>
</template>