const { db } = require("../config/firebase");

exports.getProfile = async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.user.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const u = doc.data();
    return res.json({
      success: true,
      profile: {
        uid: doc.id,
        patientId: u.patientId || null,
        email: u.email,
        fullName: u.fullName || "",
        age: u.age || null,
        gender: u.gender || "",
        bloodGroup: u.bloodGroup || "",
        phone: u.phone || "",
        address: u.address || "",
        emergencyContact: u.emergencyContact || "",
        allergies: u.allergies || [],
        chronicConditions: u.chronicConditions || [],
      },
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "fullName", "age", "gender", "bloodGroup", "phone",
      "address", "emergencyContact", "allergies", "chronicConditions",
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    await db.collection("users").doc(req.user.uid).set(updates, { merge: true });

    return res.json({ success: true, message: "Profile updated", updates });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};