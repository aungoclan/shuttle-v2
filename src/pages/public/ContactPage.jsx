import { useLanguage } from "../../i18n/LanguageProvider";
import { siteConfig } from "../../lib/siteConfig";

export default function ContactPage() {
  const { language } = useLanguage();

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
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 24,
          }}
          className="contact-hero-grid"
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
              {language === "vi"
                ? "Liên hệ nhanh và rõ ràng"
                : "Clear and easy contact options"}
            </div>

            <h1
              style={{
                margin: "18px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
              }}
            >
              {language === "vi"
                ? "Liên hệ nhanh để đặt xe, hỏi giá hoặc xác nhận chuyến đi."
                : "Contact us quickly to book a ride, request a quote, or confirm your trip."}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.8,
                maxWidth: 720,
                fontSize: 17,
              }}
            >
              {language === "vi"
                ? "Trang này giúp khách hàng gọi điện, nhắn tin hoặc gửi email một cách dễ dàng."
                : "This page makes it easy for customers to call, text, or email."}
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
              {language === "vi" ? "Thông tin nhanh" : "Quick info"}
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "16px 0 0",
                display: "grid",
                gap: 12,
                color: "#e2e8f0",
                lineHeight: 1.7,
              }}
            >
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Hỗ trợ đặt xe sân bay và xe địa phương"
                  : "Support for airport transfer and local rides"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Có thể liên hệ nhanh bằng điện thoại"
                  : "Fast support by phone"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Phù hợp khách cần phản hồi sớm"
                  : "Good for customers who need a quick response"}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
        className="contact-grid"
      >
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 26,
            padding: 28,
            boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              letterSpacing: "-0.03em",
            }}
          >
            {language === "vi" ? "Liên hệ trực tiếp" : "Direct contact"}
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#64748b",
              lineHeight: 1.7,
            }}
          >
            {language === "vi"
              ? "Nếu bạn cần xe gấp hoặc muốn hỏi thêm thông tin, hãy dùng các cách liên hệ dưới đây."
              : "If you need a ride soon or want more information, use one of the contact methods below."}
          </p>

          <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
            <ContactCard
              title={language === "vi" ? "Gọi điện" : "Call"}
              value={siteConfig.phoneDisplay}
              href={`tel:${siteConfig.phone}`}
              actionLabel={language === "vi" ? "Gọi ngay" : "Call now"}
            />

            <ContactCard
              title={language === "vi" ? "Email" : "Email"}
              value={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
              actionLabel={language === "vi" ? "Gửi email" : "Send email"}
            />

            <ContactCard
              title={language === "vi" ? "Khu vực phục vụ" : "Service area"}
              value={
                language === "vi"
                  ? siteConfig.serviceAreaVi
                  : siteConfig.serviceAreaEn
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
            alignSelf: "start",
          }}
        >
          <SideCard
            title={
              language === "vi"
                ? "Khi nào nên gọi trực tiếp"
                : "When to call directly"
            }
            text={
              language === "vi"
                ? "Bạn nên gọi trực tiếp nếu cần xe sớm, muốn xác nhận giờ đón, hoặc cần trao đổi nhanh."
                : "Calling directly is best when you need a ride soon, want to confirm pickup time, or need a quick discussion."
            }
          />

          <SideCard
            title={
              language === "vi"
                ? "Khi nào nên dùng trang Đặt xe"
                : "When to use the Booking page"
            }
            text={
              language === "vi"
                ? "Nếu bạn muốn nhập đầy đủ thông tin điểm đón, điểm đến, ngày giờ, số khách và ghi chú thì nên dùng trang Đặt xe."
                : "Use the Booking page when you want to provide full pickup, destination, date, time, passenger, and note details."
            }
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid,
          .contact-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function ContactCard({ title, value, href, actionLabel }) {
  const isLink = Boolean(href);

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 22,
        padding: 20,
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
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#0f172a",
          fontWeight: 800,
          fontSize: 20,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>

      {isLink && (
        <a
          href={href}
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            padding: "12px 18px",
            fontWeight: 800,
            cursor: "pointer",
            background: "linear-gradient(135deg, #0f172a, #22314a)",
            color: "white",
            textDecoration: "none",
            boxShadow: "0 18px 30px rgba(15, 23, 42, 0.12)",
          }}
        >
          {actionLabel}
        </a>
      )}
    </div>
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