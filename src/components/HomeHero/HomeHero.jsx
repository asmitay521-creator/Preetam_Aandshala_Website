import React, { useState, useEffect } from "react";
import "./HomeHero.css";
import { 
  Users, Calendar, Award, ShieldCheck, 
  ArrowRight, Landmark, Flower2, 
  Dumbbell, BookOpen, Music, Utensils, 
  Bus, HeartHandshake, PhoneCall, Sparkles,
  ChevronLeft, ChevronRight
} from "lucide-react";

const heroSlides = [
  {
    image: "/images/slider1.JPG",
    tag: "🏛️ मुख्य आनंदशाळा वास्तू",
    title: "१.५ एकर निसर्गरम्य परिसर",
    subtitle: "सांगली जिल्ह्यातील भव्य व सर्व सोयींनी युक्त ज्येष्ठ नागरिक संकूल",
  },
  {
    image: "/images/slider2.JPG",
    tag: "🏊‍♂️ प्रीतम क्रीडा & फिटनेस क्लब",
    title: "ऑलिंपिक स्विमिंग पूल व AC जिम",
    subtitle: "बॅडमिंटन, पिकलबॉल, टेबल टेनिस, वाचनालय व अत्याधुनिक हॉल्स",
  },
  {
    image: "/images/slider3.png",
    tag: "🌸 आनंदी सुवर्णवर्षे",
    title: "आपुलकीचे नाते व कौटुंबिक आनंद",
    subtitle: "आपल्या वयाच्या मित्र-मैत्रिणींसोबत उत्साही व सुरक्षित जीवन सोहळा",
  },
];

const HomeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="hero-section-clean">

      {/* ══════════════════════════════════════════════════════════════
          1. TOP HALF: 100% FULL-WIDTH PURE IMAGE CAROUSEL SLIDER (ZERO WHITESPACE)
         ══════════════════════════════════════════════════════════════ */}
      <div className="hero-top-slide-box">
        {/* SLIDING IMAGES */}
        {heroSlides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt={slide.title}
            className={`hero-slide-photo ${idx === activeSlide ? "slide-active" : "slide-hidden"}`}
          />
        ))}

        {/* PREV / NEXT NAV ARROWS */}
        <button 
          onClick={handlePrev}
          className="hero-arrow-btn left-arrow cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="hero-arrow-btn right-arrow cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* FLOATING TOP OVERLAY DOTS ON PHOTO */}
        <div className="hero-slide-top-bar justify-end">
          <div className="slider-dots-group">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`slider-dot-item ${idx === activeSlide ? "slider-dot-active" : ""}`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. BOTTOM HALF: TEXT CONTENT, STATS CARDS & BUTTONS BELOW
         ══════════════════════════════════════════════════════════════ */}
      <div className="hero-container-main">
        <div className="hero-bottom-info-block">
          
          {/* MAIN HEADING & SUBTITLE */}
          <div className="hero-text-header text-center">
            <h1 className="hero-main-title">
              <span className="text-dark-burgundy">प्रीतम ज्येष्ठ नागरिक</span>
              <span className="text-gradient-pink"> आनंदशाळा • सांगली</span>
            </h1>

            <p className="hero-main-subtitle">
              ज्येष्ठ नागरिकांच्या निरोगी आरोग्य, आनंददायी आयुष्य व स्वाभिमानी
              जीवनासाठी प्रेम, सेवा, सुरक्षा आणि संस्कार यांचा सुंदर संगम!
            </p>
          </div>

          {/* 4 STATS CARDS GRID */}
          <div className="hero-glass-stats-grid">
            <div className="glass-stat-card">
              <div className="stat-icon-circle bg-purple-100 text-purple-700">
                <Users size={22} />
              </div>
              <div className="stat-info">
                <strong>500+</strong>
                <span>समुदाय सदस्य</span>
                <small>आमच्या परिवाराचा भाग</small>
              </div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-icon-circle bg-pink-100 text-pink-700">
                <Calendar size={22} />
              </div>
              <div className="stat-info">
                <strong>26/27/28</strong>
                <span>जानेवारी 2026</span>
                <small>भव्य प्रवेश व मित्र मेळावा</small>
              </div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-icon-circle bg-amber-100 text-amber-700">
                <Award size={22} />
              </div>
              <div className="stat-info">
                <strong>11+</strong>
                <span>उपक्रमांची बैठक</span>
                <small>दर महिन्याला 5+ उपक्रम</small>
              </div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-icon-circle bg-emerald-100 text-emerald-700">
                <ShieldCheck size={22} />
              </div>
              <div className="stat-info">
                <strong>२४×७</strong>
                <span>सुरक्षा & काळजी</span>
                <small>वैद्यकीय सेवा व CCTV</small>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="hero-cta-group">
            <a href="tel:9370237633" className="hero-btn-primary">
              <div className="btn-icon-pulse">
                <PhoneCall size={20} />
              </div>
              <div className="btn-text-box">
                <span className="btn-sub">आजच संपर्क व प्रवेश नोंदणी करा</span>
                <span className="btn-main">📞 9370237633</span>
              </div>
              <div className="btn-arrow-glow">
                <ArrowRight size={18} />
              </div>
            </a>

            <a href="#sections" className="hero-btn-department">
              <div className="btn-icon-dept">
                <Landmark size={20} />
              </div>
              <div className="btn-text-box">
                <span className="btn-dept-heading">विभाग निवडा</span>
                <span className="btn-dept-subtext">सर्व सोयी सुविधा पहा</span>
              </div>
              <ArrowRight size={16} className="text-amber-700 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* ACTIVITIES STRIP */}
          <div className="hero-activities-strip">
            <div className="activities-header">
              <Flower2 className="text-pink-500 animate-spin-slow" size={24} />
              <h3>आनंदी जीवनाचे सुंदर क्षण</h3>
            </div>

            <div className="activities-grid-full">
              <div className="activity-pill">
                <Flower2 size={20} className="text-pink-600" />
                <div>
                  <strong>योगा & ध्यान</strong>
                  <p>शारीरिक व मानसिक स्वास्थ्य</p>
                </div>
              </div>

              <div className="activity-pill">
                <Dumbbell size={20} className="text-blue-600" />
                <div>
                  <strong>फिटनेस सेंटर</strong>
                  <p>नियमित व्यायाम & जिम</p>
                </div>
              </div>

              <div className="activity-pill">
                <BookOpen size={20} className="text-amber-600" />
                <div>
                  <strong>वाचनालय</strong>
                  <p>ज्ञान व विचार संवाद</p>
                </div>
              </div>

              <div className="activity-pill">
                <Music size={20} className="text-purple-600" />
                <div>
                  <strong>संगीत & कला</strong>
                  <p>गायन, वादन व कला</p>
                </div>
              </div>

              <div className="activity-pill">
                <Utensils size={20} className="text-emerald-600" />
                <div>
                  <strong>स्वादिष्ट भोजन</strong>
                  <p>पौष्टिक व संतुलित आहार</p>
                </div>
              </div>

              <div className="activity-pill">
                <Bus size={20} className="text-sky-600" />
                <div>
                  <strong>सहली & प्रवास</strong>
                  <p>निसर्ग व धार्मिक सहली</p>
                </div>
              </div>

              <div className="activity-pill">
                <HeartHandshake size={20} className="text-rose-600" />
                <div>
                  <strong>आपुलकीचे नाते</strong>
                  <p>कौटुंबिक व स्नेही वातावरण</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomeHero;
