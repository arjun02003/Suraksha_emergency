const express = require("express");
const router = express.Router();

const protect = require("../middleware/AuthMiddleware");
const { updateProfile, getCurrentUser } = require("../controllers/UserController");

router.get('/me', protect, getCurrentUser);
router.put("/update-profile", protect, updateProfile);

module.exports = router;