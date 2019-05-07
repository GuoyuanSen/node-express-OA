const filmRouter  = require('./film') ;
// const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();

// router.use(function (req, res,next) {
//     // 拦截所有
//     // Authorition: token
//     jwt.verify(req.header['Authorition'],'shhhhh',function (err, decoded) {
//         // decoded  === {}
//         if(!err){
//             next()
//         }else {
//             res.send({
//                 code: 401,
//                 msg: '登录超时'
//             })
//         }
//     })

// })

//短信认证  国都互联 阿里大于 腾讯短信
//  get(tel )
// router.get('/login',function (req,res) {

//     //jsonwebtoken

//     var token = jwt.sign({ tel: '13121177622',entyTime: new Date().getTime() }, 'shhhhh');
//         // token

//     res.send({
//         token: token
//     })

// })


router.use('/film',filmRouter);


module.exports = router;