<template>
  <div class="pageContent">
    <div class="excelContent">
      <div>
        <el-table :data="leftData" border style="flex:1;">
          <el-table-column  v-for="(it,index) in leftHead" :fixed="index==0" :prop="index+''" :label="it">
            <template scope="scope" >
              <el-button :style="{color:index==cindex?'red':''}"
                @click.native.prevent="setCindex(index)"
                type="text"
                size="small">
                {{scope.row[index]}}
              </el-button>
              <!--<el-tag :type="index==cindex?'success':'info'" @click="setCindex(index)" ></el-tag>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="filesDiv leftfile">
          <div v-show="leftExcel.fileName.length>0">
            <el-button type="primary">{{leftExcel.fileName}}</el-button>
            <i class="iconfont icon-shanchu"></i>
          </div>
        </div>
      </div>
      <div>
        <div v-for="(it,index) in rightExcels">
          <div class="filesDiv">
            <el-button type="primary">{{it.fileName}}</el-button>
            <i class="iconfont icon-shanchu" @click="deleteF(index)"></i>
          </div>
          <el-table :data="leftData" border height="200">
            <el-table-column fixed prop="date" label="日期">
            </el-table-column>
          </el-table>
          <hr style="margin-bottom: 20px;">
        </div>
      </div>
    </div>
    <div class="bottomDiv">
      <div class="fileinput-button" @click="importExcel_1"><input type="file" ref="importFile1"/>导入基准excel</div>
      <div class="fileinput-button" @click="importExcel_2"><input type="file" multiple ref="importFile2"/>导入次准excel
      </div>
    </div>
  </div>
</template>

<script>
  import xlsx from 'node-xlsx'
  import fs from 'fs'
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        leftData: [],
        leftHead: [],
        rightData: [],
        cindex:0,
        leftExcel: {fileName: "", file: null},
        rightExcels: []
      }
    },
    created () {
//      console.log('--------->', Array.add)
    },
    methods: {
      setCindex(i){
        console.log('-----------',i);
        this.cindex = i;
      },
      deleteF(index){
        this.rightExcels.splice(index, 1);
      },
      importExcel_1(){
        let finput = this.$refs.importFile1;
        finput.onchange = (() => {
          if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
            let file = finput.files[0];
            this.leftExcel.fileName = this.setExcelName(file.name);
            this.leftExcel.file = file;
            let w=new Worker('static/threads/webWork_demo.js');
            w.onmessage = function (event) {
              console.log('-----main=>',event.data);
            };
            w.postMessage(file.path);
            let content = xlsx.parse(fs.readFileSync(file.path));
            let f1 = content[0].data;
            let arr = [];
            this.leftHead = f1[0];
            let i=1;
            while(i<10)
            {
              let it = f1[i++];
              if (it)
                arr.push(it);
            }
            this.leftData = arr;

            console.log('----------->',arr);
//            console.log('----------data',);
          } else {
            this.$Message.error("请选择正确的Excel格式文件！");
          }
        });
      },
      importExcel_2(){
        let finput = this.$refs.importFile2;
        finput.onchange = (() => {
          if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
            let files = finput.files;
            let len = files.length;
            for (let i = len; i--;) {
              let it = files[i];
              this.rightExcels.push({fileName: this.setExcelName(it.name), file: it});
            }
          } else {
            this.$Message.error("请选择正确的Excel格式文件！");
          }
        });
      },
      setExcelName(filename, max){
        if (!filename || filename.length == 0)
          return "";
        let fn = filename.split('.');
        let fullname = fn[0];
        let name = fullname.length > max ? (fullname.substring(0, max - 1) + '...') : fullname;
        return name + '.' + fn[1];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .pageContent {
    display: flex;
    flex-direction: column;
  }

  .pageContent > div:first-child {
    flex: 1;
  }

  .bottomDiv {
    height: 40px;
    line-height: 40px;
    display: flex;
    flex-direction: row;
  }

  .bottomDiv > div:first-child {
    cursor: pointer;
    text-align: center;
    background: #00EA44;
    border-radius: 2px;
    flex: 1;
  }

  .bottomDiv > div:first-child:hover {
    background: #38FF71;
    color: #fff;
  }

  .bottomDiv > div:nth-child(2) {
    cursor: pointer;
    text-align: center;
    background: #FF7300;
    flex: 1;
    border-radius: 2px;
  }

  .bottomDiv > div:nth-child(2):hover {
    background: #FF9D4E;
    color: #fff;
  }

  .excelContent {
    display: flex;
    flex-direction: row;
  }

  .excelContent > div {
    width: 50%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  ul, li {
    list-style: none;
    float: left;
    margin: 0;
    padding: 0;
  }

  .leftfile {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .leftfile li {
    min-width: 200px;
  }

  .filesDiv {
    width: 100%;
    overflow-x: auto;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
  }

  .filesDiv .iconfont {
    font-size: 16px;
  }

  .filesDiv .iconfont:hover {
    color: orangered;
  }

  .fileinput-button {
    position: relative;
  }

  .fileinput-button input {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

</style>
