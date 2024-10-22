const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/bin.controller");

router.get("/", controller.binProducts);

router.patch("/return-products/:id", controller.returnProducts);

router.patch("/return-multi/", controller.returnMulti);

router.delete("/delete/:id", controller.deleteProducts);

module.exports = router;
