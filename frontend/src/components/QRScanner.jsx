import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import client from "../api/client";

export default function QRScanner({ onPatientLoaded }) {
  const [mode, setMode] = useState("idle"); // idle | scanning | loading
  const [manualToken, setManualToken] = useState("");
  const [err, setErr] = useState("");
  const scannerRef = useRef(null);
  const containerId = "qr-reader-container";

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  // Start camera when mode changes to scanning
  useEffect(() => {
    if (mode !== "scanning") return;

    let isMounted = true;
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 15, // Faster scanning
          qrbox: { width: 300, height: 300 }, // Bigger scanning area
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (!isMounted) return;
          await scanner.stop().catch(() => {});
          await scanner.clear().catch(() => {});
          setMode("idle");
          verifyToken(decodedText);
        },
        () => {
          // Ignore scan failures (fires constantly when no QR in frame)
        }
      )
      .catch((e) => {
        if (!isMounted) return;
        console.error("Camera error:", e);
        if (e.name === "NotAllowedError" || e.message?.includes("Permission")) {
          setErr("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (e.name === "NotFoundError") {
          setErr("No camera found on this device.");
        } else {
          setErr(`Could not start camera: ${e.message || "Unknown error"}. Try manual entry below.`);
        }
        setMode("idle");
      });

    return () => {
      isMounted = false;
    };
  }, [mode]);

  async function stopCamera() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (_) {}
    }
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
          {/* Container must ALWAYS be in DOM, html5-qrcode injects video here */}
          <div 
            id={containerId} 
            className="scanner-video" 
            style={{ display: mode === "scanning" ? "block" : "none" }} 
          />
          
          {mode !== "scanning" && (
            <div className="scanner-placeholder">
              <div className="scanner-frame">
                <div className="scanner-corners" />
                <div className="mono muted" style={{ textAlign: "center" }}>
                  {mode === "loading" ? "Verifying…" : "Camera off"}
                </div>
              </div>
            </div>
          )}

          {mode === "scanning" ? (
            <button className="btn btn--ghost mt-24" onClick={stopCamera}>
              Stop camera
            </button>
          ) : (
            <button
              className="btn mt-24"
              onClick={() => setMode("scanning")}
              disabled={mode === "loading"}
            >
              {mode === "loading" ? "Verifying…" : "Open camera →"}
            </button>
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