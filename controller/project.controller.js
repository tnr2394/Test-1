// Database model
const ProjectModel = require("../models/project.model");
const ImageModel = require("../models/image.model");
const SubGroupModel = require("../models/sub-group.model");

module.exports.createProject = (req, res) => {
	const { _id } = req.user;
	const { title } = req.body;
	
	// Check project title is exists or not
	ProjectModel.findOne({ title, userId: _id })
	.then((resp) => {
		if (resp) {
			// Project with this title is already exists
			return res.status(203).json({
				status: false,
				message: "Project with this title is already exists"
			});
		} else {
			// Project with this title is not exists. So need to create one.
			const newProject = new ProjectModel({
				title,
				userId: _id
			});
	
			newProject
			.save()
			.then((inserted) => {
				// Project created successfully
				return res.json({
					status: true,
					message: "Project created successfully.",
					data: inserted
				});			
			})
		}
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.updateProject = (req, res) => {
	const { projectId } = req.params;
	const { userId } = req.user;
	const { title } = req.body;

	// Check project with projectId is exists or not
	ProjectModel.findOne({ id: projectId })
	.then((resp) => {
		if (resp) {
			// Project with projectId is found
			// Check user is authorised to update this details or not

			if (userId === resp.userId) {
				// Need to update the project details
				ProjectModel.findOneAndUpdate(
					{ id: projectId },
					{ title: title }
				)
				.then(() => {
					res.status(200).json({
						status: true,
						message: "Update successfully",
					});
				})
			} else {
				// User is not authorised to update this details
				res.status(401).json({
					status: false,
					message: "You are not authorised to update this project details.",
				});
			}
		} else {
			// Project with projectId is not found
			res.status(200).json({
				status: false,
				message: "Invalid project id passed.",
			});
		}
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};


module.exports.getAllProjects = (req, res) => {
	const { _id } = req.user;

	// Check project with projectId is exists or not
	ProjectModel
	.find({ userId: _id })
	.then((resp) => {
		return res.status(200).json({
			status: true,
			message: "Projects fetched successfully",
			data: resp
		});
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.deleteProject = (req, res) => {
	const { projectId } = req.params;
	const { _id } = req.user

	// Check project with projectId is exists or not
	ProjectModel
	.findById(projectId)
	.then((resp) => {
		console.log("resp", resp);
		if (resp) {
			// Project with projectId is found
			// Check user is authorised to update this details or not

			if (_id === resp.userId) {
				// delete project from project collection
				ProjectModel
				.deleteOne({ _id: projectId })
				.then(() => {
					// delete data from image collection
					ImageModel
					.deleteMany({ projectId })
					.then(() => {
						// delete data from sub-group collection
						SubGroupModel
						.deleteMany({ projectId })
						.then(()=> {
							// Return response
							return res.status(200).json({
								status: true,
								message: "Removed successfully",
							});
						})
					})
				})
			} else {
				// User is not authorised to update this details
				res.status(401).json({
					status: false,
					message: "You are not authorised to remove this project details.",
				});
			}
		} else {
			// Project with projectId is not found
			res.status(200).json({
				status: false,
				message: "Invalid project id passed.",
			});
		}
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};