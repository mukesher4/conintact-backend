const express = require('express');
const router = express.Router();

const validateToken = require("../middleware/validateTokenHandler");

const {
  getContactsInGroup,
  getContactInGroup,
  postContactInGroup,
  putContactInGroup,
  deleteContactInGroup,
} = require("../controllers/groupContactController");

router.use(validateToken);

router.route("/:groupId/contact")
  .get(getContactsInGroup)
  .post(postContactInGroup)

router.route("/:groupId/contact/:contactId")
  .get(getContactInGroup)
  .put(putContactInGroup)
  .delete(deleteContactInGroup)

module.exports = router;
