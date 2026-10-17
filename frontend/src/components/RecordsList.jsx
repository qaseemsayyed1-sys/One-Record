import { useEffect, useState } from "react";
import client from "../api/client";

const TYPES = ["diagnosis", "prescription", "lab report", "visit note"];

const EMPTY = {
  type: "prescription",
  title: "",
  description: "",
  medicineName: "",
  salt: "",
  doctorName: "",
  hospitalName: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    client
      .get("/api/records")
      .then((r) => setRecords(r.data.records || []))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await client.post("/api/records", form);
      setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      load();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not add record");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Loading records...</p>;

  return (
    <div>
      <div className="row space-between wrap">
        <div>
          <div className="kicker">RECORDS // ARCHIVE</div>
          <h2 className="display h3 mt-24">{records.length} entries.</h2>
        </div>
        <button className="btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add record"}
        </button>
      </div>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      {showForm && (
        <form className="form mt-48" onSubmit={handleAdd}>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>

          <div className="field">
            <label>Message / Notes</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Any instructions, symptoms, or notes"
            />
          </div>

          <div className="row" style={{ gap: 24 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Medicine Name</label>
              <input value={form.medicineName} onChange={(e) => update("medicineName", e.target.value)} placeholder="Crocin" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Salt (auto if known)</label>
              <input value={form.salt} onChange={(e) => update("salt", e.target.value)} placeholder="paracetamol" />
            </div>
          </div>

          <div className="row" style={{ gap: 24 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Doctor Name</label>
              <input value={form.doctorName} onChange={(e) => update("doctorName", e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Hospital / Clinic</label>
              <input value={form.hospitalName} onChange={(e) => update("hospitalName", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date.slice(0, 10)} onChange={(e) => update("date", e.target.value)} />
          </div>

          <button className="btn" disabled={saving}>
            {saving ? "Saving..." : "Save record"}
          </button>
        </form>
      )}

      <div className="mt-48">
        {records.length === 0 ? (
          <p className="muted">No records yet. Add your first one above.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Medicine</th>
                <th>Doctor</th>
                <th>Hospital</th>
                <th>Message from Doctor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.type}</td>
                  <td>{r.title || "-"}</td>
                  <td>
                    <div>{r.medicineName || "-"}</div>
                    {r.salt && (
                      <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>
                        {r.salt}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{r.doctorName || "-"}</div>
                    {r.addedBy && r.addedBy !== r.patientId && (
                      <div
                        className="mono"
                        style={{ fontSize: 9, color: "var(--terracotta)", marginTop: 4 }}
                      >
                        ADDED BY DOCTOR
                      </div>
                    )}
                  </td>
                  <td>{r.hospitalName || "-"}</td>
                  <td style={{ maxWidth: 320 }}>
                    {r.description ? (
                      <span
                        style={{
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={r.description}
                      >
                        {r.description}
                      </span>
                    ) : (
                      <span className="muted">No message</span>
                    )}
                  </td>
                  <td className="mono">
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}