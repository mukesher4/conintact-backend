const Contact = require("../models/contactModel.js");
const GroupContact = require("../models/groupContactModel");
const asyncHandler = require("express-async-handler");

// @desc Get contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler(async (req, res) => {
    const groupContactIds = await GroupContact.distinct("contact_id");
    const nonGroupContacts = await Contact.find({
        _id: { $nin: groupContactIds }, 
        user_id: req.user.id
    });

    if (!nonGroupContacts || nonGroupContacts.length === 0) {
        res.status(404);
        throw new Error("No non-group contacts found");
    }

    res.status(200).json(nonGroupContacts);
});

// @desc Get specific contact
// @route GET /api/contacts/:id
// @access private

const getContact = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	const groupContact = await GroupContact.findOne({ contact_id: req.params.id });

	if (contact.user_id != req.user.id) {
		res.status(403);
		throw new Error("User doesn't have permission to access contacts of other users");
	}

	if (groupContact || !contact) {
		res.status(404);
		throw new Error("Contact not Found");
	}

	res.status(200).json(contact);
});

// @desc Create New contact
// @route POST /api/contacts
// @access private

const postContacts = asyncHandler(async(req, res) => {
	const { name, email, phone, image, note } = req.body;
	if (!name || !phone) {
		res.status(400);
		throw new Error("All fields are mandatory!");
	}
	const contact = await Contact.create({
		name, email, phone, image, note, user_id: req.user.id 
	});
	res.status(201).json(contact);
});

// @desc Update Contact
// @route PUT /api/contacts/:id
// @access private

const putContacts = asyncHandler(async(req, res) => {
	const contact = await Contact.findById(req.params.id);
	const groupContact = await GroupContact.findOne({ contact_id: req.params.id });

	if(groupContact || !contact) {
		res.status(404);
		throw new Error("Contact not Found");
	}

	if (contact.user_id != req.user.id) {
		res.status(403);
		throw new Error("User doesn't have permission to access contacts of other users");
	}

	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id, 
		req.body,
		{ new: true }
	);
	res.status(200).json(updatedContact);
});

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access private

const deleteContacts = asyncHandler(async(req, res) => {
	let contact = await Contact.findById(req.params.id);
	const groupContact = await GroupContact.findOne({ contact_id: req.params.id });

	if(groupContact || !contact) {
		res.status(404);
		throw new Error("Contact not Found");
	}

	if (contact.user_id != req.user.id) {
		res.status(403);
		throw new Error("User doesn't have permission to access contacts of other users");
	}

	contact = await Contact.findByIdAndDelete(req.params.id);
	if(!contact) {
		res.status(404);
		throw new Error("Contact not Found");
	}
	res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  postContacts,
  putContacts,
  deleteContacts,
};