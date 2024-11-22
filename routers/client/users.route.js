const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/register.validate");
const authMiddleWare = require("../../middlewares/client/auth.middleware");

//Chua cac route cua trang user

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/forgot-password", controller.forgotPassword);

router.post("/forgot-password", controller.forgotPasswordPost);

router.get("/password/otp", controller.otp);

router.post("/password/otp", controller.otpPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", controller.resetPasswordPost);

router.get("/info", authMiddleWare.login, controller.infoUser);

router.patch(
    "/account/edit-user/:id",
    authMiddleWare.login,
    controller.editInfoUser
);

router.patch(
    "/account/edit-address/:id",
    authMiddleWare.login,
    controller.editInfoAddress
);

router.get("/vouchers/:id", authMiddleWare.login, controller.voucher);

router.get("/my-coupons", authMiddleWare.login, controller.myCoupons);

router.get("/my-orders", authMiddleWare.login, controller.myOrders);

router.get(
    "/my-orders/cancel/:id",
    authMiddleWare.login,
    controller.cancelOrder
);

module.exports = router;
