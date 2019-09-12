服务端渲染  ssr  模版引擎
koa2  +  koa-art-template  性能优
express + koa-ejs

1.分页(插件)
   if(type == "change"){ 
        location.href = "{{__HOST__}}/admin/article?page="+num;
        定位到当前页面，后面拼接当前page
2.文件上传(二进制文件)
    koa-multer
        下载，引用，配置
    html；form表单添加 enctype="multipart/form-data"指定编码类型
    保存上传的文件的目录public-uploads
    逻辑处理页面，async 之前加上upload.single('file')
3.富文本编辑器 node koa2 github（koa2-ueditor）
    npm i ，引入，配置
    配置静态资源(public)，在头文件中引入public下的三个js文件
    在模板中的script标签中引入ueditor
    在模版中实例化编辑器 let ue = UE.getEditor("editor")

4.格式化时间,app.js
    const sd = require("silly-datetime")
    配置文件 

5.SEO优化 ： keywords  descrption
  SEM

6.操作数据库
    db.js
    mongoose
        安装  npm  i mongoose  引入
        建立连接 mongoose.connect("mongo://127.0.0.1:27017/mymongodb")
    定义schema：保证数据库中的字段和创建的一致
    创建model: mongoose.model("CollectionName",userSchema)
            CollectionName  首字母大写
    实例化collection
        let r =  new  CollectionName({

        })   
    
    保存数据到数据库   r.save   --->大写-->小写   单数-->复数   

7.鉴权
        cookie  
        session
        jwt  
            npm i jsonwebtoken  //生成token
            npm i passport   npm i passport-jwt
            引入   配置

