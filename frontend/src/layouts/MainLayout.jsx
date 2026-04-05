import { Outlet, Link, useNavigate } from "react-router-dom";

function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.8)",
          padding: "12px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee"
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          style={{
            fontWeight: "bold",
            fontSize: "22px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          🏥 <span style={{ color: "#667eea" }}>ClinicMS</span>
        </div>

        {/* MENU */}
        <div style={{ display: "flex", gap: "25px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#333",
              fontWeight: "500"
            }}
          >
            Home
          </Link>

          <Link to="/medical-records">Medical Records</Link>

          {user && (
            <Link
              to="/appointments"
              style={{
                textDecoration: "none",
                color: "#333",
                fontWeight: "500"
              }}
            >
              Appointments
            </Link>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "6px 15px",
                  borderRadius: "8px",
                  border: "1px solid #667eea",
                  background: "transparent",
                  color: "#667eea",
                  cursor: "pointer"
                }}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "6px 15px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#667eea",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* Avatar giả */}
              <div
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#667eea",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <span style={{ fontWeight: "500" }}>
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ff4d4f",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* CONTENT */}
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;