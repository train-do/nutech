const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: 'dszopjmk8',
    api_key: '657979945464638',
    api_secret: 'CzGiF0hCM7pFYlolmzgeWMvVMFw'
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "nutech",
        allowedFormats: ["jpg", "jpeg", "png"],
    },
});
const upload = multer({ storage: storage })

module.exports = upload