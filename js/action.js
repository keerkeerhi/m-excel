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
        leftData:[],
        rightData:[],
        lcindex:-1,
        rcindex:-1,
        rObj:Object.create(null),
        fileName:""
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
            this.rightData = [];this.rcindex=-1;this.rObj=Object.create(null);
            this.sources.remove(it);
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
            this.rObj = Object.create(null);
            this.fileName = "";
        },
        getSame()
        {
            var res = [];
            var res2 = [];
            var fpath = this.sources[0].path;
            var pathstr = fpath.substring(0,fpath.lastIndexOf('\\')+1);
            if (this.lcindex<0||this.rcindex<0)
            {
                alert('请选择两个excel要对比的列！');
                return;
            }
            var rightObject = this.rObj[this.rcindex];
            this.leftData.forEach(function(it){
                if (String(it[main.lcindex]).trim().toLocaleLowerCase() in rightObject)
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
                    alert('完成任务！');
            });

            var buffer2 = xlsx.build([{name: "mySheetName", data: res2}]);
            fs.writeFile(pathstr+this.fileName+"-theDifferent.xlsx", buffer2, function(err) {
                console.log("文本创建成功2");
                i--;
                if (i==0)
                    alert('完成任务！');
            });
        },
        explain(arr)
        {
            var f1 = xlsx.parse(arr[0].path);
            let leftData = f1[0].data;
            this.fileName = arr[0].name.split(".")[0];
            if (arr.length==1)
                return;

            var f2 = xlsx.parse(arr[1].path);
            let rightData = f2[0].data;
            var t1 = document.getElementById('tab_left');
            var t2 = document.getElementById('tab_right');
            document.getElementById('content-center').style.height = Math.max(t1.offsetHeight,t2.offsetHeight) +'px';
        },
        selectLCol(index)
        {
            this.lcindex = index;
        },
        selectRCol(index)
        {
            this.rcindex = index;
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
    directives: {
        "init": {
            inserted: function (el,binding) {
                var val = binding.value;
                if (!(val.col in main.rObj))
                    main.rObj[val.col] = Object.create(null);
                main.rObj[val.col][String(val.item).trim()] = '';
            }
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


function substr(text,max)
{
    if (text&&text.length>max)
        return text.substring(0,max)+'...';
    else
        return text;
}

function getTextWidth(textStr)
{
    var txt = document.createElement('div');
    txt.style.float = 'left';
    txt.style.position = 'absolute';
    txt.style.whiteSpace = 'nowrap';
    txt.style.visibility = 'hidden';
    txt.style.fontSize = '18px;';
    txt.style.fontFamily = 'Microsoft YaHei';
    txt.innerHTML = textStr;
    document.body.appendChild(txt);
    w = txt.clientWidth;
    document.body.removeChild(txt);
    return w;
}