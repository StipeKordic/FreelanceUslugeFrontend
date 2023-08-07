<template>
    <NavbarUser />
</template>

<script>
  import NavbarUser from '@/components/NavbarUser.vue'
  export default {
  name: 'LoggedInView',
  components: {
    NavbarUser,
  }
}

  const token = localStorage.getItem('token');
</script>

<style>

</style>