const router = require("koa-router")();
const Db = require("../../model/db");
const svgCaptcha = require("svg-captcha");
const tools = require("../../model/tools");

router.get("/", async (ctx, next) => {
  // ctx.body = "用户登陆界面"
  await ctx.render("admin/login");
  await next();
});

// 处理用户登陆时填写的信息
router.post("/doLogin", async (ctx, next) => {
  // console.log("........");
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let code = ctx.request.body.code;

  //   用户提交的验证码一样
  if (code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase()) {
    // 连接数据库，对比username和password的值是否一样
    var result = await Db.find("admin", {
      username: username,
      password: tools.MD5(password)
    });
    // console.log(result); //user:collection集合   {json数据}
    if (result.length > 0) {
      //登陆成功
      ctx.session.userinfo = result[0];

      //登陆成功时，记录登陆时间，更新到数据库
      await Db.update(
        "admin",
        { _id: Db.getObjectId(result._id) },
        {
          last_time:tools.getDate() //获取当前时间
        }
      );

      ctx.redirect(ctx.state.__HOST__ + "/admin");
    } else {
      //登陆失败
      ctx.render("admin/error", {
        message: "用户名或密码错误",
        redirect: ctx.state.__HOST__ + "/admin/login"
      });
    }
  } else {
    //   验证码不一致
    ctx.render("admin/error", {
      message: "验证码错误",
      redirect: ctx.state.__HOST__ + "/admin/login"
    });
  }
});

// 生成验证码模块(安装svgCaptcha)
router.get("/code", async (ctx, next) => {
  //验证码一（随机字符）
  var captcha = svgCaptcha.create({
    width: 120,
    height: 40,
    fontSize: 35
  });
  //   验证码二（数学运算）
  // var captcha = svgCaptcha.createMathExpr({
  //   width: 120,
  //   height: 40,
  //   fontSize: 35
  // });
  // console.log(captcha);
  // 保存验证码到session
  ctx.session.code = captcha.text;
  // 设置响应头
  ctx.response.type = "svg";
  //   ctx.response.res.type = "svg";
  //   ctx.response.type = "image/svg+xml"
  ctx.body = captcha.data;
  await next();
});

// 退出登录
router.get("/logout", async (ctx, next) => {
  ctx.session.userinfo = null;
  ctx.redirect(ctx.state.__HOST__ + "/admin/login");
  await next();
});

module.exports = router.routes();
