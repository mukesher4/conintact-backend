const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true, 
		ref: "User",
		// index: true
	},
	name:{
		type: String, 
		required: [true, "Please add the contact name"]
	},
	email:{
		type: String, 
	},
	phone:{
		type: String, 
		required: [true, "Please add the contact phone number"]
	},
	image:{
		type: String,
	},
	note:{
		type: String,
	},
}, 
{
	timestamps: true,
});

// contactSchema.index({ user_id: 1 });

module.exports = mongoose.model("Contact", contactSchema);