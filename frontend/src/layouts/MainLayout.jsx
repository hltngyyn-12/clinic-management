import { Outlet, Link } from "react-router-dom";
function MainLayout() {
  return (
    <div className="container mt-4">
      <h2>Clinic Management System</h2>
      <nav className="mb-3">
        <Link to="/" className="me-3">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default MainLayout;