<script>
  export default {
    beforeCreate: function () {
      let vm = this;
      vm.$store.dispatch('setAccountData', null);
      localStorage.removeItem('token');
      localStorage.removeItem('current_role');

      window.location.href = '/login';
    }
  }
</script>

<template>

</template>