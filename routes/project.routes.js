const express = require("express");

const router = express.Router();

// Services
const ApiAuthService = require("../services/ApiAuth");

// Controllers
const ProjectController = require("../controller/project.controller");

// Validations
const ProjectValidation = require("../validations/project.validation");

// Add new project
router.post("/project", [ApiAuthService.validateToken, ProjectValidation.createAndUpdateProject], ProjectController.createProject);
// Update project
router.put("/project/:projectId", [ApiAuthService.validateToken, ProjectValidation.createAndUpdateProject], ProjectController.updateProject);
// Get all projects list
router.get("/project", [ApiAuthService.validateToken], ProjectController.getAllProjects);
// Delete particular project
router.delete("/project/:projectId", ApiAuthService.validateToken, ProjectController.deleteProject);

module.exports = router;
