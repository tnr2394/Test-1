const bcrypt = require("bcrypt");

// Database model
const UserModel = require("../models/user.model");

// services
const ApiAuthService = require("../services/ApiAuth");

// constant
const config = require("../config");

module.exports.signup = (req, res) => {
	// Check this email is already exists or not
	UserModel
	.find({ email: req.body.email })
	.then((resp) => {
		if (resp.length) {
			return res.status(203).json({
				status: false,
				message: "Sorry ! This email is already exists."
			})
		}
		
		const newUser = new UserModel({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		});
	
		newUser
		.save()
		.then(() => {
			return res.status(200).send({
				status: true,
				message: "New user added successfully.",
			});
		})
	})
	.catch((err) => {
		res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
};

module.exports.login = (req, res) => {
	UserModel
	.findOne({ email: req.body.email })
	.then(async (data) => {
		if (data) {
			if (bcrypt.compareSync(req.body.password, data.password)) {
				return res.status(200).send({
					status: true,
					message: "Login successful.",
					token: await ApiAuthService.signIn(JSON.parse(JSON.stringify(data))),
					data,
				});
			} else {
				res.status(400).send({
					status: false,
					message: "Password is not valid.",
				});
			}
		} else {
			res.status(400).send({
				status: false,
				message: "Email is not found.",
			});
		}
	})
	.catch((err) => {
		console.log("Err while find with email in login:-", err);
		res.status(500).send({
			status: false,
			message: "Something went wrong. Please try again.",
		});
	});
}

module.exports.socialSignin= (req, res) => {
	// Check user email is exists into database or not
	UserModel
	.findOne({ email: req.body.userData.email })
	.then(async (data) => {
		if (data) {
			// check if this record with social media loggedin
			return res.status(200).send({
				status: true,
				message: data.isSocialAuth ? "LoggedIn successfully" : "You are already loogedIn with email and password.",
				token: await ApiAuthService.signIn(JSON.parse(JSON.stringify(data)))
			});
		} else {
			// Need to add record into database
			const newUser = new UserModel({
				firstName: req.body.userData.givenName,
				lastName: req.body.userData.familyName,
				email: req.body.userData.email,
				userData: req.body.userData,
				tokenDetails: req.body.tokenDetails,
				isSocialAuth: true
			});

			newUser
			.save()
			.then(async (userData) => {
				console.log("userData", userData);
				return res.status(200).send({
					status: true,
					message: "User signup successfully.",
					token: await ApiAuthService.signIn(JSON.parse(JSON.stringify(userData))),
				});
			})
		}
	})
	.catch((err) => {
		console.log("err", err);
		return res.status(500).json({
			status: false,
			message: "Something went wrong. Please try again."
		})
	})
}