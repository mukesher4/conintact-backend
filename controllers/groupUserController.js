const Group = require("../models/groupModel");
const GroupUser = require("../models/groupUserModel");
const asyncHandler = require("express-async-handler");

// @desc Get Groups
// @route GET /api/group/user
// @access private

const getGroups = asyncHandler(async(req, res) => {
	const groupUser = await GroupUser.find({ user_id: req.user.id });
	if (!groupUser) {
		res.status(404);
		throw new Error("No Groups Found for the User");
	}

	const groupIds = groupUser.map((gu) => gu.group_id);

	const groups = await Group.find({ _id: { $in: groupIds } });

	if (!groups) {
		res.status(404);
		throw new Error("Groups not Found");
	}	
	res.status(200).json(groups);
});

// @desc Get Group
// @route GET /api/group/user/:id
// @access private

const getGroup = asyncHandler(async(req, res) => {
	const groupUser = await GroupUser.findOne({
		// user_id: req.user.id, 
		group_id: req.params.id
	});

	if (!groupUser) {
		res.status(404);
		throw new Error("Group not Found for the User");
	}

	const group = await Group.findById(req.params.id);
	if (!group) {
		res.status(404);
		throw new Error("Group not Found");
	}	

	res.status(200).json(group);
});

// @desc Add Group
// @route POST /api/group/user
// @access private

const postGroup = asyncHandler(async(req, res) => {
	const { name, desc, image } = req.body;

	if (!name) {
		res.status(400);
		throw new Error("Name field is mandatory");
	}

	const group = await Group.create({
		name,
		desc,
		image,
	});

	await GroupUser.create({
		group_id: group._id,
		user_id: req.user.id,
	});

	res.status(201).json(group);
});

// @desc Add User to Group
// @route POST /api/group/user/:id
// @access private

const postUserToGroup = asyncHandler(async(req, res) => {
	const group = await Group.findById(req.params.id);

	if(!group) {
		res.status(404);
		throw new Error("Group Not Found");
	}

	await GroupUser.create({
		group_id: req.params.id,
		user_id: req.user.id,
	});

	res.status(201).json(group);
});

// @desc Update Group
// @route PUT /api/group/user/:id
// @access private

const putGroup = asyncHandler(async (req, res) => {
 
  const groupUser = await GroupUser.findOne({
    user_id: req.user.id,
    group_id: req.params.id
  });

  if (!groupUser) {
    res.status(404);
    throw new Error("Group not found for the User");
  }

  const { name, description, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("All fields (name, desc, image) are mandatory");
  }

  const updatedGroup = await Group.findByIdAndUpdate(
    req.params.id,
    { name, description, image },
    { new: true }
  );

  if (!updatedGroup) {
    res.status(404);
    throw new Error("Group not found");
  }

  res.status(200).json(updatedGroup);
});

// @desc Delete Group
// @route DELETE /api/group/user/:id
// @access private

const deleteGroup = asyncHandler(async(req, res) => {
	const groupUser = await GroupUser.findOne({
		user_id: req.user.id,
		group_id: req.params.id
	});
	
	if(!groupUser) {
		res.status(404);
		throw new Error("Group not Found or User not Part of this Group");
	}

	const group = await Group.findById(req.params.id);
	
	if (!group) {
	    res.status(404);
	    throw new Error("Group not found");
	}

	await GroupUser.deleteMany({
		user_id: req.user.id,
		group_id: req.params.id
	});

	const remainingUsers = await GroupUser.countDocuments({ group_id: req.params.id });
	if (remainingUsers === 0) {
		await Group.findByIdAndDelete(req.params.id);
	}

	res.status(200).json({ message: "Group deleted successfully" });
});

module.exports = {
  getGroups,
  getGroup,
  postGroup,
  postUserToGroup,
  putGroup,
  deleteGroup,
};