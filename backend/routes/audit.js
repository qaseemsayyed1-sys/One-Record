const express = require("express");
const router = express.Router();
const { protect, onlyRole } = require("../middleware/authMiddleware");
const { getMyAudit } = require("../controllers/auditController");

router.get("/", protect, onlyRole("patient"), getMyAudit);

module.exports = router;