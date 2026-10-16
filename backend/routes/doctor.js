const express = require("express");
const router = express.Router();
const { protect, onlyRole } = require("../middleware/authMiddleware");
const { scanToken, prescribe } = require("../controllers/docterController");

router.get("/scan/:token", protect, onlyRole("doctor"), scanToken);
router.post("/prescribe", protect, onlyRole("doctor"), prescribe);

module.exports = router;