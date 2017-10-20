<script>
  import Projectc from './project/ProjectViewClient.vue'
  import Projectf from './project/ProjectViewFreelancer.vue'

  export default {
    components: {
      Projectc,
      Projectf
    }
  }
</script>

<template>
  <div>
    <projectc v-if="true"></projectc>
    <projectf v-else></projectf>
  </div>
</template>

<style>
  @import '../assets/css/contract.css';
</style>