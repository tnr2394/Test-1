module.exports = {
	signup(req, res, next) {
		req.checkBody("firstName", "Firstname is required").trim().notEmpty();
		req.checkBody("lastName", "Lastname is required").trim().notEmpty();
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("email", "Email is not valid").trim().isEmail();
		req.checkBody("password", "Password is required").trim().notEmpty();
		req.checkBody("password", "Password must be 8 to 20 length").trim().len(6, 20);

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.json({
				status: false,
				message: errors[0].msg,
			}));
	},
	login(req, res, next) {
		req.checkBody("email", "Email is required").trim().notEmpty();
		req.checkBody("email", "Email is not valid").trim().isEmail();
		req.checkBody("password", "Password is required").trim().notEmpty();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.json({
				status: false,
				message: errors[0].msg,
			}));
	},
	socialSignin(req, res, next) {
		req.checkBody("userData.email", "Email is required").trim().notEmpty();
		
		req
		.asyncValidationErrors()
		.then(() => {
			next();
		})
		.catch(errors => res.json({
			status: false,
			message: errors[0].msg,
		}));
	}
};
