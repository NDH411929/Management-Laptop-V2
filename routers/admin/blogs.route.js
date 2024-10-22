const express = require("express");
const multer = require("multer");
// const storage = require("../../helpers/multerStorage");
const upload = multer(); //{ storage: storage() }
const validate = require("../../validates/admin/products.validate");
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const router = express.Router();
const controller = require("../../controllers/admin/blogs.controller");

router.get("/", controller.blogs);

router.get("/create", controller.createBlog);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.createBlogPost
);

router.get("/edit/:idBlog", controller.editBlog);

router.patch(
    "/edit/:idBlog",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.editBlogPatch
);

router.get("/detail/:idBlog", controller.detail);

router.delete("/delete/:idBlog", controller.deleteBlog);

module.exports = router;
