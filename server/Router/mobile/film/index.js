const express = require('express');
const router = express.Router();

router.get('/getList',async function (req, res) {
   // page  rows  req.query
    console.log();
    let page = req.query.page;
    let rows = 6;
    let data = await req.$db.find('film',{},{},page,rows);
    res.send(data)
})



module.exports = router