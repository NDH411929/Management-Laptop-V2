const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/blogs.controller");

//Chua cac route cua trang san pham
router.get("/", controller.blogs);

router.get("/detail/:slug", controller.detail);

// router.get("/brand/:slug", controller.brand);

module.exports = router;
