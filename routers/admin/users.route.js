const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");

//Order User
router.get("/orders", controller.orders);

router.patch("/orders/change-status/:status/:id", controller.changeStatus);

router.patch(
    "/orders/change-status-delivery/:statusDelivery/:id",
    controller.changeStatusDelivery
);

router.delete("/orders/delete/:id", controller.deleteOrder);

router.get("/orders/detail/:id", controller.detailOrder);

//Account User
router.get("/accounts", controller.accountsUser);

router.patch(
    "/accounts/change-status/:status/:id",
    controller.changeStatusAccount
);

router.delete("/accounts/delete/:id", controller.deleteAccount);

router.get("/accounts/detail/:id", controller.detailAccount);

module.exports = router;
