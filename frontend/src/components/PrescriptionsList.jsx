import { useEffect, useState } from "react";
import client from "../api/client";

export default function PrescriptionsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    client
      .get("/api/records")
      .then((r) => {
        const all = r.data.records || [];
        const mine = all.filter((x) => x.type === "prescription");
        setRecords(mine);
      })
      .catch((e) => setErr(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading prescriptions…</p>;

  return (
    <div>
      <div className="kicker">PRESCRIPTIONS // FROM DOCTORS</div>
      <h2 className="display h3 mt-24">{records.length} prescriptions.</h2>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      {records.length === 0 ? (
        <p className="muted mt-48">
          No prescriptions yet. When a doctor prescribes via your QR, it will show up here.
        </p>
      ) : (
        <div className="prescription-grid mt-48">
          {records.map((r) => {
            const fromDoctor =
              r.addedBy && r.addedBy !== r.patientId;
            return (
              <div key={r.id} className="rx-card">
                <div className="rx-card__top">
                  <div className="rx-card__badge mono">
                    {fromDoctor ? "FROM DOCTOR" : "SELF-ADDED"}
                  </div>
                  <div className="mono muted" style={{ fontSize: 10 }}>
                    {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                  </div>
                </div>

                <div className="rx-card__med">
                  {r.medicineName || "—"}
                </div>

                {r.salt && (
                  <div className="rx-card__salt mono">SALT · {r.salt}</div>
                )}

                {r.description && (
                  <div className="rx-card__msg">
                    <div className="kicker" style={{ marginBottom: 6 }}>
                      MESSAGE
                    </div>
                    {r.description}
                  </div>
                )}

                <div className="rx-card__foot">
                  <div>
                    <div className="mono muted" style={{ fontSize: 10 }}>
                      PRESCRIBED BY
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {r.doctorName || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="mono muted" style={{ fontSize: 10 }}>
                      HOSPITAL
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {r.hospitalName || "—"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}