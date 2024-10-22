const express = require("express");
const multer = require("multer");
const upload = multer();
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");

router.get("/", controller.productsCategory);

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

router.delete("/delete/:id", controller.deleteProductsCategory);

router.get("/detail/:id", controller.detail);

router.get("/create/specification/:id", controller.createSpecification);

router.post("/create/specification/:id", controller.createSpecificationPost);

router.post(
    "/specifications/features/create/:id",
    controller.createFeaturesSpecPost
);

router.get(
    "/specifications/edit/:idCate/:idSpec",
    controller.editSpecification
);

router.patch(
    "/specifications/edit/:idCate/:idSpec",
    controller.editSpecificationPatch
);

router.get(
    "/specifications/features/edit/:idCate/:idSpec",
    controller.editFeaturesSpec
);

router.patch(
    "/specifications/features/edit/:idCate/:idSpec",
    controller.editFeaturesSpecPatch
);

router.delete(
    "/specifications/features/delete/:idCate/:idSpec",
    controller.deleteFeaturesSpec
);

router.delete(
    "/delete-specification/:idCate/:idSpec/",
    controller.deleteSpecification
);

router.get("/create/brands/:id", controller.createBrand);

router.post("/create/brands/:id", controller.createBrandPost);

module.exports = router;
