<template>
  <div class="pageContent">
    <div>
      <div class="filesDiv leftfile">
        <ul>
          <li><span>a</span><i class="iconfont icon-shanchu"></i></li>
        </ul>
      </div>
      <el-table
        :data="leftData"
        border
        style="width: 100%"
        height="250">
        <el-table-column
          fixed
          prop="date"
          label="日期">
        </el-table-column>
      </el-table>
    </div>
    <div>
      <div class="filesDiv">
        <ul>
          <li><span>a</span><i class="iconfont icon-shanchu"></i></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        leftData: [],
        rightData: [],
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
    display: flex;
    flex-direction: row;
  }
  .pageContent>div{
    flex: 1;
  }
  ul,li{
    list-style: none;
    float: left;
    margin: 0;
    padding: 0;
  }
  .leftfile{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .leftfile li{
    min-width: 200px;
  }
  .filesDiv{
    width: 100%;
    overflow-x: auto;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
  }
  .filesDiv .iconfont{
    font-size: 16px;
  }

  .filesDiv .iconfont:hover{
    color: orangered;
  }

  .filesDiv li>span{
    margin-right: 5px;
  }

  .filesDiv li{
    height: 28px;
    line-height: 28px;
    background: #20A0FF;
    border-radius: 2px;
    margin: 0 5px;
    padding: 0 5px 0 10px;
  }
</style>
