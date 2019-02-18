<template>
    <div class="nothingPage">
      <section v-if="!pageIndex" class="nothingContent" >
        <div @click="importExcel_1" class="importDiv" >
          <el-button class="importBtn" >导入Excel</el-button>
          <input class="importInput" type="file" ref="importFile1"/>
        </div>
      </section>
      <section v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="数据筛选中" class="dataContent" v-else>
        <el-form :model="params" ref="paramsForm" label-width="0">
        <div class="operateDiv" >
          <img @click="toPageOne"  src="../assets/lefticon.png"/>
          <el-form-item
            prop="maxYear"
            :rules="[
              { required: true, message: '年份不能为空'},
              { type: 'number', message: '年份必须为数字值'}
            ]"
          >
            <el-input placeholder="请输入年份" clearable v-model.number="params.maxYear">
              <template slot="append">之前</template>
            </el-input>
          </el-form-item>
        </div>
        </el-form>
        <el-table v-loading="Loading" element-loading-text="数据加载中" :data="dataList" border >
          <el-table-column v-for="(it,index) in dataHead" :fixed="index==0" :prop="index+''" :label="it">
            <template scope="scope">
              <el-button class="tdBtn" :style="{color:index==cindex?'red':''}"
                         @click.native.prevent="setCindex(index)"
                         type="text"
                         size="small">
                {{scope.row[index]}}
              </el-button>
              <!--<el-tag :type="index==cindex?'success':'info'" @click="setCindex(index)" ></el-tag>-->
            </template>
          </el-table-column>
        </el-table>
        <label>请先选择身份证号所在列，再筛选</label>
      </section>
      <section @click="submitForm('paramsForm')" class="nothingBottom" >
        筛选导出
      </section>
    </div>
</template>

<script>
  import './Nothing.css'
  import xlsx from 'node-xlsx'
  import child_process from 'child_process'
  import fs from 'fs'
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        fullscreenLoading: false,
        cExcel: {
            path: '',
            file: ''
        },
        dataList: [],
        pageIndex: 0,
        dataHead: [],
        cindex: 0,
        params:{
          maxYear: ''
        },
        datas:[]
      }
    },
    methods: {
      checkNumber(data){
        let numb = this.dataList[0][this.cindex] + ''
        if (numb.length!=18)
            return false
        let str = numb.substr(6,8)
        if (isNaN(str))
          return false

        return true
      },
      getResult(){
        let fN = this.cExcel.file.name.split(".")[0]
        let pathstr = this.cExcel.path.substring(0, this.cExcel.path.lastIndexOf('\\') + 1)
        if (!this.checkNumber()) {
          this.$notify({
            title: '警告',
            message: '选择的列非身份证号',
            type: 'warning'
          });
          return;
        }

        let w = new Worker('static/threads/distinct_ww.js');
        w.onmessage = (event) => {
          let data = event.data;
          if (data.res.length==0)
          {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              message: '没有'+this.params.maxYear+'之前的数据',
              type: 'error',
              duration: 2000
            })
              return
          }
          let buffer = xlsx.build([{name: "mySheetName", data:data.res}])
          fs.writeFile(pathstr +
            fN + this.params.maxYear+
            "之前.xlsx", buffer, (err)=> {
              console.log('----->>aaa')
            this.fullscreenLoading = false;
            child_process.exec('start ' + pathstr);
            this.$notify({
              title: '成功',
              message: '完成任务',
              type: 'success'
            });
          })
          let buffer_err = xlsx.build([{name: "mySheetName", data:data.errors}])
          fs.writeFile(pathstr +
            fN + this.params.maxYear+
            "之前-有误数据.xlsx", buffer_err, (err)=> {})
        }

        this.fullscreenLoading = true;
        w.postMessage({datas: this.datas, index: this.cindex,maxYear:this.params.maxYear});
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getResult()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      toPageOne(){
        this.pageIndex = 0;
        this.dataList = []
        this.dataHead = []
        this.cindex = 0
        this.cExcel = {
            path: '',
            file: ''
        }
        this.params = {
          maxYear: ''
        }
        this.datas = []
      },
      importExcel_1(){
        let finput = this.$refs.importFile1;

        if (!finput.onchange)
          finput.onchange = (() => {
            console.log('----->>',finput.value)
            if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
              let file = finput.files[0];
              this.cExcel.file = file;
              this.cExcel.path = file.path;
              this.Loading = true;
              setTimeout(()=>{
                let content = xlsx.parse(fs.readFileSync(this.cExcel.path));
                this.Loading = false;
                let f1 = content[0].data;
                this.datas = f1;
                this.dataHead = f1[0];
                this.dataList = this.getExcelData(f1, 10);
                this.pageIndex = 1
              },200)
            } else {
              this.$message({
                showClose: true,
                message: '请选择正确的Excel格式文件！',
                type: 'error',
                duration: 2000
              })
            }
          });
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
      },setCindex(i){
        console.log('-----------', i);
        this.cindex = i;
      },
    }
  }
</script>
