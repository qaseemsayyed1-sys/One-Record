const { db } = require("../config/firebase");

const VALID_TYPES = ["diagnosis", "prescription", "lab report", "visit note"];

exports.addRecord = async (req, res) => {
  try {
    const {
      type, title, description, medicineName, salt,
      doctorName, hospitalName, date,
    } = req.body;

    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of ${VALID_TYPES.join(", ")}` });
    }

    const record = {
      patientId: req.user.patientId,
      type,
      title: title || "",
      description: description || "",
      medicineName: medicineName || "",
      salt: salt || "",
      doctorName: doctorName || "",
      hospitalName: hospitalName || "",
      date: date || new Date().toISOString(),
      addedBy: req.user.uid, // patient's own uid
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("records").add(record);

    return res.status(201).json({
      success: true,
      message: "Record added",
      record: { id: ref.id, ...record },
    });
  } catch (err) {
    console.error("addRecord error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.listRecords = async (req, res) => {
  try {
    const snap = await db
      .collection("records")
      .where("patientId", "==", req.user.patientId)
      .get();

    const records = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({ success: true, count: records.length, records });
  } catch (err) {
    console.error("listRecords error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRecord = async (req, res) => {
  try {
    const doc = await db.collection("records").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    const record = { id: doc.id, ...doc.data() };
 
    if (record.patientId !== req.user.patientId) {
      return res.status(403).json({ success: false, message: "Not your record" });
    }
    return res.json({ success: true, record });
  } catch (err) {
    console.error("getRecord error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};