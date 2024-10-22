const express = require("express");
const multer = require("multer");
const upload = multer();
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");

router.get("/", controller.account);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("avatar"),
    uploadMiddleWare.uploadSingle,
    controller.createPost
    //Khong co upload image thi form se k gui dc data
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadMiddleWare.uploadSingle,
    controller.editPatch
    //Khong co upload image thi form se k gui dc data
);

router.delete("/delete/:id", controller.deleteAccount);

router.get("/detail/:id", controller.detail);

module.exports = router;
