import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageProvider";

export default function AboutPage() {
  const { language } = useLanguage();

  const content =
    language === "vi"
      ? {
          badge: "Giới thiệu dịch vụ",
          title:
            "Một dịch vụ đưa đón được xây dựng theo hướng rõ ràng, đáng tin và dễ làm việc.",
          desc:
            "Trang giới thiệu này giúp khách hàng hiểu bạn đang hướng đến trải nghiệm như thế nào: dễ liên hệ, dễ đặt xe, lịch sự trong cách phục vụ và rõ ràng trong quá trình sắp xếp chuyến đi.",

          storyTitle: "Cách chúng tôi xây dựng dịch vụ",
          storyDesc:
            "Mục tiêu không chỉ là cung cấp một chuyến xe, mà là tạo ra trải nghiệm đặt xe gọn gàng, dễ hiểu và đáng tin hơn cho khách hàng cần đi sân bay, đi địa phương hoặc đi việc riêng.",
          storyParagraphs: [
            "Dịch vụ được định hướng theo phong cách chuyên nghiệp nhưng gần gũi: khách dễ hỏi thông tin, dễ đặt xe và dễ xác nhận lại chuyến đi khi cần.",
            "Chúng tôi tập trung vào những điều khách hàng quan tâm nhiều nhất như sự rõ ràng khi liên hệ, tính thuận tiện khi đặt xe, và cảm giác yên tâm trong suốt quá trình sắp xếp chuyến đi.",
            "Website này cũng được xây dựng để phản ánh đúng tinh thần đó: giao diện sạch hơn, nội dung rõ hơn và các bước đặt xe dễ hiểu hơn.",
          ],

          valuesTitle: "Giá trị dịch vụ",
          valuesDesc:
            "Những điểm cốt lõi giúp dịch vụ tạo được cảm giác chuyên nghiệp và dễ tin tưởng hơn.",
          values: [
            {
              title: "Rõ ràng",
              desc:
                "Thông tin dịch vụ, cách liên hệ và quy trình đặt xe được trình bày đơn giản, dễ hiểu.",
            },
            {
              title: "Đúng hẹn",
              desc:
                "Việc xác nhận thời gian và chuyến đi được ưu tiên để khách cảm thấy yên tâm hơn.",
            },
            {
              title: "Lịch sự",
              desc:
                "Cách trao đổi và phục vụ hướng đến cảm giác chuyên nghiệp, nhẹ nhàng và tôn trọng khách hàng.",
            },
            {
              title: "Thuận tiện",
              desc:
                "Khách có thể chọn gọi điện, dùng form đặt xe hoặc email tùy nhu cầu.",
            },
          ],

          commitmentTitle: "Cam kết về trải nghiệm",
          commitmentDesc:
            "Một dịch vụ nhỏ vẫn có thể mang lại trải nghiệm chỉn chu nếu làm tốt những chi tiết quan trọng.",
          commitments: [
            "Giao diện và nội dung dễ hiểu hơn cho khách lần đầu vào web",
            "Dễ chuyển từ tìm hiểu dịch vụ sang đặt xe hoặc liên hệ",
            "Cách trình bày phù hợp cho cả khách đi cá nhân, gia đình và công việc",
            "Hướng đến cảm giác sạch sẽ, rõ ràng và chuyên nghiệp hơn",
          ],

          ctaTitle: "Muốn chuyển sang bước tiếp theo?",
          ctaDesc:
            "Bạn có thể vào trang Đặt xe để gửi yêu cầu ngay hoặc vào trang Liên hệ nếu muốn trao đổi thêm trước.",
          ctaPrimary: "Đặt xe ngay",
          ctaSecondary: "Liên hệ",
        }
      : {
          badge: "About the service",
          title:
            "A transportation service built around clarity, reliability, and a smoother customer experience.",
          desc:
            "This about page helps customers understand the kind of experience the service is designed to provide: easy communication, easy booking, respectful service, and a clearer ride coordination process.",

          storyTitle: "How the service is built",
          storyDesc:
            "The goal is not only to provide a ride, but to create a booking experience that feels more organized, easier to understand, and more dependable for airport trips, local rides, and personal travel.",
          storyParagraphs: [
            "The service is designed to feel professional yet approachable, making it easier for customers to ask questions, request a ride, and confirm trip details when needed.",
            "The focus is on the details customers usually care about most: clear communication, booking convenience, and a stronger sense of trust throughout the trip planning process.",
            "The website is built to reflect that same idea through a cleaner interface, better content structure, and a simpler booking flow.",
          ],

          valuesTitle: "Service values",
          valuesDesc:
            "These are the core ideas that help the service feel more polished and trustworthy.",
          values: [
            {
              title: "Clarity",
              desc:
                "Service details, contact methods, and booking steps are presented in a simple and understandable way.",
            },
            {
              title: "Reliability",
              desc:
                "Trip timing and confirmation are treated as priorities so customers feel more confident.",
            },
            {
              title: "Courtesy",
              desc:
                "Communication and service style aim to feel respectful, professional, and easy to work with.",
            },
            {
              title: "Convenience",
              desc:
                "Customers can choose between calling, booking online, or using email depending on what works best.",
            },
          ],

          commitmentTitle: "Commitment to the experience",
          commitmentDesc:
            "Even a smaller service can feel polished when the most important details are handled well.",
          commitments: [
            "A clearer website experience for first-time visitors",
            "An easier path from learning about the service to requesting a ride",
            "A presentation that works for personal, family, and business transportation needs",
            "A more organized, cleaner, and more professional overall feel",
          ],

          ctaTitle: "Ready for the next step?",
          ctaDesc:
            "You can move to the booking page to send your request now, or go to the contact page if you want to discuss your ride first.",
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
              {language === "vi" ? "Điểm nhấn chính" : "Key points"}
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
                  ? "Tập trung vào trải nghiệm rõ ràng và dễ làm việc"
                  : "Focused on a clearer and easier customer experience"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Tạo cảm giác chuyên nghiệp hơn cho website"
                  : "Creates a more professional feel for the website"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Giúp khách hiểu dịch vụ nhanh hơn"
                  : "Helps customers understand the service faster"}
              </li>
              <li>
                ✓{" "}
                {language === "vi"
                  ? "Tăng độ tin cậy trước khi khách đặt xe"
                  : "Builds trust before customers book"}
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