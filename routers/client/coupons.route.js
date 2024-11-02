const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/coupons.controller");

//Chua cac route cua trang san pham
router.get("/", controller.coupons);

router.get("/detail/:codeCoupon", controller.detail);

module.exports = router;
