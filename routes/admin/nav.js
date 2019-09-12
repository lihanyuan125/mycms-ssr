const router = require("koa-router")();
const DB = require("../../model/db");
const multer = require("koa-multer"); //上传图片
const tools = require("../../model/tools");

// 配置上传文件（multer）
var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, "public/uploads/"); //上传文件的保存路径
  },
  //修改文件名称
  filename: function(req, file, cb) {
    const fileFormat = file.originalname.split("."); //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
// 加载配置
const upload = multer({ storage: storage });

// 渲染导航列表
router.get("/", async (ctx, next) => {
  let result = await DB.find("nav",{},);
  await ctx.render("admin/nav/list", {
    list: result,
  });
});

// 渲染添加导航页面
router.get("/add", async (ctx, next) => {
  await DB.find("nav", {});
  await ctx.render("admin/nav/add");
});

// 处理添加导航逻辑
router.post("/doAdd",  async (ctx, next) => {
  let title = ctx.request.body.title;
  let url = ctx.request.body.url;
  let sort = ctx.request.body.sort;
  let status = ctx.request.body.status;
  let add_time = tools.getDate();
  json = { title, url, sort, status, add_time };
//  console.log(json);
  await DB.insert("nav", json);
  ctx.redirect(ctx.state.__HOST__ + "/admin/nav");
});

// 渲染编辑导航页面
router.get("/edit", async (ctx, next) => {
  let id = ctx.query.id;
  let result = await DB.find("nav", { _id: DB.getObjectId(id) });
//   console.log(result)
  await ctx.render("admin/nav/edit", {
    list: result[0],
    prePage: ctx.state.G.prePage
  });
});


// 处理编导航逻辑
router.post("/doEdit",  async (ctx, next) => {
  let id = ctx.request.body.id;
  let title = ctx.request.body.title;
  let url = ctx.request.body.url;
  let sort = ctx.request.body.sort;
  let status = ctx.request.body.status || 0;
  let prePage = ctx.request.body.prePage
  json = { id, title, url, sort, status };
  // console.log(json);
  DB.update("nav", { _id: DB.getObjectId(id) }, json);
  if (prePage) {
    ctx.redirect(prePage);
  } else {
    ctx.redirect(ctx.state.__HOST__ + "/admin/nav");
  }
});

module.exports = router.routes();