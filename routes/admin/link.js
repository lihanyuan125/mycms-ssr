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

// 渲染友情链接列表
router.get("/", async (ctx, next) => {
  var page = ctx.query.page || 1; //当前页
  var pageSize = 5;
  let count = await DB.count("link", {}); //总数量
  let totalPages = Math.ceil(count / pageSize); //总页数
  let result = await DB.find("link",{},{},
    {
      page,
      pageSize,
      totalPages,
      sortJson: { sort: 1 }
    }
  );
  await ctx.render("admin/link/list", {
    list: result,
    totalPages: totalPages,
    page: page
  });
});

// 渲染添加友情链接页面
router.get("/add", async (ctx, next) => {
  await DB.find("link", {});
  await ctx.render("admin/link/add");
});

// 处理添加友情链接逻辑
router.post("/doAdd", upload.single("pic"), async (ctx, next) => {
  let title = ctx.req.body.title;
  let pic = ctx.req.file ? ctx.req.file.path.substr(7) : "";
  let url = ctx.req.body.url;
  let sort = ctx.req.body.sort;
  let status = ctx.req.body.status;
  let add_time = tools.getDate();
  json = { title, pic, url, sort, status, add_time };
//   console.log(json);
  await DB.insert("link", json);
  ctx.redirect(ctx.state.__HOST__ + "/admin/link");
});

// 渲染编辑友情链接页面
router.get("/edit", async (ctx, next) => {
  let id = ctx.query.id;
  let result = await DB.find("link", { _id: DB.getObjectId(id) });
//   console.log(result)
  await ctx.render("admin/link/edit", {
    list: result[0],
    prePage: ctx.state.G.prePage
  });
});

// 处理编友情链接逻辑
router.post("/doEdit", upload.single("pic"), async (ctx, next) => {
  var prePage = ctx.req.body.prePage;
  let id = ctx.req.body.id;
  let title = ctx.req.body.title;
  let pic = ctx.req.file ? ctx.req.file.path.substr(7) : ""; //更新图片的地址substr(7)  public\uploads\1567211884959.jpg===>uploads\1567211753447.jpg
  let url = ctx.req.url||ctx.req.file;
  let sort = ctx.req.sort || 0;
  let status = ctx.req.status || 0;
  json = { id, title, pic, url, sort, status };
  // console.log(json);
  DB.update("link", { _id: DB.getObjectId(id) }, json);
  if (prePage) {
    ctx.redirect(prePage);
  } else {
    ctx.redirect(ctx.state.__HOST__ + "/admin/link");
  }
});

module.exports = router.routes();
