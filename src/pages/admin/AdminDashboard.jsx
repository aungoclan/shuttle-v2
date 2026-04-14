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

  const todayKey = useMemo(() => new Date().toLocaleDateString("en-CA"), []);

  const todayRides = useMemo(() => {
    return bookings
      .filter((item) => item.pickup_date === todayKey)
      .sort((a, b) => {
        const aTime = a.pickup_time || "99:99";
        const bTime = b.pickup_time || "99:99";
        return aTime.localeCompare(bTime);
      });
  }, [bookings, todayKey]);

  const stats = useMemo(() => {
    const now = new Date();

    const total = bookings.length;
    const newCount = bookings.filter((item) => item.status === "new").length;
    const confirmedCount = bookings.filter((item) => item.status === "confirmed").length;
    const completedCount = bookings.filter((item) => item.status === "completed").length;
    const cancelledCount = bookings.filter((item) => item.status === "cancelled").length;

    const ridesTodayCount = todayRides.length;
    const unconfirmedTodayCount = todayRides.filter((item) => item.status === "new").length;
    const completedTodayCount = todayRides.filter((item) => item.status === "completed").length;

    const upcomingSoonCount = todayRides.filter((item) => {
      if (!item.pickup_time) return false;

      const rideTime = new Date(`${item.pickup_date}T${item.pickup_time}`);
      const diffMs = rideTime.getTime() - now.getTime();

      return diffMs >= 0 && diffMs <= 2 * 60 * 60 * 1000;
    }).length;

    return {
      total,
      newCount,
      confirmedCount,
      completedCount,
      cancelledCount,
      ridesTodayCount,
      unconfirmedTodayCount,
      completedTodayCount,
      upcomingSoonCount,
    };
  }, [bookings, todayRides]);

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
              Theo dõi nhanh rides hôm nay, các chuyến sắp tới trong 2 giờ và các booking mới cần xử lý.
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
            <StatCard label="Tổng booking" value={String(stats.total)} hint="Toàn bộ hệ thống" />
            <StatCard label="Rides hôm nay" value={String(stats.ridesTodayCount)} hint="Theo pickup date" />
            <StatCard label="Sắp tới 2 giờ" value={String(stats.upcomingSoonCount)} hint="Cần ưu tiên xử lý" />
            <StatCard label="Chưa xác nhận hôm nay" value={String(stats.unconfirmedTodayCount)} hint="Nên gọi lại sớm" />
            <StatCard label="Hoàn thành hôm nay" value={String(stats.completedTodayCount)} hint="Đã chạy xong" />
            <StatCard label="Đã xác nhận" value={String(stats.confirmedCount)} hint="Tổng số ride đã chốt" />
          </section>

          <section
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
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em" }}>
                  Rides Today
                </h2>
                <p style={{ margin: "8px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Danh sách chuyến đón/trả hôm nay, sắp theo giờ pickup.
                </p>
              </div>

              <Link to="/admin/bookings" style={primaryBtn}>
                Xem tất cả booking
              </Link>
            </div>

            {todayRides.length === 0 ? (
              <div style={emptyBox}>Hôm nay chưa có chuyến nào.</div>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {todayRides.map((booking) => {
                  const urgent = isUpcomingSoon(booking);

                  return (
                    <Link
                      key={booking.id}
                      to={`/admin/bookings/${booking.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        background: urgent ? "#fff7ed" : "#f8fafc",
                        border: urgent
                          ? "1px solid rgba(249,115,22,0.28)"
                          : "1px solid rgba(15,23,42,0.06)",
                        borderRadius: 20,
                        padding: 18,
                        display: "grid",
                        gap: 10,
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
                          <div style={{ fontWeight: 800, fontSize: 18 }}>
                            {booking.booking_code || booking.id}
                          </div>
                          <div style={{ marginTop: 4, fontWeight: 700 }}>
                            {booking.full_name || "Không có tên"}
                          </div>
                          <div style={{ marginTop: 6, color: "#64748b" }}>
                            {booking.phone || "—"}
                          </div>
                        </div>

                        <StatusBadge status={booking.status} />
                      </div>

                      <div style={{ color: "#0f172a", fontWeight: 700 }}>
                        {booking.pickup_time || "--:--"} • {booking.service_type || "Ride"}
                      </div>

                      <div style={{ color: "#475569", lineHeight: 1.7 }}>
                        <strong>Pickup:</strong> {booking.pickup_location || "—"}
                        <br />
                        <strong>Dropoff:</strong> {booking.dropoff_location || "—"}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
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
                            {booking.booking_code || booking.id}
                          </div>

                          <div
                            style={{
                              marginTop: 6,
                              fontWeight: 700,
                              color: "#0f172a",
                              fontSize: 16,
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
                        <MiniInfo label="Điểm đón" value={booking.pickup_location || "-"} />
                        <MiniInfo label="Điểm đến" value={booking.dropoff_location || "-"} />
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
                        <Link to={`/admin/bookings/${booking.id}`} style={primaryBtn}>
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
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  letterSpacing: "-0.03em",
                }}
              >
                Gợi ý xử lý nhanh
              </h2>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#64748b",
                  lineHeight: 1.75,
                }}
              >
                Ưu tiên kiểm tra các ride sắp đến giờ pickup, sau đó xử lý các booking mới để tránh bỏ sót khách cần xác nhận gấp.
              </p>

              <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
                <ActionRow
                  title="Chuyến sắp tới"
                  value={`${stats.upcomingSoonCount} rides`}
                  note="Các booking trong vòng 2 giờ tới"
                />
                <ActionRow
                  title="Chưa xác nhận hôm nay"
                  value={`${stats.unconfirmedTodayCount} rides`}
                  note="Nên gọi lại hoặc nhắn khách sớm"
                />
                <ActionRow
                  title="Booking mới toàn hệ thống"
                  value={`${stats.newCount} rides`}
                  note="Kiểm tra xem còn booking nào chưa xử lý"
                />
                <ActionRow
                  title="Đã hủy"
                  value={`${stats.cancelledCount} rides`}
                  note="Rà lại để dọn lịch hoặc lưu ý vận hành"
                />
              </div>
            </div>
          </section>

          <style>{responsiveStyles}</style>
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
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 34,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#64748b",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {hint}
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid rgba(15,23,42,0.06)",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
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
          lineHeight: 1.6,
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
      label: "Mới",
      background: "rgba(59,130,246,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(59,130,246,0.24)",
    },
    confirmed: {
      label: "Đã xác nhận",
      background: "rgba(16,185,129,0.12)",
      color: "#047857",
      border: "1px solid rgba(16,185,129,0.24)",
    },
    completed: {
      label: "Hoàn thành",
      background: "rgba(15,23,42,0.09)",
      color: "#0f172a",
      border: "1px solid rgba(15,23,42,0.15)",
    },
    cancelled: {
      label: "Đã hủy",
      background: "rgba(239,68,68,0.1)",
      color: "#b91c1c",
      border: "1px solid rgba(239,68,68,0.2)",
    },
  };

  const current = map[status] || {
    label: status || "Không rõ",
    background: "rgba(148,163,184,0.16)",
    color: "#334155",
    border: "1px solid rgba(148,163,184,0.24)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        ...current,
      }}
    >
      {current.label}
    </span>
  );
}

function ActionRow({ title, value, note }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid rgba(15,23,42,0.06)",
        borderRadius: 18,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: "#0f172a", fontWeight: 800 }}>{title}</div>
        <div style={{ color: "#0f172a", fontWeight: 800 }}>{value}</div>
      </div>

      <div style={{ marginTop: 8, color: "#64748b", lineHeight: 1.6 }}>
        {note}
      </div>
    </div>
  );
}

function isUpcomingSoon(booking) {
  if (!booking.pickup_date || !booking.pickup_time) return false;

  const now = new Date();
  const rideTime = new Date(`${booking.pickup_date}T${booking.pickup_time}`);
  const diffMs = rideTime.getTime() - now.getTime();

  return diffMs >= 0 && diffMs <= 2 * 60 * 60 * 1000;
}

const infoBox = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 18,
  padding: "16px 18px",
  color: "#334155",
  boxShadow: "0 18px 40px rgba(15,23,42,0.05)",
};

const emptyBox = {
  background: "#f8fafc",
  border: "1px dashed rgba(15,23,42,0.12)",
  borderRadius: 18,
  padding: "22px 18px",
  color: "#475569",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px 16px",
  borderRadius: 14,
  background: "#0f172a",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px 16px",
  borderRadius: 14,
  background: "white",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(15,23,42,0.12)",
  cursor: "pointer",
};

const ghostLightBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px 16px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.08)",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.14)",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
};

const primaryLightBtn = {
  ...primaryBtn,
  background: "#d4a017",
  color: "#0f172a",
};

const responsiveStyles = `
  @media (max-width: 960px) {
    .dashboard-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
