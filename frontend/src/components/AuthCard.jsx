import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCard() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("patient"); // only used for register
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let data;
      if (tab === "login") {
        data = await login(form.email, form.password);
      } else {
        data = await register({ ...form, role });
      }
      if (data.user.role === "patient") navigate("/patient");
      else navigate("/doctor");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card__tabs">
        <button
          className={`auth-card__tab ${tab === "login" ? "active" : ""}`}
          onClick={() => { setTab("login"); setErr(""); }}
        >
          Login
        </button>
        <button
          className={`auth-card__tab ${tab === "register" ? "active" : ""}`}
          onClick={() => { setTab("register"); setErr(""); }}
        >
          Sign Up
        </button>
      </div>

      <form className="auth-card__form" onSubmit={submit}>
        {tab === "register" && (
          <div className="auth-card__roles">
            <button
              type="button"
              className={`role-chip ${role === "patient" ? "active" : ""}`}
              onClick={() => setRole("patient")}
            >
              I'm a Patient
            </button>
            <button
              type="button"
              className={`role-chip ${role === "doctor" ? "active" : ""}`}
              onClick={() => setRole("doctor")}
            >
              I'm a Doctor
            </button>
          </div>
        )}

        {tab === "register" && (
          <div className="field">
            <label>Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder={role === "doctor" ? "Dr. Anjali Sharma" : "Ramesh Kumar"}
              required
            />
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {err && <div className="alert alert--error">{err}</div>}

        <button type="submit" className="btn" disabled={loading}>
          {loading
            ? "Please wait…"
            : tab === "login"
            ? "Sign in →"
            : "Create account →"}
        </button>

        <div className="auth-card__hint">
          {tab === "login" ? (
            <>
              New here?{" "}
              <button
                type="button"
                className="link"
                onClick={() => { setTab("register"); setErr(""); }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="link"
                onClick={() => { setTab("login"); setErr(""); }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}