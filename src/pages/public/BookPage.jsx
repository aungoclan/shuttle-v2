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
        ? "Supabase đang chặn quyền gửi booking. Hãy kiểm tra RLS policy cho bảng bookings."
        : "Supabase is blocking booking inserts. Please check the RLS policy for the bookings table.";
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

    if (raw.includes("network")) {
      return language === "vi"
        ? "Kết nối mạng gặp vấn đề. Vui lòng thử lại."
        : "There was a network issue. Please try again.";
    }

    return language === "vi"
      ? `Gửi yêu cầu thất bại: ${error?.message || "Vui lòng kiểm tra lại Supabase và thử lại."}`
      : `Failed to submit booking: ${error?.message || "Please check Supabase and try again."}`;
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
        console.error("Public booking insert error:", error);
        setSubmitError(getFriendlyErrorMessage(error));
        return;
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
      <section
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          padding: 36,
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            color: "white",
            fontSize: 26,
            fontWeight: 800,
            marginBottom: 20,
          }}
        >
          ✓
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 5vw, 40px)",
            letterSpacing: "-0.03em",
          }}
        >
          {t("booking.successTitle")}
        </h1>

        <p
          style={{
            marginTop: 14,
            color: "#64748b",
            lineHeight: 1.8,
            maxWidth: 760,
          }}
        >
          {t("booking.successDesc")}
        </p>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
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

        <div
          style={{
            marginTop: 28,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button onClick={resetForm} style={primaryBtn}>
            {t("booking.submitAnother")}
          </button>

          <a href={`tel:${siteConfig.phone}`} style={ghostBtn}>
            {t("common.callNow")}
          </a>
        </div>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          background:
            "radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 26%), linear-gradient(135deg, #0f172a 0%, #162235 45%, #1f2e46 100%)",
          color: "white",
          borderRadius: 30,
          padding: "38px 28px",
          boxShadow: "0 28px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 24,
          }}
          className="book-hero-grid"
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e2e8f0",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {t("booking.heroBadge")}
            </div>

            <h1
              style={{
                margin: "18px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
              }}
            >
              {t("booking.heroTitle")}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.8,
                maxWidth: 700,
                fontSize: 17,
              }}
            >
              {t("booking.heroDesc")}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: 22,
              alignSelf: "start",
            }}
          >
            <div style={{ fontSize: 14, color: "#cbd5e1", fontWeight: 700 }}>
              {t("booking.highlightTitle")}
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "16px 0 0",
                display: "grid",
                gap: 12,
                color: "#e2e8f0",
                lineHeight: 1.6,
              }}
            >
              <li>✓ {t("booking.highlight1")}</li>
              <li>✓ {t("booking.highlight2")}</li>
              <li>✓ {t("booking.highlight3")}</li>
              <li>✓ {t("booking.highlight4")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 24,
        }}
        className="book-layout-grid"
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 26,
            padding: 28,
            boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 30,
                letterSpacing: "-0.03em",
              }}
            >
              {t("booking.formTitle")}
            </h2>

            <p
              style={{
                marginTop: 10,
                color: "#64748b",
                lineHeight: 1.7,
              }}
            >
              {t("booking.formDesc")}
            </p>
          </div>

          {submitError && (
            <div
              style={{
                marginBottom: 18,
                padding: "14px 16px",
                borderRadius: 16,
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              {submitError}
            </div>
          )}

          <div style={grid2}>
            <Field label={t("booking.fullName")}>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder={
                  language === "vi" ? "Nhập họ và tên" : "Enter your full name"
                }
                style={inputStyle}
                required
              />
            </Field>

            <Field label={t("booking.phone")}>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={siteConfig.phoneDisplay}
                style={inputStyle}
                required
              />
            </Field>
          </div>

          <div style={grid2}>
            <Field label={t("booking.email")}>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                style={inputStyle}
              />
            </Field>

            <Field label={t("booking.serviceType")}>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                style={inputStyle}
              >
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div style={grid2}>
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
                style={inputStyle}
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
                style={inputStyle}
                required
              />
            </Field>
          </div>

          <div style={grid3}>
            <Field label={t("booking.pickupDate")}>
              <input
                name="pickupDate"
                value={form.pickupDate}
                onChange={handleChange}
                type="date"
                style={inputStyle}
                required
              />
            </Field>

            <Field label={t("booking.pickupTime")}>
              <input
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                type="time"
                style={inputStyle}
                required
              />
            </Field>

            <Field label={t("booking.passengers")}>
              <select
                name="passengers"
                value={form.passengers}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
            </Field>
          </div>

          <div style={grid2}>
            <Field label={t("booking.luggage")}>
              <select
                name="luggage"
                value={form.luggage}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
            </Field>

            <Field label={t("booking.preferredContact")}>
              <select
                name="preferredContact"
                value={form.preferredContact}
                onChange={handleChange}
                style={inputStyle}
              >
                {contactOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={t("booking.notes")}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder={t("booking.notesPlaceholder")}
              style={{ ...inputStyle, minHeight: 130, resize: "vertical" }}
            />
          </Field>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              style={{
                ...primaryBtn,
                opacity: submitting ? 0.8 : 1,
                pointerEvents: submitting ? "none" : "auto",
              }}
              disabled={submitting}
            >
              {submitting
                ? language === "vi"
                  ? "Đang gửi..."
                  : "Submitting..."
                : t("booking.submit")}
            </button>

            <a href={`tel:${siteConfig.phone}`} style={ghostBtn}>
              {t("booking.callInstead")}
            </a>
          </div>
        </form>

        <aside
          style={{
            display: "grid",
            gap: 18,
            alignSelf: "start",
          }}
        >
          <SideCard
            title={
              language === "vi"
                ? "Vì sao trang này nhìn chuyên nghiệp hơn"
                : "Why this page feels more premium"
            }
            text={
              language === "vi"
                ? "Bố cục rõ ràng hơn, nhóm trường nhập hợp lý hơn, khoảng trắng đẹp hơn và cảm giác giống một website dịch vụ thật thay vì một form demo đơn giản."
                : "It uses stronger layout grouping, cleaner spacing, and a more real business reservation flow instead of a simple demo form."
            }
          />

          <SideCard
            title={
              language === "vi"
                ? "Bước tiếp theo phù hợp nhất"
                : "Best next step"
            }
            text={
              language === "vi"
                ? "Sau khi submit hoạt động, bước kế tiếp là làm admin bookings page để bạn nhìn thấy danh sách yêu cầu đặt xe."
                : "Once submit works, the next step is building the admin bookings page so you can view all booking requests."
            }
          />

          <SideCard
            title={
              language === "vi"
                ? "Nâng cấp nên làm sau đó"
                : "Recommended upgrade after this"
            }
            text={
              language === "vi"
                ? "Thêm kiểm tra dữ liệu tốt hơn, trạng thái booking, thông báo xác nhận và luồng quản lý booking trong admin."
                : "Add better validation, booking status flow, confirmation messages, and a full admin booking workflow."
            }
          />
        </aside>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .book-layout-grid,
          .book-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 10 }}>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function SideCard({ title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 22,
        padding: 22,
        boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "10px 0 0",
          color: "#64748b",
          lineHeight: 1.7,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(15,23,42,0.06)",
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
          marginTop: 8,
          color: "#0f172a",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 18,
  marginBottom: 18,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 18,
  marginBottom: 18,
};

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

const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "14px 22px",
  fontWeight: 800,
  cursor: "pointer",
  background: "transparent",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.12)",
  textDecoration: "none",
};