const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

//Cloudinary
cloudinary.config({
    cloud_name: "dorqc0zyj",
    api_key: "825358217848781",
    api_secret: "phTMlKMWP7kE5Xl9DV9qLgZh8IQ",
    secure: true,
});
//End Cloudinary

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = async (buffer) => {
    let result = await streamUpload(buffer);
    return result.secure_url;
};
