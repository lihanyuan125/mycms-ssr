// 工具函数   MD5加密方式（使用前安装MD5）
let md5 = require("md5");
let tools = {
  
// -----------------更新时间-------------------
getDate(){
  return new Date()
},

  // -----------------------------------------
  //MD5函数名,加密密码
  MD5(str) {
    return md5(str);
  },
// -----------------转换数据格式-------------------
  cateToList(data) {
    // console.log(data)
    let firstArr = [];
    for (let i = 0; i <data.length; i++) {
      // console.log(data[i].pid)
      if (data[i].pid == 0) {
        firstArr.push(data[i]);
      }
    }
    // console.log(firstArr);
    for (let i = 0; i <firstArr.length; i++) {
      firstArr[i].list = [];
      for (let j = 0; j < data.length; j++) {
        if (firstArr[i]._id == data[j].pid) {
          firstArr[i].list.push(data[j]);
        }
      }
    }
// console.log(firstArr);
    return firstArr;
  }
};

module.exports = tools;
