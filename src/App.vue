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
    <router-view v-if="useAble" class="content"></router-view>
    <section class="getActiveCode" v-else >
      <label>
        请复制机器码给管理员"小玉"获取激活码!!!
      </label>
      <div class="machineCls" >
        <span>
          机器码：{{disCode}}
        </span>
       <el-button id="copybtn" class="copyBtn" @click="copyFun" >复制</el-button>
      </div>
      <el-input class="avCode" placeholder="请输入激活码" clearable v-model="password">
      </el-input>
      <el-button class="acvBtn" @click="acvFun" >激活</el-button>
    </section>
  </div>
</template>

<script>
  let gui = require('nw.gui')
  let win = gui.Window.get()
  import Clipboard from 'clipboard'
  export default {
    name: 'app',
    data () {
      return {
        isCollapse: true,
        win: null,
        useAble: false,
        disCode: '',
        password: ''
      }
    },
    methods: {
      acvFun(){
//        console.log(this.iiiiFun(this.disCode))
        if (this.password==this.iiiiFun(this.disCode))
        {
            localStorage.setItem("useAbleCode",this.password)
            this.useAble = true
            this.$message({
              message: '激活成功，欢迎使用大玉软件~~',
              type: 'success'
            });
        }
        else
          this.$message('激活码不正确哦！');
      },
      copyFun(){
        let ve = this
        new Clipboard('#copybtn', {
          text: function(trigger) {
            ve.$message({
              message: '已复制',
              type: 'success'
            });
            return ve.disCode;  // aaaaa为设置到剪切板的内容
          }
        });
      },
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
      },
      iiiiFun(mcode){
        let a1 = [1,0,2,4,8,9,3,5]
        let i = 3
        let m = 0
        let start = 'day'
        while(i<a1.length){
            let c = mcode.charAt(i)
            let r = String.fromCharCode(c.charCodeAt()+a1[m])
            i++;
            m++;
            start +=r
        }
        return start
      }
    },
    created () {
      this.win = win
      let useAble = localStorage.getItem("useAbleCode")
      this.useAble = useAble

      function getDiskSerialNum(callBack){
//        const si = require('systeminformation');
//        si.diskLayout(callBack);

      }
      function password(length, special) {
        var iteration = 0;
        var password = "";
        var randomNumber;
        if(special == undefined){
          var special = false;
        }
        while(iteration < length){
          randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
          if(!special){
            if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
            if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
            if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
            if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
          }
          iteration++;
          password += String.fromCharCode(randomNumber);
        }
        return password;
      }
      this.disCode = password(14, true)
//      getDiskSerialNum((r)=>{
//        let disCode = r[0].serialNum;
//        if (!disCode)
//          alert('获取机器码有误');
//        else
//        {
//          this.disCode = disCode
//        }
//      });

      setTimeout(()=>{
        document.getElementById('loading').style.display = 'none'
      },1500)
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

  @keyframes second /* Safari 和 Chrome */
  {
    from {left: -50px;opacity: .3;}
    to {left: 0px;opacity: 1;}
  }
  @keyframes first /* Safari 和 Chrome */
  {
    from {left: 0px;opacity: 1;}
    to {left: -50px;opacity: .3;}
  }

  .el-menu-vertical-demo {
    width: 64px;
    min-height: 168px;
    position: fixed;
    z-index: 14;
    top: 20%;
    left: -50px;
    opacity: .3;
    background: #fff;
    animation: first 1s;
  }
  .el-menu-vertical-demo:hover{
    opacity: 1;
    left: 0;
    animation: second 1s;
  }

  #app {

    .el-menu-vertical-demo {
      background: #1C2438;
      border: solid .8px #20A0FF;
    i {
      font-size: 25px;
    }

    }
    .topRight {
      display: flex;
      flex-direction: row;
      -webkit-app-region: drag;
      border-bottom: 1px solid #ccc;
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
    .getActiveCode{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight:bold;
    }
    .el-input__inner{
      border-radius: 0;
    }
    .getActiveCode>*{
      margin-bottom: 25px;
    }
    .machineCls>span{
      margin-right: 30px;
    }
    .avCode{
      width: 400px;
    }
    .acvBtn{
      background: #FF831E;
      border: none;
      color: #fff;
      font-weight:bold;
      width: 100px;
    }
  }

</style>
