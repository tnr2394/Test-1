/** User Mongo DB model	*/

const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
	firstName: { 
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: { 
		type: String,
		required: false,
		default: ""
	},
	isSocialAuth: {
		type: Boolean,
		default: false
	},
	tokenDetails: {
		type: Object,
		default: {}
	},
	userData: {
		type: Object,
		default: {}
	}
});
UserSchema.plugin(timestamps);
module.exports = mongoose.model("users", UserSchema);
