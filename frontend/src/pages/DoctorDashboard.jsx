import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import QRScanner from "../components/QRScanner";
import PatientView from "../components/PatientView";
import PrescribeForm from "../components/PrescribeForm";

const TABS = [
  { id: "scan", label: "Scan", index: "01" },
  { id: "prescribe", label: "Prescribe", index: "02" },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("scan");
  const [scan, setScan] = useState(null); // { token, patient, records }

  function handlePatientLoaded(data) {
    setScan(data);
    setTab("prescribe");
  }

  function handlePrescriptionSaved() {
    // Refresh the patient's records on screen
    if (scan) {
      setScan({ ...scan, records: [...scan.records] });
    }
  }

  return (
    <section className="container section">
      <div className="row space-between wrap">
        <div>
          <div className="kicker">DOCTOR DASHBOARD // {user?.fullName || "—"}</div>
          <h1 className="display h2 mt-24">
            {user?.fullName?.split(" ").slice(-1)[0] || "Doctor"}.
          </h1>
        </div>
        <div className="hero__meta" style={{ textAlign: "right" }}>
          <div>ROLE · DOCTOR</div>
          <div>UID · {user?.uid?.slice(0, 8) || "—"}…</div>
        </div>
      </div>

      <div className="tabs mt-48">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.index} // {t.label}
          </button>
        ))}
      </div>

      <div className="mt-48">
        {tab === "scan" && (
          <>
            <QRScanner onPatientLoaded={handlePatientLoaded} />
            {scan && (
              <div className="mt-48">
                <PatientView
                  patient={scan.patient}
                  records={scan.records}
                  onClose={() => setScan(null)}
                />
              </div>
            )}
          </>
        )}

        {tab === "prescribe" && (
          <>
            {!scan ? (
              <div className="alert alert--warn">
                Scan a patient's QR first, or paste their token in the Scan tab.
              </div>
            ) : (
              <>
                <PatientView patient={scan.patient} records={scan.records} />
                <div className="mt-48">
                  <PrescribeForm token={scan.token} onSaved={handlePrescriptionSaved} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}