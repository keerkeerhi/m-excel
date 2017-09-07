<template>
    <div class="pageContent">
      this is calc...
      {{msg}}
    </div>
</template>

<script>
  export default {
    name: 'calc',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .pageContent {
        background: rgb(28, 36, 56);
      width: 100%;
      height: 100%;
    }
</style>
