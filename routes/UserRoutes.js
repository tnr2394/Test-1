const express = require("express");

const router = express.Router();

// Controllers
const UserController = require("../controller/UserController");

// Validations
const UserValidation = require("../validations/user.validations");

router.post("/signup", UserValidation.signup, UserController.signup);
router.post("/login", UserValidation.login, UserController.login);
router.post("/socialSignin", UserValidation.socialSignin, UserController.socialSignin);

module.exports = router;
