const express = require("express");
const router = express.Router();
const { protect, onlyRole } = require("../middleware/authMiddleware");
const { generateToken, listActive, revoke, verify } = require("../controllers/qrController");

router.post("/generate", protect, onlyRole("patient"), generateToken);
router.get("/active", protect, onlyRole("patient"), listActive);
router.post("/revoke/:shareId", protect, onlyRole("patient"), revoke);
router.get("/verify/:token", protect, verify);

module.exports = router;