/* ----------------查找分类列表api-------------------- */
const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require("../../model/tools");
router.get("/list",async(ctx,next)=>{
    let result = await DB.find("articlecate",{},{})
    let json = {
        code:1,
        result:tools.cateToList(result),
        message:"获取成功"
    }
    ctx.body = json;
    console.log(result);
    
})

module.exports = router.routes()