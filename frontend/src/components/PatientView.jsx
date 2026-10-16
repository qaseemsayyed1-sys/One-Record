export default function PatientView({ patient, records, onClose }) {
  if (!patient) return null;

  return (
    <div className="patient-view">
      <div className="row space-between wrap">
        <div>
          <div className="kicker">PATIENT // ANONYMIZED</div>
          <h2 className="display h3 mt-24">
            {patient.patientId || "—"}
          </h2>
        </div>
        {onClose && (
          <button className="btn btn--ghost btn--sm" onClick={onClose}>
            Close ×
          </button>
        )}
      </div>

      <div className="patient-view__vitals mt-48">
        <div className="vital">
          <div className="vital__label mono muted">Age</div>
          <div className="vital__value">{patient.age || "—"}</div>
        </div>
        <div className="vital">
          <div className="vital__label mono muted">Gender</div>
          <div className="vital__value">{patient.gender || "—"}</div>
        </div>
        <div className="vital">
          <div className="vital__label mono muted">Blood</div>
          <div className="vital__value">{patient.bloodGroup || "—"}</div>
        </div>
      </div>

      <div className="patient-view__tags mt-48">
        <div>
          <div className="kicker">ALLERGIES</div>
          <div className="tag-row mt-24">
            {patient.allergies?.length ? (
              patient.allergies.map((a) => (
                <span key={a} className="tag tag--warn">{a}</span>
              ))
            ) : (
              <span className="muted">None recorded</span>
            )}
          </div>
        </div>

        <div className="mt-48">
          <div className="kicker">CHRONIC CONDITIONS</div>
          <div className="tag-row mt-24">
            {patient.chronicConditions?.length ? (
              patient.chronicConditions.map((c) => (
                <span key={c} className="tag tag--sage">{c}</span>
              ))
            ) : (
              <span className="muted">None recorded</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-48">
        <div className="kicker">RECORDS // {records.length}</div>
        {records.length === 0 ? (
          <p className="muted mt-24">No records on file.</p>
        ) : (
          <table className="table mt-24">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Medicine</th>
                <th>Salt</th>
                <th>Doctor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.type}</td>
                  <td>{r.title || "—"}</td>
                  <td>{r.medicineName || "—"}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{r.salt || "—"}</td>
                  <td>{r.doctorName || "—"}</td>
                  <td className="mono">{r.date ? new Date(r.date).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}