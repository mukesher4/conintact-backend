const mongoose = require("mongoose");

const groupUserSchema = mongoose.Schema({
	group_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

groupUserSchema.index({ user_id: 1, group_id: 1 }, { unique: true });

module.exports = mongoose.model("GroupUser", groupUserSchema);