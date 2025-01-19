const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/validateTokenHandler");

const {
  getGroups,
  getGroup,
  postGroup,
  postUserToGroup,
  putGroup,
  deleteGroup,
} = require("../controllers/groupUserController");

router.use(validateToken);

router.route("/")
  .get(getGroups)
  .post(postGroup);

router.route("/:id")
  .get(getGroup)
  .put(putGroup)
  .post(postUserToGroup)
  .delete(deleteGroup);

module.exports = router;