const express = require("express");
const router = express.Router();
<<<<<<< HEAD

const protect = require("../middleware/AuthMiddleware");
const { updateProfile, getCurrentUser } = require("../controllers/UserController");

router.get('/me', protect, getCurrentUser);
router.put("/update-profile", protect, updateProfile);

module.exports = router;
=======
const protect = require("../middleware/AuthMiddleware");
const { getMe } = require("../controllers/UserController");

// GET /api/user/me — returns the authenticated user's profile
router.get("/me", protect, getMe);

module.exports = router;
>>>>>>> origin/main
