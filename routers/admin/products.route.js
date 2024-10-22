const express = require("express");
const multer = require("multer");
// const storage = require("../../helpers/multerStorage");
const upload = multer(); //{ storage: storage() }
const validate = require("../../validates/admin/products.validate");
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.products);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteProduct);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    validate.createPost,
    controller.createProduct
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadMiddleWare.uploadSingle,
    validate.createPost,
    controller.editPatch
);

router.get("/specifications/:id", controller.specification);

router.post("/specifications/create/:id", controller.createSpecificationPost);

router.post(
    "/specifications/features/create/:id",
    controller.createFeaturesSpecPost
);

router.get(
    "/specifications/edit/:idProduct/:idSpec",
    controller.editSpecification
);

router.patch(
    "/specifications/edit/:idProduct/:idSpec",
    controller.editSpecificationPatch
);

router.get(
    "/specifications/features/edit/:idProduct/:idSpec",
    controller.editFeaturesSpec
);

router.patch(
    "/specifications/features/edit/:idProduct/:idSpec",
    controller.editFeaturesSpecPatch
);

router.delete(
    "/specifications/delete/:idProduct/:idSpec",
    controller.deleteSpecification
);

router.delete(
    "/specifications/features/delete/:idProduct/:idSpec",
    controller.deleteFeaturesSpec
);

router.get("/detail/:id", controller.detail);

router.get(
    "/upload-multi/images-product/:idProduct",
    controller.uploadImageProduct
);

router.post(
    "/upload-multi/images-product/:idProduct",
    upload.array("listImage", 5),
    uploadMiddleWare.uploadMulti,
    controller.uploadImageProductPost
);

module.exports = router;
