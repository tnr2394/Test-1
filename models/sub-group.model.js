/** Post Mongo DB model	*/

const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

const SubGroupSchema = new mongoose.Schema({
	title: {
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
SubGroupSchema.plugin(timestamps);
module.exports = mongoose.model("subgroups", SubGroupSchema);