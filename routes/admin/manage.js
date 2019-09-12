const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require("../../model/tools");

router.get("/", async (ctx, next) => {
  // ctx.body = "管理员列表"
  let result = await DB.find("admin", {});
  // console.log(result)
  await ctx.render("admin/manage/list", {
    list: result
  });
  next();
});

// 渲染添加管理员页面
router.get("/add", async (ctx, next) => {
  // ctx.body = "增加管理员"
  await ctx.render("admin/manage/add");
});

// 处理添加管理员逻辑
router.post("/doAdd", async (ctx, next) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  // console.log(username,password,rpassword);

  if (!/^\w{5,18}/.test(username)) {
    await ctx.render("admin/error", {
      message: "用户名不合法，请重新输入",
      redirect: ctx.state.__HOST__ + "admin/manage/add"
    });
  } else if (password != rpassword) {
    await ctx.render("admin/error", {
      message: "两次输入密码不一致",
      redirect: ctx.state.__HOST__ + "admin/manage/add"
    });
  } else if (!((password.length >= 6) & (password.length <= 18))) {
    await ctx.render("admin/error", {
      message: "密码长度应为6-18位",
      redirect: ctx.state.__HOST__ + "admin/manage/add"
    });
  } else {
    //判断用户名在数据库中是否存在
    let findResult = await DB.find("admin", { "username": username });
    if (findResult.length > 0) {
      await ctx.render("admin/error", {
        message: "用户名已存在，请重新输入",
        redirect: ctx.state.__HOST__ + "admin/manage/add"
      });
    } else {
      await DB.insert("admin", {
        username: username,
        pasasword: tools.MD5(password),
        status: 1,
        last_time: ""
      });
      ctx.redirect(ctx.state.__HOST__ + "/admin/manage");
    }
  }
});

// 渲染编辑管理员页面
router.get("/edit", async (ctx, next) => {
  let id = ctx.query.id;
  // console.log(id);
  let result = await DB.find("admin", { "_id": DB.getObjectId(id) });
  await ctx.render("admin/manage/edit", {
    list: result[0]
  });
});

// 处理编辑管理员逻辑
router.post("/doEdit", async (ctx, next) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  let id = ctx.request.body.id;
  // console.log(username,password,rpassword,id);

  if (password != "") {
    if (password != rpassword) {
      await ctx.render("admin/error", {
        message: "密码和确认密码不一致",
        redirect: ctx.state.__HOST__ + "/admin/manage/"
      });
    } else if (!((password.length >= 6) & (password.length <= 18))) {
      await ctx.render("admin/error", {
        message: "密码长度应为6-18位",
        redirect: ctx.state.__HOST__ + "admin/manage/"
      });
    } else {
      await DB.update(
        "admin",
        { "_id": DB.getObjectId(id) },
        { password: tools.MD5(password) }
      );
      ctx.redirect(ctx.state.__HOST__ + "/admin/manage");
    }
  } else {
    await ctx.render("admin/error", {
      message: "密码不能为空",
      redirect: ctx.state.__HOST__ + "admin/manage/"
    });
  }
});

// router.get("/delete", async (ctx, next) => {
//   let id = ctx.query.id;
//   // console.log(id);
//   let result = await DB.remove("admin", { "_id": DB.getObjectId(id) });
//   await ctx.redirect("/admin/manage/");
// });

module.exports = router.routes();
