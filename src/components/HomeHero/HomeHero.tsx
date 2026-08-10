import React, { useState } from "react";
import "./HomeHero.css";
import { useLanguage } from "@/lib/use-language";

export const HomeHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isEn } = useLanguage();

  const slides = [
    {
      image: "/images/slider1.JPG",
      tag: isEn ? "🏛️ Main Campus" : "🏛️ मुख्य परिसर",
      title: isEn ? "1.5 Acre Scenic Anandshala Campus" : "१.५ एकर निसर्गरम्य आनंदशाळा परिसर",
      sub: isEn
        ? "Sangli's premier & fully equipped senior citizen hub"
        : "सांगली जिल्ह्यातील सर्वात भव्य व सुसज्ज ज्येष्ठ नागरिक केंद्र",
    },
    {
      image: "/images/slider2.JPG",
      tag: isEn ? "🏊‍♂️ Sports & Fitness Club" : "🏊‍♂️ क्रीडा & फिटनेस क्लब",
      title: isEn ? "Olympic Pool & AC Gym" : "ऑलिंपिक स्विमिंग पूल व AC जीम",
      sub: isEn
        ? "Badminton, Pickleball, Table Tennis, Library & Modern Halls"
        : "बॅडमिंटन, पिकलबॉल, टेबल टेनिस, वाचनालय व अत्याधुनिक हॉल्स",
    },
    {
      image: "/images/slider3.png",
      tag: isEn ? "🌸 Blissful Atmosphere" : "🌸 आनंदी वातावरण",
      title: isEn ? "Warm Belonging & Family Bond" : "आपुलकीचे नाते व कौटुंबिक सोहळा",
      sub: isEn
        ? "Vibrant, joyful & secure golden years with peer friends"
        : "आपल्या वयाच्या मित्र-मैत्रिणींसोबत उत्साही व सुरक्षित सुवर्णवर्षे",
    },
  ];

  const featureCards = [
    {
      icon: "👥",
      num: "500+",
      label: isEn ? "Community Members" : "समुदाय सदस्य",
      desc: isEn ? "Our beloved family" : "आमच्या परिवाराचा भाग",
      color: "#f472b6",
      bg: "#FFF0F6",
    },
    {
      icon: "📅",
      num: "26/27/28",
      label: isEn ? "January 2026" : "जानेवारी २०२६",
      desc: isEn ? "Grand Launch Meetup" : "भव्य प्रवेश व मित्र मेळावा",
      color: "#1A05A2",
      bg: "#EEF2FF",
    },
    {
      icon: "⏰",
      num: "11+",
      label: isEn ? "Activity Sessions" : "उपक्रमाची बैठक",
      desc: isEn ? "5+ monthly activities" : "दर महिन्याला ५+ उपक्रम",
      color: "#EA580C",
      bg: "#FFF7ED",
    },
    {
      icon: "🛡️",
      num: "24×7",
      label: isEn ? "Safety & Care" : "सुरक्षा & काळजी",
      desc: isEn ? "Medical service & CCTV" : "वैद्यकीय सेवा व CCTV",
      color: "#16A34A",
      bg: "#F0FDF4",
    },
  ];

  return (
    <div className="home-page-unique">
      <section className="unique-hero-sec">
        <div className="unique-bg-blob-1" />
        <div className="unique-bg-blob-2" />

        <div className="unique-container">
          {/* LEFT: HEADING, CARDS & CTAS */}
          <div className="unique-hero-left">
            <div className="unique-pill-badge">
              <span className="pulse-dot" />
              <span>
                {isEn
                  ? "🌸 India's First Senior Citizen Anandshala • Sangli"
                  : "🌸 भारतातील पहिली ज्येष्ठ नागरिक आनंदशाळा • सांगली"}
              </span>
            </div>

            <h1 className="unique-title">
              <span className="text-navy">
                {isEn ? "Preetam Senior Citizen " : "प्रीतम ज्येष्ठ नागरिक "}
              </span>
              <span className="text-pink">
                {isEn ? "Anandshala • Sangli" : "आनंदशाळा • सांगली"}
              </span>
            </h1>

            <p className="unique-subtitle">
              {isEn
                ? "A beautiful blend of love, service, security and values for senior citizens' healthy, happy and dignified living!"
                : "ज्येष्ठ नागरिकांच्या निरोगी आरोग्य, आनंददायी आयुष्य व स्वाभिमानी जीवनासाठी प्रेम, सेवा, सुरक्षा आणि संस्कार यांचा सुंदर संगम!"}
            </p>

            {/* 4 FEATURE CARDS */}
            <div className="unique-cards-grid">
              {featureCards.map((card, idx) => (
                <div key={idx} className="unique-card">
                  <div
                    className="card-top-icon"
                    style={{ background: card.bg, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div className="card-content">
                    <strong style={{ color: card.color }}>{card.num}</strong>
                    <h5>{card.label}</h5>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA BUTTONS */}
            <div className="unique-cta-row">
              <a href="tel:9370237633" className="unique-btn-primary">
                <span>
                  📞 {isEn ? "Book Admission Now (9370237633)" : "आजच संपर्क व प्रवेश नोंदणी करा 📞 9370237633"}
                </span>
              </a>

              <a
                href="#sections"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("sections");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="unique-btn-glass"
              >
                <span>{isEn ? "🏛️ Select Section" : "🏛️ विभाग निवडा"}</span>
                <span className="arrow-down">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE SLIDE SHOWCASE */}
          <div className="unique-hero-right">
            <div className="unique-slider-card">
              {/* SLIDE IMAGES */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`unique-slide-item ${
                    index === currentSlide ? "active" : ""
                  }`}
                >
                  <img src={slide.image} alt={slide.title} />
                </div>
              ))}

              {/* SLIDE COUNTER & LIVE BADGE */}
              <div className="slider-top-bar">
                <span className="live-badge">● LIVE CAMPUS</span>
                <span className="counter-badge">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>

              {/* NAV CONTROLS */}
              <button
                className="nav-arrow left"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? slides.length - 1 : prev - 1
                  )
                }
              >
                ‹
              </button>

              <button
                className="nav-arrow right"
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % slides.length)
                }
              >
                ›
              </button>

              {/* DOTS */}
              <div className="slider-dots-row">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot-item ${
                      idx === currentSlide ? "active" : ""
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeHero;
