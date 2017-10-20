<template>
  <!-- Start page loader -->
  <div id="page-loader" v-if="stack > 0">
    <div class="page-loader__spinner"></div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        stack: 0
      }
    }
  }
</script>