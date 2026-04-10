import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function AdminProtectedRoute({ children }) {
  const { loadingAuth, session, isAdmin } = useAuth();

  if (loadingAuth) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 24,
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        Đang kiểm tra quyền truy cập admin...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 24,
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Không có quyền truy cập</h2>
        <p style={{ color: "#64748b", lineHeight: 1.7 }}>
          Tài khoản này đã đăng nhập nhưng chưa được thêm vào danh sách admin.
        </p>
      </div>
    );
  }

  return children;
}