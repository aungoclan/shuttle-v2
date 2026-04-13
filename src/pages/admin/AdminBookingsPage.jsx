import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const statusOptions = ["new", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    setErrorText("");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch bookings error:", error);
      setErrorText("Không tải được danh sách booking.");
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }

  const filteredBookings = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
      const matchesDate = dateFilter ? booking.pickup_date === dateFilter : true;

      const fullName = (booking.full_name || "").toLowerCase();
      const phone = (booking.phone || "").toLowerCase();
      const email = (booking.email || "").toLowerCase();
      const pickup = (booking.pickup_location || "").toLowerCase();
      const dropoff = (booking.dropoff_location || "").toLowerCase();
      const bookingId = String(booking.id || "").toLowerCase();

      const matchesSearch =
        keyword === ""
          ? true
          : fullName.includes(keyword) ||
            phone.includes(keyword) ||
            email.includes(keyword) ||
            pickup.includes(keyword) ||
            dropoff.includes(keyword) ||
            bookingId.includes(keyword);

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [bookings, searchText, statusFilter, dateFilter]);

  async function handleStatusChange(bookingId, nextStatus) {
    setUpdatingId(bookingId);
    setErrorText("");

    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", bookingId);

    if (error) {
      console.error("Update booking status error:", error);
      setErrorText("Cập nhật trạng thái thất bại.");
      setUpdatingId("");
      return;
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: nextStatus } : booking,
      ),
    );
    setUpdatingId("");
  }

  function exportCSV() {
    if (!filteredBookings.length) {
      setErrorText("Không có dữ liệu để export CSV.");
      return;
    }

    const headers = [
      "Booking ID",
      "Created At",
      "Customer Name",
      "Phone",
      "Email",
      "Service Type",
      "Pickup Location",
      "Dropoff Location",
      "Pickup Date",
      "Pickup Time",
      "Passengers",
      "Luggage",
      "Round Trip",
      "Status",
      "Internal Note",
    ];

    const escapeCsvValue = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.created_at,
      booking.full_name,
      booking.phone,
      booking.email,
      booking.service_type,
      booking.pickup_location,
      booking.dropoff_location,
      booking.pickup_date,
      booking.pickup_time,
      booking.passengers,
      booking.luggage,
      booking.round_trip,
      booking.status,
      booking.internal_note,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute("download", `bookings-${stamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSearchText("");
    setStatusFilter("all");
    setDateFilter("");
  }

  const statusCounts = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        const status = booking.status || "new";
        acc.total += 1;
        if (acc[status] !== undefined) acc[status] += 1;
        return acc;
      },
      { total: 0, new: 0, confirmed: 0, completed: 0, cancelled: 0 },
    );
  }, [bookings]);

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
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(30px, 5vw, 46px)",
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
          }}
        >
          Quản lý booking
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#cbd5e1",
            lineHeight: 1.8,
            maxWidth: 860,
            fontSize: 16,
          }}
        >
          Tìm kiếm theo tên, số điện thoại, email, địa điểm đón/trả hoặc mã booking. Bạn cũng có thể lọc theo trạng thái,
          ngày đi và export CSV để lưu trữ hoặc xử lý ngoài hệ thống.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Tổng booking" value={statusCounts.total} />
        <StatCard label="Mới" value={statusCounts.new} />
        <StatCard label="Đã xác nhận" value={statusCounts.confirmed} />
        <StatCard label="Hoàn thành" value={statusCounts.completed} />
        <StatCard label="Đã hủy" value={statusCounts.cancelled} />
      </section>

      <section
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          padding: 20,
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto auto auto",
            gap: 12,
          }}
          className="admin-bookings-filters"
        >
          <input
            type="text"
            placeholder="Tìm theo tên, phone, email, pickup, dropoff hoặc ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={fieldStyle}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={fieldStyle}>
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={fieldStyle} />

          <button onClick={clearFilters} style={ghostBtn}>
            Xóa lọc
          </button>

          <button onClick={exportCSV} style={secondaryBtn}>
            Export CSV
          </button>

          <button onClick={fetchBookings} style={primaryBtn}>
            Làm mới
          </button>
        </div>

        <div style={{ color: "#64748b", fontSize: 14 }}>
          Đang hiển thị <strong style={{ color: "#0f172a" }}>{filteredBookings.length}</strong> booking
          {bookings.length !== filteredBookings.length ? ` / ${bookings.length} tổng` : ""}.
        </div>
      </section>

      <section
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          overflow: "hidden",
        }}
      >
        {loading && <div style={infoBox}>Đang tải dữ liệu...</div>}

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

        {!loading && !errorText && filteredBookings.length === 0 && (
          <div style={infoBox}>Không có booking nào khớp với bộ lọc hiện tại.</div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
              <thead>
                <tr>
                  {[
                    "Khách hàng",
                    "Liên hệ",
                    "Dịch vụ",
                    "Điểm đón",
                    "Điểm đến",
                    "Ngày giờ",
                    "Trạng thái hiện tại",
                    "Đổi trạng thái",
                    "Chi tiết",
                  ].map((label) => (
                    <th key={label} style={thStyle}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{booking.full_name || "-"}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>ID: {booking.id}</div>
                    </td>

                    <td style={tdStyle}>
                      <div>{booking.phone || "-"}</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{booking.email || "Không có email"}</div>
                    </td>

                    <td style={tdStyle}>{booking.service_type || "-"}</td>
                    <td style={tdStyle}>{booking.pickup_location || "-"}</td>
                    <td style={tdStyle}>{booking.dropoff_location || "-"}</td>

                    <td style={tdStyle}>
                      <div>{booking.pickup_date || "-"}</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{booking.pickup_time || "-"}</div>
                    </td>

                    <td style={tdStyle}>
                      <StatusBadge status={booking.status} />
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={booking.status || "new"}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={updatingId === booking.id}
                        style={{
                          ...fieldStyle,
                          minWidth: 150,
                          padding: "10px 12px",
                          opacity: updatingId === booking.id ? 0.7 : 1,
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td style={tdStyle}>
                      <Link to={`/admin/bookings/${booking.id}`} style={primaryLinkBtn}>
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .admin-bookings-filters {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 680px) {
          .admin-bookings-filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    new: { label: "Mới", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    confirmed: { label: "Đã xác nhận", bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
    completed: { label: "Hoàn thành", bg: "#f8fafc", color: "#334155", border: "#cbd5e1" },
    cancelled: { label: "Đã hủy", bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
  };

  const item = map[status] || map.new;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "7px 12px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        border: `1px solid ${item.border}`,
        fontSize: 13,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {item.label}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ color: "#64748b", fontSize: 14 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#fff",
  color: "#0f172a",
  outline: "none",
  minHeight: 48,
};

const infoBox = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#334155",
};

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  fontSize: 13,
  color: "#475569",
  background: "#f8fafc",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "16px 12px",
  verticalAlign: "top",
  color: "#0f172a",
  fontSize: 14,
};

const primaryBtn = {
  border: "none",
  borderRadius: 16,
  padding: "12px 16px",
  background: "#0f172a",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  minHeight: 48,
};

const secondaryBtn = {
  border: "1px solid rgba(15,23,42,0.12)",
  borderRadius: 16,
  padding: "12px 16px",
  background: "#d4a017",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
  minHeight: 48,
};

const ghostBtn = {
  border: "1px solid rgba(15,23,42,0.12)",
  borderRadius: 16,
  padding: "12px 16px",
  background: "white",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
  minHeight: 48,
};

const primaryLinkBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0f172a",
  color: "white",
  padding: "10px 14px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
  whiteSpace: "nowrap",
};
