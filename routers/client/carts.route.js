const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/carts.controller");
const authMiddleWare = require("../../middlewares/client/auth.middleware");

//Chua cac route cua trang gio hang
router.get("/", authMiddleWare.login, controller.cart);
router.post("/add/:productId", authMiddleWare.login, controller.addPost);
router.get(
    "/update/:productId/:color/:quantity",
    authMiddleWare.login,
    controller.updateItem
);
router.get(
    "/update/:productId/:quantity",
    authMiddleWare.login,
    controller.updateItem
);
router.get("/delete/:productId/", authMiddleWare.login, controller.delete);
router.get(
    "/delete/:productId/:color",
    authMiddleWare.login,
    controller.delete
);

module.exports = router;
