const router = require("koa-router")()

router.get("/",async(ctx)=>{
// ctx.body = "用户管理界面"
await ctx.render("admin/user/list")
})
router.get("/add",async(ctx)=>{
// ctx.body = "增加用户"
await ctx.render("admin/user/add")
})
router.get("/edit",async(ctx)=>{
ctx.body = "编辑用户"
})
router.get("/del",async(ctx)=>{
ctx.body = "删除用户"
})

module.exports = router.routes()