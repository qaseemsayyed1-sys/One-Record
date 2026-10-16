import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          ONE<span>·</span>RECORD
        </Link>
        <div className="nav__links">
          {!user && (
            <>
              <Link to="/login" className="nav__link">Login</Link>
              <Link to="/register" className="nav__link">Register</Link>
            </>
          )}
          {user?.role === "patient" && (
            <Link to="/patient" className="nav__link">Dashboard</Link>
          )}
          {user?.role === "doctor" && (
            <Link to="/doctor" className="nav__link">Dashboard</Link>
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