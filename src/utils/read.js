import {XlsxStreamReader} from "./xlsx-stream-reader.js";
// const XlsxStreamReader = require('xlsx-stream-reader');
const fs = require("fs")

function read_xlsx(filename,callBack){
   // sheets [{data:[]}//sheet]
   let res = []
   var workBookReader = new XlsxStreamReader();
   workBookReader.on('error', function (error) {
       throw(error);
   });
   workBookReader.on('sharedStrings', function () {
       // do not need to do anything with these,
       // cached and used when processing worksheets
       console.log(workBookReader.workBookSharedStrings);
   });

   workBookReader.on('styles', function () {
       // do not need to do anything with these
       // but not currently handled in any other way
       console.log(workBookReader.workBookStyles);
   });

   workBookReader.on('worksheet', function (workSheetReader) {
       if (workSheetReader.id > 1){
           // we only want first sheet
           workSheetReader.skip();
           return;
       }
       // print worksheet name
       console.log(workSheetReader.name);

       // if we do not listen for rows we will only get end event
       // and have infor about the sheet like row count
       workSheetReader.on('row', function (row) {
         let row_data = [];
         row.values.forEach(function(rowVal, colNum){
           row_data.push(rowVal);
             // do something with row values
             // console.log('index:',rowIndex,'---rowVal',rowVal,'---colNum',colNum)
         });
         res.push(row_data)
         console.log('----resres',res)
       });
       workSheetReader.on('end', function () {
         console.log('res====>>',res)
         callBack([{data:res}])
       });

       // call process after registering handlers
       workSheetReader.process();
   });
   workBookReader.on('end', function () {
       // end of workbook reached
       callBack();
   });

   fs.createReadStream(filename).pipe(workBookReader);
}

exports.read_xlsx = read_xlsx;
