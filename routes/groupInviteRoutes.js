const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/validateTokenHandler");

const {
	generate, 
	accept,
	view,
} = require("../controllers/groupInviteController");

router.use(validateToken);

router.route("/:inviteCode")
	.get(accept)

router.route("/:groupId")
	.post(generate);

router.route("/:inviteCode/view")
	.get(view)

module.exports = router;