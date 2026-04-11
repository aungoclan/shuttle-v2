import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";
import { siteConfig } from "../../lib/siteConfig";

export default function HomePage() {
  const { t, language } = useLanguage();

  const services = [
    {
      title: t("services.airportTitle"),
      desc: t("services.airportDesc"),
      icon: "A",
    },
    {
      title: t("services.localTitle"),
      desc: t("services.localDesc"),
      icon: "L",
    },
    {
      title: t("services.hourlyTitle"),
      desc: t("services.hourlyDesc"),
      icon: "H",
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
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-eyebrow">{t("home.eyebrow")}</div>

            <h1 className="home-hero-title">{t("home.heroTitle")}</h1>

            <p className="home-hero-desc">{t("home.heroDesc")}</p>

            <div className="home-hero-actions">
              <Link className="home-btn home-btn-primary" to="/book">
                {t("common.reserveRide")}
              </Link>

              <a
                className="home-btn home-btn-light"
                href={`tel:${siteConfig.phone}`}
              >
                {t("common.immediatePickup")}
              </a>
            </div>

            <div className="home-hero-meta">
              <div className="home-meta-pill">{t("home.meta1")}</div>
              <div className="home-meta-pill">{t("home.meta2")}</div>
              <div className="home-meta-pill">{t("home.meta3")}</div>
            </div>
          </div>

          <div className="home-hero-card">
            <div className="home-hero-card-top">
              <div>
                <div className="home-quote-badge">{t("home.quoteBadge")}</div>
                <div className="home-quote-price">{t("home.quotePrice")}</div>
                <div className="home-quote-label">{t("home.quoteLabel")}</div>
              </div>
            </div>

            <ul className="home-quote-list">
              <li>✓ {t("home.quote1")}</li>
              <li>✓ {t("home.quote2")}</li>
              <li>✓ {t("home.quote3")}</li>
              <li>✓ {t("home.quote4")}</li>
            </ul>

            <div className="home-hero-card-actions">
              <Link className="home-btn home-btn-dark" to="/book">
                {t("common.continueBooking")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-stats-section">
        <div className="home-stats-grid">
          <div className="home-stat-card">
            <div className="home-stat-value">24/7</div>
            <div className="home-stat-label">{t("home.stats1")}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Fast</div>
            <div className="home-stat-label">{t("home.stats2")}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Clean</div>
            <div className="home-stat-label">{t("home.stats3")}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Local</div>
            <div className="home-stat-label">{t("home.stats4")}</div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>{t("home.servicesTitle")}</h2>
          </div>
          <p>{t("home.servicesDesc")}</p>
        </div>

        <div className="home-services-grid">
          {services.map((service) => (
            <article className="home-service-card" key={service.title}>
              <div className="home-service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <Link className="home-service-link" to="/services">
                {t("services.requestService")}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>{t("home.whyTitle")}</h2>
          </div>
          <p>{t("home.whyDesc")}</p>
        </div>

        <div className="home-features-grid">
          {features.map((item) => (
            <article className="home-feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>{t("reviews.title")}</h2>
          </div>
          <p>{t("reviews.desc")}</p>
        </div>

        <div className="home-reviews-grid">
          {reviews.map((review) => (
            <article
              key={`${review.name}-${review.text}`}
              className="home-review-card"
            >
              <div className="home-review-stars">★★★★★</div>

              <p className="home-review-text">“{review.text}”</p>

              <div className="home-review-name">{review.name}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta-panel">
        <div className="home-cta-copy">
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaDesc")}</p>
        </div>

        <div className="home-cta-actions">
          <Link className="home-btn home-btn-dark" to="/book">
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
        .home-page {
          display: grid;
          gap: 24px;
        }

        .home-section {
          display: grid;
          gap: 18px;
        }

        .home-hero {
          background:
            radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 26%),
            linear-gradient(135deg, #0f172a 0%, #162235 45%, #1f2e46 100%);
          color: white;
          border-radius: 30px;
          padding: 38px 28px;
          box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
          overflow: hidden;
        }

        .home-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          align-items: center;
        }

        .home-eyebrow {
          display: inline-flex;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 700;
        }

        .home-hero-title {
          margin: 18px 0 14px;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.04;
          letter-spacing: -0.04em;
          max-width: 720px;
        }

        .home-hero-desc {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.8;
          max-width: 700px;
          font-size: 17px;
        }

        .home-hero-actions {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 14px 20px;
          border-radius: 999px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }

        .home-btn-primary {
          background: linear-gradient(135deg, #d4a017, #f0c14b);
          color: #111827;
          box-shadow: 0 16px 30px rgba(212,160,23,0.22);
        }

        .home-btn-light {
          background: rgba(255,255,255,0.08);
          color: white;
          border: 1px solid rgba(255,255,255,0.24);
        }

        .home-btn-dark {
          background: linear-gradient(135deg, #0f172a, #22314a);
          color: white;
          box-shadow: 0 18px 30px rgba(15, 23, 42, 0.16);
        }

        .home-btn-outline {
          background: transparent;
          color: #0f172a;
          border: 1px solid rgba(15,23,42,0.12);
        }

        .home-hero-meta {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .home-meta-pill {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 700;
        }

        .home-hero-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 26px;
          padding: 24px;
          align-self: stretch;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .home-quote-badge {
          font-size: 13px;
          color: #cbd5e1;
          font-weight: 700;
        }

        .home-quote-price {
          margin-top: 10px;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: white;
        }

        .home-quote-label {
          margin-top: 6px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        .home-quote-list {
          list-style: none;
          padding: 0;
          margin: 22px 0 0;
          display: grid;
          gap: 12px;
          color: #e2e8f0;
          line-height: 1.7;
        }

        .home-hero-card-actions {
          margin-top: 22px;
        }

        .home-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .home-stat-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 18px 40px rgba(15,23,42,0.08);
        }

        .home-stat-value {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .home-stat-label {
          margin-top: 8px;
          color: #64748b;
          line-height: 1.6;
          font-weight: 700;
        }

        .home-section-heading {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: end;
        }

        .home-section-heading h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .home-section-heading p {
          margin: 0;
          max-width: 560px;
          color: #64748b;
          line-height: 1.8;
        }

        .home-services-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .home-service-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
        }

        .home-service-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #0f172a, #22314a);
          color: white;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .home-service-card h3 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .home-service-card p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.75;
        }

        .home-service-link {
          margin-top: 16px;
          display: inline-flex;
          color: #0f172a;
          font-weight: 800;
          text-decoration: none;
        }

        .home-features-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .home-feature-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
        }

        .home-feature-card h3 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .home-feature-card p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.75;
        }

        .home-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .home-review-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
        }

        .home-review-stars {
          font-size: 18px;
          letter-spacing: 2px;
          color: #d4a017;
          font-weight: 800;
        }

        .home-review-text {
          margin: 14px 0 0;
          color: #334155;
          line-height: 1.8;
        }

        .home-review-name {
          margin-top: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .home-cta-panel {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 28px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
        }

        .home-cta-copy h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 40px);
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .home-cta-copy p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.8;
          max-width: 640px;
        }

        .home-cta-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .home-hero-grid {
            grid-template-columns: 1fr;
          }

          .home-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-services-grid {
            grid-template-columns: 1fr;
          }

          .home-reviews-grid {
            grid-template-columns: 1fr;
          }

          .home-cta-panel {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .home-page {
            gap: 20px;
          }

          .home-hero {
            border-radius: 24px;
            padding: 24px 18px;
          }

          .home-hero-grid {
            gap: 18px;
          }

          .home-eyebrow {
            font-size: 12px;
            padding: 9px 12px;
          }

          .home-hero-title {
            margin: 16px 0 12px;
            font-size: 34px;
            line-height: 1.08;
          }

          .home-hero-desc {
            font-size: 15px;
            line-height: 1.75;
          }

          .home-hero-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .home-btn {
            width: 100%;
            min-height: 48px;
            padding: 13px 16px;
          }

          .home-hero-meta {
            gap: 8px;
          }

          .home-meta-pill {
            font-size: 12px;
            min-height: 34px;
            padding: 7px 10px;
          }

          .home-hero-card {
            padding: 18px;
            border-radius: 22px;
          }

          .home-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .home-stat-card {
            padding: 18px;
            border-radius: 18px;
          }

          .home-stat-value {
            font-size: 24px;
          }

          .home-section-heading {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .home-section-heading h2 {
            font-size: 30px;
          }

          .home-section-heading p {
            max-width: none;
            font-size: 15px;
            line-height: 1.75;
          }

          .home-services-grid,
          .home-features-grid,
          .home-reviews-grid {
            grid-template-columns: 1fr;
          }

          .home-service-card,
          .home-feature-card,
          .home-review-card {
            padding: 18px;
            border-radius: 20px;
          }

          .home-service-card h3,
          .home-feature-card h3 {
            font-size: 19px;
          }

          .home-service-card p,
          .home-feature-card p,
          .home-review-text {
            font-size: 15px;
            line-height: 1.75;
          }

          .home-cta-panel {
            padding: 20px 18px;
            border-radius: 22px;
          }

          .home-cta-copy h2 {
            font-size: 28px;
          }

          .home-cta-copy p {
            font-size: 15px;
            line-height: 1.75;
          }

          .home-cta-actions {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .home-cta-actions .home-btn {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .home-hero-title {
            font-size: 30px;
          }

          .home-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}