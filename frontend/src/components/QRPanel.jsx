import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import client from "../api/client";

export default function QRPanel() {
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function loadShares() {
    client
      .get("/api/qr/active")
      .then((r) => setShares(r.data.shares || []))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load shares"));
  }

  useEffect(loadShares, []);

  async function generate() {
    setLoading(true);
    setErr("");
    try {
      const res = await client.post("/api/qr/generate");
      setToken(res.data.token);
      setExpiresAt(res.data.expiresAt);
      loadShares();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not generate token");
    } finally {
      setLoading(false);
    }
  }

  async function revoke(shareId) {
    try {
      await client.post(`/api/qr/revoke/${shareId}`);
      loadShares();
    } catch (e) {
      setErr(e.response?.data?.message || "Revoke failed");
    }
  }

  return (
    <div>
      <div className="kicker">CONSENT // SHARE</div>
      <h2 className="display h3 mt-24">Grant 15-minute access.</h2>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      <div className="qr-panel mt-48">
        <div className="qr-box">
          {token ? (
            <>
              <QRCodeSVG value={token} size={220} bgColor="#fbf8f1" fgColor="#1a1a1a" />
              <div className="mono" style={{ fontSize: 10, wordBreak: "break-all", textAlign: "center" }}>
                {token}
              </div>
              <div className="kicker">
                Expires {expiresAt ? new Date(expiresAt).toLocaleTimeString() : "—"}
              </div>
            </>
          ) : (
            <div style={{ minHeight: 220, display: "flex", alignItems: "center" }} className="muted">
              No active token
            </div>
          )}
          <button className="btn btn--sm" onClick={generate} disabled={loading}>
            {loading ? "Generating…" : token ? "New token" : "Generate QR →"}
          </button>
        </div>

        <div>
          <div className="kicker">ACTIVE SHARES // {shares.length}</div>
          {shares.length === 0 ? (
            <p className="muted mt-24">No active shares. Generate one to show a doctor.</p>
          ) : (
            <table className="table mt-24">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Expires</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shares.map((s) => (
                  <tr key={s.id}>
                    <td className="mono" style={{ fontSize: 10 }}>
                      {s.token.slice(0, 12)}…
                    </td>
                    <td className="mono">{new Date(s.expiresAt).toLocaleTimeString()}</td>
                    <td>
                      <button className="btn btn--sm btn--ghost" onClick={() => revoke(s.id)}>
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}