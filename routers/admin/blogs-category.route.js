const express = require("express");
const multer = require("multer");
// const storage = require("../../helpers/multerStorage");
const upload = multer(); //{ storage: storage() }
const validate = require("../../validates/admin/products.validate");
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const router = express.Router();
const controller = require("../../controllers/admin/blogs-category.controller");

router.get("/", controller.blogsCategory);

router.patch("/change-status/:status/:id", controller.changeStatus);

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

router.get("/detail/:id", controller.detail);

module.exports = router;
