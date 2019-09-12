const router = require("koa-router")();
const DB = require("../../model/db");
const tools = require("../../model/tools");

/* -----获取用户列表的api接口  /api/manage/-----*/
router.get("/list", async (ctx, next) => {
  let result = await DB.find("users", {}, {"_id":0, "username": 1});
  ctx.body = result;
});

/* -----添加用户的api接口  /api/manage/add-----*/
router.post("/add", async (ctx, next) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  if (!/^\w{5,18}/.test(username)) {
    let json = {
      code: 0,
      message: "用户名不合法，请重新输入"
    };
    ctx.body = json;
  } else if (password != rpassword) {
    let json = {
      code: 0,
      message: "两次输入密码不一致"
    };
    ctx.body = json;
  } else if (!((password.length >= 6) & (password.length <= 18))) {
    let json = {
      code: 0,
      message: "密码长度应该在6到18位"
    };
    ctx.body = json;
  } else {
    //判断用户名在数据库中是否存在
    let findResult = await DB.find("users", { username: username });
    if (findResult.length > 0) {
      let json = {
        code: 0,
        message: "用户名已存在，请重新输入"
      };
      ctx.body = json;
    } else {
      await DB.insert("users", {
        username: username,
        password: tools.MD5(password),
        status: 1,
        last_time: tools.getDate(),
      });
      let json = {
        code: 1,
        message: "添加用户成功"
      };
      ctx.body = json;
    }
  }
});

/* -----修改用户的api接口  /api/manage/edit-----*/
router.post("/edit", async (ctx, next) => {
  // let id = ctx.query.id;
  let username = ctx.request.body.username;
  // let nusername = ctx.request.body.nusername;
  let password = ctx.request.body.password;
  let rpassword = ctx.request.body.rpassword;
  let npassword = ctx.request.body.npassword;
  console.log( username, password, rpassword, npassword);

  let result = await DB.find("users", { username: username });
  if (!result[0]) {
    let json = {
      code: 0,
      message: "用户名不存在，请重新输入"
    };
    ctx.body = json
  }else{
    if (!/^\w{5,18}/.test(username)) {
      let json = {
        code: 0,
        message: "用户名不合法，请重新输入"
      };
      ctx.body = json;
    } else if (password != rpassword) {
      let json = {
        code: 0,
        message: "两次输入密码不一致"
      };
      ctx.body = json;
    } else if (!(password.length >= 6) & (password.length <= 18)) {
      let json = {
        code: 0,
        message: "密码长度应该在6到18位"
      };
      ctx.body = json;
    }else {
      //判断用户名在数据库中是否存在
      if (result[0].length > 0) {
        let json = {
          code: 0,
          message: "用户名已存在，请重新输入"
        };
        ctx.body = json;
      } else {
        // let json1 = {"username":nusername,"password":npassword}
        await DB.update(
          "users",
          { "username": username},
         {"password":tools.MD5(npassword)}
        );
        let json = {
          code: 1,
          message: "修改用户成功"
        };
        ctx.body = json;
      }
    }
  }

   
});

module.exports = router.routes();
