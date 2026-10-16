const { db } = require("../config/firebase");
const { getSalt } = require("../data/saltMap");

async function duplicateCheck(patientId, prescription) {
  try {
    if (!patientId || !prescription || !prescription.medicineName) {
      return { duplicate: false, warning: null };
    }

    const newSalt = (prescription.salt || getSalt(prescription.medicineName) || "")
      .trim()
      .toLowerCase();

    if (!newSalt) {
      return { duplicate: false, warning: null, note: "Salt unknown, cannot check" };
    }

    const newMed = prescription.medicineName.trim().toLowerCase();
    const newDoctor = (prescription.doctorName || "").trim().toLowerCase();

    const snap = await db
      .collection("records")
      .where("patientId", "==", patientId)
      .where("type", "==", "prescription")
      .get();

    for (const doc of snap.docs) {
      const rec = doc.data();
      const prevSalt = (rec.salt || getSalt(rec.medicineName) || "").trim().toLowerCase();
      if (prevSalt !== newSalt) continue;

      const prevMed = (rec.medicineName || "").trim().toLowerCase();
      const prevDoctor = (rec.doctorName || "").trim().toLowerCase();

      const diffMed = prevMed && prevMed !== newMed;
      const diffDoc = prevDoctor && newDoctor && prevDoctor !== newDoctor;

      if (diffMed || diffDoc) {
        return {
          duplicate: true,
          warning: `Same salt "${newSalt}" already prescribed${
            diffMed ? ` as "${rec.medicineName}"` : ""
          }${diffDoc ? ` by Dr. ${rec.doctorName}` : ""} on ${
            rec.date ? new Date(rec.date).toLocaleDateString() : "an earlier visit"
          }.`,
          details: {
            salt: newSalt,
            previousMedicine: rec.medicineName || "",
            previousDoctor: rec.doctorName || "",
            date: rec.date || null,
            recordId: doc.id,
          },
        };
      }
    }

    return { duplicate: false, warning: null };
  } catch (err) {
    console.error("duplicateCheck error:", err);
    return { duplicate: false, warning: null, error: "duplicate check failed" };
  }
}

module.exports = { duplicateCheck };