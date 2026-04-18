import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function ServicesPage() {
  const { language } = useLanguage();

  const content =
    language === "vi"
      ? {
          badge: "Dịch vụ đưa đón tại Sacramento",
          title: "Các lựa chọn di chuyển rõ ràng, riêng tư và thuận tiện cho nhu cầu hằng ngày.",
          desc:
            "Từ đưa đón sân bay đến các chuyến đi trong thành phố hoặc hành trình xa hơn, dịch vụ được sắp xếp để khách dễ chọn, dễ đặt và dễ phối hợp trước chuyến đi.",

          sectionTitle: "Các dịch vụ chính",
          sectionDesc:
            "Những lựa chọn phổ biến và thiết thực cho cá nhân, gia đình, khách đi sân bay và các nhu cầu đi lại riêng.",

          cards: [
            {
              title: "Đưa đón sân bay",
              desc:
                "Phù hợp cho các chuyến đi đến hoặc từ sân bay với thời gian đón rõ ràng, liên hệ thuận tiện và trải nghiệm gọn gàng hơn cho khách cần đúng giờ.",
              bullets: [
                "Phù hợp cho chuyến bay sáng sớm hoặc tối muộn",
                "Dễ xác nhận giờ đón và điểm đón",
                "Thuận tiện cho cá nhân, cặp đôi và gia đình",
              ],
            },
            {
              title: "Đi lại trong thành phố",
              desc:
                "Dịch vụ di chuyển linh hoạt trong khu vực Sacramento cho lịch hẹn, công việc cá nhân, thăm người thân, đi mua sắm hoặc các nhu cầu đi lại hằng ngày.",
              bullets: [
                "Thuận tiện cho các chuyến đi trong khu vực",
                "Phù hợp cho việc riêng và lịch hẹn",
                "Đặt xe đơn giản, dễ phối hợp",
              ],
            },
            {
              title: "Chuyến đi riêng",
              desc:
                "Lựa chọn phù hợp khi bạn muốn không gian riêng tư hơn, cần chủ động thời gian hoặc muốn sắp xếp hành trình thoải mái theo nhu cầu thực tế.",
              bullets: [
                "Riêng tư và thoải mái hơn",
                "Phù hợp cho lịch trình linh hoạt",
                "Dễ sắp xếp cho nhu cầu cá nhân hoặc công việc",
              ],
            },
            {
              title: "Chuyến đi đường dài",
              desc:
                "Giải pháp phù hợp cho các hành trình giữa thành phố này với thành phố khác, hoặc những chuyến đi xa cần sự ổn định và dễ phối hợp hơn.",
              bullets: [
                "Phù hợp cho hành trình xa hơn",
                "Di chuyển trực tiếp, riêng tư hơn",
                "Thuận tiện cho kế hoạch đi lại dài hơn trong ngày",
              ],
            },
          ],

          whyTitle: "Vì sao dịch vụ này phù hợp",
          whyDesc:
            "Điều khách thường quan tâm không chỉ là có xe, mà là quy trình có dễ hiểu, liên hệ có rõ ràng và chuyến đi có đủ yên tâm hay không.",

          features: [
            {
              title: "Đặt xe dễ hiểu",
              desc:
                "Thông tin được trình bày rõ ràng để khách dễ chọn dịch vụ phù hợp và gửi yêu cầu nhanh hơn.",
            },
            {
              title: "Liên hệ thuận tiện",
              desc:
                "Khách có thể gọi trực tiếp hoặc gửi yêu cầu online tùy theo cách nào tiện nhất.",
            },
            {
              title: "Phù hợp nhiều loại chuyến đi",
              desc:
                "Từ sân bay, đi lại địa phương đến các chuyến riêng hoặc hành trình xa hơn.",
            },
            {
              title: "Trải nghiệm gọn gàng hơn",
              desc:
                "Ưu tiên sự rõ ràng, đúng giờ và phối hợp dễ dàng trước mỗi chuyến đi.",
            },
          ],

          faqTitle: "Câu hỏi thường gặp",
          faqs: [
            {
              q: "Tôi có thể đặt chuyến sáng sớm hoặc tối muộn không?",
              a: "Có. Bạn chỉ cần gửi thông tin chuyến đi trước để việc sắp xếp được rõ ràng hơn.",
            },
            {
              q: "Tôi có thể đặt xe cho chuyến khứ hồi không?",
              a: "Có. Bạn có thể ghi rõ nhu cầu trong lúc đặt xe để sắp xếp phù hợp hơn.",
            },
            {
              q: "Nếu tôi chưa chắc giờ đi thì sao?",
              a: "Bạn vẫn có thể liên hệ trước để trao đổi. Sau đó có thể cập nhật lại chi tiết khi kế hoạch rõ hơn.",
            },
          ],

          ctaTitle: "Sẵn sàng đặt chuyến đi phù hợp với nhu cầu của bạn?",
          ctaDesc:
            "Bạn có thể đặt xe ngay bây giờ hoặc chuyển sang trang liên hệ nếu muốn trao đổi thêm trước khi xác nhận.",
          ctaPrimary: "Đặt xe ngay",
          ctaSecondary: "Liên hệ trước",
        }
      : {
          badge: "Transportation services in Sacramento",
          title: "Clear, private, and convenient ride options for everyday travel needs.",
          desc:
            "From airport transportation to local rides and longer private trips, the service is organized to make booking easier, communication clearer, and planning more convenient.",

          sectionTitle: "Core services",
          sectionDesc:
            "Practical ride options for individuals, families, airport travelers, and customers who want a more private transportation experience.",

          cards: [
            {
              title: "Airport Transfers",
              desc:
                "A dependable option for rides to and from the airport with clear pickup timing, easier coordination, and a smoother overall travel experience.",
              bullets: [
                "Good for early morning or late-night flights",
                "Clear pickup time and location coordination",
                "Convenient for individuals, couples, and families",
              ],
            },
            {
              title: "Local Rides",
              desc:
                "Flexible transportation around Sacramento for appointments, errands, family visits, shopping, and other day-to-day travel needs.",
              bullets: [
                "Convenient for local transportation needs",
                "Useful for appointments and personal errands",
                "Simple booking and easy coordination",
              ],
            },
            {
              title: "Private Rides",
              desc:
                "A strong choice when you want a more private setting, a more flexible schedule, or a ride tailored more closely to your trip needs.",
              bullets: [
                "More private and comfortable",
                "Works well for flexible schedules",
                "Suitable for personal or business travel",
              ],
            },
            {
              title: "Long Distance Trips",
              desc:
                "A practical transportation option for travel between cities or for longer rides that need a more stable and direct arrangement.",
              bullets: [
                "Suitable for longer travel distances",
                "More direct and private transportation",
                "Helpful for extended day travel plans",
              ],
            },
          ],

          whyTitle: "Why this service works well",
          whyDesc:
            "Customers usually care about more than just finding a ride. They also want a process that feels clear, responsive, and dependable.",

          features: [
            {
              title: "Easy to understand",
              desc:
                "Service details are presented clearly so it is easier to choose the right option and send a request quickly.",
            },
            {
              title: "Convenient communication",
              desc:
                "Customers can call directly or submit an online request depending on what works best.",
            },
            {
              title: "Useful for different trip types",
              desc:
                "From airport rides and local travel to private trips and longer-distance transportation.",
            },
            {
              title: "A smoother overall experience",
              desc:
                "The focus is on clarity, punctuality, and easier coordination before the ride.",
            },
          ],

          faqTitle: "Frequently Asked Questions",
          faqs: [
            {
              q: "Can I request an early morning or late-night ride?",
              a: "Yes. You can send your trip details in advance so scheduling is easier to coordinate.",
            },
            {
              q: "Can I book a round trip?",
              a: "Yes. You can include those details when submitting your request so the trip can be arranged more clearly.",
            },
            {
              q: "What if my travel time is not fully confirmed yet?",
              a: "You can still reach out first and update the trip details later once your schedule is finalized.",
            },
          ],

          ctaTitle: "Ready to request the right ride for your trip?",
          ctaDesc:
            "You can book now directly or go to the contact page if you want to discuss your trip before confirming.",
          ctaPrimary: "Book Now",
          ctaSecondary: "Contact First",
        };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          background:
            "radial-gradient(circle at top right, rgba(212,160,23,0.14), transparent 26%), linear-gradient(135deg, #0f172a 0%, #162235 45%, #1f2e46 100%)",
          color: "white",
          borderRadius: 30,
          padding: "42px 28px",
          boxShadow: "0 28px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 24,
          }}
          className="services-hero-grid"
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
              {content.badge}
            </div>

            <h1
              style={{
                margin: "18px 0 14px",
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
              }}
            >
              {content.title}
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
              {content.desc}
            </p>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link to="/book" style={primaryLightBtn}>
                {content.ctaPrimary}
              </Link>

              <Link to="/contact" style={ghostLightBtn}>
                {content.ctaSecondary}
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 24,
              padding: 24,
              alignSelf: "start",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#cbd5e1",
                fontWeight: 800,
              }}
            >
              {language === "vi" ? "Tóm tắt nhanh" : "Quick Summary"}
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
                  ? "Dịch vụ rõ ràng, dễ chọn"
                  : "Clear service options"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Phù hợp cho sân bay, đi lại địa phương và chuyến riêng"
                  : "Works for airport, local, and private trips"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Liên hệ và đặt xe thuận tiện hơn"
                  : "Easier communication and booking"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Kết nối nhanh sang trang đặt xe"
                  : "Quick path to the booking page"}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gap: 18 }}>
        <div className="section-heading">
          <div>
            <h2>{content.sectionTitle}</h2>
          </div>
          <p>{content.sectionDesc}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 18,
          }}
          className="services-cards-grid"
        >
          {content.cards.map((item) => (
            <article
              key={item.title}
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
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, #eff6ff, #e0e7ff)",
                  color: "#0f172a",
                  fontWeight: 800,
                  marginBottom: 18,
                }}
              >
                {item.title.charAt(0)}
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 24,
                  letterSpacing: "-0.03em",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: "12px 0 0",
                  color: "#64748b",
                  lineHeight: 1.8,
                }}
              >
                {item.desc}
              </p>

              <ul
                style={{
                  margin: "18px 0 0",
                  paddingLeft: 18,
                  color: "#334155",
                  lineHeight: 1.8,
                }}
              >
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              <div style={{ marginTop: 18 }}>
                <Link to="/book" style={serviceLinkBtn}>
                  {language === "vi" ? "Đặt dịch vụ này" : "Request this service"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 18 }}>
        <div className="section-heading">
          <div>
            <h2>{content.whyTitle}</h2>
          </div>
          <p>{content.whyDesc}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
          className="services-features-grid"
        >
          {content.features.map((item) => (
            <div
              key={item.title}
              style={{
                background: "rgba(255,255,255,0.94)",
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
                {item.title}
              </h3>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#64748b",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: 18 }}>
        <div className="section-heading">
          <div>
            <h2>{content.faqTitle}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
          className="services-faq-grid"
        >
          {content.faqs.map((item) => (
            <article
              key={item.q}
              style={{
                background: "rgba(255,255,255,0.94)",
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
                  color: "#0f172a",
                }}
              >
                {item.q}
              </h3>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#64748b",
                  lineHeight: 1.75,
                  fontSize: 14,
                }}
              >
                {item.a}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 28,
          padding: 30,
          boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              letterSpacing: "-0.03em",
            }}
          >
            {content.ctaTitle}
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              color: "#64748b",
              lineHeight: 1.8,
              maxWidth: 760,
            }}
          >
            {content.ctaDesc}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/book" style={primaryBtn}>
            {content.ctaPrimary}
          </Link>

          <Link to="/contact" style={ghostBtn}>
            {content.ctaSecondary}
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .services-hero-grid,
          .services-cards-grid,
          .services-features-grid,
          .services-faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: 999,
  padding: "12px 18px",
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
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "transparent",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.12)",
  textDecoration: "none",
};

const primaryLightBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "white",
  color: "#0f172a",
  textDecoration: "none",
  border: "none",
};

const ghostLightBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.24)",
  textDecoration: "none",
};

const serviceLinkBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer",
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid rgba(15,23,42,0.08)",
  textDecoration: "none",
};