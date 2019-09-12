const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require("../../model/tools");

// 获取新闻列表的接口
router.get("/list",async(ctx,next)=>{
    let result = await DB.find("article",{},{"catename": 1, "title": 1,"author": 1,"description":1,"keywords":1,"img_url":1,"content":1})
    ctx.body = result;
    console.log(result);
    
})

module.exports = router.routes()
