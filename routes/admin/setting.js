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

// 渲染设置页面
router.get("/",async(ctx,next)=>{
    let result = await Db.find("setting",{})
    await ctx.render("admin/setting/list",{
        list:result[0],
    })
})

// 处理编辑信息逻辑
router.post("/doEdit",upload.single("site_logo"),async(ctx,next)=>{
    let site_title =ctx.req.body.site_title
    let site_keyword = ctx.req.body.site_keyword
    let site_logo = ctx.req.file? ctx.req.file.path.substr(7) : ""
    let site_descrption = ctx.req.body.site_descrption
    let site_icp = ctx.req.body.site_icp
    let site_qq = ctx.req.body.site_qq
    let site_tel = ctx.req.body.site_tel
    let site_address = ctx.req.body.site_address
    let site_status = ctx.req.body.site_status
    let add_time = ctx.req.body.add_time
    if(site_logo){
        json = {
            site_address,site_title,site_keyword,site_descrption,site_logo,site_icp,site_qq,site_tel,site_status,add_time
        }    
    }else{
        json = {
            site_address,site_title,site_keyword,site_descrption,site_icp,site_qq,site_tel,site_status,add_time
        }    
    }
    Db.update("setting",{},json)
    ctx.redirect(ctx.state.__HOST__+'/admin/setting/')
})

module.exports = router.routes()