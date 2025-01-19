const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add group name"]
	},
	description: {
		type: String
	},
	image: {
		type: String
	}
});

module.exports = mongoose.model("Group", groupSchema);