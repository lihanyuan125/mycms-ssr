const router = require("koa-router")();
const url = require("url");
let  = require("../routes/admin/index")
let ueditor = require("koa2-ueditor")

// 配置符文本编辑器,需要传一个数组：静态目录和 UEditor 配置对象
// 比如要修改上传图片的类型、保存路径
router.all('/editor/controller', ueditor(['public', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/admin/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


// 得到静态资源的绝对路径
router.use(async (ctx, next) => {
  // console.log("http://"+ctx.request.header.host);
  ctx.state.__HOST__ = "http://" + ctx.request.header.host;
  // console.log(ctx.state.__HOST__);

  // 得到访问的路径
  // let pathname = url.parse(ctx.request.url).pathname;
  // console.log(pathname);   // /admin/user/add

  let pathname = url.parse(ctx.request.url).pathname.substring(1);
  // console.log(pathname);   // admin/manage/add

  let splitUrl = pathname.split("/")
  // console.log(splitUrl);  //[ 'admin', 'manage', 'add' ]
  

  // 把用户信息保存到ctx的state上面
  ctx.state.G = {
    userinfo: ctx.session.userinfo,
    url: splitUrl,
    prePage:ctx.request.header['referer']
  };
  // console.log(ctx.session.userinfo);

  // 权限的校验(操作session需要配一个session中间件koa-session)
  if (ctx.session.userinfo) {
    await next();
  } else {
    if (
      pathname == "admin/login" ||
      pathname == "admin/login/doLogin" ||
      pathname == "admin/login/code"
    ) {
      await next();
    } else {
      ctx.redirect("/admin/login");
    }
  }
});

// 引入路由模块
let login = require("./admin/login");
let index = require ("./admin/index")
// let user = require("./admin/user");
let manage = require ("./admin/manage")
let articlecate = require ("./admin/articlecate")
let article = require ("./admin/article")
let focus = require ("./admin/focus")
let link = require ("./admin/link")
let nav = require ("./admin/nav")
let setting = require ("./admin/setting")

// 二级路由
router.use("/login", login);
router.use(index);
// router.use("/user", user);
router.use("/manage", manage);
router.use("/articlecate", articlecate);
router.use("/article", article);
router.use("/focus", focus);
router.use("/link", link);
router.use("/nav", nav);
router.use("/setting", setting);

module.exports = router.routes();
