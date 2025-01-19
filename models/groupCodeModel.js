const mongoose = require("mongoose");

const groupCodeSchema = mongoose.Schema({
	invite_code: {
		type: String,
		required: true,
	},
	group_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	}
});

module.exports = mongoose.model("GroupCode", groupCodeSchema);