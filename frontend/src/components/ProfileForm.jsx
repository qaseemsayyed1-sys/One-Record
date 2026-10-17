import { useEffect, useState } from "react";
import client from "../api/client";

const EMPTY = {
  fullName: "",
  age: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  address: "",
  emergencyContact: "",
  allergies: "",
  chronicConditions: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    client
      .get("/api/profile")
      .then((res) => {
        const p = res.data.profile;
        setForm({
          fullName: p.fullName || "",
          age: p.age || "",
          gender: p.gender || "",
          bloodGroup: p.bloodGroup || "",
          phone: p.phone || "",
          address: p.address || "",
          emergencyContact: p.emergencyContact || "",
          allergies: (p.allergies || []).join(", "),
          chronicConditions: (p.chronicConditions || []).join(", "),
        });
      })
      .catch((e) => setErr(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        allergies: form.allergies
          ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        chronicConditions: form.chronicConditions
          ? form.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await client.put("/api/profile", payload);
      setMsg("Profile saved.");
    } catch (e) {
      setErr(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Loading profile…</p>;

  return (
    <form className="form" onSubmit={handleSave}>
      <div className="kicker">PROFILE // IDENTITY</div>

      {err && <div className="alert alert--error">{err}</div>}
      {msg && <div className="alert alert--ok">{msg}</div>}

      <div className="field">
        <label>Full Name</label>
        <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
      </div>

      <div className="row" style={{ gap: 24 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Age</label>
          <input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Gender</label>
          <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Blood Group</label>
          <input value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)} placeholder="B+" />
        </div>
      </div>

      <div className="row" style={{ gap: 24 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Emergency Contact</label>
          <input value={form.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Address</label>
        <textarea value={form.address} onChange={(e) => update("address", e.target.value)} />
      </div>

      <div className="field">
        <label>Allergies (comma separated)</label>
        <input
          value={form.allergies}
          onChange={(e) => update("allergies", e.target.value)}
          placeholder="penicillin, peanuts"
        />
      </div>

      <div className="field">
        <label>Chronic Conditions (comma separated)</label>
        <input
          value={form.chronicConditions}
          onChange={(e) => update("chronicConditions", e.target.value)}
          placeholder="diabetes, hypertension"
        />
      </div>

      <button type="submit" className="btn" disabled={saving}>
        {saving ? "Saving…" : "Save profile →"}
      </button>
    </form>
  );
}