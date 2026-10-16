import { useState } from "react";
import client from "../api/client";

export default function PrescribeForm({ token, onSaved }) {
  const [form, setForm] = useState({
    medicineName: "",
    salt: "",
    description: "",
    hospitalName: "",
  });
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState(null);
  const [saved, setSaved] = useState(null);
  const [err, setErr] = useState("");

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setWarning(null);
    setSaved(null);
    setSaving(true);
    try {
      const res = await client.post("/api/doctor/prescribe", {
        token,
        ...form,
      });
      setSaved(res.data.record);
      setWarning(res.data.duplicateWarning || null);
      setForm({ medicineName: "", salt: "", description: "", hospitalName: "" });
      if (onSaved) onSaved(res.data.record);
    } catch (e2) {
      const status = e2.response?.status;
      const msg = e2.response?.data?.message || "Save failed";
      setErr(status === 403 ? "Token expired or revoked." : msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="kicker">PRESCRIBE // 02</div>
      <h2 className="display h3 mt-24">Write a prescription.</h2>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      {warning && warning.duplicate && (
        <div className="alert alert--warn mt-24">
          <strong>⚠ Duplicate salt detected.</strong>
          <div style={{ marginTop: 6 }}>{warning.warning}</div>
          {warning.details && (
            <div className="mono mt-24" style={{ fontSize: 11, opacity: 0.8 }}>
              PREV · {warning.details.previousMedicine} · Dr. {warning.details.previousDoctor} ·{" "}
              {warning.details.date
                ? new Date(warning.details.date).toLocaleDateString()
                : "—"}
            </div>
          )}
        </div>
      )}

      {saved && !warning?.duplicate && (
        <div className="alert alert--ok mt-24">
          Prescription saved for {saved.patientId}.
        </div>
      )}

      <form className="form mt-48" onSubmit={handleSubmit}>
        <div className="field">
          <label>Medicine Name</label>
          <input
            value={form.medicineName}
            onChange={(e) => update("medicineName", e.target.value)}
            placeholder="e.g. Dolo 650"
            required
          />
        </div>

        <div className="field">
          <label>Salt (leave empty to auto-detect)</label>
          <input
            value={form.salt}
            onChange={(e) => update("salt", e.target.value)}
            placeholder="paracetamol"
          />
        </div>

        <div className="field">
          <label>Instructions</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Twice a day after meals, for 5 days"
          />
        </div>

        <div className="field">
          <label>Hospital / Clinic</label>
          <input
            value={form.hospitalName}
            onChange={(e) => update("hospitalName", e.target.value)}
          />
        </div>

        <button className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save prescription →"}
        </button>
      </form>
    </div>
  );
}