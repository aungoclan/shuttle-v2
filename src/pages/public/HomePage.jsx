import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";
import { siteConfig } from "../../lib/siteConfig";

export default function HomePage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const copy = isVi
    ? {
        eyebrow: "Đưa đón sân bay & xe riêng tại Sacramento",
        heroTitle: "Dịch vụ đưa đón sân bay và xe riêng đáng tin cậy tại Sacramento",
        heroDesc:
          "Đặt xe nhanh chóng, đón đúng giờ và di chuyển êm ái. Phù hợp cho chuyến sân bay, đi lại hằng ngày hoặc lịch trình riêng theo nhu cầu.",
        reserveRide: "Đặt xe ngay",
        immediatePickup: "Gọi ngay",
        meta1: "Đặt trước dễ dàng",
        meta2: "Phản hồi nhanh",
        meta3: "Phục vụ linh hoạt",
        quoteBadge: "Đặt xe nhanh & rõ ràng",
        quotePrice: "Nhanh • Gọn • An tâm",
        quoteLabel:
          "Gửi yêu cầu đặt xe trực tuyến và nhận xác nhận rõ ràng cho hành trình của bạn.",
        quote1: "Đưa đón sân bay đúng giờ",
        quote2: "Đi lại riêng tư, thoải mái",
        quote3: "Hỗ trợ chuyến sớm hoặc khuya",
        quote4: "Liên hệ nhanh, đặt xe dễ",
        continueBooking: "Tiếp tục đặt xe",

        stats1: "Hỗ trợ lịch trình linh hoạt",
        stats2: "Xác nhận nhanh",
        stats3: "Trải nghiệm gọn gàng, thoải mái",
        stats4: "Phục vụ khu vực Sacramento",

        servicesTitle: "Dịch vụ vận chuyển",
        servicesDesc:
          "Giải pháp di chuyển đơn giản, riêng tư và thuận tiện cho nhu cầu sân bay, đi lại trong thành phố hoặc hành trình xa.",
        services: [
          {
            title: "Đưa đón sân bay",
            desc: "Di chuyển đúng giờ đến hoặc từ sân bay với quy trình đặt xe rõ ràng và thuận tiện.",
            icon: "A",
          },
          {
            title: "Xe riêng theo nhu cầu",
            desc: "Phù hợp cho công việc, thăm gia đình, hẹn gặp, mua sắm hoặc các chuyến đi cần sự chủ động.",
            icon: "P",
          },
          {
            title: "Chuyến đi đường dài",
            desc: "Lựa chọn thoải mái và riêng tư cho các hành trình giữa các thành phố hoặc điểm đến xa hơn.",
            icon: "L",
          },
        ],
        requestService: "Xem dịch vụ",

        whyTitle: "Vì sao khách chọn dịch vụ này",
        whyDesc:
          "Tập trung vào trải nghiệm dễ đặt, dễ liên hệ và hành trình rõ ràng hơn cho khách hàng.",
        features: [
          {
            title: "Đúng giờ và đáng tin cậy",
            desc: "Ưu tiên thời gian đón chính xác để bạn yên tâm hơn cho các chuyến sân bay và lịch hẹn quan trọng.",
          },
          {
            title: "Đặt xe đơn giản",
            desc: "Biểu mẫu đặt xe nhanh gọn, dễ dùng trên điện thoại hoặc máy tính, không rườm rà.",
          },
          {
            title: "Liên hệ rõ ràng",
            desc: "Thông tin chuyến đi được xác nhận rõ ràng để bạn dễ theo dõi và chủ động sắp xếp thời gian.",
          },
          {
            title: "Linh hoạt theo lịch trình",
            desc: "Phù hợp cho các chuyến sáng sớm, tối muộn hoặc nhu cầu di chuyển theo khung giờ riêng.",
          },
        ],

        reviewsTitle: "Khách hàng nói gì",
        reviewsDesc:
          "Phản hồi thực tế về trải nghiệm đặt xe, liên hệ và hành trình.",
        reviews: [
          {
            name: "Khách hàng tại Sacramento",
            text: "Đặt xe nhanh, liên hệ rõ ràng và đến đúng giờ. Trải nghiệm rất yên tâm cho chuyến sân bay.",
          },
          {
            name: "Khách đi chuyến sáng sớm",
            text: "Quy trình đơn giản, phản hồi nhanh và chuyến đi rất thoải mái. Mình sẽ tiếp tục sử dụng khi cần.",
          },
          {
            name: "Khách đặt xe riêng",
            text: "Phù hợp cho những ai muốn một chuyến đi riêng tư, gọn gàng và không phải lo nhiều về lịch trình.",
          },
        ],

        ctaTitle: "Sẵn sàng đặt chuyến đi của bạn?",
        ctaDesc:
          "Đặt xe nhanh, liên hệ dễ và nhận xác nhận rõ ràng cho hành trình tiếp theo của bạn.",
        callNow: "Gọi ngay",
      }
    : {
        eyebrow: "Airport transfers & private rides in Sacramento",
        heroTitle: "Reliable Airport Transfers & Private Rides in Sacramento",
        heroDesc:
          "Book in minutes with on-time pickup, smooth travel, and dependable service for airport trips, local transportation, or private rides.",
        reserveRide: "Book a Ride",
        immediatePickup: "Call Now",
        meta1: "Easy booking",
        meta2: "Fast response",
        meta3: "Flexible service",
        quoteBadge: "Simple booking experience",
        quotePrice: "Fast • Clear • Reliable",
        quoteLabel:
          "Submit your ride request online and receive a clear confirmation for your trip.",
        quote1: "On-time airport transfers",
        quote2: "Private and comfortable rides",
        quote3: "Early morning or late-night availability",
        quote4: "Quick communication and easy booking",
        continueBooking: "Continue Booking",

        stats1: "Flexible scheduling",
        stats2: "Fast confirmation",
        stats3: "Clean and comfortable experience",
        stats4: "Sacramento area service",

        servicesTitle: "Transportation Services",
        servicesDesc:
          "Simple, private, and dependable transportation for airport pickups, local travel, and longer trips.",
        services: [
          {
            title: "Airport Transfers",
            desc: "Convenient rides to and from the airport with timely pickup and a smooth travel experience.",
            icon: "A",
          },
          {
            title: "Private Rides",
            desc: "Comfortable transportation for appointments, family visits, errands, and day-to-day travel needs.",
            icon: "P",
          },
          {
            title: "Long Distance Trips",
            desc: "A practical private ride option for direct travel between cities or destinations farther away.",
            icon: "L",
          },
        ],
        requestService: "View Services",

        whyTitle: "Why Riders Choose This Service",
        whyDesc:
          "Built around easy booking, clear communication, and a smoother transportation experience.",
        features: [
          {
            title: "On-Time and Dependable",
            desc: "Reliable scheduling helps you stay on track for airport trips and important appointments.",
          },
          {
            title: "Simple Booking Process",
            desc: "Quick and easy booking on mobile or desktop without unnecessary steps.",
          },
          {
            title: "Clear Communication",
            desc: "Trip details are handled clearly so you know what to expect before your ride.",
          },
          {
            title: "Flexible for Your Schedule",
            desc: "Works well for early departures, late-night pickups, and custom travel timing.",
          },
        ],

        reviewsTitle: "What Riders Say",
        reviewsDesc:
          "Real feedback about the booking process, communication, and ride experience.",
        reviews: [
          {
            name: "Sacramento Rider",
            text: "The booking process was easy, communication was clear, and pickup was right on time for my airport trip.",
          },
          {
            name: "Early Morning Pickup",
            text: "Fast response, simple coordination, and a very smooth ride. I would use this service again.",
          },
          {
            name: "Private Ride Customer",
            text: "A great option if you want a more private, comfortable, and straightforward transportation experience.",
          },
        ],

        ctaTitle: "Ready to Book Your Ride?",
        ctaDesc:
          "Fast booking, clear communication, and reliable transportation for your next trip.",
        callNow: "Call Now",
      };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="home-eyebrow">{copy.eyebrow}</div>

            <h1 className="home-hero-title">{copy.heroTitle}</h1>

            <p className="home-hero-desc">{copy.heroDesc}</p>

            <div className="home-hero-actions">
              <Link className="home-btn home-btn-primary" to="/book">
                {copy.reserveRide}
              </Link>

              <a
                className="home-btn home-btn-light"
                href={`tel:${siteConfig.phone}`}
              >
                {copy.immediatePickup}
              </a>
            </div>

            <div className="home-hero-meta">
              <div className="home-meta-pill">{copy.meta1}</div>
              <div className="home-meta-pill">{copy.meta2}</div>
              <div className="home-meta-pill">{copy.meta3}</div>
            </div>
          </div>

          <div className="home-hero-card">
            <div className="home-hero-card-top">
              <div>
                <div className="home-quote-badge">{copy.quoteBadge}</div>
                <div className="home-quote-price">{copy.quotePrice}</div>
                <div className="home-quote-label">{copy.quoteLabel}</div>
              </div>
            </div>

            <ul className="home-quote-list">
              <li>✓ {copy.quote1}</li>
              <li>✓ {copy.quote2}</li>
              <li>✓ {copy.quote3}</li>
              <li>✓ {copy.quote4}</li>
            </ul>

            <div className="home-hero-card-actions">
              <Link className="home-btn home-btn-dark" to="/book">
                {copy.continueBooking}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-stats-section">
        <div className="home-stats-grid">
          <div className="home-stat-card">
            <div className="home-stat-value">24/7</div>
            <div className="home-stat-label">{copy.stats1}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Fast</div>
            <div className="home-stat-label">{copy.stats2}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Smooth</div>
            <div className="home-stat-label">{copy.stats3}</div>
          </div>

          <div className="home-stat-card">
            <div className="home-stat-value">Local</div>
            <div className="home-stat-label">{copy.stats4}</div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>{copy.servicesTitle}</h2>
          </div>
          <p>{copy.servicesDesc}</p>
        </div>

        <div className="home-services-grid">
          {copy.services.map((service) => (
            <article className="home-service-card" key={service.title}>
              <div className="home-service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <Link className="home-service-link" to="/services">
                {copy.requestService}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>{copy.whyTitle}</h2>
          </div>
          <p>{copy.whyDesc}</p>
        </div>

        <div className="home-features-grid">
          {copy.features.map((item) => (
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
            <h2>{copy.reviewsTitle}</h2>
          </div>
          <p>{copy.reviewsDesc}</p>
        </div>

        <div className="home-reviews-grid">
          {copy.reviews.map((review) => (
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
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaDesc}</p>
        </div>

        <div className="home-cta-actions">
          <Link className="home-btn home-btn-dark" to="/book">
            {copy.continueBooking}
          </Link>

          <a
            className="home-btn home-btn-outline"
            href={`tel:${siteConfig.phone}`}
          >
            {copy.callNow}
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