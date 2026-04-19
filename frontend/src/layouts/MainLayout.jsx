import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MainLayout() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fc" }}>
      {/* NAVBAR */}
      <div style={{
        height: "70px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px"
      }}>
        <div
          onClick={() => navigate("/")}
          style={{ fontSize: "20px", fontWeight: "bold", cursor: "pointer" }}
        >
          🏥 ClinicMS
        </div>

        {user && (
          <div style={{ display: "flex", gap: "25px" }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/doctors">Doctors</NavLink>
            <NavLink to="/appointments">Appointments</NavLink>
            <NavLink to="/medical-records">Records</NavLink>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!user ? (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Register</button>
            </>
          ) : (
            <>
              <div style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: "#6366f1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <span>{user.username}</span>

              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;