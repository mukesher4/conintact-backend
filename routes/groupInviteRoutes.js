const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/validateTokenHandler");

const {
  generate, 
  accept,
  view,
} = require("../controllers/groupInviteController");

router.use(validateToken);

router.post("/:groupId", generate);

router.get("/:inviteCode", accept);

router.get("/:inviteCode/view", view);

module.exports = router;
