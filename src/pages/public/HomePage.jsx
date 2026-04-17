import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";
import { siteConfig } from "../../lib/siteConfig";

export default function HomePage() {
  const { t, language } = useLanguage();

  const services = [
    {
      title: t("services.airportTitle"),
      desc: t("services.airportDesc"),
      icon: "✈️",
    },
    {
      title: t("services.localTitle"),
      desc: t("services.localDesc"),
      icon: "🚘",
    },
    {
      title: t("services.hourlyTitle"),
      desc: t("services.hourlyDesc"),
      icon: "🌙",
    },
    {
      title: language === "vi" ? "Đặt trước dễ dàng" : "Easy Booking",
      desc:
        language === "vi"
          ? "Chỉ vài bước đơn giản để giữ chỗ nhanh chóng."
          : "Reserve your ride in just a few simple steps.",
      icon: "📅",
    },
  ];

  const features = [
    {
      title: t("features.f1Title"),
      desc: t("features.f1Desc"),
    },
    {
      title: t("features.f2Title"),
      desc: t("features.f2Desc"),
    },
    {
      title: t("features.f3Title"),
      desc: t("features.f3Desc"),
    },
    {
      title: t("features.f4Title"),
      desc: t("features.f4Desc"),
    },
  ];

  const reviews = Array.isArray(t("reviews.items")) ? t("reviews.items") : [];

  return (
    <div className="home-v3">
      <section className="hero-v3">
        <div className="hero-v3-image" />
        <div className="hero-v3-overlay" />

        <div className="hero-v3-content">
          <div className="hero-v3-copy">
            <div className="hero-v3-eyebrow">{t("home.eyebrow")}</div>

            <h1 className="hero-v3-title">{t("home.heroTitle")}</h1>

            <p className="hero-v3-desc">{t("home.heroDesc")}</p>

            <div className="hero-v3-actions">
              <Link className="home-btn home-btn-primary" to="/book">
                {t("common.reserveRide")}
              </Link>

              <a
                className="home-btn home-btn-white"
                href={`tel:${siteConfig.phone}`}
              >
                {language === "vi" ? "Gọi ngay" : "Call Now"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-badges">
        <div className="hero-badge">{t("home.meta1")}</div>
        <div className="hero-badge">{t("home.meta2")}</div>
        <div className="hero-badge">{t("home.meta3")}</div>
      </section>

      <section className="section-v3">
        <div className="section-heading centered">
          <h2>{t("home.servicesTitle")}</h2>
          <p>{t("home.servicesDesc")}</p>
        </div>

        <div className="services-grid-v3">
          {services.map((service) => (
            <article className="service-card-v3" key={service.title}>
              <div className="service-icon-v3">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-strip-section">
        <div className="quote-strip">
          <div className="quote-strip-copy">
            <h2>
              {language === "vi" ? "Xem giá nhanh" : "Quick Fare Estimate"}
            </h2>
            <p>
              {language === "vi"
                ? "Nhập điểm đón và điểm đến để tiếp tục đặt xe."
                : "Enter your pickup and dropoff to continue your booking."}
            </p>
          </div>

          <div className="quote-strip-form">
            <div className="fake-input">
              {language === "vi" ? "Nhập địa điểm đón" : "Pickup location"}
            </div>
            <div className="fake-input">
              {language === "vi" ? "Nhập địa điểm đến" : "Dropoff location"}
            </div>
            <Link className="home-btn quote-btn" to="/book">
              {language === "vi" ? "Xem giá" : "Get Quote"}
            </Link>
          </div>

          <div className="quote-strip-notes">
            <span>✓ {t("home.quote1")}</span>
            <span>✓ {t("home.quote2")}</span>
            <span>✓ {t("home.quote3")}</span>
          </div>
        </div>
      </section>

      <section className="section-v3">
        <div className="section-heading">
          <div>
            <h2>{t("home.whyTitle")}</h2>
          </div>
          <p>{t("home.whyDesc")}</p>
        </div>

        <div className="features-grid-v3">
          {features.map((item) => (
            <article className="feature-card-v3" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section-v3">
          <div className="section-heading centered">
            <h2>{t("reviews.title")}</h2>
            <p>{t("reviews.desc")}</p>
          </div>

          <div className="reviews-grid-v3">
            {reviews.slice(0, 3).map((review) => (
              <article
                key={`${review.name}-${review.text}`}
                className="review-card-v3"
              >
                <div className="review-stars-v3">★★★★★</div>
                <p className="review-text-v3">“{review.text}”</p>
                <div className="review-name-v3">{review.name}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="cta-v3">
        <div className="cta-v3-copy">
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaDesc")}</p>
        </div>

        <div className="cta-v3-actions">
          <Link className="home-btn home-btn-primary" to="/book">
            {t("common.continueBooking")}
          </Link>

          <a
            className="home-btn home-btn-outline"
            href={`tel:${siteConfig.phone}`}
          >
            {language === "vi" ? "Gọi ngay" : "Call Now"}
          </a>
        </div>
      </section>

      <style>{`
        .home-v3 {
          display: grid;
          gap: 28px;
        }

        .hero-v3 {
          position: relative;
          min-height: 500px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
        }

        .hero-v3-image {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(10, 30, 60, 0.72), rgba(10, 30, 60, 0.20)),
            url("https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1600&q=80");
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
        }

        .hero-v3-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.18));
        }

        .hero-v3-content {
          position: relative;
          z-index: 2;
          min-height: 500px;
          display: flex;
          align-items: center;
          padding: 54px 56px;
        }

        .hero-v3-copy {
          max-width: 620px;
          color: white;
        }

        .hero-v3-eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.95);
          font-size: 13px;
          font-weight: 800;
          backdrop-filter: blur(10px);
        }

        .hero-v3-title {
          margin: 18px 0 12px;
          font-size: clamp(38px, 5vw, 64px);
          line-height: 1.02;
          letter-spacing: -0.04em;
          color: white;
          max-width: 680px;
          text-shadow: 0 8px 28px rgba(0,0,0,0.16);
        }

        .hero-v3-desc {
          margin: 0;
          max-width: 560px;
          font-size: 18px;
          line-height: 1.75;
          color: rgba(255,255,255,0.92);
        }

        .hero-v3-actions {
          margin-top: 24px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 14px 22px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 800;
          white-space: nowrap;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .home-btn:hover {
          transform: translateY(-1px);
        }

        .home-btn-primary {
          color: white;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 16px 28px rgba(37, 99, 235, 0.28);
        }

        .home-btn-white {
          color: #0f172a;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        }

        .home-btn-outline {
          color: #0f172a;
          background: transparent;
          border: 1px solid rgba(15, 23, 42, 0.14);
        }

        .hero-badges {
          margin-top: -14px;
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 0 20px;
        }

        .hero-badge {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 18px;
          padding: 16px 18px;
          text-align: center;
          font-weight: 700;
          color: #334155;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .section-v3 {
          display: grid;
          gap: 20px;
        }

        .section-heading {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
        }

        .section-heading.centered {
          grid-template-columns: 1fr;
          text-align: center;
          justify-items: center;
        }

        .section-heading h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 44px);
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .section-heading p {
          margin: 0;
          max-width: 700px;
          color: #64748b;
          line-height: 1.8;
        }

        .services-grid-v3 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .service-card-v3 {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 24px;
          padding: 28px 22px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.07);
          text-align: center;
        }

        .service-icon-v3 {
          width: 64px;
          height: 64px;
          margin: 0 auto 18px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          font-size: 28px;
          background: linear-gradient(180deg, #eff6ff, #dbeafe);
        }

        .service-card-v3 h3 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .service-card-v3 p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.75;
        }

        .quote-strip-section {
          display: grid;
        }

        .quote-strip {
          background: linear-gradient(135deg, #0f2d63, #123a82);
          border-radius: 28px;
          padding: 28px;
          color: white;
          box-shadow: 0 24px 60px rgba(18, 58, 130, 0.18);
        }

        .quote-strip-copy h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: -0.03em;
          color: white;
        }

        .quote-strip-copy p {
          margin: 10px 0 0;
          color: rgba(255,255,255,0.82);
          line-height: 1.75;
        }

        .quote-strip-form {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 14px;
        }

        .fake-input {
          min-height: 56px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.96);
          color: #64748b;
          font-weight: 600;
        }

        .quote-btn {
          min-width: 150px;
          color: #0f172a;
          background: linear-gradient(135deg, #fb923c, #f97316);
          box-shadow: 0 16px 28px rgba(249, 115, 22, 0.24);
        }

        .quote-strip-notes {
          margin-top: 16px;
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          color: rgba(255,255,255,0.88);
          font-size: 14px;
          font-weight: 600;
        }

        .features-grid-v3 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .feature-card-v3 {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.07);
        }

        .feature-card-v3 h3 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .feature-card-v3 p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.8;
        }

        .reviews-grid-v3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .review-card-v3 {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.07);
        }

        .review-stars-v3 {
          color: #f59e0b;
          font-size: 18px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .review-text-v3 {
          margin: 14px 0 0;
          color: #334155;
          line-height: 1.85;
        }

        .review-name-v3 {
          margin-top: 16px;
          color: #0f172a;
          font-weight: 800;
        }

        .cta-v3 {
          background: linear-gradient(180deg, #eff6ff, #ffffff);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 28px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.06);
        }

        .cta-v3-copy h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 40px);
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .cta-v3-copy p {
          margin: 10px 0 0;
          max-width: 680px;
          color: #64748b;
          line-height: 1.8;
        }

        .cta-v3-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        @media (max-width: 1100px) {
          .services-grid-v3 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .reviews-grid-v3 {
            grid-template-columns: 1fr;
          }

          .cta-v3 {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 900px) {
          .hero-v3 {
            min-height: 460px;
          }

          .hero-v3-content {
            min-height: 460px;
            padding: 30px 24px;
          }

          .hero-v3-title {
            font-size: 40px;
          }

          .hero-badges {
            grid-template-columns: 1fr;
            padding: 0;
            margin-top: 0;
          }

          .quote-strip-form {
            grid-template-columns: 1fr;
          }

          .features-grid-v3,
          .services-grid-v3 {
            grid-template-columns: 1fr;
          }

          .section-heading {
            grid-template-columns: 1fr;
            align-items: start;
          }
        }

        @media (max-width: 768px) {
          .home-v3 {
            gap: 20px;
          }

          .hero-v3 {
            border-radius: 22px;
            min-height: 420px;
          }

          .hero-v3-content {
            min-height: 420px;
            padding: 24px 18px;
          }

          .hero-v3-title {
            margin: 16px 0 12px;
            font-size: 34px;
            line-height: 1.08;
          }

          .hero-v3-desc {
            font-size: 15px;
            line-height: 1.75;
          }

          .hero-v3-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .home-btn {
            width: 100%;
            min-height: 48px;
            padding: 13px 16px;
          }

          .hero-badge {
            padding: 14px 16px;
            font-size: 14px;
          }

          .service-card-v3,
          .feature-card-v3,
          .review-card-v3 {
            padding: 18px;
            border-radius: 20px;
          }

          .service-card-v3 h3,
          .feature-card-v3 h3 {
            font-size: 20px;
          }

          .service-card-v3 p,
          .feature-card-v3 p,
          .review-text-v3,
          .section-heading p,
          .cta-v3-copy p,
          .quote-strip-copy p {
            font-size: 15px;
            line-height: 1.75;
          }

          .quote-strip {
            border-radius: 22px;
            padding: 20px 18px;
          }

          .cta-v3 {
            padding: 22px 18px;
            border-radius: 22px;
          }

          .cta-v3-actions {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .cta-v3-actions .home-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}