<script>
  import { mapGetters } from 'vuex'
  import Headerblock from '../partials/Header.vue'
  import Footerblock from '../partials/Footer.vue'

  export default {
    data: function () {
      let vm = this;

      return {

      }
    },
    methods: {
    },
    components: {
      Headerblock,
      Footerblock
    }
  }
</script>

<template>
  <div>
    <headerblock></headerblock>

    <footerblock></footerblock>
  </div>
</template>