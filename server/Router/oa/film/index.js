const express = require("express");

const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
// const crypto = require("jwt-simple");
const url = "mongodb://localhost:27017/cms"
const router = express.Router();
mongoose.connect(url);
// 文件位置
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(__dirname,"../../../upload"));
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

let upload = multer({storage : storage});
//新增电影
router.post('/addFilm',upload.any(),async function (req, res) {
    // console.log(req.body);
    console.log(req.files);
    //插入数据库
    req.body["state"] = "1";
    req.body['imgsrc'] = 'http://localhost:3000/'+ req.files[0].filename;
    console.log(req.body);
    let data = await  req.$db.insert('film', req.body);
    res.send(data)
})

//更新电影
router.post("/updateFilm",upload.any(),async function(req,res){
    // console.log(req.body);
    console.log(req.files[0]);
    // 插入数据库
    if(!req.body["imgsrc"]){
        req.body["imgsrc"] = "http://localhost:3000/"+req.files[0].filename;
    }else{
        req.body["imgsrc"] =req.body.imgsrc  
    }
    
    console.log(req.body);
    let data = await req.$db.update("film",
    {"_id":req.body["_id"]},
    req.body);
    res.send(data);
})
//删除电影
router.get('/deleteFilm',async function(req,res){
    console.log(req.query)
    let data = await req.$db.remove('film',
    {'_id': req.query._id});
    res.send(data)
})

//模糊查询
router.get("/mohuFind",async  function(req,res){
    console.log(req.query)
    let record = new RegExp(req.query.name);
    console.log(record)
    let data = await req.$db.find("film",{$or:[
        {filmname:{$regex:record}},
        {role:{$regex:record}},
        {score:{$regex:record}},
        {releasetime:{$regex:record}},
        {state:{$regex:record}}
    ]
    })
    // console.log(data)
    res.send({
        data
    })
})  
router.post("/login",async function(req,res){
    let user = req.body.username;
    let password = req.body.password;
    console.log(password)
   let data = await req.$db.find("users",{username:user})
        // 判断用户名密码，登录成功后写入cookie，session
        // console.log(req.body)
        // console.log(data)
        // res.send(data)
        if(data.length){
            if(password == data[0].password){
                // 登录成功
                req.session.user = user;
                req.session.isLogin = true;
                res.send({status:0,msg:"登录成功"})
            }else{
                res.send({status:1,msg:"密码错误"})
            }
        }else{
            res.send({status:1,msg:"该用户未注册，请先注册"})
        }

})
router.get("/sign",async function(req,res){
    // console.log(req.query)
    let user = req.query.user
    // console.log(user)
    let data = await req.$db.find("sessions",{})
   res.send(data)
    // console.log(data)
    // let name = data[0].session;

    // let users = JSON.parse(name);
    // if(users.user = ""){
    //     res.send({"msg":"no"})
    // }else{
    //     res.send({"msg":"yes"})
    // }
    // if(req.session.sign){
    //     console.log(req.session);
    //     res.send(data)
    // }else{
    //     console.log(req.query);
    //     res.send(data)
    // }
})

//删除电影
router.get('/deleteFilm',async function(req,res){
    console.log(req.query)
    let data = await req.$db.remove('film',
    {'_id': req.query._id});
    res.send(data)
    
})

router.get("/up",async function(req,res){
    // console.log(req.body);
    // console.log(req.files);
    // 插入数据库
    console.log(req.query);
    let data = await req.$db.update("film", {"_id":req.query["_id"]},{state:"1"});
    res.send(data);
})
router.get("/down",async function(req,res){
    // console.log(req.body);
    // console.log(req.files);
    // 插入数据库
    console.log(req.query);
    let data = await req.$db.update("film", {"_id":req.query["_id"]},{state:"0"});
    res.send(data);
})
router.get("/getFilmList",async function(req,res){
    console.log(req.query);
    let data = await req.$db.find("film",{},{},req.query.page,req.query.rows)

    let totalPage = await req.$db.count("film",{})
    // console.log(totalPage)
    res.send({
        totalPage:totalPage,
        data:data
    })
})


module.exports = router;