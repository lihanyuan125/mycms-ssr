const Koa = require("koa");
const router = require("koa-router")();
const path = require("path");
const static = require("koa-static");
const render = require("koa-art-template"); //template模版引擎
const sd = require("silly-datetime")  //格式化时间
const session = require("koa-session"); 
const bodyParser = require("koa-bodyparser"); 

let app = new Koa(); //实例化一个koa


// 配置session中间件
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000,//session存储生命周期
  autoCommit: true,
  overwrite: true, 
  httpOnly: true, 
  signed: true,
  rolling: false, 
  renew: false, 
};
app.use(session(CONFIG, app));

// 配置post提交数据的中间件
app.use(bodyParser())


// 配置模版引擎
render(app, {
  root: path.join(__dirname, "views"),
  extname: ".html",
  debug: process.env.NODE_ENV !== "production",
  // 格式化时间格式
  dateFormat:dateFormat=function(newDate){ //扩展模版中的方法
    return sd.format( newDate,'YYYY-MM-DD HH:mm');
  }
});

// 托管静态资源
app.use(static(__dirname + "/public"));

// 引入路由模块
let index = require("./routes/index");
let api = require("./routes/api");
let admin = require("./routes/admin");
// 创建一级路由
router.use(index);
router.use("/admin", admin);
router.use("/api", api);

// 启动路由(使用koa-router中间件)
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3030, () => {
  console.log("server is running");
});

module.exports = app;
