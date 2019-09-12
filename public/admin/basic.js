
// 封装一些公用的方法
let app = {

/*-----------------------改变状态status----------------------------*/
// onclick="app.f1(this,'admin','status','{{@$value._id}}')"  -->list
  f1: function(el, collectionName, attr, id) {
    //attr (status)
    // alert("..........")
    // 在后端开一个api接口，利用ajax去请求
    $.get(
      "/admin/changeStatus",
      {
        collectionName: collectionName,
        attr: attr,
        id: id
      },
      function(data) {
        //如果后端返回的data里面有success，表示成功
        if (data.success ===true) {
          //   console.log(data);
          if (el.src.indexOf("yes") != -1) {
            //查找src里面是否包含yes
            el.src = "/admin/images/no.gif";
          } else {
            el.src = "/admin/images/yes.gif";
          }
        }
      }
    );
  },



  /*-------------------失去焦点后进行排序----------------------*/
  // 调api（index/changeSort）
  async changeSort(el, collectionName, id) {
    let sortValue = el.value;
    let sort = new Promise((resolve,reject)=>{
      $.get(
        "/admin/changeSort",
        {
          collectionName: collectionName,
          id: id,
          sortValue: sortValue
        },
        function(data) {
          resolve(data)
        }
      );
    })
    let f1 = await sort.then((res)=>{
      return res
    })
    if(f1.success === true){
      // console.log(f1);
      // history.go(0) 
      location.reload()
      // location.href = "http://localhost:3030/admin/"  //定位到当前页面
    }
  },
  confirmSure(el, collectionName, id){
    let a = confirm("确认修改？")    // 确定：true，  取消：false
    if(a){
      this.changeSort(el, collectionName, id)
    }else{
      return
    }
  }
};
