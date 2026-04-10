import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const statusOptions = ["new", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    setLoading(false);
  }

  const filteredBookings = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" ? true : booking.status === statusFilter;
      const fullName = (booking.full_name || "").toLowerCase();
      const phone = (booking.phone || "").toLowerCase();
      const matchesSearch = keyword === "" ? true : fullName.includes(keyword) || phone.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchText, statusFilter]);

  const handleStatusChange = async (bookingId, nextStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", bookingId);

    if (error) {
      setErrorText("Cập nhật trạng thái thất bại.");
      return;
    }

    setBookings((prev) => prev.map((booking) => 
      booking.id === bookingId ? { ...booking, status: nextStatus } : booking
    ));
  };

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
            maxWidth: 760,
            fontSize: 16,
          }}
        >
          Tìm kiếm theo tên khách hoặc số điện thoại, lọc theo trạng thái, và đổi trạng thái booking trực tiếp ngay trong bảng.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
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
        </div>
        <div>
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

        {!loading && errorText && <div style={{ color: "red" }}>{errorText}</div>}

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Dịch vụ</th>
              <th>Điểm đón</th>
              <th>Điểm đến</th>
              <th>Ngày giờ</th>
              <th>Trạng thái hiện tại</th>
              <th>Đổi trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.full_name}</td>
                <td>{booking.phone}</td>
                <td>{booking.service_type}</td>
                <td>{booking.pickup_location}</td>
                <td>{booking.dropoff_location}</td>
                <td>{booking.pickup_date} {booking.pickup_time}</td>
                <td>{booking.status}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    style={{ padding: "5px", borderRadius: "4px" }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Link
                    to={`/admin/bookings/${booking.id}`}
                    style={{
                      backgroundColor: "#0f172a",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "5px",
                      textDecoration: "none",
                    }}
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}