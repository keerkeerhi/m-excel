/**
 * Created by Administrator on 2017/9/2.
 */
function init () {
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '')
  }

  Array.prototype.indexOfFun = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].path == val)
        return i
    }
    return -1
  }

  Array.prototype.remove = function (val) {
    var index = this.indexOfFun(val.path)
    if (index > -1)
      this.splice(index, 1)
  }

  Array.prototype.add = function (val) {
    var index = this.indexOfFun(val.path)
    if (index == -1)
      this.push(val)
  }
}
init()

export default 'ok'
