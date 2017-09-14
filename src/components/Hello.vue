<template>
  <div class="pageContent">
    <div>aa<code>aaa我我我</code></div>
    <hr style="border: 3px solid red;margin-left:3px;" >
    <div hidden >bbbbb</div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    created () {
      console.log('--------->', Array.add)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pageContent {
    width: 100%;
    height: 100%;
  }
</style>
