/**
 * Created by Administrator on 2017/9/11.
 */
var i=0;

function timedCount()
{
  i=i+1;
  console.log('-----------',i);
  postMessage(i);
  setTimeout("timedCount()",500);
}

onmessage = function (event) {
  console.log('----->worker=>',event.data);
};
