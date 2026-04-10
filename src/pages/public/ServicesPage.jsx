import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function ServicesPage() {
  const { language } = useLanguage();

  const content =
    language === "vi"
      ? {
          badge: "Dịch vụ vận chuyển chuyên nghiệp",
          title: "Các dịch vụ được thiết kế rõ ràng, linh hoạt và phù hợp cho nhu cầu đi lại thực tế.",
          desc:
            "Trang này giúp khách hàng hiểu nhanh bạn cung cấp những loại dịch vụ nào, phù hợp với chuyến đi nào, và nên đặt xe theo cách nào để thuận tiện nhất.",

          sectionTitle: "Dịch vụ chính",
          sectionDesc:
            "Tập trung vào những nhóm dịch vụ thiết thực nhất cho khách hàng cá nhân, gia đình và nhu cầu đi lại hằng ngày.",

          cards: [
            {
              title: "Đưa đón sân bay",
              desc:
                "Dịch vụ đón và trả sân bay với thời gian rõ ràng, liên hệ dễ dàng và trải nghiệm chuyên nghiệp hơn cho khách cần đi sớm, đi xa hoặc cần đúng giờ.",
              bullets: [
                "Phù hợp cho chuyến bay sáng sớm hoặc tối muộn",
                "Dễ xác nhận giờ đón và điểm đón",
                "Thích hợp cho cá nhân, cặp đôi và gia đình",
              ],
            },
            {
              title: "Đi lại địa phương",
              desc:
                "Dịch vụ đưa đón linh hoạt trong khu vực Sacramento cho các nhu cầu đi chợ, đi làm, đi khám, gặp người thân hoặc những chuyến đi cá nhân hằng ngày.",
              bullets: [
                "Đi lại linh hoạt trong thành phố",
                "Phù hợp cho lịch hẹn, việc riêng và sinh hoạt",
                "Quy trình đặt xe đơn giản, dễ dùng",
              ],
            },
            {
              title: "Thuê xe theo giờ",
              desc:
                "Lựa chọn phù hợp khi khách cần nhiều điểm dừng, cần chủ động thời gian hoặc muốn có chuyến đi riêng cho công việc, sự kiện hoặc nhu cầu cá nhân.",
              bullets: [
                "Thuận tiện cho nhiều điểm dừng",
                "Phù hợp cho lịch trình linh hoạt",
                "Dễ dùng cho công việc hoặc việc riêng",
              ],
            },
            {
              title: "Xe cho dịp đặc biệt",
              desc:
                "Dịch vụ cho các dịp quan trọng như họp mặt, tiệc nhỏ, đưa đón khách thân, hoặc các chuyến đi cần sự chỉnh chu và đáng tin cậy hơn.",
              bullets: [
                "Phù hợp cho nhu cầu riêng và sự kiện nhỏ",
                "Tạo cảm giác gọn gàng và chuyên nghiệp",
                "Dễ phối hợp trước giờ đi",
              ],
            },
          ],

          whyTitle: "Điểm nổi bật của dịch vụ",
          whyDesc:
            "Điều khách hàng thường quan tâm nhất không chỉ là có xe, mà là trải nghiệm đặt xe có rõ ràng, dễ liên lạc và đáng tin hay không.",

          features: [
            {
              title: "Đặt xe dễ hiểu",
              desc:
                "Biểu mẫu và nội dung được trình bày rõ ràng để khách dễ gửi yêu cầu mà không bị rối.",
            },
            {
              title: "Liên hệ nhanh",
              desc:
                "Khách có thể chọn gọi điện, gửi form hoặc email tùy nhu cầu và thời điểm.",
            },
            {
              title: "Phù hợp nhiều loại chuyến đi",
              desc:
                "Từ đi sân bay, đi việc riêng, đi trong thành phố đến các chuyến cần nhiều điểm dừng.",
            },
            {
              title: "Hướng đến trải nghiệm chuyên nghiệp",
              desc:
                "Thiết kế và nội dung đều hướng đến cảm giác tin cậy, sạch sẽ và dễ làm việc.",
            },
          ],

          ctaTitle: "Sẵn sàng đặt chuyến đi phù hợp với nhu cầu của bạn?",
          ctaDesc:
            "Bạn có thể đặt xe trực tiếp ngay bây giờ hoặc chuyển sang trang liên hệ nếu cần trao đổi thêm trước khi chốt chuyến.",
          ctaPrimary: "Đặt xe ngay",
          ctaSecondary: "Liên hệ trước",
        }
      : {
          badge: "Professional transportation services",
          title: "Clear, flexible service options designed for real transportation needs.",
          desc:
            "This page helps customers quickly understand what services are available, which option best fits their trip, and how to request a ride more easily.",

          sectionTitle: "Core services",
          sectionDesc:
            "Focused on practical transportation options for individuals, families, and everyday travel needs.",

          cards: [
            {
              title: "Airport Transfer",
              desc:
                "Reliable airport pickup and drop-off service with clearer timing, easier communication, and a more polished booking experience.",
              bullets: [
                "Good for early morning or late-night flights",
                "Clear pickup coordination",
                "Suitable for individuals, couples, and families",
              ],
            },
            {
              title: "Local Rides",
              desc:
                "Flexible local transportation around Sacramento for appointments, shopping, errands, family visits, and daily personal travel.",
              bullets: [
                "Flexible city transportation",
                "Useful for appointments and personal errands",
                "Simple and easy request process",
              ],
            },
            {
              title: "Hourly Service",
              desc:
                "A strong option for customers who need multiple stops, more control over timing, or a more private ride arrangement for work or personal use.",
              bullets: [
                "Convenient for multiple stops",
                "Works well for flexible schedules",
                "Useful for business or personal trips",
              ],
            },
            {
              title: "Special Occasion Rides",
              desc:
                "A more polished transportation option for small events, family pickups, personal occasions, or trips that need a more organized experience.",
              bullets: [
                "Great for personal needs and small events",
                "Feels more polished and professional",
                "Easier to coordinate ahead of time",
              ],
            },
          ],

          whyTitle: "What makes the service stronger",
          whyDesc:
            "Customers usually care about more than just having a ride available. They also care about clarity, responsiveness, and an overall sense of trust.",

          features: [
            {
              title: "Easy booking flow",
              desc:
                "The form and page structure are designed to be clear and simple instead of confusing.",
            },
            {
              title: "Fast contact options",
              desc:
                "Customers can choose to call, submit a request, or send an email depending on what works best.",
            },
            {
              title: "Works for multiple trip types",
              desc:
                "From airport rides and local travel to multi-stop trips and personal transportation needs.",
            },
            {
              title: "Built for a professional feel",
              desc:
                "The design and wording aim to feel trustworthy, organized, and easier to work with.",
            },
          ],

          ctaTitle: "Ready to request the right ride for your trip?",
          ctaDesc:
            "You can book now directly or move to the contact page if you want to discuss your ride before confirming.",
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
              {language === "vi" ? "Tóm tắt nhanh" : "Quick summary"}
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
                  ? "Nội dung dịch vụ rõ ràng hơn"
                  : "Clearer service presentation"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Giúp khách chọn đúng loại chuyến đi"
                  : "Helps customers choose the right trip type"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Tăng cảm giác chuyên nghiệp của website"
                  : "Improves the professional feel of the site"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Dễ kết nối sang trang đặt xe"
                  : "Easy path into the booking page"}
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
          .services-features-grid {
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