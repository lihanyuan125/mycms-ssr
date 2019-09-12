const router = require("koa-router")();
const Db = require("../../model/db");
const tools = require("../../model/tools");

// 渲染分类列表
router.get("/", async (ctx, next) => {
  let result = await Db.find("articlecate", {});
  // console.log(result);
  await ctx.render("admin/articlecate/list", {
    list: tools.cateToList(result)
  });
});

// 渲染添加分类页面
router.get("/add", async (ctx, next) => {
  let result = await Db.find("articlecate", { pid: "0" }); //渲染顶级分类下拉框
  // console.log(result)
  await ctx.render("admin/articlecate/add", {
    cateList: result
  });
});

//  处理添加分类页面逻辑
router.post("/doAdd", async (ctx, next) => {
  // console.log(123456);
  let addData = ctx.request.body;
  // console.log(addData);
  await Db.insert("articlecate", addData);
  ctx.redirect(ctx.state.__HOST__ + "/admin/articlecate");
});

// 渲染编辑分类页面
router.get("/edit", async (ctx, next) => {
  let id = ctx.query.id;
  // console.log(id);
  let result = await Db.find("articlecate", { _id: Db.getObjectId(id) });
  console.log(result);
  let articlecate = await Db.find("articlecate", { pid: "0" });
  // console.log(articlecate);
  await ctx.render("admin/articlecate/edit", {
    list: result[0],
    catelist: articlecate //顶级的
  });
});

//  处理编辑分类页面逻辑
router.post("/doEdit", async (ctx, next) => {
  let editData = ctx.request.body;
  // console.log(editData)
  //     { title: '公司新闻',
  //   id: '5afa5392416f21368039b05e',
  //   pid: '5afa56bb416f21368039b05d',
  //   keywords: '公司新闻',
  //   status: '1',
  //   description: '公司新闻' }
  let id = editData.id;
  let title = editData.title;
  let pid = editData.pid;
  let keywords = editData.keywords;
  let status = editData.status;
  let description = editData.description;
//   console.log(id, title, pid, keywords, status, description); //5afa5392416f21368039b05e 公司新闻 5afa56bb416f21368039b05d 公司新闻 1 公司新闻
  await Db.update(
    "articlecate",//要更新的collection
    { _id: Db.getObjectId(id) },//条件
    {
      title,
      pid,
      keywords,
      status,
      description
    }
  );
  ctx.redirect(ctx.state.__HOST__ + "/admin/articlecate");
});

module.exports = router.routes();
