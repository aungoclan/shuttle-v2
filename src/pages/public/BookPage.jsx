import { useState } from "react";
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

export default function BookPage() {
  const { t, language } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
      return language === "vi"
        ? "Supabase đang chặn quyền gửi booking. Hãy kiểm tra lại quyền của bảng bookings."
        : "Supabase is blocking booking inserts. Please review the bookings table permissions.";
    }

    if (raw.includes("invalid input syntax")) {
      return language === "vi"
        ? "Một số dữ liệu gửi lên chưa đúng định dạng."
        : "Some submitted fields have an invalid format.";
    }

    if (raw.includes("column") && raw.includes("does not exist")) {
      return language === "vi"
        ? "Bảng bookings đang thiếu cột so với dữ liệu form gửi lên."
        : "The bookings table is missing one or more columns expected by the form.";
    }

    if (raw.includes("network") || raw.includes("failed to fetch")) {
      return language === "vi"
        ? "Kết nối mạng gặp vấn đề. Vui lòng thử lại."
        : "There was a network issue. Please try again.";
    }

    return language === "vi"
      ? `Gửi yêu cầu thất bại: ${error?.message || "Vui lòng thử lại."}`
      : `Failed to submit booking: ${error?.message || "Please try again."}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
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
        status: "new",
      };
	const { error } = await supabasePublic.from("bookings").insert([payload]);

if (error) {
  console.error("DB error:", error);
  setSubmitError(getFriendlyErrorMessage(error));
  return;
}
      const res = await fetch(
  "https://labkqgghnczvpgugkcsm.supabase.co/functions/v1/send-booking",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

const result = await res.json();

if (!res.ok) {
  throw new Error(result.error || "Failed to send booking");
}
      

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
    setSubmitError("");
  }

  const serviceOptions =
    language === "vi"
      ? [
          "Đưa đón sân bay",
          "Đi lại địa phương",
          "Thuê xe theo giờ",
          "Xe đi sự kiện",
        ]
      : [
          "Airport Transfer",
          "Local Rides",
          "Hourly Service",
          "Special Event Ride",
        ];

  const contactOptions =
    language === "vi"
      ? ["Điện thoại", "Tin nhắn", "Email"]
      : ["Phone", "Text", "Email"];

  if (submitted) {
    return (
      <section className="book-success">
        <div className="book-success-icon">✓</div>

        <h1 className="book-success-title">{t("booking.successTitle")}</h1>

        <p className="book-success-desc">{t("booking.successDesc")}</p>

        <div className="book-success-grid">
          <InfoCard label={t("booking.serviceType")} value={form.serviceType} />
          <InfoCard
            label={t("booking.pickupLocation")}
            value={form.pickupLocation || "-"}
          />
          <InfoCard
            label={t("booking.dropoffLocation")}
            value={form.dropoffLocation || "-"}
          />
          <InfoCard
            label={`${t("booking.pickupDate")} / ${t("booking.pickupTime")}`}
            value={
              form.pickupDate || form.pickupTime
                ? `${form.pickupDate || ""} ${form.pickupTime || ""}`.trim()
                : "-"
            }
          />
        </div>

        <div className="book-success-actions">
          <button onClick={resetForm} className="book-btn book-btn-dark">
            {t("booking.submitAnother")}
          </button>

          <a href={`tel:${siteConfig.phone}`} className="book-btn book-btn-outline">
            {t("common.callNow")}
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
            <div className="book-hero-badge">{t("booking.heroBadge")}</div>

            <h1 className="book-hero-title">{t("booking.heroTitle")}</h1>

            <p className="book-hero-desc">{t("booking.heroDesc")}</p>

            <div className="book-hero-pills">
              <span className="book-hero-pill">
                {language === "vi" ? "Xác nhận rõ ràng" : "Clear confirmation"}
              </span>
              <span className="book-hero-pill">
                {language === "vi" ? "Đặt nhanh trên điện thoại" : "Fast mobile booking"}
              </span>
              <span className="book-hero-pill">
                {language === "vi" ? "Liên hệ dễ dàng" : "Easy communication"}
              </span>
            </div>
          </div>

          <div className="book-hero-card">
            <div className="book-hero-card-title">{t("booking.highlightTitle")}</div>

            <ul className="book-hero-list">
              <li>✓ {t("booking.highlight1")}</li>
              <li>✓ {t("booking.highlight2")}</li>
              <li>✓ {t("booking.highlight3")}</li>
              <li>✓ {t("booking.highlight4")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="book-layout">
        <form onSubmit={handleSubmit} className="book-form-card">
          <div className="book-form-header">
            <h2>{t("booking.formTitle")}</h2>
            <p>{t("booking.formDesc")}</p>
          </div>

          {submitError && <div className="book-error-box">{submitError}</div>}

          <div className="book-section-block">
            <div className="book-section-label">
              {language === "vi" ? "Thông tin liên hệ" : "Contact details"}
            </div>

            <div className="book-grid-2">
              <Field label={t("booking.fullName")}>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={
                    language === "vi" ? "Nhập họ và tên" : "Enter your full name"
                  }
                  className="book-input"
                  required
                />
              </Field>

              <Field label={t("booking.phone")}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={siteConfig.phoneDisplay}
                  className="book-input"
                  required
                />
              </Field>
            </div>

            <div className="book-grid-2">
              <Field label={t("booking.email")}>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  type="email"
                  className="book-input"
                />
              </Field>

              <Field label={t("booking.preferredContact")}>
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
            <div className="book-section-label">
              {language === "vi" ? "Chi tiết chuyến đi" : "Trip details"}
            </div>

            <div className="book-grid-2">
              <Field label={t("booking.serviceType")}>
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

              <Field label={t("booking.passengers")}>
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                  className="book-input"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </Field>
            </div>

            <div className="book-grid-2">
              <Field label={t("booking.pickupLocation")}>
                <input
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Sân bay, khách sạn, địa chỉ..."
                      : "Airport, hotel, address..."
                  }
                  className="book-input"
                  required
                />
              </Field>

              <Field label={t("booking.dropoffLocation")}>
                <input
                  name="dropoffLocation"
                  value={form.dropoffLocation}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Nhập điểm đến"
                      : "Enter destination address"
                  }
                  className="book-input"
                  required
                />
              </Field>
            </div>

            <div className="book-grid-3">
              <Field label={t("booking.pickupDate")}>
                <input
                  name="pickupDate"
                  value={form.pickupDate}
                  onChange={handleChange}
                  type="date"
                  className="book-input"
                  required
                />
              </Field>

              <Field label={t("booking.pickupTime")}>
                <input
                  name="pickupTime"
                  value={form.pickupTime}
                  onChange={handleChange}
                  type="time"
                  className="book-input"
                  required
                />
              </Field>

              <Field label={t("booking.luggage")}>
                <select
                  name="luggage"
                  value={form.luggage}
                  onChange={handleChange}
                  className="book-input"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="book-section-block">
            <div className="book-section-label">
              {language === "vi" ? "Ghi chú thêm" : "Additional notes"}
            </div>

            <Field label={t("booking.notes")}>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder={t("booking.notesPlaceholder")}
                className="book-input book-textarea"
              />
            </Field>
          </div>

          <div className="book-form-actions">
            <button
              type="submit"
              className="book-btn book-btn-dark"
              disabled={submitting}
            >
              {submitting
                ? language === "vi"
                  ? "Đang gửi..."
                  : "Submitting..."
                : t("booking.submit")}
            </button>

            <a href={`tel:${siteConfig.phone}`} className="book-btn book-btn-outline">
              {t("booking.callInstead")}
            </a>
          </div>
        </form>

        <aside className="book-side-panel">
          <SideCard
            title={
              language === "vi"
                ? "Vì sao trang này phù hợp cho điện thoại"
                : "Why this page works better on mobile"
            }
            text={
              language === "vi"
                ? "Form đã được chia thành từng nhóm rõ ràng, mỗi trường dễ đọc và dễ bấm hơn, giúp khách đặt xe nhanh hơn trên màn hình nhỏ."
                : "The form is grouped into clearer sections with larger, easier-to-tap fields for a smoother mobile booking experience."
            }
          />

          <SideCard
            title={
              language === "vi"
                ? "Thông tin nên nhập rõ nhất"
                : "Most important details to enter"
            }
            text={
              language === "vi"
                ? "Tên, số điện thoại, điểm đón, điểm đến và thời gian là những phần quan trọng nhất để bạn xử lý booking nhanh và chính xác."
                : "Name, phone number, pickup, dropoff, and pickup time are the most important details for handling a booking quickly and accurately."
            }
          />

          <SideCard
            title={
              language === "vi"
                ? "Liên hệ nhanh"
                : "Quick contact"
            }
            text={
              language === "vi"
                ? "Nếu khách cần gấp, họ vẫn có thể bấm gọi ngay thay vì điền toàn bộ form."
                : "If a rider needs urgent help, they can still call immediately instead of completing the full form."
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

  .book-hero-pills {
    margin-top: 18px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .book-hero-pill {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: #e2e8f0;
    font-size: 12px;
    font-weight: 700;
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

  .book-error-box {
    margin-top: 18px;
    padding: 14px 16px;
    border-radius: 16px;
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
    font-weight: 600;
    line-height: 1.6;
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

    .book-side-panel {
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