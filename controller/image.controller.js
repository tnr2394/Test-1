// Database model
const ImageModel = require("../models/image.model");
const UserModel = require("../models/user.model");
const mongoose = require("mongoose");

module.exports.createImage = (req, res) => {
	const { projectId } = req.params;
	console.log("req.files", req);
	if (req.files.length) {
		const addNewImage = req.files.map((key) => {
			return ({
				projectId,
				path: key.filename
			});
		});

		ImageModel
		.insertMany(addNewImage)
		.then((inserted) => {
			return res.status(200).json({
				status: true,
				message: "Images added",
				data: inserted
			});
		})
		.catch((err) => {
			res.status(500).json({
				status: false,
				message: "Something went wrong. Please try again.",
			});
		})
	} else {
		return res.status(406).json({
			status: false,
			message: "Please attach at least one image."
		});
	}
};

module.exports.getAllImages = (req, res) => {
	const { projectId } = req.params;

	// Check project with projectId is exists or not
	ImageModel
	.find({ projectId })
	.populate('taggedUsers')
	.then((resp) => {
		return res.status(200).json({
			status: true,
			message: "Images fetch successfully",
			data: resp
		});
	})
	.catch((err) => {
		console.log("err", err);
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.deleteImage = (req, res) => {
	const { imageId } = req.params;

	// Check project with projectId is exists or not	
	ImageModel
	.findOneAndRemove({ _id: imageId })
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
	const { imageId } = req.params;

	// Check project with projectId is exists or not	
	ImageModel
	.findOne({ _id: imageId })
	.then((resp) => {
		console.log("resp", resp);
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
				message: "Invalid imageId passed"
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
	const { imageId } = req.params;
	const { id } = req.body;
	// Check userId is exists or not
	UserModel
	.findOne({ _id: id })
	.then((userData) => {
		if (userData) {
			// User exists
			// Check project with projectId is exists or not	
			ImageModel
			.findOne({ _id: imageId })
			.then((resp) => {
				if (resp) {
					// Fetch tagged user list
					const taggedUserList = resp.taggedUsers;
					// Fetch all the users list who is not in this taggedList
					ImageModel
					.update(
						{ _id: imageId }, 
						{ $push: { taggedUsers: mongoose.Types.ObjectId(id) } }
					)
					.then(() => {
						return res.status(200).json({
							status: true,
							message: "User added",
							data: userData
						});
					})
				} else {
					return res.status(203).json({
						status: false,
						message: "Invalid imageId passed"
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
	const { imageId, userId } = req.params;

	// Check project with projectId is exists or not	
	ImageModel
	.update(
		{ _id: imageId },
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