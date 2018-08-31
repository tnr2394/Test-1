const express = require("express");

const router = express.Router();

// Services
const ApiAuthService = require("../services/ApiAuth");

// Controllers
const SubGroupController = require("../controller/sub-group.controller");

// Validations
const SubGroupValidation = require("../validations/sub-group.validation");

// Add new sub-group
router.post("/sub-group/:projectId", [ApiAuthService.validateToken, SubGroupValidation.createAndUpdateSubGroup], SubGroupController.createSubGroup);
// Update sub-group
router.put("/sub-group/:subGroupId", [ApiAuthService.validateToken, SubGroupValidation.createAndUpdateSubGroup], SubGroupController.updateProject);
// Get all sub-group list
router.get("/sub-group/:projectId", ApiAuthService.validateToken, SubGroupController.getAllSubGroup);
// Delete particular sub-group
router.delete("/sub-group/:subGroupId", ApiAuthService.validateToken, SubGroupController.deleteSubGroup);
// Get untagged userlist
router.get("/sub-group/untaggeduser/:subGroupId", ApiAuthService.validateToken, SubGroupController.getUntaggedUsers);
// add new tagged user
router.post("/sub-group/taggedUser/:subGroupId", ApiAuthService.validateToken, SubGroupController.addNewTagUser);
// remove tagged user
router.delete("/sub-group/taggedUser/:subGroupId/:userId", ApiAuthService.validateToken, SubGroupController.deleteTagUser);

module.exports = router;