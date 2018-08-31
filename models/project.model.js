/** Post Mongo DB model	*/

const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

const ProjectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	}
});

ProjectSchema.plugin(timestamps);

module.exports = mongoose.model("projects", ProjectSchema);
