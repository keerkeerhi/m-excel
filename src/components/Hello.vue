<template>
  <div class="pageContent">
    <div class="excelContent">
      <div>
        <el-table :data="leftData" border style="flex:1;">
          <el-table-column v-for="(it,index) in leftHead" :fixed="index==0" :prop="index+''" :label="it">
            <template scope="scope">
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
            <i class="iconfont icon-shanchu" @click="removeLeft()"></i>
          </div>
        </div>
      </div>
      <div>
        <div v-for="(excel,index) in rightExcels">
          <el-table :data="excel.datas" border style="flex:1;">
            <el-table-column v-for="(it,inx) in excel.head" :fixed="inx==0" :prop="inx+''" :label="it">
              <template scope="scope">
                <el-button :style="{color:inx==excel.cindex?'red':''}"
                           @click.native.prevent="excel.cindex=inx;"
                           type="text"
                           size="small">
                  {{scope.row[inx]}}
                </el-button>
                <!--<el-tag :type="index==cindex?'success':'info'" @click="setCindex(index)" ></el-tag>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="filesDiv">
            <el-button type="primary">{{excel.fileName}}</el-button>
            <i class="iconfont icon-shanchu" @click="deleteF(index)"></i>
          </div>
          <hr style="margin-bottom: 20px;">
        </div>
      </div>
    </div>
    <div class="bottomDiv">
      <div class="fileinput-button" @click="importExcel_1"><input type="file" ref="importFile1"/>导入基准excel</div>
      <div class="fileinput-button" @click="getResult">getResult</div>
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
        fpath: "",
        rightData: [],
        cindex: 0,
        leftExcel: {fileName: "", file: null},
        status: {left: null},
        rightExcels: [],
        rData: []
      }
    },
    created () {
//      console.log('--------->', Array.add)
    },
    methods: {
      getResult(){
        console.log(this.status.left)
        let fN = this.leftExcel.fileName.split(".")[0];
        let pathstr = this.fpath.substring(0, this.fpath.lastIndexOf('\\') + 1);
        if (!this.status.left) {
          this.$notify({
            title: '警告',
            message: '请导入左侧基准excel',
            type: 'warning'
          });
          return;
        }
        if (this.rData.length == 0) {
          this.$notify({
            title: '警告',
            message: '请导入右侧要对比的excel',
            type: 'warning'
          });
          return;
        }
        let w = new Worker('static/threads/webWork_demo.js');
        w.onmessage = (event) => {
          let data = event.data;
          let i = 2;
          let buffer = xlsx.build([{name: "mySheetName", data: data.res}]);
          fs.writeFile(pathstr + fN + "-theSame.xlsx", buffer, function (err) {
            console.log("文本创建成功1");
            i--;
            if (i == 0) {
              this.$notify({
                title: '成功',
                message: '完成任务',
                type: 'success'
              });
            }
          });

          let buffer2 = xlsx.build([{name: "mySheetName", data: res2}]);
          fs.writeFile(pathstr + fN + "-theDifferent.xlsx", buffer2, function (err) {
            console.log("文本创建成功2");
            i--;
            if (i == 0) {
              this.$notify({
                title: '成功',
                message: '完成任务',
                type: 'success'
              });
            }
          });
        };
        let arr = [];
        let len = this.rightExcels.length;
        for (let i = 0; i < len; i++)
          arr.push(this.rightExcels[i].cindex);
        w.postMessage({left: {data: this.status.left, index: this.cindex}, right: {data: this.rData, index: arr}});
      },
      removeLeft(){
        let finput = this.$refs.importFile1;
        finput.value = ''
        this.leftData = null;
        this.leftHead = null;
        this.cindex = 0;
        this.leftExcel = {fileName: "", file: null};
        this.status.left = null;
        this.fpath = "";
      },
      setCindex(i){
        console.log('-----------', i);
        this.cindex = i;
      },
      deleteF(index){
        this.rightExcels.splice(index, 1);
        this.rData.splice(index, 1);
      },
      importExcel_1(){
        let finput = this.$refs.importFile1;
        finput.onchange = (() => {
          if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
            let file = finput.files[0];
            this.leftExcel.fileName = this.setExcelName(file.name);
            this.leftExcel.file = file;
            this.fpath = file.path;
            let content = xlsx.parse(fs.readFileSync(this.fpath));
            let f1 = content[0].data;
            this.status.left = f1;
            this.leftHead = f1[0];
            this.leftData = this.getExcelData(f1, 10);
            console.log('----------->', this.leftData);
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
            for (let i = 0; i < len; i++) {
              let it = files[i];
              let content = xlsx.parse(fs.readFileSync(it.path));
              let f1 = content[0].data;
              this.rightExcels.push({
                fileName: this.setExcelName(it.name),
                head: f1[0],
                datas: this.getExcelData(f1, 4),
                cindex: 0
              });
              this.rData.push(f1);
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
      },
      getExcelData(list, size){
        let arr = [];
        let i = 1;
        while (i < size) {
          let it = list[i++];
          if (it)
            arr.push(it);
        }
        return arr;
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

  .bottomDiv > div {
    flex: 1;
  }

  .bottomDiv > div:first-child {
    cursor: pointer;
    text-align: center;
    background: #00EA44;
    border-radius: 2px;
    color: #fff;
  }

  .bottomDiv > div:nth-child(2) {
    cursor: pointer;
    background: RGB(209, 33, 119);
    text-align: center;
    border-radius: 2px;
    color: #fff;
  }

  .bottomDiv > div:hover {
    opacity: .5;
  }

  .bottomDiv > div:nth-child(3) {
    cursor: pointer;
    text-align: center;
    background: #FF7300;
    border-radius: 2px;
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
