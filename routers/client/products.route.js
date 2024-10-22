const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/products.controller");
const authMiddleWare = require("../../middlewares/client/auth.middleware");

//Chua cac route cua trang san pham
router.get("/", controller.products);

router.get("/:slugCategory", controller.category);

router.get("/:slugCategory/brand/:slugBrand", controller.brandOfCategory);

router.get("/detail/:slugProduct", controller.detail);

router.post(
    "/evaluate/:slugProduct",
    authMiddleWare.login,
    controller.sendEvaluate
);

// router.get("/brand/:slug", controller.brand);

module.exports = router;
