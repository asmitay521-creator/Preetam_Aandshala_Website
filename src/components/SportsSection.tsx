import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, PhoneCall } from "lucide-react";
import "./SportsSection.css";
import { site, sportsClub } from "../lib/site-info";
import { useLanguage } from "@/lib/use-language";

interface FacilityDetail {
  id: string;
  titleMr: string;
  titleEn: string;
  subMr: string;
  subEn: string;
  descMr: string;
  img: string;
  icon: string;
  featuresMr: string[];
  timingMr: string;
}

const facilityItems: FacilityDetail[] = [
  {
    id: "gym",
    icon: "🏋️‍♂️",
    titleMr: "जिम & बॉडीबिल्डिंग",
    titleEn: "Gym & Bodybuilding Studio",
    subMr: "आधुनिक उपकरणांसह प्रशिक्षित ट्रेनर्स",
    subEn: "Certified trainers with modern fitness equipment",
    descMr: "जागतिक दर्जाची फिटनेस उपकरणे, पूर्णतः वातानुकूलित परिसर आणि वैयक्तिक प्रमाणित ट्रेनर्सच्या मार्गदर्शनाखाली बॉडीबिल्डिंग व फिटनेस ट्रेनिंग.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg",
    timingMr: "सकाळी ६:०० ते रात्री ९:३०",
    featuresMr: [
      "प्रमाणित पर्सनल ट्रेनर्स",
      "वातानुकूलित (AC) प्रिमियम परिसर",
      "कार्डिओ व व्हेट ट्रेनिंग मशीन्स",
      "विशेष डायट व पोषण आहार मार्गदर्शन"
    ]
  },
  {
    id: "swimming",
    icon: "🏊‍♂️",
    titleMr: "स्विमिंग पूल",
    titleEn: "Olympic Standard Swimming Pool",
    subMr: "ऑलिंपिक मानकांचा स्वच्छ पूल",
    subEn: "Clean Olympic standard filtered pool",
    descMr: "ऑलिंपिक मानकांनुसार बनवलेला स्वच्छ, २५ मीटरचा शुद्ध पाण्याचा पोहण्याचा तलाव. महिला व पुरुषांसाठी सुरक्षित व स्वतंत्र बॅचेस.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243460172.jpg",
    timingMr: "सकाळी ६:०० ते रात्री ८:००",
    featuresMr: [
      "ऑलिंपिक स्टँडर्ड फिल्टर्ड पाणी",
      "सुरक्षा गार्ड व एक्सपर्ट लाइफगार्ड",
      "स्वतंत्र चेंजिंग रूम व हॉट शॉवर",
      "लहान मुले व बिगिनर्स साठी विशेष ट्रेनिंग"
    ]
  },
  {
    id: "badminton",
    icon: "🏸",
    titleMr: "इनडोअर बॅडमिंटन",
    titleEn: "Indoor Badminton Arena",
    subMr: "आंतरराष्ट्रीय मानकांच्या कोर्टसह",
    subEn: "International standard wooden courts",
    descMr: "लाकडी सिंथेटिक मॅटिंग व आय-प्रोटेक्ट LED लाईटिंगसह सुसज्ज इनडोअर बॅडमिंटन कोर्ट. सर्व वयोगटातील लोकांसाठी खेळण्याची व सराव करण्याची उत्तम सोय.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444303.jpg",
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "प्र्रीमियम वूडन सिंथेटिक मॅटिंग",
      "प्रोफेशनल अँटी-ग्लेअर LED लाईटिंग",
      "रॅकेट व कॉक उपलब्ध",
      "टूर्नामेंट स्टँडर्ड कोर्ट्स"
    ]
  },
  {
    id: "pickleball",
    icon: "🏓",
    titleMr: "पिकलबॉल",
    titleEn: "Pickleball Court",
    subMr: "नवीन खेळ, मजा आणि फिटनेस",
    subEn: "Modern trending sport for total fitness",
    descMr: "जगातील सर्वात वेगाने लोकप्रिय होणारा पिकलबॉल खेळ! कुटुंबासोबत व मित्रांसोबत खेळण्यासाठी सांगलीतील भव्य पिकलबॉल कोर्ट.",
    img: "/images/pickleball-court.png",
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "सांगलीतील पहिले भव्य पिकलबॉल कोर्ट",
      "सोपा व आरोग्यदायी फिटनेस खेळ",
      "पॅडल्स व बॉल्स उपलब्ध",
      "सर्व वयोगटांसाठी अत्यंत सोयीचे"
    ]
  },
  {
    id: "yoga",
    icon: "🧘",
    titleMr: "योग & ध्यान कक्ष",
    titleEn: "Yoga & Meditation Studio",
    subMr: "शारीरिक व मानसिक आरोग्य संतुलन",
    subEn: "Physical and mental health harmony",
    descMr: "शांत, प्रसन्न व निसर्गरम्य वातावरणात योगाभ्यास, प्राणायाम व ध्यानधारणा. अनुभवी योगशिक्षकांकडून दररोज सकाळी व संध्याकाळी मार्गदर्शन.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841664.jpg",
    timingMr: "सकाळी ६:३० ते ९:०० व सायं. ५ ते ७",
    featuresMr: [
      "शांत व प्रसन्न वातानुकूलित हॉल",
      "प्राणायाम व योगासने वर्ग",
      "मानसिक ताणतणाव व BP मुक्ती",
      "ज्येष्ठ नागरिकांसाठी विशेष सोपा योगा"
    ]
  },
  {
    id: "zumba",
    icon: "💃",
    titleMr: "झुंबा & डान्स क्लास",
    titleEn: "Zumba & Fitness Dance",
    subMr: "एनर्जेटिक सेशन्स आणि प्रोफेशनल कोडिंग",
    subEn: "High energy zumba and dance workout",
    descMr: "संगीताच्या तालावर एनर्जेटिक झुंबा व फिटनेस डान्स सेशन्स. वजन नियंत्रित ठेवण्यासाठी व आनंदाने कॅलरी बर्न करण्यासाठी सर्वोत्तम उपक्रम.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357581614.png",
    timingMr: "सकाळी ७:०० ते ८:०० व सायं. ६ ते ७",
    featuresMr: [
      "प्रोफेशनल सर्टीफाइड झुंबा ट्रेनर्स",
      "हाय-फाय साऊंड व म्युझिक सिस्टीम",
      "मजबूत कार्डिओ वर्कआउट",
      "उत्साही व आनंदी वातावरण"
    ]
  },
  {
    id: "squash",
    icon: "🎾",
    titleMr: "स्क्वॅश कोर्ट",
    titleEn: "Squash Arena",
    subMr: "आंतरराष्ट्रीय मानकांच्या स्वच्छ कोर्ट",
    subEn: "International glass-back squash court",
    descMr: "आंतरराष्ट्रीय ग्लास-बॅक मानकांचे स्क्वॅश कोर्ट. जलद हालचाली, स्टॅमिना व उच्च फिटनेससाठी अतिशय उपयुक्त.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184843273.jpg",
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "ग्लास-बॅक आंतरराष्ट्रीय मानकांचे कोर्ट",
      "स्पेशल वूडन स्प्रंग फ्लोअरिंग",
      "रॅकेट व इक्विपमेंट सोय",
      "उच्च फिटनेस व स्टॅमिना वर्कआउट"
    ]
  },
  {
    id: "snooker",
    icon: "🎱",
    titleMr: "स्नूकर & पूल लाउंज",
    titleEn: "Snooker & Pool Lounge",
    subMr: "एकग्रता वाढवणारा स्नूकर आणि पूल टेबल",
    subEn: "Concentration boosting snooker and pool table",
    descMr: "प्रीमियम वूलन क्लोथवर आंतरराष्ट्रीय मानकांचे स्नूकर व पूल टेबल्स. वातानुकूलित लाउंजमध्ये एकाग्रता व मनोरंजनाचा आनंद.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357638129.jpg",
    timingMr: "सकाळी १०:०० ते रात्री ९:००",
    featuresMr: [
      "आंतरराष्ट्रीय मानकांचे स्नूकर टेबल्स",
      "प्रीमियम ८-बॉल पूल टेबल",
      "एसी लाउंज व सोफा सीटिंग",
      "मित्र-मैत्रिणींसोबत रिलॅक्सिंग वेळ"
    ]
  }
];

export const SportsSection: React.FC = () => {
  const [activeNav, setActiveNav] = useState("home");
  const { isEn } = useLanguage();
  const [selectedFacility, setSelectedFacility] = useState<FacilityDetail | null>(null);

  const [showRegModal, setShowRegModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    interest: "sports",
    message: ""
  });

  const handleSubmitReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  useEffect(() => {
    if (selectedFacility || showRegModal) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedFacility, showRegModal]);

  const toggleLang = () => setLang((l) => (l === "mr" ? "en" : "mr"));

  return (
    <div className="sp-v3-root">

      <div className="sp-container">
        {/* ══════════════════════════════════════════════════════════════
            2. HERO SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-clean-sec">
          {/* TOP LUXURY BANNER WITH KEN-BURNS ANIMATION & AMBIENT LIGHT ORBS */}
          <div className="sp-exact-banner-box">
            <div className="sp-banner-glow-orb-left" />
            <div className="sp-banner-glow-orb-right" />

            {/* FLOATING STAT BADGES */}
            <div className="sp-floating-stat-left hidden sm:block">
              🏆 १.५ एकर भव्य निसर्गरम्य संकुल
            </div>
            <div className="sp-floating-stat-right hidden sm:block">
              ⚡ १३+ आंतरराष्ट्रीय स्पोर्ट्स सोयी
            </div>

            <img
              src="/images/sports_hero_bg.png"
              alt="Preetam Sports Complex Sangli Aerial View"
              className="sp-exact-banner-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg";
              }}
            />
            <div className="sp-exact-banner-overlay">
              <div className="sp-exact-top-pill">
                <span className="sp-pulse-dot">⚡</span>
                <span>महाराष्ट्रातील १.५ एकर भव्य प्रीमियम संकुल</span>
              </div>

              <h1 className="sp-exact-banner-title">
                प्रीतम स्पोर्ट्स अँड फिटनेस क्लब
                <br />
                <span className="sp-title-highlight">• सांगली</span>
              </h1>

              <p className="sp-exact-banner-sub">
                वातानुकूलित जिम • ऑलिंपिक स्विमिंग पूल • इनडोअर बॅडमिंटन • पिकलबॉल • योग व ध्यान
              </p>

              <button 
                type="button"
                onClick={() => setShowRegModal(true)} 
                className="sp-hero-cta-btn"
                title="ऑनलाईन नोंदणी करा"
              >
                <span>✨ आजच ऑनलाईन सभासद नोंदणी करा</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* MIDDLE CHIPS ROW WITH VIBRANT EMOJIS & GLOW HOVER EFFECTS */}
          <div className="sp-exact-chips-row">
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏋️‍♂️</span> AC जिम व बॉडीबिल्डिंग</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏊‍♂️</span> ऑलिंपिक स्विमिंग पूल</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏸</span> इनडोअर बॅडमिंटन</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏓</span> पिकलबॉल Court</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🧘</span> योग व ध्यान धारणा</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">💃</span> झुंबा व डान्स क्लास</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🎾</span> स्क्वॅश ॲरेना</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🎱</span> स्नूकर लाउंज</div>
          </div>

        </section>

        {/* ══════════════════════════════════════════════════════════════
            3. "आमच्या सुविधा" 8 CARDS GRID
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-facilities-sec">
          <div className="sp-sec-header">
            <div className="sp-sec-badge">✨ प्रिमियम सोयी सुविधा</div>
            <h2 className="sp-sec-title-center">आमच्या सुविधा (विस्तृत माहितीसाठी कार्डवर क्लिक करा)</h2>
            <p className="sp-sec-subtitle">प्रीतम स्पोर्ट्स क्लबमधील जागतिक दर्जाच्या क्रीडा व फिटनेस सुविधा</p>
          </div>

          <div className="sp-facilities-grid">
            {facilityItems.map((item) => {
              const isActive = selectedFacility?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`sp-fac-card-v2 ${isActive ? "active-card" : ""}`}
                  onClick={() => setSelectedFacility(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sp-fac-img-box">
                    <img
                      src={item.img}
                      alt={item.titleMr}
                      className="sp-fac-img"
                    />
                  </div>
                  <div className="sp-fac-body">
                    <div className="sp-fac-info-title">{item.titleMr}</div>
                    <div className="sp-fac-info-sub">{item.subMr}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FACILITY DETAIL POPUP MODAL
           ══════════════════════════════════════════════════════════════ */}
        {selectedFacility &&
          createPortal(
            <div
              className="sp-modal-overlay"
              onClick={() => setSelectedFacility(null)}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
                <button
                  className="sp-modal-close-btn"
                  onClick={() => setSelectedFacility(null)}
                  title="बंद करा"
                >
                  ✕
                </button>

                <div className="sp-modal-hero-img-box">
                  <img
                    src={selectedFacility.img}
                    alt={selectedFacility.titleMr}
                    className="sp-modal-hero-img"
                  />
                  <div className="sp-modal-hero-badge">
                    <span>{selectedFacility.icon}</span>
                    <span>{selectedFacility.titleMr}</span>
                  </div>
                </div>

                <div className="sp-modal-content">
                  <div className="sp-modal-header">
                    <h3 className="sp-modal-title">
                      {selectedFacility.icon} {selectedFacility.titleMr}
                    </h3>
                    <div className="sp-modal-timing">
                      ⏰ उपलब्ध वेळ: <strong>{selectedFacility.timingMr}</strong>
                    </div>
                  </div>

                  <p className="sp-modal-desc">{selectedFacility.descMr}</p>

                  <div className="sp-modal-features-sec">
                    <h4 className="sp-modal-features-title">✨ मुख्य वैशिष्ट्ये व सोयी:</h4>
                    <ul className="sp-modal-features-list">
                      {selectedFacility.featuresMr.map((feat, idx) => (
                        <li key={idx} className="sp-modal-feat-item">
                          <span className="sp-feat-check">✔</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sp-modal-actions">
                    <a
                      href={`tel:${sportsClub.phones[0]}`}
                      className="sp-modal-btn-call"
                    >
                      📞 आजच बुकिंग करा
                    </a>
                    <a
                      href={`${sportsClub.whatsapp}&text=मला%20${encodeURIComponent(
                        selectedFacility.titleMr
                      )}%20बद्दल%20अधिक%20माहिती%20हवी%20आहे.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-modal-btn-wa"
                    >
                      💬 WhatsApp वर चौकशी करा
                    </a>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* ══════════════════════════════════════════════════════════════
            4. "आरोग्य, फिटनेस आणि आनंदाचा एकत्रित प्रवास!" GRID
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-journey-sec">
          <div className="sp-journey-grid">
            {/* LEFT CONTENT */}
            <div className="sp-journey-left">
              <div className="sp-journey-badge">✨ प्रीतम स्पोर्ट्स अँड फिटनेस क्लब • सांगली</div>
              <h2 className="sp-journey-title">
                आरोग्य, फिटनेस आणि <br />
                <span className="sp-title-gradient">आनंदाचा एकत्रित प्रवास!</span>
              </h2>
              <p className="sp-journey-sub">
                सुसज्ज वातानुकूलित जिम, ऑलिंपिक स्विमिंग पूल, इनडोअर बॅडमिंटन कोर्ट्स आणि निसर्गरम्य वातावरणात समृद्ध जीवनशैलीचा मनसोक्त आनंद घ्या.
              </p>
              
              <div className="sp-journey-highlights">
                <span className="sp-hl-chip">🏊‍♂️ ऑलिंपिक पूल</span>
                <span className="sp-hl-chip">🏋️‍♂️ AC जिम</span>
                <span className="sp-hl-chip">🏸 इन्डोअर कोर्ट्स</span>
                <span className="sp-hl-chip">🧘 योग & ध्यान</span>
              </div>

              <button 
                type="button"
                onClick={() => setShowRegModal(true)} 
                className="sp-btn-pink-hero cursor-pointer hover:scale-105 transition-transform"
                title="ऑनलाईन प्रवेश नोंदणी फॉर्म उघडा"
              >
                <PhoneCall size={18} />
                <span>आजच प्रवेश नोंदणी करा: {sportsClub.phones[0]}</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* RIGHT 6 PHOTO COLLAGE WITH LABELS */}
            <div className="sp-photo-collage">
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243460172.jpg"
                  alt="Pool"
                />
                <span className="sp-collage-label">🏊‍♂️ स्विमिंग पूल</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg"
                  alt="Gym"
                />
                <span className="sp-collage-label">🏋️‍♂️ AC जिम</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841664.jpg"
                  alt="Yoga"
                />
                <span className="sp-collage-label">🧘 योग व ध्यान</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444303.jpg"
                  alt="Badminton"
                />
                <span className="sp-collage-label">🏸 बॅडमिंटन</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357581614.png"
                  alt="Zumba"
                />
                <span className="sp-collage-label">💃 झुम्बा डान्स</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357638128.jpg"
                  alt="Club House"
                />
                <span className="sp-collage-label">🏢 प्रिमियम क्लब</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. ONLINE REGISTRATION ENQUIRY FORM MODAL
         ══════════════════════════════════════════════════════════════ */}
      {showRegModal && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0429] via-[#2d0739] to-[#0c0216] border-4 border-pink-500/40 rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-white my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
              className="absolute top-4 right-4 size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition font-black cursor-pointer z-20"
              aria-label="Close"
            >
              ✕
            </button>

            {!isSubmitted ? (
              <div>
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-black mb-2 shadow-inner">
                    ✨ ऑनलाईन प्रवेश व चौकशी नोंदणी
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    आजच प्रवेश नोंदणी करा
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-200/80 font-bold mt-1">
                    खालील माहिती भरा. आमची टीम लवकरच तुमच्याशी संपर्क साधेल!
                  </p>
                </div>

                <form onSubmit={handleSubmitReg} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      १. आपले संपूर्ण नाव *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="उदा. राहुल सचिन पाटील"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      २. संपर्क मोबाईल नंबर *
                    </label>
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      placeholder="उदा. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-pink-200 mb-1.5">
                        ३. शहर / गाव
                      </label>
                      <input 
                        type="text" 
                        placeholder="उदा. सांगली / मिरज"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-pink-200 mb-1.5">
                        ४. प्रवेशाचा प्रकार
                      </label>
                      <select 
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-slate-900 text-white border-2 border-white/20 rounded-2xl px-3 py-3 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                      >
                        <option value="sports" className="bg-[#0f172a] text-white font-bold">स्पोर्ट्स अँड फिटनेस क्लब</option>
                        <option value="anandshala" className="bg-[#0f172a] text-white font-bold">आनंदशाळा ज्येष्ठ नागरिक धाम</option>
                        <option value="both" className="bg-[#0f172a] text-white font-bold">दोन्ही (आनंदशाळा व स्पोर्ट्स)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      ५. विशेष टीप / संदेश (पर्यायी)
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="तुमचे काही प्रश्न असल्यास येथे लिहा..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-2.5 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span>कृपया वाट पहा...</span>
                    ) : (
                      <>
                        <span>फॉर्म सबमिट करा</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  अभिनंदन! नोंदणी सबमिट झाली.
                </h3>
                <p className="text-sm font-bold text-pink-200/90 leading-relaxed max-w-sm mx-auto mb-6">
                  धन्यवाद <strong>{formData.name}</strong>! आमची प्रीतम आनंदशाळा टीम लवकरच आपल्याशी फोन वर संवाद साधेल.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a 
                    href={`https://wa.me/91${sportsClub.phones[0]}?text=नमस्कार,%20मी%20फॉर्म%20भरला%20आहे.%20माझे%20नाव:%20${encodeURIComponent(formData.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <span>💬 WhatsApp वर मेसेज करा</span>
                  </a>

                  <button 
                    onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm border border-white/20 transition"
                  >
                    बंद करा
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default SportsSection;
