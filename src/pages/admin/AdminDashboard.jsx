import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setErrorText("");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dashboard fetch error:", error);
      setErrorText("Không tải được dữ liệu dashboard.");
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const total = bookings.length;
    const newCount = bookings.filter((item) => item.status === "new").length;
    const confirmedCount = bookings.filter(
      (item) => item.status === "confirmed"
    ).length;
    const completedCount = bookings.filter(
      (item) => item.status === "completed"
    ).length;
    const cancelledCount = bookings.filter(
      (item) => item.status === "cancelled"
    ).length;

    const todayCount = bookings.filter((item) => {
      if (!item.created_at) return false;
      return item.created_at.slice(0, 10) === todayKey;
    }).length;

    return {
      total,
      newCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      todayCount,
    };
  }, [bookings]);

  const recentBookings = useMemo(() => bookings.slice(0, 5), [bookings]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          background:
            "radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 26%), linear-gradient(135deg, #0f172a 0%, #162235 45%, #1f2e46 100%)",
          color: "white",
          borderRadius: 30,
          padding: "34px 28px",
          boxShadow: "0 28px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(30px, 5vw, 46px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
              }}
            >
              Dashboard admin
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                color: "#cbd5e1",
                lineHeight: 1.8,
                maxWidth: 760,
                fontSize: 16,
              }}
            >
              Xem nhanh tình trạng booking, số lượng yêu cầu mới và truy cập nhanh
              sang trang quản lý booking.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={fetchDashboardData} style={ghostLightBtn}>
              Tải lại dữ liệu
            </button>

            <Link to="/admin/bookings" style={primaryLightBtn}>
              Mở trang bookings
            </Link>
          </div>
        </div>
      </section>

      {loading && <div style={infoBox}>Đang tải dữ liệu dashboard...</div>}

      {!loading && errorText && (
        <div
          style={{
            ...infoBox,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          {errorText}
        </div>
      )}

      {!loading && !errorText && (
        <>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard
              label="Tổng booking"
              value={String(stats.total)}
              hint="Tất cả yêu cầu hiện có"
            />
            <StatCard
              label="Booking hôm nay"
              value={String(stats.todayCount)}
              hint="Tạo trong ngày hôm nay"
            />
            <StatCard
              label="Booking mới"
              value={String(stats.newCount)}
              hint="Chưa xử lý hoặc chưa xác nhận"
            />
            <StatCard
              label="Đã xác nhận"
              value={String(stats.confirmedCount)}
              hint="Đã chốt với khách"
            />
            <StatCard
              label="Hoàn thành"
              value={String(stats.completedCount)}
              hint="Đã chạy xong"
            />
            <StatCard
              label="Đã hủy"
              value={String(stats.cancelledCount)}
              hint="Không tiếp tục chuyến"
            />
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 24,
            }}
            className="dashboard-grid"
          >
            <div
              style={{
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: 18,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 28,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Booking gần đây
                  </h2>

                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#64748b",
                      lineHeight: 1.7,
                    }}
                  >
                    5 yêu cầu mới nhất để bạn xử lý nhanh.
                  </p>
                </div>

                <Link to="/admin/bookings" style={primaryBtn}>
                  Xem tất cả
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div style={emptyBox}>Chưa có booking nào.</div>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid rgba(15,23,42,0.06)",
                        borderRadius: 20,
                        padding: 18,
                        display: "grid",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "start",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "#0f172a",
                              fontSize: 18,
                            }}
                          >
                            {booking.full_name || "Không có tên"}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              color: "#64748b",
                              fontSize: 14,
                              lineHeight: 1.6,
                            }}
                          >
                            {booking.phone || "-"} • {booking.service_type || "-"}
                          </div>
                        </div>

                        <StatusBadge status={booking.status} />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 10,
                        }}
                      >
                        <MiniInfo
                          label="Điểm đón"
                          value={booking.pickup_location || "-"}
                        />
                        <MiniInfo
                          label="Điểm đến"
                          value={booking.dropoff_location || "-"}
                        />
                        <MiniInfo
                          label="Ngày giờ"
                          value={`${booking.pickup_date || "-"} ${booking.pickup_time || ""}`.trim()}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <Link
                          to={`/admin/bookings/${booking.id}`}
                          style={primaryBtn}
                        >
                          Xem chi tiết
                        </Link>

                        {booking.phone && (
                          <a href={`tel:${booking.phone}`} style={ghostBtn}>
                            Gọi khách
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
                alignSelf: "start",
              }}
            >
              <PanelCard
                title="Việc nên ưu tiên"
                text="Hãy xử lý booking có trạng thái “Mới” trước, sau đó xác nhận thời gian đón, điểm đón và cách liên hệ phù hợp với khách."
              />

              <PanelCard
                title="Quy trình gợi ý"
                text="1) Xem booking mới → 2) Gọi hoặc nhắn xác nhận → 3) Đổi trạng thái sang Đã xác nhận → 4) Sau khi hoàn tất chuyến thì chuyển sang Hoàn thành."
              />

              <PanelCard
                title="Nâng cấp nên làm tiếp"
                text="Dashboard hiện đã đủ để theo dõi nhanh. Bước tiếp theo nên là xuất CSV hoặc lọc theo ngày để tiện vận hành thực tế."
              />
            </div>
          </section>

          <style>{`
            @media (max-width: 900px) {
              .dashboard-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#64748b",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 32,
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#64748b",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {hint}
      </div>
    </div>
  );
}

function PanelCard({ title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 22,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "12px 0 0",
          color: "#64748b",
          lineHeight: 1.8,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 14,
        border: "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#0f172a",
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    new: {
      bg: "#eff6ff",
      color: "#1d4ed8",
      label: "Mới",
    },
    confirmed: {
      bg: "#ecfdf5",
      color: "#047857",
      label: "Đã xác nhận",
    },
    completed: {
      bg: "#f8fafc",
      color: "#334155",
      label: "Hoàn thành",
    },
    cancelled: {
      bg: "#fef2f2",
      color: "#b91c1c",
      label: "Đã hủy",
    },
  };

  const item = map[status] || {
    bg: "#f8fafc",
    color: "#334155",
    label: status || "Không rõ",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontWeight: 800,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      {item.label}
    </span>
  );
}

const infoBox = {
  padding: "16px 18px",
  borderRadius: 16,
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid rgba(15,23,42,0.08)",
};

const emptyBox = {
  padding: "20px",
  borderRadius: 18,
  background: "#f8fafc",
  color: "#64748b",
  border: "1px solid rgba(15,23,42,0.08)",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "linear-gradient(135deg, #0f172a, #22314a)",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 18px 30px rgba(15, 23, 42, 0.16)",
};

const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "transparent",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.12)",
  textDecoration: "none",
};

const primaryLightBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "white",
  color: "#0f172a",
  textDecoration: "none",
  border: "none",
};

const ghostLightBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.24)",
  textDecoration: "none",
};