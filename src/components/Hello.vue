<template>
  <div class="pageContent">
    <div class="selectColor" >
      <el-radio-group class="radios" v-model="current_color">
        <el-radio-button v-for="(it,inx) in allColors"
                         :label="inx">{{it.label}}</el-radio-button>
      </el-radio-group>
      <el-button class="helpBtn" @click="dialogVisible=true;" type="success">帮助</el-button>
    </div>
    <div class="excelContent">
      <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="数据对比中" >
        <el-table v-loading="leftLoading" element-loading-text="数据加载中" :data="leftData" border style="flex:1;">
          <el-table-column v-for="(it,index) in leftHead" :fixed="index==0" :prop="index+''" :label="it">
            <template scope="scope">
              <el-button :style="{color:(index in leftIndex)?(allColors[leftIndex[index]].color):''}"
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
      <div v-loading="rightLoading" element-loading-text="数据加载中">
        <div v-for="(excel,index) in rightExcels">
          <el-table :data="excel.datas" border style="flex:1;">
            <el-table-column  v-for="(it,inx) in excel.head"
                              :fixed="inx==0" :prop="inx+''" :label="it">
              <template scope="scope">
                <el-button :style="{color:(inx in excel.rindex)?allColors[excel.rindex[inx]].color:''}"
                           @click.native.prevent="setRindex(index,inx)"
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
      <div class="fileinput-button" @click="importExcel_1">
        <input type="file" ref="importFile1"/>导入基准excel</div>
      <div class="fileinput-button" @click="getResult">getResult</div>
      <div class="fileinput-button" @click="importExcel_2"><input type="file" multiple ref="importFile2"/>导入次准excel
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose">
      <div class="helpWord" >
        1、先选择颜色，再选择下侧左右excel表格要对比的列。
      </div>
      <div class="helpWord" >
        2、点击列表中的某列数据即可选中要对比的列。
      </div>
      <div class="helpWord" >
        3、右侧可导入多个Excel表格，每个Excel表格选择不同的要同左侧Excel表格对比的列。
      </div>
      <div class="helpWord" >
        4、得出的结果为：左侧Excel中，和右侧Excel相同的和不同的数据。
      </div>
      <div class="helpWord" >
        5、若要得出右侧Excel中，与左侧Excel相同的和不同的数据，请调换左右两侧的文件。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEver()">不再提示</el-button>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import xlsx from 'node-xlsx'
  import lx from '../utils/xlsx.js';
  import fs from 'fs'
  import child_process from 'child_process'
  const XLSX = lx.CFB;
  const parse = (mixed, options = {}) => {
    console.log('=222222222222222',XLSX)
    const workSheet = XLSX.read(mixed, options);
    console.log('======ws',workSheet)
    return Object.keys(workSheet.Sheets).map((name) => {
      console.log('-----name',name)
      const sheet = workSheet.Sheets[name];
      console.log('-----sheet',sheet)
      let data = XLSX.utils.sheet_to_json(sheet, {header: 1, raw: options.raw !== false})
      console.log('-----cont',data);
      return {name, data};
    });
  };

  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        allColors: [
          {label:'红色',color:'#FE0647'},
          {label:'黄色',color:'#FCD906'},
          {label:'绿色',color:'#27B463'},
          {label:'蓝色',color:'#0122D7'},
          {label:'紫色',color:'#690CFE'}],
        current_color: 0, // 当前选择颜色的index
        leftData: [],
        leftHead: [],
        fpath: "",
        rightData: [],
        // {'0':'2'} 左侧的第一列显示第3种颜色
        leftIndex: Object.create(null),
        lIObj: Object.create(null),
        leftExcel: {fileName: "", file: null},
        status: {left: null},
        // 右边Excel
        rightExcels: [],
        rData: [],
        // loading...
        leftLoading: false,
        rightLoading: false,
        fullscreenLoading: false,
        dialogVisible:false
      }
    },
    created () {
      let useAble = localStorage.getItem("useAbleCode")
      let _this = this;
      if (!useAble)
      {
        _this.isTry = true;
        _this.times = 3;
      }
      else
        _this.isTry = false;

      let noDialog = localStorage.getItem('noDialog')
      if (!noDialog)
        this.dialogVisible = true;
//    /select, C:\\Users\\Administrator\\Desktop\\aaa\\gg\\demo1.xlsx
//      console.log('--------->', Array.add)
    },
    methods: {
      handleClose(e){
        this.dialogVisible = false;
      },
      closeEver(){
        this.dialogVisible = false;
        localStorage.setItem("noDialog",true);
      },
      getResult(){
        if (this.isTry&&this.times<=0)
        {
          this.$notify({
            title: '提醒',
            message: '尊敬的用户，您的试用次数已用完！',
            type: 'info',
            duration:0
          });
          setTimeout(()=>{
            location.reload()
          },3000)
          return;
        }
        let fN = this.leftExcel.fileName.split(".")[0];
        let pathstr = this.fpath.substring(0, this.fpath.lastIndexOf('\\') + 1);
        let _this = this;
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
          let buffer = xlsx.build([{name: "mySheetName", data: data.same}]);
          fs.writeFile(pathstr + fN + "-theSame.xlsx", buffer, (err)=> {
            i--;
            if (i == 0) {
              this.fullscreenLoading = false;
              child_process.exec('start ' + pathstr);
              if (_this.isTry)
                _this.times--;
              this.$notify({
                title: '成功',
                message: '完成任务',
                type: 'success'
              });
            }
          });

          let buffer2 = xlsx.build([{name: "mySheetName", data: data.diff}]);
          fs.writeFile(pathstr + fN + "-theDifferent.xlsx", buffer2, (err)=> {
            i--;
            if (i == 0) {
              this.fullscreenLoading = false;
              child_process.exec('start ' + pathstr);
              if (_this.isTry)
                _this.times--;
              this.$notify({
                title: '成功',
                message: '完成任务',
                type: 'success'
              });
            }
          });
        };
        let indexObj = this.leftIndex;
        let iiObj = this.lIObj;
        let indexArr = [];
        for (let key in indexObj)
          indexArr.push(indexObj[key])
        indexArr.sort();
        let indexArr_left = [];
        indexArr.forEach(it=>{
          indexArr_left.push(iiObj[it])
        })
        let arr = [];
        let len = this.rightExcels.length;
        let swlength = indexArr.length;
        for (let i = 0; i < len; i++)
        {
          let {riObj} = this.rightExcels[i]
          let indexArr_right = [];
          for (let n=0;n<swlength;n++)
          {
            let ix = indexArr[n]
            if (!(ix in riObj))
            {
              _this.$notify({
                title: '警告',
                message: 'excel选择对比的列数应该相同，且一一对应！',
                type: 'warning'
              });
              return;
            }
            indexArr_right.push(riObj[ix])
          }
          arr.push(indexArr_right);
        }
        this.fullscreenLoading = true;
        console.log('====',indexArr_left,arr)
        w.postMessage({left: {data: this.status.left, index: indexArr_left}, right: {data: this.rData, index: arr}});
      },
      removeLeft(){
        let finput = this.$refs.importFile1;
        finput.value = ''
        this.leftData = null;
        this.leftHead = null;
        this.leftIndex = Object.create(null);
        this.lIObj = Object.create(null);
        this.leftExcel = {fileName: "", file: null};
        this.status.left = null;
        this.fpath = "";
      },
      setRindex(inx,index){
        let rExcel = this.rightExcels[inx];
        let {rindex,riObj} = rExcel;
        let current_color = this.current_color;
        let _this = this;

        // 如果当前excel表当前列已选中了当前颜色，则取消当前颜色的选中
        if (index in rindex)
        {
          let colorIndex = rindex[index]
          _this.$delete(_this.rightExcels[inx].rindex,index)
          delete riObj[colorIndex]
        }
        // 选中当前excel表格的当前列
        else
        {
          // 删除当前excel表格已选中的非当前列（当前颜色）
          if (current_color in riObj)
          {
            let inx = riObj[current_color]
            delete rindex[inx];
          }
          // 选中当前excel表格，当前列为当前颜色
          _this.$set(_this.rightExcels[inx].rindex,index,current_color);
          // rindex[index] = current_color;
          riObj[current_color] = index;
        }
      },
      setCindex(index){
        console.log('----index',index)
        let inxObj = this.leftIndex;
        let ilObj = this.lIObj;
        let rExcel = this.rightExcels;
        let current_color = this.current_color;
        let _this = this;
        if (index in inxObj)
        {
          let colorIndex = inxObj[index]
          rExcel.forEach((it,inx)=>{
            let {riObj} = it
            if (colorIndex in riObj)
            {
              let rx = riObj[colorIndex]
              _this.$delete(_this.rightExcels[inx].rindex,rx);
              delete riObj[colorIndex]
            }
          })
          _this.$delete(_this.leftIndex,index);
          delete ilObj[colorIndex];
        }
        else
        {
          if (current_color in ilObj)
            delete _this.leftIndex[ilObj[current_color]];

          ilObj[current_color] = index;
          _this.$set(_this.leftIndex,index,current_color);
        }
      },
      deleteF(index){
        this.rightExcels.splice(index, 1);
        this.rData.splice(index, 1);
        let finput = this.$refs.importFile2;
        finput.value = "";
      },
      importExcel_1(){
        let finput = this.$refs.importFile1;
        let _this = this;
        if (!finput.onchange)
        finput.onchange = (() => {
          if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
            let file = finput.files[0];
            _this.leftExcel.fileName = _this.setExcelName(file.name);
            _this.leftExcel.file = file;
            _this.fpath = file.path;
            _this.leftLoading = true;
            setTimeout(()=>{
              console.log('------------11111');
              let content;
              try {
                content = parse(fs.readFileSync(_this.fpath));
                // content = xlsx.parse(_this.fpath);
              }catch(e)
              {
                console.log('=====>error',e)
              }
              console.log("----leftData",content)
              // let
              _this.leftLoading = false;
              let f1 = content[0].data;
              _this.status.left = f1;
              _this.leftHead = f1[0];
              _this.leftData = _this.getExcelData(f1, 10);
            },200)
          } else {
            _this.$Message.error("请选择正确的Excel格式文件！");
          }
        });
      },
      // 导入次准excel
      importExcel_2(){
        let finput = this.$refs.importFile2;
        finput.onchange = (() => {
          if (finput.value.match(/\.(xls|xlsx|xlsm)(\?.*)?$/)) {
            let files = finput.files;
            let len = files.length;
            this.rightLoading = true;
            setTimeout(()=>{
              for (let i = 0; i < len; i++) {
                let it = files[i];
                let content = parse(fs.readFileSync(it.path));
                let f1 = content[0].data;
                this.rightExcels.push({
                  fileName: this.setExcelName(it.name),
                  head: f1[0],
                  datas: this.getExcelData(f1, 4),
                  rindex: Object.create(null),
                  riObj: Object.create(null)
                });
                this.rData.push(f1);
              }
              this.rightLoading = false;
            },200)
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
  .el-button--text{
    color: #333;
    font-weight: bold;
  }
  .pageContent {
    display: flex;
    flex-direction: column;
  }
  .selectColor{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color:#fff;
    align-items: center;
  }
  .helpBtn{
    position: absolute;
    right: 0;
    top: 10px;
    right: 20px;
  }
  .helpWord{
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    line-height: 24px;
  }
  .radios{
    margin: 20px 0;
  }
  .pageContent > .excelContent {
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
