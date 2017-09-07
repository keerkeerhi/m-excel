<template>
  <div id="app">
    <el-menu default-active="1-4-1" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
             :collapse="true">
      <el-menu-item index="1" :route="'/hello'">
        <i class="el-icon-message"></i>
        <span slot="title">excel</span>
      </el-menu-item>
      <el-menu-item index="2" :route="'/calc'">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
    </el-menu>
    <div class="topRight">

    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        isCollapse: true
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    background: rgb(28, 36, 56);
  }

  .el-menu-vertical-demo {
    width: 64px;
    min-height: 168px;
    position: fixed;
    top: 20%;
    background: rgb(28, 36, 56);
  }

  #app {

  .topRight {
    float: right;
  }

  }
</style>
