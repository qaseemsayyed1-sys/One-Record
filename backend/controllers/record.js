const express = require("express");
const router = express.Router();
const { protect, onlyRole } = require("../middleware/authMiddleware");
const { addRecord, listRecords, getRecord } = require("../controllers/recordController");

router.post("/", protect, onlyRole("patient"), addRecord);
router.get("/", protect, onlyRole("patient"), listRecords);
router.get("/:id", protect, onlyRole("patient"), getRecord);

module.exports = router;