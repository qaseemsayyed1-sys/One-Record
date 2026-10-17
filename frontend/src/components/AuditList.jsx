import { useEffect, useState } from "react";
import client from "../api/client";

export default function AuditList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    client
      .get("/api/audit")
      .then((r) => setLogs(r.data.logs || []))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading audit log…</p>;

  return (
    <div>
      <div className="kicker">WATCHTOWER // AUDIT</div>
      <h2 className="display h3 mt-24">{logs.length} access events.</h2>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      {logs.length === 0 ? (
        <p className="muted mt-48">No one has accessed your record yet.</p>
      ) : (
        <table className="table mt-48">
          <thead>
            <tr>
              <th>Time</th>
              <th>Doctor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="mono">
                  {l.timestamp ? new Date(l.timestamp).toLocaleString() : "—"}
                </td>
                <td className="mono" style={{ fontSize: 11 }}>{l.doctorId}</td>
                <td>{l.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}