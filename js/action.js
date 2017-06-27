﻿var fs = require("fs");
var xlsx = require('node-xlsx');
var gui = require('nw.gui');
var win = gui.Window.get();

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

Array.prototype.indexOfFun = function(val)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i].path == val)
            return i;
    }
    return -1;
};

Array.prototype.remove = function(val)
{
    var index = this.indexOfFun(val.path);
    if (index > -1)
        this.splice(index, 1);
};

Array.prototype.add = function(val)
{
    var index = this.indexOfFun(val.path);
    if (index==-1)
        this.push(val);
};

var sourceArr = [];
var main = new Vue({
    el:".main",
    data:{
        sources:sourceArr,
        sourceData:[],
        lcindex:-1,
        rcindex:-1,
        fileName:"",
        datas:{ld:[],rd:[]}
    }
    ,
    methods:{
        getRes()
        {
            if (this.sources.length<2)
            {
                alert("请拖入excel！");
                return;
            }
        }
        ,
        delfun(it)
        {
            this.rcindex=-1;
            this.sources.splice(it,1);
            this.lcindex = -1;
            this.rcindex = -1;
            this.fileName = "";
            this.sourceData = [];
        }
        ,
        close_fun()
        {
            win.close();
        },
        small_fun(){
            win.minimize();
        },
        clear()
        {
            this.sources=[];
            this.lcindex = -1;
            this.rcindex = -1;
            this.fileName = "";
            this.sourceData = [];
        },
        getSame()
        {
            var res = [];
            var res2 = [];
            var fpath = this.sources[0].path;
            var pathstr = fpath.substring(0,fpath.lastIndexOf('\\')+1);
            var lindex = this.lcindex;
            var rindex = this.rcindex;
            if (this.lcindex<0||this.rcindex<0)
            {
                alert('请选择两个excel要对比的列！');
                return;
            }
            var loadO = this.showLoad;
            setTimeout(function(){loadO(true)},1);
            var rightObject = Object.create(null);
            this.datas.rd.forEach(function(it){
                rightObject[String(it[rindex]).trim().toLocaleLowerCase()] = 0;
            });

            this.datas.ld.forEach(function(it){
                if (String(it[lindex]).trim().toLocaleLowerCase() in rightObject)
                    res.push(it);
                else
                    res2.push(it);
            });

            var i=2;
            var buffer = xlsx.build([{name: "mySheetName", data: res}]);
            fs.writeFile(pathstr+this.fileName+"-theSame.xlsx", buffer, function(err) {
                console.log("文本创建成功1");
                i--;
                if (i==0)
                {
                    loadO(false);
                    alert('完成任务！');
                }
            });

            var buffer2 = xlsx.build([{name: "mySheetName", data: res2}]);
            fs.writeFile(pathstr+this.fileName+"-theDifferent.xlsx", buffer2, function(err) {
                console.log("文本创建成功2");
                i--;
                if (i==0){
                    loadO(false);
                    alert('完成任务！');
                }
            });
        },
        explain(arr)
        {
            var loadO = this.showLoad;
            setTimeout(function(){loadO(true)},1);
            if (this.sourceData.length==1)
            {
                this.setRightData(arr);
                setTimeout(function(){loadO(false)},1);
                return;
            }
            this.fileName = arr[0].name.split(".")[0];
            var f1 = xlsx.parse(arr[0].path);
            let leftArr = f1[0].data;
            this.datas.ld = leftArr;
            this.sourceData.push(leftArr.length>0?leftArr[0]:[]);
            if (arr.length==1)
            {
                setTimeout(function(){loadO(false)},1);
                return;
            }
            this.setRightData(arr);
            setTimeout(function(){loadO(false)},1);
        },
        setRightData(arr){
            var f2 = xlsx.parse(arr[1].path);
            let rightArr = f2[0].data;
            this.datas.rd = rightArr;
            this.sourceData.push(rightArr.length>0?rightArr[0]:[]);
        },
        selectLCol(index)
        {
            this.lcindex = index;
        },
        selectRCol(index)
        {
            this.rcindex = index;
        },
        showLoad(flag){
            document.getElementById('loading').style.display=flag?'table':'none';
        }
    },
    watch:{
        sources:{
            handler: function (val, oldVal) {
                if (val.length>0)
                    this.explain(val);
            },
            deep: true
        }
    },
    computed:{
        leftWidth(){
            return 100/this.sourceData[0].length+'%';
        },
        rightWidth(){
            return 100/this.sourceData[1].length+'%';
        }
    }
});

const holder = document.getElementById('content');
holder.ondragover = function() {
    return false;
}

holder.ondragleave = holder.ondragend = function() {
    return false;
}

holder.ondrop = function(e) {
    e.preventDefault();
    for ( var i=0;i<e.dataTransfer.files.length;i++)
    {
        var f = e.dataTransfer.files[i];
        console.log('File(s) you dragged here: ', f.path)
        main.sources.add(f);
    }
    return false;
}