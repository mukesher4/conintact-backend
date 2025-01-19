const mongoose = require("mongoose");

const groupContactSchema = mongoose.Schema({
	group_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	contact_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

module.exports = mongoose.model("GroupContact", groupContactSchema);