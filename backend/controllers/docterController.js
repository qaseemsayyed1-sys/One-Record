const { db } = require("../config/firebase");
const { duplicateCheck } = require("../utils/duplicateCheck");

async function logAccess(doctorId, patientId, action) {
  try {
    await db.collection("auditLogs").add({
      doctorId,
      patientId,
      action,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("audit log failed:", e);
  }
}

exports.scanToken = async (req, res) => {
  try {
    const { token } = req.params;

    const snap = await db.collection("shares").where("token", "==", token).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }

    const shareDoc = snap.docs[0];
    const share = shareDoc.data();

    const expired = new Date(share.expiresAt).getTime() < Date.now();
    if (!share.active || expired) {
      return res.status(403).json({
        success: false,
        message: expired ? "Token expired" : "Token revoked",
      });
    }

    const userSnap = await db
      .collection("users")
      .where("patientId", "==", share.patientId)
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const patient = userSnap.docs[0].data();

    const recSnap = await db
      .collection("records")
      .where("patientId", "==", share.patientId)
      .get();

    const records = recSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    await logAccess(req.user.uid, share.patientId, "scan");

    return res.json({
      success: true,
      patient: {
        patientId: patient.patientId,
        age: patient.age || null,
        gender: patient.gender || "",
        bloodGroup: patient.bloodGroup || "",
        allergies: patient.allergies || [],
        chronicConditions: patient.chronicConditions || [],
      },
      records,
    });
  } catch (err) {
    console.error("scanToken error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.prescribe = async (req, res) => {
  try {
    const { token, medicineName, salt, description, title, hospitalName, date } = req.body;

    if (!token || !medicineName) {
      return res.status(400).json({ success: false, message: "token and medicineName required" });
    }

    const snap = await db.collection("shares").where("token", "==", token).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }
    const share = snap.docs[0].data();
    const expired = new Date(share.expiresAt).getTime() < Date.now();
    if (!share.active || expired) {
      return res.status(403).json({
        success: false,
        message: expired ? "Token expired" : "Token revoked",
      });
    }

    const dup = await duplicateCheck(share.patientId, {
      medicineName,
      doctorName: req.user.uid, 
    });

    const docSnap = await db.collection("users").doc(req.user.uid).get();
    const doctorName = docSnap.exists ? (docSnap.data().fullName || "Doctor") : "Doctor";

    const dupFinal = await duplicateCheck(share.patientId, { medicineName, doctorName });

    const record = {
      patientId: share.patientId,
      type: "prescription",
      title: title || "Prescription",
      description: description || "",
      medicineName,
      salt: salt || "",
      doctorName,
      hospitalName: hospitalName || "",
      date: date || new Date().toISOString(),
      addedBy: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("records").add(record);

    await logAccess(req.user.uid, share.patientId, "prescribe");

    return res.status(201).json({
      success: true,
      message: "Prescription saved",
      record: { id: ref.id, ...record },
      duplicateWarning: dupFinal.duplicate ? dupFinal : null,
    });
  } catch (err) {
    console.error("prescribe error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};