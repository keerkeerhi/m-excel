<template>
  <div id="app">
    <el-menu default-active="1-4-1" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
             :collapse="true">
      <el-menu-item index="/hello" >
        <i class="iconfont icon-excel"></i>
        <span slot="title">excel</span>
      </el-menu-item>
      <el-menu-item index="/calc">
        <i class="iconfont icon-ai-calculator"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="/nothing">
        <i class="iconfont icon-gongju"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
    </el-menu>
    <div class="topRight">
      <i class="iconfont icon-zuixiaohua" @click="minimized_fun"></i>
      <i class="iconfont icon-weibiaoti101" @click="close_fun"></i>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  let gui = require('nw.gui')
  let win = gui.Window.get()
  export default {
    name: 'app',
    data () {
      return {
        isCollapse: true,
        win:null
      }
    },
    methods: {
      close_fun () {
        win.close()
      },
      minimized_fun () {
        win.minimize()
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    created () {
      this.win = win
    }
  }
</script>

<style lang="less">
  @import url('../static/font/iconfont.css');

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
    .el-menu-vertical-demo{
      i{
        font-size: 25px;
      }
    }
    .topRight {
      float: right;
      i {
        cursor: pointer;
        color: #fff;
        font-size: 25px;
        margin-left: 20px;
      }
    }

  }
</style>
