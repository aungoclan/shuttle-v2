import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function AboutPage() {
  const { language } = useLanguage();

  const content =
    language === "vi"
      ? {
          badge: "Về dịch vụ",
          title:
            "Dịch vụ đưa đón được xây dựng theo hướng rõ ràng, đúng giờ và dễ phối hợp cho từng chuyến đi.",
          desc:
            "Mục tiêu là mang lại trải nghiệm đặt xe đơn giản hơn, liên hệ thuận tiện hơn và hành trình yên tâm hơn cho khách cần đi sân bay, đi lại trong khu vực hoặc đặt xe riêng theo nhu cầu.",

          storyTitle: "Cách dịch vụ được xây dựng",
          storyDesc:
            "Không chỉ là một chuyến xe, mà là một quy trình rõ ràng hơn từ lúc khách tìm hiểu, liên hệ, đặt xe đến khi xác nhận chuyến đi.",
          storyParagraphs: [
            "Dịch vụ này được định hướng cho những khách cần một cách đặt xe gọn gàng, dễ hiểu và bớt rườm rà hơn. Từ chuyến đi sân bay đến nhu cầu đi lại cá nhân, mọi thứ đều ưu tiên sự thuận tiện và rõ ràng.",
            "Điểm quan trọng nhất là khả năng phối hợp trước chuyến đi. Khách cần biết mình đặt như thế nào, khi nào sẽ được xác nhận, và thông tin chuyến đi có được trình bày rõ hay không.",
            "Vì vậy, toàn bộ trải nghiệm được xây dựng theo hướng dễ dùng, dễ liên hệ và dễ sắp xếp hơn, để khách cảm thấy yên tâm ngay từ trước khi chuyến đi bắt đầu.",
          ],

          valuesTitle: "Giá trị cốt lõi",
          valuesDesc:
            "Những điều quan trọng giúp dịch vụ tạo cảm giác chuyên nghiệp, dễ tin tưởng và phù hợp cho nhu cầu đi lại thực tế.",
          values: [
            {
              title: "Rõ ràng",
              desc:
                "Thông tin dịch vụ, cách liên hệ và quy trình đặt xe được trình bày đơn giản, trực tiếp và dễ hiểu.",
            },
            {
              title: "Đáng tin cậy",
              desc:
                "Ưu tiên việc xác nhận và phối hợp thời gian để khách cảm thấy yên tâm hơn trước mỗi chuyến đi.",
            },
            {
              title: "Lịch sự",
              desc:
                "Cách trao đổi hướng đến sự tôn trọng, nhẹ nhàng và chuyên nghiệp trong toàn bộ quá trình làm việc.",
            },
            {
              title: "Thuận tiện",
              desc:
                "Khách có thể chọn hình thức liên hệ phù hợp như gọi điện, gửi yêu cầu đặt xe hoặc trao đổi trước khi xác nhận.",
            },
          ],

          commitmentTitle: "Cam kết về trải nghiệm",
          commitmentDesc:
            "Một dịch vụ tốt không chỉ nằm ở việc có chuyến xe, mà còn ở cách mọi chi tiết được chuẩn bị và phối hợp trước đó.",
          commitments: [
            "Hỗ trợ đặt xe đơn giản và dễ hiểu hơn",
            "Tạo cảm giác rõ ràng hơn trước khi khách xác nhận chuyến đi",
            "Phù hợp cho khách cá nhân, gia đình hoặc nhu cầu đi lại công việc",
            "Ưu tiên sự đúng giờ, liên hệ thuận tiện và hành trình gọn gàng hơn",
          ],

          ctaTitle: "Sẵn sàng cho chuyến đi tiếp theo của bạn?",
          ctaDesc:
            "Bạn có thể chuyển sang trang Đặt xe để gửi yêu cầu ngay, hoặc vào trang Liên hệ nếu muốn trao đổi thêm trước.",
          ctaPrimary: "Đặt xe ngay",
          ctaSecondary: "Liên hệ",
        }
      : {
          badge: "About the service",
          title:
            "A ride service built around clarity, punctuality, and easier coordination for each trip.",
          desc:
            "The goal is to create a simpler booking experience, more convenient communication, and a smoother overall ride experience for airport transportation, local travel, and private ride requests.",

          storyTitle: "How the service is built",
          storyDesc:
            "It is not only about providing a ride. It is also about making the full process clearer from the moment a customer explores the service to the moment the trip is confirmed.",
          storyParagraphs: [
            "This service is designed for customers who want a booking process that feels cleaner, easier to understand, and less complicated. Whether the trip is for the airport, local transportation, or personal travel, the focus stays on convenience and clarity.",
            "One of the most important parts is coordination before the ride. Customers want to know how the request works, when confirmation will happen, and whether the trip details are clearly communicated.",
            "That is why the overall experience is built to feel easier to use, easier to contact, and easier to arrange, so customers can feel more confident before the trip even begins.",
          ],

          valuesTitle: "Core values",
          valuesDesc:
            "These are the principles that help the service feel more polished, more trustworthy, and more useful for real transportation needs.",
          values: [
            {
              title: "Clarity",
              desc:
                "Service details, contact options, and booking steps are presented in a direct and easy-to-understand way.",
            },
            {
              title: "Reliability",
              desc:
                "Timing and trip coordination are treated as priorities so customers can feel more confident before each ride.",
            },
            {
              title: "Courtesy",
              desc:
                "Communication is meant to feel respectful, calm, and professional throughout the process.",
            },
            {
              title: "Convenience",
              desc:
                "Customers can choose the contact method that fits them best, whether that means calling first or sending a booking request online.",
            },
          ],

          commitmentTitle: "Commitment to the experience",
          commitmentDesc:
            "A quality ride service is not only about having transportation available. It is also about how well the details are handled before the trip.",
          commitments: [
            "A booking process that feels simpler and easier to follow",
            "Clearer communication before the customer confirms a trip",
            "Useful for individual, family, and business transportation needs",
            "A stronger focus on punctuality, convenience, and a smoother ride experience",
          ],

          ctaTitle: "Ready for your next ride?",
          ctaDesc:
            "You can go to the booking page to send your request now, or visit the contact page if you would like to discuss the trip first.",
          ctaPrimary: "Book Now",
          ctaSecondary: "Contact",
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
          className="about-hero-grid"
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
                maxWidth: 760,
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
              {language === "vi" ? "Điểm nổi bật" : "Highlights"}
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
                  ? "Quy trình đặt xe rõ ràng hơn"
                  : "A clearer booking process"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Dễ liên hệ và dễ phối hợp trước chuyến đi"
                  : "Easier communication and trip coordination"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Phù hợp cho sân bay, đi địa phương và xe riêng"
                  : "Suitable for airport, local, and private rides"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Ưu tiên trải nghiệm gọn gàng và đáng tin cậy"
                  : "Focused on a smoother and more dependable experience"}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 24,
        }}
        className="about-story-grid"
      >
        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 24,
            padding: 24,
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
            {content.storyTitle}
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              color: "#64748b",
              lineHeight: 1.8,
            }}
          >
            {content.storyDesc}
          </p>

          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            {content.storyParagraphs.map((text) => (
              <p
                key={text}
                style={{
                  margin: 0,
                  color: "#334155",
                  lineHeight: 1.85,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 24,
            padding: 24,
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
            {content.commitmentTitle}
          </h2>

          <p
            style={{
              margin: "12px 0 0",
              color: "#64748b",
              lineHeight: 1.8,
            }}
          >
            {content.commitmentDesc}
          </p>

          <ul
            style={{
              margin: "18px 0 0",
              paddingLeft: 18,
              color: "#334155",
              lineHeight: 1.9,
            }}
          >
            {content.commitments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ display: "grid", gap: 18 }}>
        <div className="section-heading">
          <div>
            <h2>{content.valuesTitle}</h2>
          </div>
          <p>{content.valuesDesc}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
          className="about-values-grid"
        >
          {content.values.map((item) => (
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
          .about-hero-grid,
          .about-story-grid,
          .about-values-grid {
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