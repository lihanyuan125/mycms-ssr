const router = require("koa-router")();
const Db = require("../../model/db");

// 创建二级路由
router.get("/", async (ctx, next) => {
  // ctx.body = '后台首頁面'
  await ctx.render("admin/index");
});

/*-------------------更改状态----------------------*/
router.get("/changeStatus", async (ctx, next) => {
  // console.log("hello")
  let collectionName = ctx.query.collectionName; //集合
  let attr = ctx.query.attr; //得到集合中的某个字段
  let id = ctx.query.id;
  let data = await Db.find(collectionName, { _id: Db.getObjectId(id)})
  console.log(data);
  if (data.length > 0) {   //data[0]-->拿到data中的对象
    if (data[0][attr]==1){  //attr-->status   
      // 拼装一个json数据
      var json = {
        [attr] : 0   //[attr是一个变量，所以获取时必须加[]]
      }
    }else{
      json = {
        [attr] : 1
      }
    }
    let updataResult = await Db.update(collectionName,{"_id":Db.getObjectId(id)},json)
    if (updataResult){
      ctx.body = {"message":"更新成功","success":true}
      // ctx.redirect
    }else{
      ctx.body = {"message":"更新失败","success":false}
    }
  }else{
    ctx.body = {"message":"更新失败，参数错误","success":true}
  }
});


/*-------------------更改排序接口----------------------*/
router.get("/changeSort", async (ctx, next) => {
  // console.log("hello")
  let collectionName = ctx.query.collectionName; //集合
  let id = ctx.query.id;
  let sortValue =ctx.query.sortValue;
  let  json = {
    sort:sortValue
  }
  let updataResult = Db.update(collectionName,{"_id":Db.getObjectId(id)}, json)
  if(updataResult){
    ctx.body = {"message":"更新成功","success":true}
  }else{
    ctx.body = {"message":"更新失败","success":false}
  }
});


/*-------------------公共的删除方法----------------------*/
router.get("/remove",async(ctx,next)=>{
  // 得到集合名  id
  let collectionName = ctx.query.collectionName;
  let id = ctx.query.id;
  await Db.remove(collectionName,{"_id":Db.getObjectId(id)})
  ctx.redirect(ctx.state.G.prePage);
})

 /*-------------------更新个人信息成功----------------------*/


module.exports = router.routes();
