/** Post Mongo DB model	*/

const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

const ImageSchema = new mongoose.Schema({
	path: {
		type: String,
		required: true
	},
	projectId: {
		type: String,
		required: true
	},
	taggedUsers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}]
});
ImageSchema.plugin(timestamps);
module.exports = mongoose.model("images", ImageSchema);