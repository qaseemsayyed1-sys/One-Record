import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import client from "../api/client";

export default function QRScanner({ onPatientLoaded }) {
  const [mode, setMode] = useState("idle"); // idle | scanning | loading
  const [manualToken, setManualToken] = useState("");
  const [err, setErr] = useState("");
  const scannerRef = useRef(null);
  const containerId = "qr-reader-container";

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    setErr("");
    setMode("scanning");
    try {
      // Check if browser supports camera at all
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser. Use HTTPS.");
      }

      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopCamera();
          await verifyToken(decodedText);
        },
        () => {}
      );
    } catch (e) {
      console.error("Camera error:", e);
      // Show specific error to user
      if (e.name === "NotAllowedError" || e.message.includes("Permission")) {
        setErr("Camera permission denied. Please allow camera access in your browser settings (click the lock icon in the URL bar).");
      } else if (e.name === "NotFoundError" || e.name === "DevicesNotFoundError") {
        setErr("No camera found on this device.");
      } else if (e.name === "NotReadableError" || e.name === "TrackStartError") {
        setErr("Camera is already in use by another app. Close other apps and try again.");
      } else {
        setErr(`Could not start camera: ${e.message || "Unknown error"}. Try manual entry below.`);
      }
      setMode("idle");
    }
  }

  async function stopCamera() {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (_) {}
    setMode("idle");
  }

  async function verifyToken(token) {
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
              <div id={containerId} className="scanner-video" />
              <button className="btn btn--ghost mt-24" onClick={stopCamera}>
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
                onClick={startCamera}
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