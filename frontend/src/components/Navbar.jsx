import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenChat }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link
          to="/"
          className="nav__brand"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "24px" }}>🍃</span> ONE<span>·</span>RECORD
        </Link>
        <div className="nav__links" style={{ alignItems: "center" }}>
          {user && (
            <button
              onClick={onOpenChat}
              className="nav__ai-btn"
              title="Open AI Chat"
            >
              AI
            </button>
          )}
          {!user && (
            <>
              <Link to="/login" className="nav__link">
                Login
              </Link>
              <Link to="/register" className="nav__link">
                Register
              </Link>
            </>
          )}
          {user?.role === "patient" && (
            <Link to="/patient" className="nav__link">
              Dashboard
            </Link>
          )}
          {user?.role === "doctor" && (
            <Link to="/doctor" className="nav__link">
              Dashboard
            </Link>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="nav__link"
              style={{ padding: 0 }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}