import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAuth } from "../auth/AuthProvider";
import { siteConfig } from "../lib/siteConfig";

export default function PublicLayout() {
  const currentWidth =
    typeof window !== "undefined" ? window.innerWidth : 0;  
const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="page-shell">
      <div className="debug-viewport-badge">
        width: {currentWidth}px
      </div>
      <header className="site-header">
        <div className="container header-inner desktop-header">
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
            <LanguageSwitch language={language} setLanguage={setLanguage} />

            <a className="btn btn-ghost" href={`tel:${siteConfig.phone}`}>
              {t("common.callNow")}
            </a>

            <Link className="btn btn-primary" to="/book">
              {t("common.reserveRide")}
            </Link>
          </div>
        </div>

        <div className="container mobile-topbar">
          <Link to="/" className="mobile-brand" onClick={closeMobileMenu}>
            <div className="brand-badge">S</div>
            <div className="mobile-brand-text">
              <div className="mobile-brand-title">{siteConfig.brand}</div>
              <div className="mobile-brand-subtitle">{tagline}</div>
            </div>
          </Link>

          <div className="mobile-topbar-actions">
            <div className="mobile-language-wrap">
              <LanguageSwitch language={language} setLanguage={setLanguage} compact />
            </div>

            <button
              className="mobile-menu-button"
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "show" : ""}`}
        onClick={closeMobileMenu}
      />

      <aside className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div>
            <div className="mobile-drawer-title">{siteConfig.brand}</div>
            <div className="mobile-drawer-subtitle">{tagline}</div>
          </div>

          <button
            className="mobile-drawer-close"
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <Link to="/" onClick={closeMobileMenu}>
            {t("common.home")}
          </Link>
          <Link to="/services" onClick={closeMobileMenu}>
            {language === "vi" ? "Dịch vụ" : "Services"}
          </Link>
          <Link to="/about" onClick={closeMobileMenu}>
            {language === "vi" ? "Giới thiệu" : "About"}
          </Link>
          <Link to="/book" onClick={closeMobileMenu}>
            {t("common.book")}
          </Link>
          <Link to="/contact" onClick={closeMobileMenu}>
            {t("common.contact")}
          </Link>
          {user && isAdmin && (
            <Link to="/admin" onClick={closeMobileMenu}>
              {t("common.admin")}
            </Link>
          )}
        </nav>

        <div className="mobile-drawer-actions">
          <a href={`tel:${siteConfig.phone}`} className="mobile-drawer-call">
            {t("common.callNow")}
          </a>

          <Link to="/book" className="mobile-drawer-book" onClick={closeMobileMenu}>
            {t("common.reserveRide")}
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <div className="container content-container">
         <div style={{ background: "red", color: "white", padding: 12, fontWeight: 800}}>
		MOBILE LAYOUT ACTIVE
	 </div>
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-grid">
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
                  <div className="brand-title" style={{ color: "white", fontSize: 16 }}>
                    {siteConfig.brand}
                  </div>
                  <div className="brand-subtitle" style={{ color: "#94a3b8" }}>
                    {tagline}
                  </div>
                </div>
              </div>

              <p className="footer-summary">{footerContent.serviceSummary}</p>
            </div>

            <div>
              <h3 className="footer-heading">{footerContent.quickLinks}</h3>
              <div className="footer-links">
                <FooterLink to="/">{t("common.home")}</FooterLink>
                <FooterLink to="/services">{footerContent.services}</FooterLink>
                <FooterLink to="/about">{footerContent.about}</FooterLink>
                <FooterLink to="/book">{footerContent.booking}</FooterLink>
                <FooterLink to="/contact">{footerContent.contact}</FooterLink>
              </div>
            </div>

            <div>
              <h3 className="footer-heading">{footerContent.contactInfo}</h3>
              <div className="footer-links">
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
              <h3 className="footer-heading">{footerContent.serviceInfo}</h3>
              <div className="footer-links">
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

          <div className="footer-bottom">
            <div>
              © 2026 {siteConfig.brand}. {footerContent.rights}
            </div>

            <div className="footer-bottom-links">
              <Link to="/services">{footerContent.services}</Link>
              <Link to="/about">{footerContent.about}</Link>
              <Link to="/contact">{footerContent.contact}</Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="mobile-floating-cta">
        <div className="mobile-floating-cta-inner">
          <a href={`tel:${siteConfig.phone}`} className="mobile-floating-call">
            {t("common.callNow")}
          </a>

          <Link to="/book" className="mobile-floating-book">
            {t("common.reserveRide")}
          </Link>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 80;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(15,23,42,0.08);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 84px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-badge {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #0f172a, #22314a);
          color: white;
          font-weight: 800;
          flex-shrink: 0;
        }

        .brand-title {
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          color: #64748b;
          font-size: 13px;
          line-height: 1.4;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav a {
          text-decoration: none;
          color: #0f172a;
          font-weight: 700;
          font-size: 15px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 12px 18px;
          font-weight: 800;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .btn-ghost {
          color: #0f172a;
          border: 1px solid rgba(15,23,42,0.12);
          background: white;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0f172a, #22314a);
          color: white;
          box-shadow: 0 18px 30px rgba(15, 23, 42, 0.16);
        }

        .mobile-topbar,
        .mobile-drawer,
        .mobile-drawer-overlay,
        .mobile-floating-cta {
          display: none;
        }

        .content-container {
          padding-top: 24px;
          padding-bottom: 32px;
        }

        .site-footer {
          margin-top: 32px;
          background: #0f172a;
          color: #e2e8f0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .footer-container {
          padding: 42px 0 20px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.9fr 1fr;
          gap: 24px;
        }

        .footer-heading {
          margin: 0;
          font-size: 16px;
          color: white;
          letter-spacing: -0.01em;
        }

        .footer-links {
          margin-top: 16px;
          display: grid;
          gap: 12px;
        }

        .footer-summary {
          margin: 16px 0 0;
          color: #cbd5e1;
          line-height: 1.8;
          max-width: 360px;
        }

        .footer-bottom {
          margin-top: 28px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          color: #94a3b8;
          font-size: 14px;
        }

        .footer-bottom-links {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-bottom-links a {
          color: #94a3b8;
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .nav {
            gap: 16px;
          }

          .nav a {
            font-size: 14px;
          }

          .header-actions .btn {
            padding: 11px 14px;
          }
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .desktop-header {
            display: none;
          }

          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-height: 78px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            min-width: 0;
          }

          .mobile-brand-text {
            min-width: 0;
          }

          .mobile-brand-title {
            color: #0f172a;
            font-weight: 800;
            font-size: 15px;
            letter-spacing: -0.02em;
          }

          .mobile-brand-subtitle {
            color: #64748b;
            font-size: 12px;
            line-height: 1.35;
          }

          .mobile-topbar-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
          }

          .mobile-language-wrap {
            min-width: 96px;
          }

          .mobile-menu-button {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            border: 1px solid rgba(15,23,42,0.1);
            background: white;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
          }

          .mobile-menu-button span {
            width: 18px;
            height: 2px;
            background: #0f172a;
            border-radius: 2px;
          }

          .mobile-drawer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15,23,42,0.32);
            z-index: 90;
            opacity: 0;
            pointer-events: none;
            transition: 0.25s ease;
          }

          .mobile-drawer-overlay.show {
            display: block;
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-drawer {
            display: block;
            position: fixed;
            top: 0;
            right: 0;
            width: min(84vw, 360px);
            height: 100vh;
            background: white;
            z-index: 100;
            padding: 22px 18px 28px;
            box-shadow: -10px 0 30px rgba(15,23,42,0.12);
            transform: translateX(100%);
            transition: transform 0.28s ease;
          }

          .mobile-drawer.open {
            transform: translateX(0);
          }

          .mobile-drawer-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 18px;
          }

          .mobile-drawer-title {
            color: #0f172a;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }

          .mobile-drawer-subtitle {
            margin-top: 4px;
            color: #64748b;
            font-size: 13px;
            line-height: 1.5;
          }

          .mobile-drawer-close {
            border: 0;
            background: #f8fafc;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            cursor: pointer;
            color: #0f172a;
            font-size: 18px;
          }

          .mobile-drawer-nav {
            display: grid;
            gap: 8px;
          }

          .mobile-drawer-nav a {
            text-decoration: none;
            color: #0f172a;
            font-weight: 700;
            padding: 14px 12px;
            border-radius: 14px;
            background: #f8fafc;
          }

          .mobile-drawer-actions {
            margin-top: 18px;
            display: grid;
            gap: 10px;
          }

          .mobile-drawer-call,
          .mobile-drawer-book {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 800;
          }

          .mobile-drawer-call {
            border: 1px solid rgba(15,23,42,0.12);
            color: #0f172a;
            background: white;
          }

          .mobile-drawer-book {
            background: linear-gradient(135deg, #0f172a, #22314a);
            color: white;
          }

          .content-container {
            padding-top: 16px;
            padding-bottom: 96px;
          }

          .mobile-floating-cta {
            display: block;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 85;
            padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(15,23,42,0.08);
          }

          .mobile-floating-cta-inner {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            max-width: 720px;
            margin: 0 auto;
          }

          .mobile-floating-call,
          .mobile-floating-book {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            border-radius: 999px;
            font-weight: 800;
            text-decoration: none;
          }

          .mobile-floating-call {
            border: 1px solid rgba(15,23,42,0.12);
            color: #0f172a;
            background: white;
          }

          .mobile-floating-book {
            background: linear-gradient(135deg, #0f172a, #22314a);
            color: white;
            box-shadow: 0 18px 30px rgba(15, 23, 42, 0.16);
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }
.debug-viewport-badge {
          position: fixed;
          top: 8px;
          left: 8px;
          z-index: 9999;
          background: #dc2626;
          color: white;
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(0,0,0,0.18);
        }

        @media (max-width: 768px) {
          .debug-viewport-badge {
            background: #16a34a;
          }
        }
        }
      `}
        </style>
    </div>
  );
}

function LanguageSwitch({ language, setLanguage, compact = false }) {
  return (
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
          padding: compact ? "9px 12px" : "10px 14px",
          border: 0,
          cursor: "pointer",
          background: language === "vi" ? "#0f172a" : "transparent",
          color: language === "vi" ? "white" : "#0f172a",
          fontWeight: 700,
          fontSize: compact ? 13 : 14,
        }}
      >
        VI
      </button>
      <button
        onClick={() => setLanguage("en")}
        style={{
          padding: compact ? "9px 12px" : "10px 14px",
          border: 0,
          cursor: "pointer",
          background: language === "en" ? "#0f172a" : "transparent",
          color: language === "en" ? "white" : "#0f172a",
          fontWeight: 700,
          fontSize: compact ? 13 : 14,
        }}
      >
        EN
      </button>
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