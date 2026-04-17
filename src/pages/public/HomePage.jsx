import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";
import { siteConfig } from "../../lib/siteConfig";

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="home2">
      {/* HERO */}
      <section className="hero2">
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>
            {language === "vi"
              ? "Dịch vụ đưa đón sân bay tại Sacramento"
              : "Airport Shuttle Service in Sacramento"}
          </h1>

          <p>
            {language === "vi"
              ? "An toàn • Đúng giờ • Giá rõ ràng"
              : "Safe • On-Time • Transparent Pricing"}
          </p>

          <div className="hero-actions">
            <Link to="/book" className="btn primary">
              {language === "vi" ? "Đặt xe ngay" : "Book Now"}
            </Link>

            <a href={`tel:${siteConfig.phone}`} className="btn light">
              {language === "vi" ? "Gọi nhanh" : "Call Now"}
            </a>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights">
        <div>✈️ {language === "vi" ? "Đưa đón sân bay đúng giờ" : "On-time airport pickup"}</div>
        <div>🚗 {language === "vi" ? "Xe sạch sẽ, rộng rãi" : "Clean & comfortable vehicles"}</div>
        <div>📍 {language === "vi" ? "Đón tận nơi, không chờ đợi" : "Door-to-door service"}</div>
      </section>

      {/* SERVICES */}
      <section className="services2">
        <h2>{language === "vi" ? "Dịch vụ của chúng tôi" : "Our Services"}</h2>

        <div className="grid">
          <div className="card">
            <h3>{language === "vi" ? "Đưa đón sân bay" : "Airport Transfer"}</h3>
            <p>{language === "vi" ? "Không trễ chuyến, không chờ lâu" : "Reliable airport rides"}</p>
          </div>

          <div className="card">
            <h3>{language === "vi" ? "Đi trong thành phố" : "City Ride"}</h3>
            <p>{language === "vi" ? "Linh hoạt, tiện lợi" : "Flexible local trips"}</p>
          </div>

          <div className="card">
            <h3>{language === "vi" ? "Đưa đón ban đêm" : "Late Night Ride"}</h3>
            <p>{language === "vi" ? "An toàn, phục vụ xuyên đêm" : "Safe night service"}</p>
          </div>

          <div className="card">
            <h3>{language === "vi" ? "Đặt trước dễ dàng" : "Easy Booking"}</h3>
            <p>{language === "vi" ? "Chỉ vài bước đơn giản" : "Quick & simple booking"}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta2">
        <h2>
          {language === "vi"
            ? "Sẵn sàng đặt chuyến đi của bạn?"
            : "Ready to book your ride?"}
        </h2>

        <Link to="/book" className="btn primary">
          {language === "vi" ? "Đặt xe ngay" : "Book Now"}
        </Link>
      </section>

      {/* STYLE */}
      <style>{`
        .home2 {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .hero2 {
          position: relative;
          height: 420px;
          border-radius: 20px;
          overflow: hidden;
          background: url("https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1600") center/cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 40px;
          max-width: 700px;
        }

        .hero-content h1 {
          font-size: 40px;
          margin: 0;
        }

        .hero-content p {
          margin: 12px 0 20px;
          font-size: 18px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
        }

        .primary {
          background: #1e40af;
          color: white;
        }

        .light {
          background: white;
          color: #111;
        }

        .highlights {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .highlights div {
          background: #f3f4f6;
          padding: 12px 16px;
          border-radius: 10px;
        }

        .services2 {
          text-align: center;
        }

        .services2 h2 {
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .card {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        .cta2 {
          text-align: center;
          background: #1e3a8a;
          color: white;
          padding: 40px;
          border-radius: 20px;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .hero-content h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}