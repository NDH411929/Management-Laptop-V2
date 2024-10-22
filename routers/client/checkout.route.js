const express = require("express");
const router = express.Router();
const authMiddleWare = require("../../middlewares/client/auth.middleware");
const controller = require("../../controllers/client/checkout.controller");

//Chua cac route cua trang dat hang
router.get("/", authMiddleWare.login, controller.checkout);

router.post("/order", authMiddleWare.login, controller.orderPost);

router.get("/success", authMiddleWare.login, controller.checkoutSuccess);

router.get("/review", authMiddleWare.login, controller.orderReview);

module.exports = router;
