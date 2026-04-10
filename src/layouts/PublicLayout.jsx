import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAuth } from "../auth/AuthProvider";
import { siteConfig } from "../lib/siteConfig";

export default function PublicLayout() {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const footerContent =
    language === "vi"
      ? {
          quickLinks: "Liên kết nhanh",
          contactInfo: "Thông tin liên hệ",
          serviceInfo: "Thông tin dịch vụ",
          services: "Dịch vụ",
          about: "Giới thiệu",
          booking: "Đặt xe",
          contact: "Liên hệ",
          serviceArea: "Khu vực phục vụ",
          serviceAreaValue: siteConfig.serviceAreaVi,
          supportHours: "Hỗ trợ",
          supportHoursValue: siteConfig.supportTextVi,
          serviceSummary:
            "Dịch vụ đưa đón sân bay và di chuyển địa phương với trải nghiệm rõ ràng, dễ liên hệ và chuyên nghiệp hơn.",
          rights: "Tất cả quyền được bảo lưu.",
        }
      : {
          quickLinks: "Quick links",
          contactInfo: "Contact information",
          serviceInfo: "Service information",
          services: "Services",
          about: "About",
          booking: "Booking",
          contact: "Contact",
          serviceArea: "Service area",
          serviceAreaValue: siteConfig.serviceAreaEn,
          supportHours: "Support",
          supportHoursValue: siteConfig.supportTextEn,
          serviceSummary:
            "Airport transfer and local transportation with a clearer, easier, and more professional customer experience.",
          rights: "All rights reserved.",
        };

  const tagline =
    language === "vi" ? siteConfig.taglineVi : siteConfig.taglineEn;

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-badge">S</div>
            <div className="brand-text">
              <div className="brand-title">{siteConfig.brand}</div>
              <div className="brand-subtitle">{tagline}</div>
            </div>
          </div>

          <nav className="nav">
            <Link to="/">{t("common.home")}</Link>
            <Link to="/services">{language === "vi" ? "Dịch vụ" : "Services"}</Link>
            <Link to="/about">{language === "vi" ? "Giới thiệu" : "About"}</Link>
            <Link to="/book">{t("common.book")}</Link>
            <Link to="/contact">{t("common.contact")}</Link>

            {user && isAdmin && <Link to="/admin">{t("common.admin")}</Link>}
          </nav>

          <div className="header-actions" style={{ flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                border: "1px solid rgba(15,23,42,0.12)",
                borderRadius: 999,
                overflow: "hidden",
                background: "white",
              }}
            >
              <button
                onClick={() => setLanguage("vi")}
                style={{
                  padding: "10px 14px",
                  border: 0,
                  cursor: "pointer",
                  background: language === "vi" ? "#0f172a" : "transparent",
                  color: language === "vi" ? "white" : "#0f172a",
                  fontWeight: 700,
                }}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage("en")}
                style={{
                  padding: "10px 14px",
                  border: 0,
                  cursor: "pointer",
                  background: language === "en" ? "#0f172a" : "transparent",
                  color: language === "en" ? "white" : "#0f172a",
                  fontWeight: 700,
                }}
              >
                EN
              </button>
            </div>

            <a className="btn btn-ghost" href={`tel:${siteConfig.phone}`}>
              {t("common.callNow")}
            </a>

            <Link className="btn btn-primary" to="/book">
              {t("common.reserveRide")}
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer
        style={{
          marginTop: 32,
          background: "#0f172a",
          color: "#e2e8f0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="container"
          style={{
            padding: "42px 0 20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr 0.9fr 1fr",
              gap: 24,
            }}
            className="footer-grid"
          >
            <div>
              <div className="brand" style={{ alignItems: "flex-start" }}>
                <div
                  className="brand-badge"
                  style={{
                    background: "linear-gradient(135deg, #ffffff, #cbd5e1)",
                    color: "#0f172a",
                  }}
                >
                  S
                </div>

                <div className="brand-text">
                  <div
                    className="brand-title"
                    style={{ color: "white", fontSize: 16 }}
                  >
                    {siteConfig.brand}
                  </div>
                  <div
                    className="brand-subtitle"
                    style={{ color: "#94a3b8" }}
                  >
                    {tagline}
                  </div>
                </div>
              </div>

              <p
                style={{
                  margin: "16px 0 0",
                  color: "#cbd5e1",
                  lineHeight: 1.8,
                  maxWidth: 360,
                }}
              >
                {footerContent.serviceSummary}
              </p>
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                {footerContent.quickLinks}
              </h3>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 12,
                }}
              >
                <FooterLink to="/">{t("common.home")}</FooterLink>
                <FooterLink to="/services">{footerContent.services}</FooterLink>
                <FooterLink to="/about">{footerContent.about}</FooterLink>
                <FooterLink to="/book">{footerContent.booking}</FooterLink>
                <FooterLink to="/contact">{footerContent.contact}</FooterLink>
              </div>
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                {footerContent.contactInfo}
              </h3>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <FooterInfo
                  label={language === "vi" ? "Điện thoại" : "Phone"}
                  value={siteConfig.phoneDisplay}
                  href={`tel:${siteConfig.phone}`}
                />
                <FooterInfo
                  label="Email"
                  value={siteConfig.email}
                  href={`mailto:${siteConfig.email}`}
                />
              </div>
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                {footerContent.serviceInfo}
              </h3>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <FooterInfo
                  label={footerContent.serviceArea}
                  value={footerContent.serviceAreaValue}
                />
                <FooterInfo
                  label={footerContent.supportHours}
                  value={footerContent.supportHoursValue}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            <div>
              © 2026 {siteConfig.brand}. {footerContent.rights}
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link
                to="/services"
                style={{ color: "#94a3b8", textDecoration: "none" }}
              >
                {footerContent.services}
              </Link>
              <Link
                to="/about"
                style={{ color: "#94a3b8", textDecoration: "none" }}
              >
                {footerContent.about}
              </Link>
              <Link
                to="/contact"
                style={{ color: "#94a3b8", textDecoration: "none" }}
              >
                {footerContent.contact}
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .footer-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .footer-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </footer>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(15,23,42,0.08)",
          display: "none",
        }}
        className="mobile-floating-cta"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <a
            href={`tel:${siteConfig.phone}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              padding: "14px 16px",
              fontWeight: 800,
              background: "transparent",
              color: "#0f172a",
              border: "1px solid rgba(15,23,42,0.12)",
              textDecoration: "none",
            }}
          >
            {t("common.callNow")}
          </a>

          <Link
            to="/book"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              padding: "14px 16px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #0f172a, #22314a)",
              color: "white",
              textDecoration: "none",
              boxShadow: "0 18px 30px rgba(15, 23, 42, 0.16)",
            }}
          >
            {t("common.reserveRide")}
          </Link>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-floating-cta {
              display: block !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: "#cbd5e1",
        textDecoration: "none",
        lineHeight: 1.6,
      }}
    >
      {children}
    </Link>
  );
}

function FooterInfo({ label, value, href }) {
  const content = href ? (
    <a
      href={href}
      style={{
        color: "#e2e8f0",
        textDecoration: "none",
        lineHeight: 1.6,
        wordBreak: "break-word",
      }}
    >
      {value}
    </a>
  ) : (
    <div
      style={{
        color: "#e2e8f0",
        lineHeight: 1.6,
        wordBreak: "break-word",
      }}
    >
      {value}
    </div>
  );

  return (
    <div>
      <div
        style={{
          fontSize: 13,
          color: "#94a3b8",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {content}
    </div>
  );
}