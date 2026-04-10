import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { siteConfig } from "../lib/siteConfig";

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-badge">A</div>
            <div className="brand-text">
              <div className="brand-title">{siteConfig.brand} Admin</div>
              <div className="brand-subtitle">
                {user?.email || "Quản lý booking và nội dung"}
              </div>
            </div>
          </div>

          <nav className="nav">
            <Link to="/">Về website</Link>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/bookings">Bookings</Link>
          </nav>

          <div className="header-actions">
            <button className="btn btn-ghost" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}