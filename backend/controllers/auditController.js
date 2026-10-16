const { db } = require("../config/firebase");

exports.getMyAudit = async (req, res) => {
  try {
    const snap = await db
      .collection("auditLogs")
      .where("patientId", "==", req.user.patientId)
      .get();

    const logs = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    console.error("getMyAudit error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};