<template>
    <div class="pageContent">
        there is nothing..
    </div>
</template>

<script>
  export default {
    name: 'hello',
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
      width: 100%;
      height: calc(100% - 28px);
        background: rgb(28, 36, 56);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
</style>
