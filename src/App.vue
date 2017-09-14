<template>
  <div id="app">
    <el-menu default-active="/hello" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
             :collapse="true">
      <el-menu-item index="/hello">
        <i class="iconfont icon-duibi"></i>
        <span slot="title">对比</span>
      </el-menu-item>
      <el-menu-item index="/nothing">
        <i class="iconfont icon-shaixuan"></i>
        <span slot="title">筛选</span>
      </el-menu-item>
      <el-menu-item index="/calc">
        <i class="iconfont icon-ai-calculator"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
    </el-menu>
    <div class="topRight">
      <div></div>
      <i class="iconfont icon-zuixiaohua" @click="minimized_fun"></i>
      <i class="iconfont icon-weibiaoti101" @click="close_fun"></i>
    </div>
    <router-view class="content"></router-view>
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
        win: null
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
    display: flex;
    flex-direction: column;
  }

  .el-menu-vertical-demo {
    width: 64px;
    min-height: 168px;
    position: fixed;
    z-index: 14;
    opacity: .3;
    top: 20%;
    background: rgb(28, 36, 56);
  }
  .el-menu-vertical-demo:hover{
    opacity: 1;
  }
  #app {

    .el-menu-vertical-demo {

    i {
      font-size: 25px;
    }

    }
    .topRight {
      display: flex;
      flex-direction: row;

      div{
        flex: 1;
      }

    i {
      cursor: pointer;
      color: #fff;
      font-size: 25px;
      margin-right: 10px;
    }

    }
    .iconfont {
      -webkit-app-region: no-drag;
      cursor: pointer;
    }
    .content {
      width: 100%;
      flex: 1;
    }
  }
</style>
