const express = require("express");

const router = express.Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const home_gallery_storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, '../public/images/'));
    },
    filename(req, file, callback) {
        const extension = file.originalname.split('.').slice(-1).pop();
        const final_filename = `${uuid.v4()}.${extension}`;
        callback(null, final_filename);
    },
});
const home_gallery_upload = multer({ storage: home_gallery_storage });

// Services
const ApiAuthService = require("../services/ApiAuth");

// Controllers
const ImageController = require("../controller/image.controller");

// Add new image
router.post("/image/:projectId", [ApiAuthService.validateToken, home_gallery_upload.array('images')], ImageController.createImage);
// Get all image list
router.get("/image/:projectId", ApiAuthService.validateToken, ImageController.getAllImages);
// Delete particular image
router.delete("/image/:imageId", ApiAuthService.validateToken, ImageController.deleteImage);
// Get untagged userlist
router.get("/image/untaggeduser/:imageId", ApiAuthService.validateToken, ImageController.getUntaggedUsers);
// add new tagged user
router.post("/image/taggedUser/:imageId", ApiAuthService.validateToken, ImageController.addNewTagUser);
// remove tagged user
router.delete("/image/taggedUser/:imageId/:userId", ApiAuthService.validateToken, ImageController.deleteTagUser);
module.exports = router;