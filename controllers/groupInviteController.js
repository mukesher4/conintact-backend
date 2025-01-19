const asyncHandler = require("express-async-handler");
const GroupCode = require("../models/groupCodeModel");
const GroupUser = require("../models/groupUserModel");
const { v4 : uuidv4 } = require('uuid');

// @desc Map Code to Group
// @route POST /api/invite/:groupId/
// @access private

const generate = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    let inviteCode, duplicate;

    // Generate a unique invite code
    do {
        inviteCode = uuidv4().slice(0, 8);
        duplicate = await GroupCode.findOne({ invite_code: inviteCode });
    } while (duplicate);

    console.log(groupId);
    console.log(inviteCode);

    // Use updateOne with upsert to handle existing group_id
    const response = await GroupCode.updateOne(
        { group_id: groupId }, // Filter by group_id
        { $set: { invite_code: inviteCode } }, // Set the new invite_code
        { upsert: true } // Create a new document if group_id doesn't exist
    ).catch((error) => {
        console.error("Error creating/updating group invite code:", error);
        throw new Error("Failed to create/update group invite code");
    });

    if (!response) {
        throw new Error('Failed to create/update group invite code');
    }

    res.status(201).json(inviteCode);
});


// @desc Map User to Group
// @route GET /api/invite/:inviteCode/
// @access private

const accept = asyncHandler(async(req, res) => {
	const { inviteCode } = req.params;
	console.log(`inviteCode: ${req.params.id}`);
	const groupCode = await GroupCode.findOne({
		invite_code: inviteCode
	});

	if (!groupCode) {
		throw new Error("Invalid Invite Code");
		res.status(404);
	}

	const groupId = groupCode.group_id;

	await GroupUser.create({
		group_id: groupId,
		user_id: req.user.id,
	});	

	res.status(201).json(groupId);
});

// @desc View GroupID of Invite Code
// @route GET /api/invite/:inviteCode/view/
// @access private

const view = asyncHandler(async(req, res) => {
	const { inviteCode } = req.params;
	console.log(`inviteCode: ${req.params.id}`);
	const groupCode = await GroupCode.findOne({
		invite_code: inviteCode
	});

	if (!groupCode) {
		throw new Error("Invalid Invite Code");
		res.status(404);
	}

	const groupId = groupCode.group_id;

	res.status(201).json(groupId);
});

module.exports = {
	generate,
	accept,
	view,
};