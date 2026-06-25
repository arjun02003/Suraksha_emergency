const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createAmbulance,
  getMyAmbulances,
  updateAmbulance,
  deleteAmbulance,
} = require("../controllers/ambulanceController");

router.post("/create", protect, createAmbulance);
router.get("/my-ambulances", protect, getMyAmbulances);
router.put("/update/:id", protect, updateAmbulance);
router.delete("/delete/:id", protect, deleteAmbulance);

module.exports = router;
