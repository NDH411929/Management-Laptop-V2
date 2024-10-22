const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadMiddleWare = require("../../middlewares/admin/uploadCloudinary.middleware");
const controller = require("../../controllers/admin/setting-general.controller");

router.get("/general", controller.settingGeneral);

router.patch(
    "/general",
    upload.single("logo"),
    uploadMiddleWare.uploadSingle,
    controller.settingGeneralPatch
);

module.exports = router;
