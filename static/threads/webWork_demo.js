/**
 * Created by Administrator on 2017/9/11.
 */
onmessage = function (event) {
  let res = []
  let res2 = []
  let data = event.data
  let lExcel = data.left
  let rExcels = data.right
  let rightObject = Object.create(null)

  let rlen = rExcels.data.length
  for (let m = rlen; m--;) {
    let data = rExcels.data[m]
    let inx = rExcels.index[m]
    let len = data.length
    for (let n = len; n--;) {
      let it = data[n]
      rightObject[String(it[inx]).trim().toLocaleLowerCase()] = 0
    }
  }
  let lDatas = lExcel.data
  let llen = lDatas.length
  let linx = lExcel.index
  for (let i = 0; i < llen; i++) {
    let it = lExcel.data[i]
    if (String(it[linx]).trim().toLocaleLowerCase() in rightObject)
      res.push(it)
    else
      res2.push(it)
  }
  postMessage({same: res, diff: res2})
}
