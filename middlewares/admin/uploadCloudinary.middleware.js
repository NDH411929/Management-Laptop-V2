const uploadToCloudinary = require("../../helpers/uploadCloudinary.helper");

module.exports.uploadSingle = async (req, res, next) => {
    if (req.file) {
        const link = await uploadToCloudinary(req.file.buffer);
        req.body[req.file.fieldname] = link;
        next();
    } else {
        next();
    }
};

module.exports.uploadMulti = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            const uploadPromises = await req.files.map((file) =>
                uploadToCloudinary(file.buffer)
            );
            const results = await Promise.all(uploadPromises);
            req.body.listImage = results; // Store URLs of the uploaded images
            next(); // Continue to the next middleware
        } else {
            next(); // Continue to the next middleware
        }
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).send({ error: "Failed to upload images" });
    }
};
