const express = require("express");
const router = express.Router();
const { protect, onlyRole } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

router.get("/", protect, onlyRole("patient"), getProfile);
router.put("/", protect, onlyRole("patient"), updateProfile);

module.exports = router;