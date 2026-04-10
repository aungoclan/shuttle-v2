import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function HomePage() {
  const { t } = useLanguage();

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

  const reviews = t("reviews.items");

  return (
    <div>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">{t("home.eyebrow")}</div>

            <h1>{t("home.heroTitle")}</h1>

            <p>{t("home.heroDesc")}</p>

            <div className="hero-actions">
              <Link className="btn btn-accent" to="/book">
                {t("common.reserveRide")}
              </Link>

              <a
                className="btn"
                href="tel:+19160000000"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.24)",
                }}
              >
                {t("common.immediatePickup")}
              </a>
            </div>

            <div className="hero-meta">
              <div className="meta-pill">{t("home.meta1")}</div>
              <div className="meta-pill">{t("home.meta2")}</div>
              <div className="meta-pill">{t("home.meta3")}</div>
            </div>
          </div>

          <div className="quote-card">
            <div className="quote-top">
              <div>
                <div className="quote-badge">{t("home.quoteBadge")}</div>
                <div className="quote-price">{t("home.quotePrice")}</div>
                <div className="quote-label">{t("home.quoteLabel")}</div>
              </div>
            </div>

            <ul className="quote-list">
              <li>✓ {t("home.quote1")}</li>
              <li>✓ {t("home.quote2")}</li>
              <li>✓ {t("home.quote3")}</li>
              <li>✓ {t("home.quote4")}</li>
            </ul>

            <div style={{ marginTop: 22 }}>
              <Link className="btn btn-primary" to="/book">
                {t("common.continueBooking")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">{t("home.stats1")}</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">Fast</div>
            <div className="stat-label">{t("home.stats2")}</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">Clean</div>
            <div className="stat-label">{t("home.stats3")}</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">Local</div>
            <div className="stat-label">{t("home.stats4")}</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>{t("home.servicesTitle")}</h2>
          </div>
          <p>{t("home.servicesDesc")}</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <Link className="service-link" to="/services">
                {t("services.requestService")}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>{t("home.whyTitle")}</h2>
          </div>
          <p>{t("home.whyDesc")}</p>
        </div>

        <div className="features-grid">
          {features.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>{t("reviews.title")}</h2>
          </div>
          <p>{t("reviews.desc")}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
          className="reviews-grid"
        >
          {Array.isArray(reviews) &&
            reviews.map((review) => (
              <article
                key={`${review.name}-${review.text}`}
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
                    fontSize: 18,
                    letterSpacing: "2px",
                    color: "#d4a017",
                    fontWeight: 800,
                  }}
                >
                  ★★★★★
                </div>

                <p
                  style={{
                    margin: "14px 0 0",
                    color: "#334155",
                    lineHeight: 1.8,
                  }}
                >
                  “{review.text}”
                </p>

                <div
                  style={{
                    marginTop: 16,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  {review.name}
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaDesc")}</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/book">
            {t("common.continueBooking")}
          </Link>

          <a className="btn btn-ghost" href="tel:+19160000000">
            {t("common.callNow")}
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}