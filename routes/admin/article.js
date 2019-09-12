const router = require("koa-router")();
const Db = require("../../model/db");
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


// 渲染新闻列表
router.get("/", async (ctx, next) => {
  let page = ctx.query.page || 1;
  let pageSize = 5;
  let resultCount = await Db.count("article", {});
  // console.log(resultCount)
  let totalPages = Math.ceil(resultCount / pageSize);
  let result = await Db.find(
    "article",
    {},
    {},
    {
      page,
      pageSize,
      totalPages,
      sort: { add_time: -1 }
    }
  );
  //   console.log(result);
  await ctx.render("admin/article/list", {
    list: result,
    page: page,
    totalPages: totalPages
  });
});

// 渲染添加新闻列表
router.get("/add", async (ctx, next) => {
  let cateList = await Db.find("articlecate", {});
  // console.log(cateList);
  await ctx.render("admin/article/add", {
    cateList: tools.cateToList(cateList)
  });
  // console.log(tools.cateToList(cateList));
});

// 处理添加新闻逻辑，接收客户端提交的新闻内容
router.post("/doAdd", upload.single("img_url"), async ctx => {
  // 接收数据
  let pid = ctx.req.body.pid;
  let title = ctx.req.body.title.trim();
  let author = ctx.req.body.author.trim();
  let status = ctx.req.body.status;
  let is_hot = ctx.req.body.is_hot;
  let is_new = ctx.req.body.is_new;
  let is_best = ctx.req.body.is_best;
  let keywords = ctx.req.body.keywords;
  let content = ctx.req.body.content || "";
  let description = ctx.req.body.description || "";
  let add_time = tools.getDate(); //插入时的时间
  // let img_url = ctx.req.file.path.substring(7);
  let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : "";
  // console.log(pid,title,author,status,is_best,is_hot,is_new,keywords,content,description,add_time,img_url)
  let result = await Db.find("articlecate", { _id: Db.getObjectId(pid) });
  let catename = result[0].title;

  let json = {
    pid,
    catename,
    title,
    author,
    status,
    is_best,
    is_hot,
    is_new,
    keywords,
    content,
    description,
    add_time,
    img_url
  };
  await Db.insert("article", json);
  ctx.redirect(ctx.state.__HOST__ + "/admin/article");
});

// 渲染编辑页面
router.get("/edit", async (ctx, next) => {
  let cateList = await Db.find("articlecate", {});
  let id = ctx.query.id; // 得到点击的要删除项的id
  let list = await Db.find("article", { _id: Db.getObjectId(id) });
  // console.log(cateList,list);
  ctx.render("admin/article/edit", {
    cateList: tools.cateToList(cateList),
    list: list[0],
    prePage: ctx.state.G.prePage
  });
});

// 处理编辑新闻逻辑
router.post("/doEdit", upload.single("img_url"), async (ctx, next) => {
  // console.log("....");

  let prePage = ctx.req.body.prePage || "";
  let id = ctx.req.body.id;
  let pid = ctx.req.body.pid;
  let catename = ctx.req.body.catename || "";
  let title = ctx.req.body.title.trim();
  let author = ctx.req.body.author.trim();
  let status = ctx.req.body.status;
  let is_hot = ctx.req.body.is_hot;
  let is_new = ctx.req.body.is_new;
  let is_best = ctx.req.body.is_best;
  let keywords = ctx.req.body.keywords;
  let content = ctx.req.body.content || "";
  let description = ctx.req.body.description || "";
  let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : "";
  console.log(img_url);
  
  // console.log(id,pid,title,author,status,is_best,is_hot,is_new,keywords,content,description,img_url)
  if (img_url) {
    var json = {
      id,
      pid,
      catename,
      title,
      author,
      status,
      is_best,
      is_hot,
      is_new,
      keywords,
      content,
      description,
      img_url //若有新的图片，则添加新的图片地址
    };
  } else {
    var json = {
      id,
      pid,
      catename,
      title,
      author,
      status,
      is_best,
      is_hot,
      is_new,
      keywords,
      content,
      description
    };
  }
  let result = await Db.update("article",{ "_id": Db.getObjectId(id)}, json);
  
  if (prePage) {
    ctx.redirect(prePage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + "/admin/article");
  }
});

module.exports = router.routes();
