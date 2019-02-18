/**
 * Created by Administrator on 2017/9/11.
 */
onmessage = function (event) {
  let data = event.data;
  let maxYear = Date.parse(data.maxYear)
  let datas = data.datas
  let index = data.index
  let res = []
  let errors = []
  while (datas.length)
  {
    let item = datas.pop()
    try {
      let itemstr = item[index]+''
      let datestr = itemstr.substr(6,8)
      let year = datestr.substr(0,4)
      let month = datestr.substr(4,2)
      let day = datestr.substr(6,2)
      let date = Date.parse(year+'-'+month+"-"+day)
      if (isNaN(date))
      {
        errors.push(item)
        continue
      }
      if (date<maxYear)
      {
        res.push(item)
      }
    }catch(e){
      errors.push(item)
    }
  }

  postMessage({res,errors})
}
