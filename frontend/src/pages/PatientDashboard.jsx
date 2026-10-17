import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileForm from "../components/ProfileForm";
import RecordsList from "../components/RecordsList";
import PrescriptionsList from "../components/PrescriptionsList";
import QRPanel from "../components/QRPanel";
import AuditList from "../components/AuditList";

const TABS = [
  { id: "profile", label: "Profile", index: "01" },
  { id: "records", label: "Records", index: "02" },
  { id: "prescriptions", label: "Prescriptions", index: "03" },
  { id: "share", label: "Share", index: "04" },
  { id: "audit", label: "Audit", index: "05" },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("profile");

  return (
    <section className="container section">
      <div className="row space-between wrap">
        <div>
          <div className="kicker">PATIENT DASHBOARD // {user?.patientId || "—"}</div>
          <h1 className="display h2 mt-24">
            {user?.fullName?.split(" ")[0] || "Patient"}.
          </h1>
        </div>
        <div className="hero__meta" style={{ textAlign: "right" }}>
          <div>ROLE · PATIENT</div>
          <div>PID · {user?.patientId || "—"}</div>
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
        {tab === "profile" && <ProfileForm />}
        {tab === "records" && <RecordsList />}
        {tab === "prescriptions" && <PrescriptionsList />}
        {tab === "share" && <QRPanel />}
        {tab === "audit" && <AuditList />}
      </div>
    </section>
  );
}