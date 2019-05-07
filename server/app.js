const express = require("express");
const bodyParser = require("body-parser");

const oaRouter = require("./Router/oa")
const mobileRouter = require("./Router/mobile")
const path = require("path");
const cookieParse = require("cookie-parser")
const expressSession = require("express-session");
const mongoStore = require("connect-mongo")(expressSession)
const multer = require("multer")

const db = require("./toolkit/db");
const app = express();
const str = "fdslmdkferworksvc";

app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Credentials","true") 
    next();
})

// 处理重定向
app.disable("etag");
app.use(cookieParse())
app.use(express.static("./upload"));
// 处理post请求
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.raw());

 
//使用数据操作 
app.use(db);
app.use(cookieParse("hdladdajsik"))
app.use(expressSession({
    store:new mongoStore({
        url:"mongodb://localhost:27017/cms",
        autoRemove :' interval ', 
        autoRemoveInterval :20 
    }),
    secret:str,
    resave:true,
    rolling:true,
    saveUninitialized:false,
    cookie:{
        httpOnly:false,
        maxAge:20*60*1000
    },
}))
// 文件位置
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,"upload"));
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

let upload = multer({storage : storage})

// 允许所有形式文件上传
app.post("/upload",upload.any(),function(req,res){
    res.send({
        data:req.body
    })
})

app.use("/oa",oaRouter)
app.use("/mobile",mobileRouter)

app.listen(3000,function(){
    console.log("success") 
})