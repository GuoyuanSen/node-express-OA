const filmRouter = require("./film");
const express = require("express");

const router = express.Router()

router.use("/film",filmRouter);

module.exports = router;