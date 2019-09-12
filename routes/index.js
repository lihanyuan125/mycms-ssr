const router = require("koa-router")()
const DB = require("../model/db")
const url = require("url")
const tools = require("../model/tools")


router.get('/', async(ctx)=>{
  ctx.render("default/index")
})


router.get('/service', async(ctx)=>{
  ctx.render("default/service")
})

router.get('/conetent', async(ctx)=>{
  ctx.render("default/conetent")
})


router.get('/case', async(ctx)=>{
  ctx.render("default/case")
})

router.get('/news', async(ctx)=>{
  ctx.render("default/index")
})

router.get('/about', async(ctx)=>{
  ctx.render("default/about")
})

router.get('/connect', async(ctx)=>{
  ctx.render("default/connect")
})



module.exports = router.routes()
