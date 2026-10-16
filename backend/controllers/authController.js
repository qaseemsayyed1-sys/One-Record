const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

async function generatePatientId() {
  const counterRef = db.collection("meta").doc("patientCounter");
  const newId = await db.runTransaction(async (tx) => {
    const doc = await tx.get(counterRef);
    let current = doc.exists ? doc.data().value : 1022; // start at PID-1023
    current += 1;
    tx.set(counterRef, { value: current }, { merge: true });
    return current;
  });
  return `PID-${newId}`;
}

exports.register = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "email, password, role required" });
    }
    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({ success: false, message: "role must be patient or doctor" });
    }

    const existing = await db.collection("users").where("email", "==", email.toLowerCase()).get();
    if (!existing.empty) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userDoc = {
      email: email.toLowerCase(),
      passwordHash,
      role,
      fullName: fullName || "",
      createdAt: new Date().toISOString(),
    }; 

    if (role === "patient") {
      userDoc.patientId = await generatePatientId();
    }

    const ref = await db.collection("users").add(userDoc);

    const token = jwt.sign(
      { uid: ref.id, role, patientId: userDoc.patientId || null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user: {
        uid: ref.id,
        email: userDoc.email,
        role,
        fullName: userDoc.fullName,
        patientId: userDoc.patientId || null,
      },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password required" });
    }

    const snap = await db.collection("users").where("email", "==", email.toLowerCase()).limit(1).get();
    if (snap.empty) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { uid: userDoc.id, role: user.role, patientId: user.patientId || null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Logged in",
      token,
      user: {
        uid: userDoc.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        patientId: user.patientId || null,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};