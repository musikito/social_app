const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

/**
 * @route   GET api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
