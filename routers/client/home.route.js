const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/home.controller");
//Chua cac route cua trang chu
router.get("/", controller.home);

module.exports = router;
