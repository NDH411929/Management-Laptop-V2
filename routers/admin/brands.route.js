const express = require("express");
const multer = require("multer");
// const storage = require("../../helpers/multerStorage");
const upload = multer(); //{ storage: storage() }
const router = express.Router();
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const controller = require("../../controllers/admin/brands.controller");

router.get("/", controller.brands);

router.get("/create", controller.createBrand);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.createBrandPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    controller.editPatch
);

router.delete("/delete/:id", controller.delete);

router.get("/upload-multi/images-brand/:idBrand", controller.uploadImageBrand);

router.post(
    "/upload-multi/images-brand/:idBrand",
    upload.array("listImage", 5),
    uploadMiddleWare.uploadMulti,
    controller.uploadImageBrandPost
);

router.get("/detail/:id", controller.detail);

module.exports = router;
