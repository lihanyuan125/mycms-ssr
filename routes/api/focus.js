/* ----------------查找轮播图列表api-------------------- */
const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require("../../model/tools");
router.get("/list",async(ctx,next)=>{
    let result = await DB.find("focus",{},{"title": 1,"pic":1,"url":1})
    ctx.body = result;
    console.log(result);
    
})

module.exports = router.routes()