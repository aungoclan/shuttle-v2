import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const statusOptions = ["new", "confirmed", "completed", "cancelled"];

function getConfirmationFunctionUrl() {
  const configured = import.meta.env.VITE_CONFIRMATION_FUNCTION_URL?.trim();
  if (configured) return configured;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/functions/v1/send-confirmation`;
}

function getCancellationFunctionUrl() {
  const configured = import.meta.env.VITE_CANCELLATION_FUNCTION_URL?.trim();
  if (configured) return configured;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/functions/v1/send-cancellation`;
}

export default function AdminBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [priceNote, setPriceNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [sendingConfirmation, setSendingConfirmation] = useState(false);
  const [sendingCancellation, setSendingCancellation] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  async function fetchBooking() {
    setLoading(true);
    setErrorText("");
    setSuccessText("");

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Fetch booking detail error:", error);
      setErrorText("Không tải được chi tiết booking.");
      setLoading(false);
      return;
    }

    if (!data) {
      setErrorText("Không tìm thấy booking này.");
      setLoading(false);
      return;
    }

    setBooking(data);
    setInternalNote(data.internal_note || "");
    setFinalPrice(data.final_price != null ? String(data.final_price) : "");
    setPriceNote(data.price_note || "");
    setLoading(false);
  }

  async function handleStatusChange(nextStatus) {
    if (!booking) return;

    setUpdating(true);
    setErrorText("");
    setSuccessText("");

    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", booking.id);

    if (error) {
      console.error("Update booking detail status error:", error);
      setErrorText("Cập nhật trạng thái thất bại.");
      setUpdating(false);
      return;
    }

    setBooking((prev) => ({ ...prev, status: nextStatus }));
    setSuccessText("Đã cập nhật trạng thái booking.");
    setUpdating(false);
  }

  async function handleSaveInternalNote() {
    if (!booking) return;

    setSavingNote(true);
    setErrorText("");
    setSuccessText("");

    const normalizedFinalPrice = finalPrice === "" ? null : Number(finalPrice);

    if (normalizedFinalPrice !== null && Number.isNaN(normalizedFinalPrice)) {
      setErrorText("Giá cuối cùng chưa đúng định dạng số.");
      setSavingNote(false);
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .update({
        internal_note: internalNote,
        final_price: normalizedFinalPrice,
        price_note: priceNote.trim() || null,
      })
      .eq("id", booking.id);

    if (error) {
      console.error("Update internal note error:", error);
      setErrorText("Lưu ghi chú nội bộ thất bại.");
      setSavingNote(false);
      return;
    }

    setBooking((prev) => ({
      ...prev,
      internal_note: internalNote,
      final_price: normalizedFinalPrice,
      price_note: priceNote.trim() || null,
    }));
    setSuccessText("Đã lưu ghi chú nội bộ và thông tin giá.");
    setSavingNote(false);
  }

  async function handleConfirmAndSendEmail() {
    if (!booking) return;
    if (!booking.email) {
      setErrorText("Booking này chưa có email khách hàng để gửi xác nhận.");
      return;
    }

    const functionUrl = getConfirmationFunctionUrl();
    if (!functionUrl) {
      setErrorText("Thiếu VITE_SUPABASE_URL hoặc VITE_CONFIRMATION_FUNCTION_URL.");
      return;
    }

    setSendingConfirmation(true);
    setErrorText("");
    setSuccessText("");

    try {
      const payload = {
        id: booking.id,
        booking_code: booking.booking_code || booking.id,
        full_name: booking.full_name,
        phone: booking.phone,
        email: booking.email,
        service_type: booking.service_type,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        passengers: booking.passengers,
        luggage: booking.luggage,
        preferred_contact: booking.preferred_contact,
        notes: booking.notes,
        estimated_price_text: booking.estimated_price_text,
        final_price: booking.final_price,
        price_note: booking.price_note,
      };

      const mailResponse = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const mailResult = await mailResponse.json().catch(() => null);

      if (!mailResponse.ok || !mailResult?.success) {
        throw new Error(mailResult?.error || "Gửi email xác nhận thất bại.");
      }

      const sentAt = new Date().toISOString();
      const nextStatus = booking.status === "completed" ? "completed" : "confirmed";

      const { error } = await supabase
        .from("bookings")
        .update({
          status: nextStatus,
          confirmation_sent_at: sentAt,
          confirmation_email: booking.email,
        })
        .eq("id", booking.id);

      if (error) {
        throw new Error("Email đã gửi nhưng không cập nhật được trạng thái trong database.");
      }

      setBooking((prev) => ({
        ...prev,
        status: nextStatus,
        confirmation_sent_at: sentAt,
        confirmation_email: booking.email,
      }));
      setSuccessText("Đã gửi email xác nhận cho khách và cập nhật trạng thái booking.");
    } catch (error) {
      console.error("Send confirmation error:", error);
      setErrorText(error instanceof Error ? error.message : "Gửi email xác nhận thất bại.");
    } finally {
      setSendingConfirmation(false);
    }
  }

  async function handleCancelAndSendEmail() {
    if (!booking) return;
    if (!booking.email) {
      setErrorText("Booking này chưa có email khách hàng để gửi email hủy chuyến.");
      return;
    }

    const functionUrl = getCancellationFunctionUrl();
    if (!functionUrl) {
      setErrorText("Thiếu VITE_SUPABASE_URL hoặc VITE_CANCELLATION_FUNCTION_URL.");
      return;
    }

    setSendingCancellation(true);
    setErrorText("");
    setSuccessText("");

    try {
      const payload = {
        id: booking.id,
        booking_code: booking.booking_code || booking.id,
        full_name: booking.full_name,
        phone: booking.phone,
        email: booking.email,
        service_type: booking.service_type,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        passengers: booking.passengers,
        luggage: booking.luggage,
        preferred_contact: booking.preferred_contact,
        notes: booking.notes,


        estimated_price_text: booking.estimated_price_text,
        final_price: booking.final_price,
        price_note: booking.price_note,

      };

      const mailResponse = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const mailResult = await mailResponse.json().catch(() => null);

      if (!mailResponse.ok || !mailResult?.success) {
        throw new Error(mailResult?.error || "Gửi email hủy chuyến thất bại.");
      }

      const sentAt = new Date().toISOString();

      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancellation_sent_at: sentAt,
          cancellation_email: booking.email,
        })
        .eq("id", booking.id);

      if (error) {
        throw new Error("Email đã gửi nhưng không cập nhật được trạng thái hủy trong database.");
      }

      setBooking((prev) => ({
        ...prev,
        status: "cancelled",
        cancellation_sent_at: sentAt,
        cancellation_email: booking.email,
      }));
      setSuccessText("Đã gửi email hủy chuyến cho khách và cập nhật trạng thái booking.");
    } catch (error) {
      console.error("Send cancellation error:", error);
      setErrorText(error instanceof Error ? error.message : "Gửi email hủy chuyến thất bại.");
    } finally {
      setSendingCancellation(false);
    }
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
              Chi tiết booking
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
              Xem đầy đủ thông tin yêu cầu đặt xe, cập nhật trạng thái, gửi email xác nhận hoặc email hủy chuyến cho khách và lưu ghi chú nội bộ cho admin.
            </p>
          </div>

          <button onClick={() => navigate("/admin/bookings")} style={ghostBtn}>
            ← Quay lại danh sách
          </button>
        </div>
      </section>

      {loading && <div style={infoBox}>Đang tải chi tiết booking...</div>}

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

      {!loading && booking && (
        <>
          {successText && (
            <div
              style={{
                ...infoBox,
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0",
              }}
            >
              {successText}
            </div>
          )}

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 24,
            }}
            className="booking-detail-grid"
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
                  gap: 16,
                  alignItems: "start",
                  flexWrap: "wrap",
                  marginBottom: 20,
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
                    {booking.full_name || "Không có tên"}
                  </h2>

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <StatusBadge status={booking.status} />
                    <span style={codeBadgeStyle}>{booking.booking_code || booking.id}</span>
                  </div>
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    textAlign: "right",
                  }}
                >
                  <div>Tạo lúc</div>
                  <div style={{ marginTop: 6, fontWeight: 700, color: "#0f172a" }}>
                    {formatDateTime(booking.created_at)}
                  </div>
                </div>
              </div>

              <div style={detailsGrid}>
                <DetailItem label="Họ tên" value={booking.full_name} />
                <DetailItem label="Số điện thoại" value={booking.phone} />
                <DetailItem label="Email" value={booking.email || "Không có"} />
                <DetailItem label="Loại dịch vụ" value={booking.service_type || "-"} />
                <DetailItem label="Điểm đón" value={booking.pickup_location || "-"} />
                <DetailItem label="Điểm đến" value={booking.dropoff_location || "-"} />
                <DetailItem label="Ngày đi" value={booking.pickup_date || "-"} />
                <DetailItem label="Giờ đi" value={booking.pickup_time || "-"} />
                <DetailItem label="Số khách" value={booking.passengers || "-"} />
                <DetailItem label="Hành lý" value={booking.luggage || "-"} />
                <DetailItem label="Liên hệ ưu tiên" value={booking.preferred_contact || "-"} />
                <DetailItem label="Giá ước tính" value={booking.estimated_price_text || "Chưa có"} />
                <DetailItem label="Giá chốt cuối" value={formatPrice(booking.final_price)} />
                <DetailItem label="Ghi chú giá" value={booking.price_note || "Chưa có"} />
                <DetailItem label="Email xác nhận lần cuối" value={booking.confirmation_email || "Chưa gửi"} />
                <DetailItem label="Đã gửi xác nhận lúc" value={formatDateTime(booking.confirmation_sent_at)} />
                <DetailItem label="Email hủy chuyến lần cuối" value={booking.cancellation_email || "Chưa gửi"} />
                <DetailItem label="Đã gửi hủy chuyến lúc" value={formatDateTime(booking.cancellation_sent_at)} />
              </div>

              <div style={{ marginTop: 22 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#334155",
                    marginBottom: 10,
                  }}
                >
                  Ghi chú khách hàng
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 18,
                    padding: 18,
                    border: "1px solid rgba(15,23,42,0.06)",
                    color: booking.notes ? "#0f172a" : "#94a3b8",
                    lineHeight: 1.7,
                  }}
                >
                  {booking.notes || "Không có ghi chú"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
                alignSelf: "start",
              }}
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Cập nhật trạng thái</h3>

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Chọn trạng thái mới cho booking này.
                </p>

                <select
                  value={booking.status || "new"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating || sendingConfirmation || sendingCancellation}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(15,23,42,0.12)",
                    background: "#fff",
                    color: "#0f172a",
                    outline: "none",
                    fontWeight: 700,
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatStatusLabel(option)}
                    </option>
                  ))}
                </select>

                {updating && (
                  <div style={{ marginTop: 10, color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                    Đang cập nhật...
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Gửi email xác nhận cho khách</h3>

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Nút này sẽ gửi email confirmation chính thức cho khách. Sau khi gửi thành công, booking sẽ tự chuyển sang trạng thái <strong>Đã xác nhận</strong> nếu booking chưa completed.
                </p>

                <div
                  style={{
                    marginTop: 16,
                    background: booking.email ? "#f8fafc" : "#fef2f2",
                    border: booking.email ? "1px solid rgba(15,23,42,0.08)" : "1px solid #fecaca",
                    borderRadius: 16,
                    padding: 16,
                    color: booking.email ? "#334155" : "#991b1b",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  <div>
                    <strong>Email khách:</strong> {booking.email || "Booking này chưa có email"}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Lần gửi gần nhất:</strong> {formatDateTime(booking.confirmation_sent_at)}
                  </div>
                </div>

                <button
                  onClick={handleConfirmAndSendEmail}
                  disabled={sendingConfirmation || sendingCancellation || !booking.email}
                  style={{
                    marginTop: 14,
                    ...primaryBtn,
                    opacity: sendingConfirmation || sendingCancellation || !booking.email ? 0.6 : 1,
                    cursor: sendingConfirmation || sendingCancellation || !booking.email ? "not-allowed" : "pointer",
                    width: "100%",
                  }}
                >
                  {sendingConfirmation ? "Đang gửi email xác nhận..." : "Confirm + Send Email"}
                </button>
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Gửi email hủy chuyến cho khách</h3>
<<<<<<< HEAD

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Nút này sẽ gửi email báo hủy chuyến cho khách. Sau khi gửi thành công, booking sẽ tự chuyển sang trạng thái <strong>Đã hủy</strong>.
                </p>

                <div
                  style={{
                    marginTop: 16,
                    background: booking.email ? "#fff7ed" : "#fef2f2",
                    border: booking.email ? "1px solid #fed7aa" : "1px solid #fecaca",
                    borderRadius: 16,
                    padding: 16,
                    color: booking.email ? "#9a3412" : "#991b1b",
=======

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Nút này sẽ gửi email báo hủy chuyến cho khách. Sau khi gửi thành công, booking sẽ tự chuyển sang trạng thái <strong>Đã hủy</strong>.
                </p>

                <div
                  style={{
                    marginTop: 16,
                    background: booking.email ? "#fff7ed" : "#fef2f2",
                    border: booking.email ? "1px solid #fed7aa" : "1px solid #fecaca",
                    borderRadius: 16,
                    padding: 16,
                    color: booking.email ? "#9a3412" : "#991b1b",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  <div>
                    <strong>Email khách:</strong> {booking.email || "Booking này chưa có email"}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Lần gửi gần nhất:</strong> {formatDateTime(booking.cancellation_sent_at)}
                  </div>
                </div>

                <button
                  onClick={handleCancelAndSendEmail}
                  disabled={sendingCancellation || sendingConfirmation || !booking.email}
                  style={{
                    marginTop: 14,
                    ...dangerBtn,
                    opacity: sendingCancellation || sendingConfirmation || !booking.email ? 0.6 : 1,
                    cursor: sendingCancellation || sendingConfirmation || !booking.email ? "not-allowed" : "pointer",
                    width: "100%",
                  }}
                >
                  {sendingCancellation ? "Đang gửi email hủy chuyến..." : "Cancel + Send Email"}
                </button>
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Ghi chú nội bộ admin</h3>

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Dùng phần này để lưu giá ước tính, chốt giá cuối cùng và ghi chú nội bộ như đã gọi khách, ghi chú đón khách hoặc tình trạng xử lý.
                </p>

                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 18,
                    background: "#f8fafc",
                    border: "1px solid rgba(15,23,42,0.06)",
                    color: "#334155",
>>>>>>> feature/estimate-price
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  <div>
<<<<<<< HEAD
                    <strong>Email khách:</strong> {booking.email || "Booking này chưa có email"}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Lần gửi gần nhất:</strong> {formatDateTime(booking.cancellation_sent_at)}
                  </div>
                </div>

                <button
                  onClick={handleCancelAndSendEmail}
                  disabled={sendingCancellation || sendingConfirmation || !booking.email}
                  style={{
                    marginTop: 14,
                    ...dangerBtn,
                    opacity: sendingCancellation || sendingConfirmation || !booking.email ? 0.6 : 1,
                    cursor: sendingCancellation || sendingConfirmation || !booking.email ? "not-allowed" : "pointer",
                    width: "100%",
                  }}
                >
                  {sendingCancellation ? "Đang gửi email hủy chuyến..." : "Cancel + Send Email"}
                </button>
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Ghi chú nội bộ admin</h3>

                <p style={{ margin: "10px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Dùng phần này để ghi các lưu ý nội bộ như đã gọi khách, chốt giá, ghi chú đón khách hoặc tình trạng xử lý.
                </p>
=======
                    <strong>Estimated Fare:</strong> {booking.estimated_price_text || "Chưa có"}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                    Giá này chỉ để tham khảo. Bạn vẫn có thể chỉnh giá thật trước khi xác nhận với khách.
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                      Final Price
                    </div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      placeholder="Ví dụ: 85"
                      style={{
                        width: "100%",
                        minHeight: 52,
                        padding: "14px 16px",
                        borderRadius: 16,
                        border: "1px solid rgba(15,23,42,0.12)",
                        background: "#fff",
                        color: "#0f172a",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                      Price Note
                    </div>
                    <textarea
                      value={priceNote}
                      onChange={(e) => setPriceNote(e.target.value)}
                      placeholder="Ví dụ: Giá đã bao gồm đón sớm 4:30 AM và 3 kiện hành lý."
                      style={{
                        width: "100%",
                        minHeight: 92,
                        padding: "14px 16px",
                        borderRadius: 16,
                        border: "1px solid rgba(15,23,42,0.12)",
                        background: "#fff",
                        color: "#0f172a",
                        outline: "none",
                        resize: "vertical",
                        lineHeight: 1.6,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
>>>>>>> feature/estimate-price

                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Ví dụ: Đã gọi xác nhận lúc 8:30 sáng. Khách muốn liên hệ bằng text. Đón ở cổng phụ."
                  style={{
                    width: "100%",
                    marginTop: 16,
                    minHeight: 140,
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(15,23,42,0.12)",
                    background: "#fff",
                    color: "#0f172a",
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />

                <button onClick={handleSaveInternalNote} disabled={savingNote} style={{ marginTop: 14, ...primaryBtn }}>
<<<<<<< HEAD
                  {savingNote ? "Đang lưu..." : "Lưu ghi chú nội bộ"}
=======
                  {savingNote ? "Đang lưu..." : "Lưu giá & ghi chú nội bộ"}
>>>>>>> feature/estimate-price
                </button>
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
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.03em" }}>Thao tác nhanh</h3>

                <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                  <Link to="/admin/bookings" style={primaryBtn}>
                    Quay lại danh sách bookings
                  </Link>

                  {booking.phone && (
                    <a href={`tel:${booking.phone}`} style={ghostBtn}>
                      Gọi khách hàng
                    </a>
                  )}

                  {booking.email && (
                    <a href={`mailto:${booking.email}`} style={ghostBtn}>
                      Mở email khách
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          <style>{`
            @media (max-width: 900px) {
              .booking-detail-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{label}</div>

      <div
        style={{
          marginTop: 8,
          color: "#0f172a",
          fontWeight: 700,
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
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

function formatStatusLabel(status) {
  const map = {
    new: "Mới",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };

  return map[status] || status;
}

function formatPrice(value) {
  if (value == null || value === "") return "Chưa chốt";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `$${amount}`;
}

function formatDateTime(value) {
  if (!value) return "Chưa có";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const infoBox = {
  padding: "16px 18px",
  borderRadius: 16,
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid rgba(15,23,42,0.08)",
};

const codeBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.06)",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 13,
  whiteSpace: "nowrap",
  border: "1px solid rgba(15,23,42,0.08)",
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

const dangerBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "linear-gradient(135deg, #991b1b, #7f1d1d)",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 18px 30px rgba(127, 29, 29, 0.2)",
};
