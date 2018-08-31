// Database model
const SubGroupModel = require("../models/sub-group.model");
const UserModel = require("../models/user.model");
const mongoose = require("mongoose");

module.exports.createSubGroup = (req, res) => {
	const { title } = req.body;
	const { projectId } = req.params;

	// Check title is exists or not
	SubGroupModel
	.findOne({ title, projectId })
	.then((resp) => {
		if (resp) {
			// Project with this title is already exists
			return res.status(203).json({
				status: false,
				message: "Sub group with this title is already exists for this project."
			});
		} else {
			// Project with this title is not exists. So need to create one.
			const newSubGroup = new SubGroupModel({
				title,
				projectId
			});
	
			newSubGroup
			.save()
			.then((inserted) => {
				// Project created successfully
				res.status(200).json({
					status: true,
					message: "Sub group created successfully.",
					data: inserted
				});			
			})
		}
	})
	.catch((err) => {
		console.log("err", err);
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.updateProject = (req, res) => {
	const { projectId, subGroupId } = req.params;
	const { title } = req.body;

	// Check project with projectId is exists or not
	SubGroupModel
	.findOne({ id: subGroupId, projectId })
	.then((res) => {
		if (res) {
			// Project with projectId is found
			SubGroupModel.findOneAndUpdate(
				{ id: subGroupId },
				{ title }
			)
			.then(() => {
				res.status(200).json({
					status: true,
					message: "Update successfully",
				});
			})
		} else {
			// Project with projectId is not found
			res.status(200).json({
				status: false,
				message: "Invalid sub group id passed.",
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


module.exports.getAllSubGroup = (req, res) => {
	const { projectId } = req.params;

	// Check project with projectId is exists or not
	SubGroupModel
	.find({ projectId })
	.populate('taggedUsers')
	.then((resp) => {
		return res.status(200).json({
			status: true,
			message: "Sub groups fetch successfully",
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

module.exports.deleteSubGroup = (req, res) => {
	const { subGroupId } = req.params;

	// Check project with projectId is exists or not	
	SubGroupModel
	.findOneAndRemove({ _id: subGroupId })
	.then(() => {
		res.status(200).json({
			status: true,
			message: "Removed successfully",
		});
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.getUntaggedUsers = (req, res) => {
	const { subGroupId } = req.params;

	// Check project with projectId is exists or not	
	SubGroupModel
	.findOne({ _id: subGroupId })
	.then((resp) => {
		if (resp) {
			// Fetch tagged user list
			const taggedUserList = resp.taggedUsers;
			console.log("taggedUserList", taggedUserList);
			// Fetch all the users list who is not in this taggedList
			return UserModel
			.find({ _id: { "$nin": taggedUserList }})
			.then((userList) => {
				return res.status(200).json({
					status: true,
					message: "User list found",
					data: userList
				})
			})
		} else {
			return res.status(203).json({
				status: false,
				message: "Invalid subGroupId passed"
			});
		}
	})
	.catch((err) => {
		console.log("err", err);
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.addNewTagUser = (req, res) => {
	const { subGroupId } = req.params;
	const { id } = req.body;

	// Check userId is exists or not
	UserModel
	.findOne({ _id: id })
	.then((userData) => {
		if (userData) {
			// Check project with projectId is exists or not	
			SubGroupModel
			.findOne({ _id: subGroupId })
			.then((resp) => {
				if (resp) {
					// Fetch all the users list who is not in this taggedList
					SubGroupModel
					.update(
						{ _id: subGroupId }, 
						{ $push: { taggedUsers: mongoose.Types.ObjectId(id) } }
					)
					.then(() => {
						return res.status(200).json({
							status: true,
							message: "User added",
							data: userData
						})
					})
				} else {
					return res.status(203).json({
						status: false,
						message: "Invalid subGroupId passed"
					});
				}
			})
		} else {
			// User not exists
			return res.status(200).json({
				status: false,
				message: "This tagged user which you want to tag is not exists with our database."
			});
		}
	})
	.catch((err) => {
		console.log("err", err);
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.deleteTagUser = (req, res) => {
	const { userId, subGroupId } = req.params;

	// Check project with projectId is exists or not	
	SubGroupModel
	.update(
		{ _id: subGroupId },
		{"$pull": { taggedUsers: userId }}
	)
	.then(() => {
		return res.status(200).json({
			status: true,
			message: "User removed successfully"
		})
	})
	.catch((err) => {
		console.log("err", err);
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};