const Contact = require("../models/contactModel");
const Group = require("../models/groupModel");
const GroupContact = require("../models/groupContactModel");
const GroupUser = require("../models/groupUserModel");
const asyncHandler = require("express-async-handler");

// @desc Get Contacts of a Group
// @route GET /api/group/:groupId/contact
// @access private

const getContactsInGroup = asyncHandler(async(req, res) => {
	const { groupId } = req.params;

	const groupUser = await GroupUser.findOne({
		group_id: groupId,
		user_id: req.user.id,
	});
	if(!groupUser) {
		res.status(403);
		throw new Error("User doesn't have permission to access contacts of other users");
	}

	const groupContact = await GroupContact.find({
		group_id: groupId,
	});

	const contactIds = groupContact.map((gc) => gc.contact_id);

	// if (contactIds.length === 0) {
	// 	res.status(404);
	// 	throw new Error("No contacts found for this group");
	// }
	
	const contacts = await Contact.find({ _id: { $in: contactIds } });

	res.status(200).json({ contacts, groupContact });
});

// @desc Get Contact of a Group
// @route GET /api/group/:groupId/contact/:contactId
// @access private

const getContactInGroup = asyncHandler(async(req, res) => {
	const { groupId, contactId } = req.params;

	const groupUser = await GroupUser.findOne({
		group_id: groupId,
		user_id: req.user.id,
	});
	if(!groupUser) {
		res.status(403);
		throw new Error("Group not Found or User not Part of this Group");
	}

	const groupContact = await GroupContact.findOne({
		group_id: groupId,
		contact_id: contactId,
	});
	if(!groupContact) {
		res.status(404);
		throw new Error("Contact not Found");
	}

	const contact = await Contact.findById(contactId);

	res.status(200).json({ contact, groupContact });
});

// @desc Create Contact in a Group
// @route POST /api/group/:groupId/contact
// @access private

const postContactInGroup = asyncHandler(async(req, res) => {
	const { groupId } = req.params;

	const group = await Group.findById(groupId);
	if (!group) {
		res.status(404);
		throw new Error("Group not found");
	}

	const groupUser = await GroupUser.findOne({
		group_id: groupId,
		user_id: req.user.id,
	});
	if(!groupUser) {
		res.status(403);
		throw new Error("User doesn't have permission to access contacts of other users");
	}
    console.log("GroupUser:", groupUser);

	const { name, email, phone, image, note } = req.body;
	if (!name || !phone) {
		res.status(400);
		throw new Error("All fields are mandatory!");
	}
	const contact = await Contact.create({
		name,
		email,
		phone,
		image,
		note,
		user_id: req.user.id, 
	});

	console.log(`Contact: ${contact}`);

	const groupContact = await GroupContact.create({
		group_id: groupId,
		contact_id: contact._id,
	});

	res.status(201).json({ contact, groupContact });
});

// @desc Update Contact in a Group
// @route PUT /api/group/:groupId/contact/:contactId
// @access private

const putContactInGroup = asyncHandler(async(req, res) => {
	const { groupId, contactId } = req.params;

	const groupUser = await GroupUser.findOne({
		user_id: req.user.id,
		group_id: groupId
	});
	
	if(!groupUser) {
		res.status(404);
		throw new Error("Group not Found or User not Part of this Group");
	}

	const groupContact = await GroupContact.findOne({
		group_id: groupId,
		contact_id: contactId,
	});
	if(!groupContact) {
		req.status(404);
		throw new Error("Contact not Found");
	}

	const updatedContact = await Contact.findByIdAndUpdate(
		contactId, 
		req.body,
		{ new: true }
	);

	res.status(200).json(updatedContact);
});

// @desc Delete Contact in a Group
// @route DELETE /api/group/:groupId/contact/:contactId
// @access private

const deleteContactInGroup = asyncHandler(async(req, res) => {
	const { groupId, contactId } = req.params;

	const groupUser = await GroupUser.findOne({
		group_id: groupId,
		user_id: req.user.id,
	});
	if(!groupUser) {
		res.status(403);
		throw new Error("Group not Found or User not Part of this Group");
	}

	const contact = await Contact.findByIdAndDelete(contactId);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not Found");
	}

	const deletedContact = GroupContact.deleteOne({
		group_id: groupId,
		contact_id: req.user.id,		
	});

	res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = {
  getContactsInGroup,
  getContactInGroup,
  postContactInGroup,
  putContactInGroup,
  deleteContactInGroup,
};