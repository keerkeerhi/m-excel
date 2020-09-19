const {read_xlsx} = require('./read.js');

read_xlsx('./abc.xlsx',function(res){
  console.log('---res',res)
})
console.log(222222222222222)
