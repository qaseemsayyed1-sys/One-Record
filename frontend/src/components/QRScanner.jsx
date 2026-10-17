import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import client from "../api/client";

export default function QRScanner({ onPatientLoaded }) {
  const [mode, setMode] = useState("idle"); // idle | scanning | loading
  const [manualToken, setManualToken] = useState("");
  const [err, setErr] = useState("");

  async function verifyToken(token) {
    if (!token) return;
    setErr("");
    setMode("loading");
    try {
      const res = await client.get(`/api/doctor/scan/${token.trim()}`);
      onPatientLoaded({
        token: token.trim(),
        patient: res.data.patient,
        records: res.data.records || [],
      });
    } catch (e) {
      const status = e.response?.status;
      const msg = e.response?.data?.message || "Scan failed";
      setErr(status === 403 ? "This QR has expired or been revoked." : msg);
      setMode("idle");
    }
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualToken.trim()) return;
    verifyToken(manualToken);
  }

  return (
    <div>
      <div className="kicker">SCAN // 01</div>
      <h2 className="display h3 mt-24">Scan the patient's QR.</h2>

      {err && <div className="alert alert--error mt-24">{err}</div>}

      <div className="scanner-layout mt-48">
        <div className="scanner-box">
          {mode === "scanning" ? (
            <>
              <div style={{ width: "100%", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      verifyToken(result[0].rawValue);
                    }
                  }}
                  onError={(error) => {
                    console.error(error);
                    if (error?.name === "NotAllowedError") {
                      setErr("Camera permission denied. Please allow camera access.");
                      setMode("idle");
                    }
                  }}
                  formats={["qr_code"]}
                />
              </div>
              <button className="btn btn--ghost mt-24" onClick={() => setMode("idle")}>
                Stop camera
              </button>
            </>
          ) : (
            <>
              <div className="scanner-placeholder">
                <div className="scanner-frame">
                  <div className="scanner-corners" />
                  <div className="mono muted" style={{ textAlign: "center" }}>
                    {mode === "loading" ? "Verifying…" : "Camera off"}
                  </div>
                </div>
              </div>
              <button
                className="btn mt-24"
                onClick={() => setMode("scanning")}
                disabled={mode === "loading"}
              >
                {mode === "loading" ? "Verifying…" : "Open camera →"}
              </button>
            </>
          )}
        </div>

        <div className="scanner-manual">
          <div className="kicker">MANUAL ENTRY // FALLBACK</div>
          <p className="muted mt-24" style={{ fontSize: 14 }}>
            Camera not working? Ask the patient for their token and paste it below.
          </p>
          <form onSubmit={handleManualSubmit} className="mt-24" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label>Token</label>
              <input
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="e.g. a3f8c1e2b9d4..."
              />
            </div>
            <button className="btn btn--sage" disabled={mode === "loading"}>
              Verify token →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}