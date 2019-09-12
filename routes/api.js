const router = require('koa-router')()

// 创建二级路由
router.get('/',async (ctx, next)=>{
 ctx.body = "api接口"
})

let manage = require("./api/manage")
let articlecate = require("./api/articlecate")
let article = require("./api/article")
let focus = require("./api/focus")
let link = require("./api/link")
let nav = require("./api/nav")


router.use("/manage",manage)
router.use("/articlecate",articlecate)
router.use("/article",article)
router.use("/focus",focus)
router.use("/link",link)
router.use("/nav",nav)



module.exports = router.routes()