const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = protect.adminOnly;

const { createHospital } = require("../controllers/adminController");

router.post("/create-hospital", protect, adminOnly, createHospital);

module.exports = router;
