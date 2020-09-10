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
    // 右侧其中一个Excel 的数据
    let data = rExcels.data[m]
    // 右侧其中一个Excel 的对比索引
    let cols = rExcels.index[m]

    // let cols = []
    // // 初始化多字段对比数据库
    // for (key in riObj)
    // {
    //   // if (!(key in rightObject))
    //   //   rightObject[key] = Object.create(null)
    //   cols.push(riObj[key]);
    // }

    let len = data.length
    for (let n = len; n--;) {
      // 右侧一个Excel 中的一条数据
      let it = data[n]
      let ln = cols.length;
      let key = "";
      for(let h = 0;h<ln;h++)
      {
        let inx = cols[h];
        let cont = String(it[inx]).trim()
        if (cont)
        {
          key+=cont.toLocaleLowerCase()+','
        }
      }
      rightObject[key] = 0;
    }
  }

  let lDatas = lExcel.data
  let llen = lDatas.length
  let linx = lExcel.index
  for (let i = 0; i < llen; i++) {
    let it = lDatas[i]
    let ln = linx.length;
    let key = "";
    for(let h = 0;h<ln;h++)
    {
      let inx = linx[h];
      let cont = String(it[inx]).trim()
      if (cont)
      {
        key+=cont.toLocaleLowerCase()+','
      }
    }
    if (key in rightObject)
      res.push(it)
    else
      res2.push(it)
  }

  // 得到的结果是左侧Excel中，和右侧Excel相同的和不同的数据。
  postMessage({same: res, diff: res2})
}
