const crypto = require("crypto");
const { db } = require("../config/firebase");

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

exports.generateToken = async (req, res) => {
  try {
    const token = crypto.randomBytes(24).toString("hex");
    const now = Date.now();
    const expiresAt = new Date(now + TOKEN_TTL_MS).toISOString();

    const share = {
      token,
      patientId: req.user.patientId,
      ownerUid: req.user.uid,
      active: true,
      createdAt: new Date(now).toISOString(),
      expiresAt,
    };

    const ref = await db.collection("shares").add(share);

    return res.status(201).json({
      success: true,
      message: "Token generated",
      shareId: ref.id,
      token,
      expiresAt,
      ttlSeconds: TOKEN_TTL_MS / 1000,
    });
  } catch (err) {
    console.error("generateToken error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.listActive = async (req, res) => {
  try {
    const snap = await db
      .collection("shares")
      .where("ownerUid", "==", req.user.uid)
      .where("active", "==", true)
      .get();

    const now = Date.now();
    const active = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((s) => new Date(s.expiresAt).getTime() > now);

    return res.json({ success: true, count: active.length, shares: active });
  } catch (err) {
    console.error("listActive error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.revoke = async (req, res) => {
  try {
    const { shareId } = req.params;
    const ref = db.collection("shares").doc(shareId);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Share not found" });
    }
    if (doc.data().ownerUid !== req.user.uid) {
      return res.status(403).json({ success: false, message: "Not your share" });
    }

    await ref.set({ active: false, revokedAt: new Date().toISOString() }, { merge: true });
    return res.json({ success: true, message: "Share revoked" });
  } catch (err) {
    console.error("revoke error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verify = async (req, res) => {
  try {
    const { token } = req.params;
    const snap = await db.collection("shares").where("token", "==", token).limit(1).get();

    if (snap.empty) {
      return res.status(404).json({ success: false, valid: false, message: "Token not found" });
    }

    const share = snap.docs[0].data();
    const expired = new Date(share.expiresAt).getTime() < Date.now();

    if (!share.active || expired) {
      return res.status(403).json({
        success: false,
        valid: false,
        message: expired ? "Token expired" : "Token revoked",
      });
    }

    return res.json({
      success: true,
      valid: true,
      patientId: share.patientId,
      expiresAt: share.expiresAt,
    });
  } catch (err) {
    console.error("verify error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};