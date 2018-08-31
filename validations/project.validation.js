module.exports = {
	createAndUpdateProject(req, res, next) {
		req.checkBody("title", "Title is required").trim().notEmpty();

		req.asyncValidationErrors()
			.then(() => {
				next();
			})
			.catch(errors => res.status(400).json({
				success: false,
				errors: errors[0].msg,
			}));
	},
};
