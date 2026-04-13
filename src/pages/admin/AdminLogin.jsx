import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function AdminLogin() {
  const { session, isAdmin, loadingAuth, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  if (!loadingAuth && session && isAdmin) {
    return <Navigate to="/admin/bookings" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");
    setErrorText("");

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setErrorText(error.message || "Authentication failed.");
      setSubmitting(false);
      return;
    }

    setMessage("Đăng nhập thành công. Đang kiểm tra quyền admin...");
    setSubmitting(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(circle at top left, rgba(212, 160, 23, 0.08), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "10px 14px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#0f172a",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Admin access
          </div>

          <h1
            style={{
              margin: "16px 0 8px",
              fontSize: 34,
              letterSpacing: "-0.03em",
            }}
          >
            Đăng nhập admin
          </h1>

          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
            Chỉ tài khoản đã được cấp quyền trong bảng admin_users mới truy cập được khu vực quản trị.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={inputStyle}
              required
              autoComplete="email"
            />
          </Field>

          <Field label="Mật khẩu">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
              autoComplete="current-password"
            />
          </Field>

          {errorText && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                fontWeight: 600,
              }}
            >
              {errorText}
            </div>
          )}

          {message && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              {message}
            </div>
          )}

          <button type="submit" style={primaryBtn} disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p style={{ marginTop: 18, color: "#64748b", lineHeight: 1.7 }}>
          Tạo tài khoản admin mới nên thực hiện trực tiếp trong Supabase Auth để tránh mở public signup trên production.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#fff",
  color: "#0f172a",
  outline: "none",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: 999,
  padding: "14px 22px",
  fontWeight: 800,
  cursor: "pointer",
  background: "linear-gradient(135deg, #0f172a, #22314a)",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 18px 30px rgba(15, 23, 42, 0.16)",
};
