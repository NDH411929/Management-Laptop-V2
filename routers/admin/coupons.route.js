const express = require("express");
const router = express.Router();
const multer = require("multer");
// const storage = require("../../helpers/multerStorage");
const upload = multer(); //{ storage: storage() }
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const controller = require("../../controllers/admin/coupons.controller");

router.get("/", controller.coupons);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.editPatch
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
