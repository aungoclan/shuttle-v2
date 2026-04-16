import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { supabasePublic } from "../../lib/supabasePublic";
import { siteConfig } from "../../lib/siteConfig";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  serviceType: "Airport Transfer",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "",
  passengers: "1",
  luggage: "0",
  preferredContact: "Phone",
  notes: "",
};

function getFunctionUrl() {
  const configured = import.meta.env.VITE_BOOKING_FUNCTION_URL?.trim();
  if (configured) return configured;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/functions/v1/send-booking`;
}

function normalizePhone(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

function isFutureOrToday(dateValue) {
  if (!dateValue) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(`${dateValue}T00:00:00`);
  return !Number.isNaN(selected.getTime()) && selected >= today;
}

function generateBookingCode() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `DDS-${yy}${mm}${dd}-${hh}${min}${ss}`;
}

function parseCount(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return Number(digits || 0);
}

function includesAny(value, keywords) {
  const normalized = String(value || "").toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function estimatePrice({ pickup, dropoff, passengers, luggage, serviceType }) {
  const pickupText = String(pickup || "").toLowerCase();
  const dropoffText = String(dropoff || "").toLowerCase();
  const serviceText = String(serviceType || "").toLowerCase();
  const combined = `${pickupText} ${dropoffText} ${serviceText}`;

  const airportKeywords = ["smf", "airport", "sacramento international"];
  const isAirportRide = includesAny(combined, airportKeywords);

  let min = 40;
  let max = 65;
  let zoneLabel = "local";

  if (isAirportRide) {
    zoneLabel = "airport";

    if (includesAny(combined, ["elk grove"])) {
      min = 75;
      max = 95;
      zoneLabel = "Elk Grove ↔ SMF";
    } else if (includesAny(combined, ["davis", "uc davis"])) {
      min = 80;
      max = 100;
      zoneLabel = "Davis ↔ SMF";
    } else if (includesAny(combined, ["roseville", "rocklin"])) {
      min = 85;
      max = 110;
      zoneLabel = "Roseville/Rocklin ↔ SMF";
    } else if (includesAny(combined, ["folsom", "rancho cordova"])) {
      min = 95;
      max = 120;
      zoneLabel = "Folsom/Rancho Cordova ↔ SMF";
    } else if (includesAny(combined, ["woodland", "west sacramento"])) {
      min = 70;
      max = 90;
      zoneLabel = "Woodland/West Sacramento ↔ SMF";
    } else {
      min = 65;
      max = 85;
      zoneLabel = "Sacramento ↔ SMF";
    }
  } else if (includesAny(combined, ["hourly", "theo giờ"])) {
    min = 90;
    max = 140;
    zoneLabel = "hourly";
  } else if (includesAny(combined, ["event", "sự kiện"])) {
    min = 55;
    max = 85;
    zoneLabel = "event";
  }

  const passengerCount = parseCount(passengers);
  const luggageCount = parseCount(luggage);

  if (passengerCount >= 4) {
    min += 10;
    max += 10;
  }

  if (luggageCount >= 4) {
    min += 10;
    max += 10;
  }

  return {
    min,
    max,
    text: `$${min} - $${max}`,
    zoneLabel,
  };
}

export default function BookPage() {
  const { language } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [estimate, setEstimate] = useState(null);

  const isVi = language === "vi";

  useEffect(() => {
    if (form.pickupLocation.trim() && form.dropoffLocation.trim()) {
      setEstimate(
        estimatePrice({
          pickup: form.pickupLocation,
          dropoff: form.dropoffLocation,
          passengers: form.passengers,
          luggage: form.luggage,
          serviceType: form.serviceType,
        })
      );
      return;
    }

    setEstimate(null);
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function getFriendlyErrorMessage(error) {
    const raw = String(error?.message || error || "").toLowerCase();

    if (
      raw.includes("row-level security") ||
      raw.includes("new row violates row-level security") ||
      raw.includes("permission denied") ||
      raw.includes("403")
    ) {
      return isVi
        ? "Supabase đang chặn quyền gửi booking. Hãy kiểm tra lại quyền của bảng bookings."
        : "Supabase is blocking booking inserts. Please review the bookings table permissions.";
    }

    if (raw.includes("invalid input syntax")) {
      return isVi
        ? "Một số dữ liệu gửi lên chưa đúng định dạng."
        : "Some submitted fields have an invalid format.";
    }

    if (raw.includes("column") && raw.includes("does not exist")) {
      return isVi
        ? "Bảng bookings đang thiếu cột so với dữ liệu form gửi lên."
        : "The bookings table is missing one or more columns expected by the form.";
    }

    if (raw.includes("network") || raw.includes("failed to fetch")) {
      return isVi
        ? "Kết nối mạng gặp vấn đề. Vui lòng thử lại."
        : "There was a network issue. Please try again.";
    }

    return isVi
      ? `Gửi yêu cầu thất bại: ${error?.message || "Vui lòng thử lại."}`
      : `Failed to submit booking: ${error?.message || "Please try again."}`;
  }

  function validateForm() {
    if (!isValidPhone(form.phone)) {
      return isVi
        ? "Vui lòng nhập số điện thoại hợp lệ để bên mình xác nhận chuyến đi."
        : "Please enter a valid phone number so we can confirm your ride.";
    }

    if (!isFutureOrToday(form.pickupDate)) {
      return isVi
        ? "Ngày đón phải là hôm nay hoặc một ngày trong tương lai."
        : "Pickup date must be today or a future date.";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return isVi
        ? "Email chưa đúng định dạng."
        : "Email format is invalid.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");
    setEmailWarning("");

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      setSubmitting(false);
      return;
    }

    try {
      const bookingCode = generateBookingCode();

      const payload = {
        booking_code: bookingCode,
        full_name: form.fullName.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim() || null,
        service_type: form.serviceType,
        pickup_location: form.pickupLocation.trim(),
        dropoff_location: form.dropoffLocation.trim(),
        pickup_date: form.pickupDate,
        pickup_time: form.pickupTime,
        passengers: form.passengers,
        luggage: form.luggage,
        preferred_contact: form.preferredContact,
        notes: form.notes.trim() || null,
        estimated_price_min: estimate?.min ?? null,
        estimated_price_max: estimate?.max ?? null,
        estimated_price_text: estimate?.text ?? null,
        status: "new",
      };

      const { error } = await supabasePublic.from("bookings").insert([payload]);

      if (error) {
        setSubmitError(getFriendlyErrorMessage(error));
        setSubmitting(false);
        return;
      }

      const functionUrl = getFunctionUrl();

      if (functionUrl) {
        try {
          const res = await fetch(functionUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const result = await res.json().catch(() => null);
            console.warn("send-booking failed after DB insert", result || res.statusText);
            setEmailWarning(
              isVi
                ? "Yêu cầu đã được lưu thành công, nhưng email xác nhận đang gặp lỗi. Bên mình vẫn có thể liên hệ bạn qua số điện thoại đã cung cấp."
                : "Your request was saved successfully, but the confirmation email had an issue. We can still contact you using the phone number you provided."
            );
          }
        } catch (mailError) {
          console.warn("send-booking request failed after DB insert", mailError);
          setEmailWarning(
            isVi
              ? "Yêu cầu đã được lưu thành công, nhưng email xác nhận đang gặp lỗi. Bên mình vẫn có thể liên hệ bạn qua số điện thoại đã cung cấp."
              : "Your request was saved successfully, but the confirmation email had an issue. We can still contact you using the phone number you provided."
          );
        }
      }

      setSubmittedCode(bookingCode);
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected submit error:", err);
      setSubmitError(getFriendlyErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
    setSubmittedCode("");
    setSubmitError("");
    setEmailWarning("");
  }

  const serviceOptions = isVi
    ? ["Đưa đón sân bay", "Đi lại địa phương", "Thuê xe theo giờ", "Xe đi sự kiện"]
    : ["Airport Transfer", "Local Rides", "Hourly Service", "Special Event Ride"];

  const contactOptions = isVi ? ["Điện thoại", "Tin nhắn", "Email"] : ["Phone", "Text", "Email"];

  if (submitted) {
    return (
      <section className="book-success">
        <div className="book-success-icon">✓</div>
        <h1 className="book-success-title">
          {isVi ? "Đã nhận yêu cầu đặt xe" : "Your booking request has been received"}
        </h1>
        <p className="book-success-desc">
          {isVi
            ? "Bên mình đã nhận được thông tin chuyến đi của bạn và sẽ liên hệ sớm để xác nhận. Nếu cần gấp, bạn có thể gọi trực tiếp ngay bây giờ."
            : "We received your ride request and will contact you shortly to confirm the trip. If your ride is urgent, please call us now."}
        </p>

        {emailWarning && <div className="book-warning-box">{emailWarning}</div>}

        {submittedCode && (
          <div
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 14,
              background: "rgba(15,23,42,0.06)",
              border: "1px solid rgba(15,23,42,0.08)",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            {isVi ? "Mã booking:" : "Booking code:"} {submittedCode}
          </div>
        )}

        <div className="book-success-grid">
          <InfoCard label={isVi ? "Dịch vụ" : "Service"} value={form.serviceType} />
          <InfoCard label={isVi ? "Điểm đón" : "Pickup"} value={form.pickupLocation || "-"} />
          <InfoCard label={isVi ? "Điểm đến" : "Dropoff"} value={form.dropoffLocation || "-"} />
          <InfoCard
            label={isVi ? "Ngày / Giờ" : "Date / Time"}
            value={`${form.pickupDate || ""} ${form.pickupTime || ""}`.trim() || "-"}
          />
          <InfoCard label={isVi ? "Giá ước tính" : "Estimated Fare"} value={estimate?.text || "-"} />
        </div>

        <div className="book-success-actions">
          <button onClick={resetForm} className="book-btn book-btn-dark">
            {isVi ? "Gửi yêu cầu khác" : "Submit another request"}
          </button>
          <a href={`tel:${siteConfig.phone}`} className="book-btn book-btn-outline">
            {isVi ? "Gọi ngay" : "Call now"}
          </a>
        </div>

        <style>{styles}</style>
      </section>
    );
  }

  return (
    <div className="book-page">
      <section className="book-hero">
        <div className="book-hero-grid">
          <div>
            <div className="book-hero-badge">
              {isVi ? "Đặt xe nhanh và rõ ràng" : "Fast and clear booking"}
            </div>
            <h1 className="book-hero-title">
              {isVi ? "Đặt chuyến đi của bạn" : "Book your ride"}
            </h1>
            <p className="book-hero-desc">
              {isVi
                ? "Điền thông tin chuyến đi để bên mình tiếp nhận nhanh hơn. Với các chuyến gấp hoặc cùng ngày, hãy gọi trực tiếp để được hỗ trợ nhanh nhất."
                : "Share your trip details so we can review your request quickly. For urgent or same-day rides, please call directly for the fastest support."}
            </p>
          </div>

          <div className="book-hero-card">
            <div className="book-hero-card-title">
              {isVi ? "Khách thường dùng form này cho" : "Most riders use this form for"}
            </div>
            <ul className="book-hero-list">
              <li>✓ {isVi ? "Đưa đón sân bay" : "Airport transfers"}</li>
              <li>✓ {isVi ? "Đặt trước chuyến địa phương" : "Pre-scheduled local rides"}</li>
              <li>✓ {isVi ? "Đi đêm hoặc sáng sớm" : "Early morning or late night pickups"}</li>
              <li>✓ {isVi ? "Yêu cầu liên hệ lại qua phone hoặc text" : "Phone or text confirmation"}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="book-layout">
        <form onSubmit={handleSubmit} className="book-form-card">
          <div className="book-form-header">
            <h2>{isVi ? "Thông tin đặt xe" : "Ride request details"}</h2>
            <p>
              {isVi
                ? "Số điện thoại là thông tin quan trọng nhất để xác nhận booking. Email có thể để trống nếu bạn muốn liên hệ qua điện thoại hoặc tin nhắn."
                : "Your phone number is the most important detail for booking confirmation. Email can be left blank if you prefer phone or text."}
            </p>
          </div>

          <div className="book-section-block">
            <div className="book-section-label">{isVi ? "Thông tin liên hệ" : "Contact details"}</div>
            <div className="book-grid-2">
              <Field label={isVi ? "Họ và tên" : "Full name"}>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="book-input"
                  placeholder={isVi ? "Nhập họ và tên" : "Enter your full name"}
                  required
                />
              </Field>
              <Field label={isVi ? "Số điện thoại" : "Phone number"}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="book-input"
                  placeholder={siteConfig.phoneDisplay}
                  required
                />
              </Field>
            </div>

            <div className="book-grid-2">
              <Field label={isVi ? "Email (không bắt buộc)" : "Email (optional)"}>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="book-input"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label={isVi ? "Cách liên hệ ưu tiên" : "Preferred contact"}>
                <select
                  name="preferredContact"
                  value={form.preferredContact}
                  onChange={handleChange}
                  className="book-input"
                >
                  {contactOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="book-section-block">
            <div className="book-section-label">{isVi ? "Chi tiết chuyến đi" : "Trip details"}</div>
            <div className="book-grid-2">
              <Field label={isVi ? "Loại dịch vụ" : "Service type"}>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="book-input"
                >
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={isVi ? "Điểm đón" : "Pickup location"}>
                <input
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={handleChange}
                  className="book-input"
                  placeholder={isVi ? "Ví dụ: SMF Airport" : "Example: SMF Airport"}
                  required
                />
              </Field>
            </div>

            <div className="book-grid-2">
              <Field label={isVi ? "Điểm đến" : "Dropoff location"}>
                <input
                  name="dropoffLocation"
                  value={form.dropoffLocation}
                  onChange={handleChange}
                  className="book-input"
                  placeholder={isVi ? "Nhập điểm đến" : "Enter dropoff location"}
                  required
                />
              </Field>
              <Field label={isVi ? "Ngày đón" : "Pickup date"}>
                <input
                  name="pickupDate"
                  value={form.pickupDate}
                  onChange={handleChange}
                  type="date"
                  className="book-input"
                  required
                />
              </Field>
            </div>

            <div className="book-grid-3">
              <Field label={isVi ? "Giờ đón" : "Pickup time"}>
                <input
                  name="pickupTime"
                  value={form.pickupTime}
                  onChange={handleChange}
                  type="time"
                  className="book-input"
                  required
                />
              </Field>
              <Field label={isVi ? "Số hành khách" : "Passengers"}>
                <select name="passengers" value={form.passengers} onChange={handleChange} className="book-input">
                  {["1", "2", "3", "4", "5", "6+"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={isVi ? "Số hành lý" : "Luggage"}>
                <select name="luggage" value={form.luggage} onChange={handleChange} className="book-input">
                  {["0", "1", "2", "3", "4", "5+"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={isVi ? "Ghi chú thêm" : "Additional notes"}>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="book-input book-textarea"
                placeholder={
                  isVi
                    ? "Ví dụ: cần đón sớm, có trẻ em, cần liên hệ bằng text..."
                    : "Example: early pickup, child seat request, prefer text confirmation..."
                }
              />
            </Field>
          </div>

          {estimate ? (
            <div className="book-estimate-card">
              <div className="book-estimate-label">{isVi ? "Giá ước tính" : "Estimated Fare"}</div>
              <div className="book-estimate-value">{estimate.text}</div>
              <div className="book-estimate-note">
                {isVi
                  ? "Đây là mức giá ước tính để bạn tham khảo. Giá cuối cùng sẽ được xác nhận thủ công qua điện thoại, tin nhắn hoặc email."
                  : "This is an estimate for reference only. The final quote will be confirmed manually by phone, text, or email."}
              </div>
            </div>
          ) : (
            <div className="book-estimate-card book-estimate-card-muted">
              <div className="book-estimate-label">{isVi ? "Giá ước tính" : "Estimated Fare"}</div>
              <div className="book-estimate-note">
                {isVi
                  ? "Nhập điểm đón và điểm đến để xem mức giá ước tính."
                  : "Enter your pickup and dropoff locations to see an estimated fare."}
              </div>
            </div>
          )}

          {submitError && <div className="book-error-box">{submitError}</div>}

          <div className="book-form-actions">
            <button type="submit" className="book-btn book-btn-dark" disabled={submitting}>
              {submitting ? (isVi ? "Đang gửi..." : "Submitting...") : isVi ? "Gửi yêu cầu đặt xe" : "Submit booking request"}
            </button>
            <a href={`tel:${siteConfig.phone}`} className="book-btn book-btn-outline">
              {isVi ? "Gọi ngay" : "Call now"}
            </a>
          </div>
        </form>

        <aside className="book-side-panel">
          <SideCard
            title={isVi ? "Cần gấp?" : "Need a fast response?"}
            text={
              isVi
                ? "Với chuyến đi cùng ngày hoặc cần xác nhận gấp, gọi trực tiếp sẽ nhanh hơn điền form."
                : "For same-day rides or urgent confirmation, calling directly is faster than completing the form."
            }
          />
          <SideCard
            title={isVi ? "Thông tin quan trọng nhất" : "Most important details"}
            text={
              isVi
                ? "Tên, số điện thoại, điểm đón, điểm đến và thời gian là những thông tin quan trọng nhất để xử lý booking chính xác."
                : "Name, phone number, pickup, dropoff, and pickup time are the most important details for accurate booking handling."
            }
          />
          <SideCard
            title={isVi ? "Xác nhận linh hoạt" : "Flexible confirmation"}
            text={
              isVi
                ? "Bạn có thể để trống email nếu muốn được xác nhận qua điện thoại hoặc tin nhắn."
                : "You can leave email blank if you prefer booking confirmation by phone or text."
            }
          />
        </aside>
      </section>

      <style>{styles}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="book-field">
      <span className="book-label">{label}</span>
      {children}
    </label>
  );
}

function SideCard({ title, text }) {
  return (
    <div className="book-side-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="book-info-card">
      <div className="book-info-label">{label}</div>
      <div className="book-info-value">{value}</div>
    </div>
  );
}

const styles = `
  .book-page {
    display: grid;
    gap: 24px;
  }

  .book-hero {
    background:
      radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 26%),
      linear-gradient(135deg, #0f172a 0%, #162235 45%, #1f2e46 100%);
    color: white;
    border-radius: 30px;
    padding: 32px 24px;
    box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
  }

  .book-hero-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 22px;
    align-items: center;
  }

  .book-hero-badge {
    display: inline-flex;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #e2e8f0;
    font-size: 13px;
    font-weight: 700;
  }

  .book-hero-title {
    margin: 18px 0 14px;
    font-size: clamp(34px, 5vw, 54px);
    line-height: 1.06;
    letter-spacing: -0.03em;
  }

  .book-hero-desc {
    margin: 0;
    color: #cbd5e1;
    line-height: 1.8;
    max-width: 720px;
    font-size: 17px;
  }

  .book-hero-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 22px;
  }

  .book-hero-card-title {
    font-size: 14px;
    color: #cbd5e1;
    font-weight: 700;
  }

  .book-hero-list {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: grid;
    gap: 12px;
    color: #e2e8f0;
    line-height: 1.6;
  }

  .book-layout {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 24px;
    align-items: start;
  }

  .book-form-card,
  .book-side-card,
  .book-success {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(15,23,42,0.08);
    box-shadow: 0 18px 50px rgba(15,23,42,0.08);
  }

  .book-form-card {
    border-radius: 28px;
    padding: 26px;
  }

  .book-form-header h2 {
    margin: 0;
    font-size: clamp(28px, 4vw, 36px);
    letter-spacing: -0.03em;
    color: #0f172a;
  }

  .book-form-header p {
    margin: 10px 0 0;
    color: #64748b;
    line-height: 1.75;
  }

  .book-section-block {
    margin-top: 22px;
    padding-top: 22px;
    border-top: 1px solid rgba(15,23,42,0.08);
  }

  .book-section-block:first-of-type {
    margin-top: 18px;
  }

  .book-section-label {
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #475569;
    text-transform: uppercase;
  }

  .book-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .book-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }

  .book-field {
    display: grid;
    gap: 9px;
  }

  .book-label {
    font-size: 14px;
    font-weight: 700;
    color: #334155;
  }

  .book-input {
    width: 100%;
    min-height: 52px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,0.12);
    background: white;
    color: #0f172a;
    outline: none;
    font-size: 15px;
    box-sizing: border-box;
  }

  .book-input:focus {
    border-color: rgba(15,23,42,0.28);
    box-shadow: 0 0 0 4px rgba(15,23,42,0.04);
  }

  .book-textarea {
    min-height: 130px;
    resize: vertical;
    padding-top: 14px;
  }

  .book-estimate-card {
    margin-top: 22px;
    padding: 18px;
    border-radius: 22px;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    border: 1px solid rgba(15,23,42,0.08);
  }

  .book-estimate-card-muted {
    background: #f8fafc;
  }

  .book-estimate-label {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #475569;
  }

  .book-estimate-value {
    margin-top: 8px;
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 900;
    letter-spacing: -0.03em;
    color: #0f172a;
  }

  .book-estimate-note {
    margin-top: 8px;
    color: #64748b;
    line-height: 1.7;
    font-size: 14px;
  }

  .book-form-actions,
  .book-success-actions {
    margin-top: 24px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  .book-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    padding: 14px 20px;
    border-radius: 999px;
    font-weight: 800;
    text-decoration: none;
    border: 0;
    cursor: pointer;
    white-space: nowrap;
  }

  .book-btn-dark {
    background: linear-gradient(135deg, #0f172a, #22314a);
    color: white;
    box-shadow: 0 18px 30px rgba(15, 23, 42, 0.16);
  }

  .book-btn-outline {
    background: transparent;
    color: #0f172a;
    border: 1px solid rgba(15,23,42,0.12);
  }

  .book-error-box,
  .book-warning-box {
    margin-top: 18px;
    padding: 14px 16px;
    border-radius: 16px;
    font-weight: 600;
    line-height: 1.6;
  }

  .book-error-box {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .book-warning-box {
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fcd34d;
  }

  .book-side-panel {
    display: grid;
    gap: 18px;
  }

  .book-side-card {
    border-radius: 22px;
    padding: 22px;
  }

  .book-side-card h3 {
    margin: 0;
    font-size: 18px;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .book-side-card p {
    margin: 10px 0 0;
    color: #64748b;
    line-height: 1.75;
  }

  .book-success {
    border-radius: 28px;
    padding: 30px 24px;
  }

  .book-success-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white;
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 20px;
  }

  .book-success-title {
    margin: 0;
    font-size: clamp(28px, 5vw, 40px);
    letter-spacing: -0.03em;
    color: #0f172a;
  }

  .book-success-desc {
    margin-top: 14px;
    color: #64748b;
    line-height: 1.8;
    max-width: 760px;
  }

  .book-success-grid {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .book-info-card {
    background: #f8fafc;
    border-radius: 18px;
    padding: 18px;
    border: 1px solid rgba(15,23,42,0.06);
  }

  .book-info-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 700;
  }

  .book-info-value {
    margin-top: 8px;
    color: #0f172a;
    font-weight: 700;
    line-height: 1.6;
  }

  @media (max-width: 1024px) {
    .book-hero-grid,
    .book-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .book-page {
      gap: 20px;
    }

    .book-hero {
      border-radius: 24px;
      padding: 24px 18px;
    }

    .book-hero-title {
      margin: 16px 0 12px;
      font-size: 34px;
      line-height: 1.08;
    }

    .book-hero-desc {
      font-size: 15px;
      line-height: 1.75;
    }

    .book-hero-card {
      border-radius: 20px;
      padding: 18px;
    }

    .book-form-card,
    .book-success {
      border-radius: 22px;
      padding: 20px 18px;
    }

    .book-form-header h2 {
      font-size: 30px;
    }

    .book-form-header p,
    .book-side-card p,
    .book-success-desc {
      font-size: 15px;
      line-height: 1.75;
    }

    .book-grid-2,
    .book-grid-3,
    .book-success-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .book-input {
      min-height: 50px;
      font-size: 16px;
    }

    .book-form-actions,
    .book-success-actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    .book-btn {
      width: 100%;
    }

    .book-side-card {
      border-radius: 20px;
      padding: 18px;
    }
  }
`;
