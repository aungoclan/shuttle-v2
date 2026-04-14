import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const statusOptions = ["new", "confirmed", "completed", "cancelled"];

const statusLabels = {
  new: "Mới",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const statusBadgeStyles = {
  new: {
    background: "rgba(59,130,246,0.12)",
    color: "#1d4ed8",
    border: "1px solid rgba(59,130,246,0.24)",
  },
  confirmed: {
    background: "rgba(16,185,129,0.12)",
    color: "#047857",
    border: "1px solid rgba(16,185,129,0.24)",
  },
  completed: {
    background: "rgba(15,23,42,0.09)",
    color: "#0f172a",
    border: "1px solid rgba(15,23,42,0.15)",
  },
  cancelled: {
    background: "rgba(239,68,68,0.1)",
    color: "#b91c1c",
    border: "1px solid rgba(239,68,68,0.2)",
  },
};

function formatStatus(status) {
  return statusLabels[status] || status || "—";
}

function escapeCsvValue(value) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

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
      setErrorText("Không tải được danh sách booking.");
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setSelectedIds([]);
    setLoading(false);
  }

  const filteredBookings = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
      const matchesDate = dateFilter ? booking.pickup_date === dateFilter : true;

      const haystack = [
        booking.booking_code,
      booking.id,
        booking.full_name,
        booking.phone,
        booking.email,
        booking.service_type,
        booking.pickup_location,
        booking.dropoff_location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = keyword === "" ? true : haystack.includes(keyword);

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [bookings, searchText, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    const base = { total: bookings.length, new: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const booking of bookings) {
      if (statusOptions.includes(booking.status)) {
        base[booking.status] += 1;
      }
    }
    return base;
  }, [bookings]);

  const allFilteredSelected =
    filteredBookings.length > 0 && filteredBookings.every((booking) => selectedIds.includes(booking.id));

  async function handleStatusChange(bookingId, nextStatus) {
    setErrorText("");

    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", bookingId);

    if (error) {
      setErrorText("Cập nhật trạng thái thất bại.");
      return;
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: nextStatus } : booking
      )
    );
  }

  function toggleSelected(bookingId) {
    setSelectedIds((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId]
    );
  }

  function toggleSelectAllFiltered() {
    if (allFilteredSelected) {
      const filteredIdSet = new Set(filteredBookings.map((booking) => booking.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
      return;
    }

    const next = new Set(selectedIds);
    filteredBookings.forEach((booking) => next.add(booking.id));
    setSelectedIds([...next]);
  }

  async function handleDeleteBooking(booking) {
    const ok = window.confirm(
      `Bạn có chắc muốn xóa booking của ${booking.full_name || "khách này"}?\n\nHành động này không thể hoàn tác.`
    );

    if (!ok) return;

    setDeletingId(booking.id);
    setErrorText("");

    const { error } = await supabase.from("bookings").delete().eq("id", booking.id);

    if (error) {
      setErrorText("Xóa booking thất bại. Vui lòng kiểm tra quyền xóa trong Supabase.");
      setDeletingId(null);
      return;
    }

    setBookings((prev) => prev.filter((item) => item.id !== booking.id));
    setSelectedIds((prev) => prev.filter((id) => id !== booking.id));
    setDeletingId(null);
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      window.alert("Bạn chưa chọn booking nào để xóa.");
      return;
    }

    const ok = window.confirm(
      `Bạn có chắc muốn xóa ${selectedIds.length} booking đã chọn?\n\nHành động này không thể hoàn tác.`
    );

    if (!ok) return;

    setBulkDeleting(true);
    setErrorText("");

    const { error } = await supabase.from("bookings").delete().in("id", selectedIds);

    if (error) {
      setErrorText("Xóa nhiều booking thất bại. Vui lòng kiểm tra quyền xóa trong Supabase.");
      setBulkDeleting(false);
      return;
    }

    const selectedSet = new Set(selectedIds);
    setBookings((prev) => prev.filter((item) => !selectedSet.has(item.id)));
    setSelectedIds([]);
    setBulkDeleting(false);
  }

  function clearFilters() {
    setSearchText("");
    setStatusFilter("all");
    setDateFilter("");
  }

  function exportCsv() {
    if (filteredBookings.length === 0) {
      window.alert("Không có booking nào để export.");
      return;
    }

    const headers = [
      "Booking Code",
      "ID",
      "Khach hang",
      "Phone",
      "Email",
      "Dich vu",
      "Diem don",
      "Diem den",
      "Ngay",
      "Gio",
      "Trang thai",
      "Tao luc",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.booking_code,
      booking.id,
      booking.full_name,
      booking.phone,
      booking.email,
      booking.service_type,
      booking.pickup_location,
      booking.dropoff_location,
      booking.pickup_date,
      booking.pickup_time,
      formatStatus(booking.status),
      booking.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
          Tìm kiếm, lọc, xuất CSV và xóa các booking cũ hoặc booking lỗi trực tiếp trong admin.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {[
          { label: "Tổng booking", value: stats.total },
          { label: "Mới", value: stats.new },
          { label: "Đã xác nhận", value: stats.confirmed },
          { label: "Hoàn thành", value: stats.completed },
          { label: "Đã hủy", value: stats.cancelled },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: 20,
              padding: "18px 20px",
              boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>
              {item.label}
            </div>
            <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, color: "#0f172a" }}>{item.value}</div>
          </div>
        ))}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="Tìm theo booking code, tên, phone, email, điểm đón, điểm đến"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 16,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#0f172a",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            onClick={fetchBookings}
            style={{
              border: "none",
              borderRadius: 14,
              padding: "11px 16px",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Làm mới
          </button>

          <button
            onClick={clearFilters}
            style={{
              border: "1px solid rgba(15,23,42,0.12)",
              borderRadius: 14,
              padding: "11px 16px",
              background: "#fff",
              color: "#0f172a",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Xóa lọc
          </button>

          <button
            onClick={exportCsv}
            style={{
              border: "1px solid rgba(15,23,42,0.12)",
              borderRadius: 14,
              padding: "11px 16px",
              background: "#ecfdf5",
              color: "#047857",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Export CSV
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0 || bulkDeleting}
            style={{
              border: "1px solid rgba(239,68,68,0.18)",
              borderRadius: 14,
              padding: "11px 16px",
              background: selectedIds.length === 0 || bulkDeleting ? "#fee2e2" : "#ef4444",
              color: selectedIds.length === 0 || bulkDeleting ? "#991b1b" : "#fff",
              fontWeight: 700,
              cursor: selectedIds.length === 0 || bulkDeleting ? "not-allowed" : "pointer",
              opacity: selectedIds.length === 0 || bulkDeleting ? 0.65 : 1,
            }}
          >
            {bulkDeleting ? "Đang xóa..." : `Xóa đã chọn (${selectedIds.length})`}
          </button>
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
        {loading && <div>Đang tải dữ liệu...</div>}

        {!loading && errorText && (
          <div
            style={{
              marginBottom: 16,
              borderRadius: 16,
              padding: "12px 14px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.16)",
              color: "#b91c1c",
              fontWeight: 600,
            }}
          >
            {errorText}
          </div>
        )}

        {!loading && filteredBookings.length === 0 ? (
          <div
            style={{
              borderRadius: 18,
              padding: "22px 18px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px dashed rgba(15,23,42,0.12)",
            }}
          >
            Không có booking nào khớp với bộ lọc hiện tại.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 1180, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={thStyle}>
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th style={thStyle}>Khách hàng</th>
                  <th style={thStyle}>Liên hệ</th>
                  <th style={thStyle}>Dịch vụ</th>
                  <th style={thStyle}>Điểm đón</th>
                  <th style={thStyle}>Điểm đến</th>
                  <th style={thStyle}>Ngày giờ</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Đổi trạng thái</th>
                  <th style={thStyle}>Chi tiết</th>
                  <th style={thStyle}>Xóa</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} style={{ borderTop: "1px solid rgba(15,23,42,0.08)" }}>
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(booking.id)}
                        onChange={() => toggleSelected(booking.id)}
                        aria-label={`Chọn booking ${booking.full_name || booking.id}`}
                      />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 800, color: "#0f172a" }}>{booking.booking_code || booking.id}</div>
                      <div style={{ marginTop: 6, fontWeight: 700, color: "#334155" }}>{booking.full_name || "—"}</div>
                      <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{booking.id}</div>
                    </td>
                    <td style={tdStyle}>
                      <div>{booking.phone || "—"}</div>
                      <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{booking.email || "Không có email"}</div>
                    </td>
                    <td style={tdStyle}>{booking.service_type || "—"}</td>
                    <td style={tdStyle}>{booking.pickup_location || "—"}</td>
                    <td style={tdStyle}>{booking.dropoff_location || "—"}</td>
                    <td style={tdStyle}>
                      <div>{booking.pickup_date || "—"}</div>
                      <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{booking.pickup_time || "—"}</div>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "7px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          ...statusBadgeStyles[booking.status],
                        }}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <select
                        value={booking.status || "new"}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid rgba(15,23,42,0.12)",
                          background: "#fff",
                          color: "#0f172a",
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <Link
                        to={`/admin/bookings/${booking.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#0f172a",
                          color: "white",
                          padding: "10px 14px",
                          borderRadius: 12,
                          textDecoration: "none",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDeleteBooking(booking)}
                        disabled={deletingId === booking.id}
                        style={{
                          border: "1px solid rgba(239,68,68,0.18)",
                          background: deletingId === booking.id ? "#fee2e2" : "#fff",
                          color: "#b91c1c",
                          borderRadius: 12,
                          padding: "10px 14px",
                          fontWeight: 700,
                          cursor: deletingId === booking.id ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {deletingId === booking.id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 12px",
  fontSize: 13,
  color: "#334155",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 12px",
  verticalAlign: "top",
  color: "#0f172a",
  fontSize: 14,
};
