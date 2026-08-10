import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/use-language";
import "./AnandshalaStory.css";

import {
  Flower2,
  Landmark,
  HeartHandshake,
  Users,
  Target,
  Sparkles,
  Award,
  Trees,
  Calendar,
  Quote,
  ShieldCheck,
  Star
} from "lucide-react";

import buildingImage from "../assets/anandshala-building.png";

const AnandshalaStory: React.FC = () => {
  const { isEn } = useLanguage();

  const [selectedPillar, setSelectedPillar] = useState<{
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    desc: string;
    details: string[];
  } | null>(null);

  const pillars = [
    {
      id: "establishment",
      icon: <Landmark className="as-pillar-icon-svg" />,
      title: isEn ? "Foundation" : "स्थापना",
      subtitle: isEn ? "Since 26 January 2000" : "२६ जानेवारी २००० पासून",
      image: "/images/aandshala_img.png",
      desc: isEn
        ? "Business foundation laid on 26 January 2000. 26-year legacy of organizing annual foundation day & senior citizen meetups."
        : "२६ जानेवारी २००० रोजी व्यवसायाची पायाभरणी झाली. दरवर्षी वाढदिवस दिन व भव्य नागरिक मेळावा आयोजनाची २६ वर्षांची परंपरा.",
      badge: isEn ? "History & Legacy" : "इतिहास व परंपरा",
      color: "from-pink-500 to-rose-600",
      details: isEn
        ? [
            "Foundation laid on 26 January 2000 by Mr. Abhinav Kakani.",
            "26+ years of continuous social, medical & community service.",
            "Enthusiastic annual participation of thousands of senior citizens."
          ]
        : [
            "२६ जानेवारी २००० रोजी श्री. अभिनव काकाणी यांच्या हस्ते पायाभरणी.",
            "गेल्या २६ वर्षांपासून अविरत सामाजिक, वैद्यकीय व सेवा कार्य.",
            "दरवर्षी हजारो ज्येष्ठ नागरिकांचा उत्स्फूर्त सहभाग सोहळा."
          ]
    },
    {
      id: "service",
      icon: <HeartHandshake className="as-pillar-icon-svg" />,
      title: isEn ? "Service" : "सेवा",
      subtitle: isEn ? "Dedication & Warmth" : "समर्पण आणि आपुलकी",
      image: "/images/aandshala sahal 1.jpeg",
      desc: isEn
        ? "Rich culture of service, values and excellent activities. Tireless dedication for senior citizens' health and happiness."
        : "सेवा, संस्कार आणि उत्कृष्ट उपक्रमांची समृद्ध संस्कृती. ज्येष्ठ नागरिकांच्या उत्तम आरोग्यासाठी आणि आनंदासाठी अविरत कार्य.",
      badge: isEn ? "Values & Belonging" : "संस्कार व आपुलकी",
      color: "from-purple-500 to-indigo-600",
      details: isEn
        ? [
            "24×7 trained nurse & caretaker staff service.",
            "Nutritious, organic, home-cooked pure vegetarian food.",
            "Warm, affectionate & family-like trustworthy atmosphere."
          ]
        : [
            "२४×७ प्रशिक्षित नर्स व केअरटेकर स्टाफ सेवा.",
            "सकस, सेंद्रिय, घरगुती पद्धतीचा शाकाहारी आहार.",
            "मायेचे, आपुलकीचे व कौटुंबिक विश्वासाचे वातावरण."
          ]
    },
    {
      id: "participation",
      icon: <Users className="as-pillar-icon-svg" />,
      title: isEn ? "Participation" : "सहभाग",
      subtitle: isEn ? "Joy of Togetherness" : "एकत्र येण्याचा आनंद",
      image: "/images/aandmelav 10.jpeg",
      desc: isEn
        ? "Thousands of senior citizens actively participate in annual events & meetups. A continuous movement preserving togetherness."
        : "दरवर्षी विविध सोहळे व मेळाव्यात हजारो ज्येष्ठ नागरिकांचा उत्स्फूर्त सहभाग. आपुलकीचे नाते जपणारी अखंड चळवळ.",
      badge: isEn ? "Community Spirit" : "लोकसहभाग",
      color: "from-blue-500 to-cyan-600",
      details: isEn
        ? [
            "Daily indoor games, chess, carrom & music sessions.",
            "Festivals, cultural events, bhajan & spiritual gatherings.",
            "Joyful living with like-minded friends of your age."
          ]
        : [
            "दररोज इनडोअर गेम्स, बुद्धिबळ, कॅरम व संगीत.",
            "सण, उत्सव, भजने, कीर्तने व संस्कृती सोहळे.",
            "समविचारी मित्र-मैत्रिणींसोबत आनंदी जीवन."
          ]
    },
    {
      id: "mission",
      icon: <Target className="as-pillar-icon-svg" />,
      title: isEn ? "Mission" : "ध्येय",
      subtitle: isEn ? "Positive Lifestyle" : "सकारात्मक जीवनशैली",
      image: "/images/anandshala_hero_bg.png",
      desc: isEn
        ? "India's premier 1.5-acre digital campus. Our mission is providing enthusiasm & boundless joy at every stage of life."
        : "१.५ एकर निसर्गरम्य परिसरात भारतातील पहिला भव्य प्रकल्प. आयुष्याच्या प्रत्येक टप्प्यावर उत्साह व निरामय आनंद देणे हेच ध्येय.",
      badge: isEn ? "Core Vision" : "उद्दिष्ट",
      color: "from-amber-500 to-pink-600",
      details: isEn
        ? [
            "1.5-acre scenic digital sanctuary campus.",
            "55-foot grand Radha Krishna idol & Satsang center.",
            "Dignity, self-respect & happiness for every senior citizen."
          ]
        : [
            "१.५ एकर निसर्गरम्य हक्काचा डिजिटल प्रकल्प परिसर.",
            "५५ फुटांची भव्य राधाकृष्ण मूर्ती व सत्संग केंद्र.",
            "ज्येष्ठ नागरिकांचा सन्मान, स्वाभिमान व आनंद."
          ]
    }
  ];

  const stats = [
    {
      icon: <Calendar className="as-stat-icon" />,
      value: isEn ? "26+ Yrs" : "२६+ वर्षे",
      label: isEn ? "Legacy of Service" : "सामाजिक सेवेचा वारसा"
    },
    {
      icon: <Trees className="as-stat-icon" />,
      value: isEn ? "1.5 Acres" : "१.५ एकर",
      label: isEn ? "Scenic Campus" : "निसर्गरम्य परिसर"
    },
    {
      icon: <Users className="as-stat-icon" />,
      value: isEn ? "Thousands" : "हजारो",
      label: isEn ? "Senior Members" : "ज्येष्ठ नागरिक सहभाग"
    },
    {
      icon: <Award className="as-stat-icon" />,
      value: isEn ? "#1" : "१ लाच",
      label: isEn ? "Grand Project in India" : "भारतातील भव्य प्रकल्प"
    }
  ];

  return (
    <section className="as-redesign-wrapper" id="anandshala-story">
      {/* Background Decorative Blur & Elements */}
      <div className="as-bg-glow-1" />
      <div className="as-bg-glow-2" />

      <div className="as-container">
        
        {/* ====================================
            1. SECTION HEADER
        ==================================== */}
        <div className="as-header-section">
          <motion.div 
            className="as-badge-pill"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="as-badge-icon" />
            <span>{isEn ? "Our Legacy • Our Inspiration" : "आपली परंपरा • आमची प्रेरणा"}</span>
          </motion.div>

          <motion.h2 
            className="as-hero-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isEn ? "The Inspiring " : "आनंदशाळेची "}
            <span className="as-title-gradient">
              {isEn ? "Story of Anandshala" : "प्रेरणादायी कहाणी"}
            </span>
          </motion.h2>

          <motion.div className="as-title-underline" />
        </div>

        {/* ====================================
            2. HERO STORY CONTENT & DUAL IMAGE SHOWCASE
        ==================================== */}
        <div className="as-story-grid">
          {/* Left Side: Story Text & Highlights Card with Rich Animations */}
          <motion.div 
            className="as-story-text-card"
            initial={{ opacity: 0, x: -50, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ y: -6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div 
              className="as-card-tag"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flower2 className="as-flower-icon" />
              </motion.div>
              <span>{isEn ? "A World Built From Dreams" : "स्वप्नातून साकारलेली सृष्टी"}</span>
            </motion.div>

            <motion.h3 
              className="as-story-subheading"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              ज्येष्ठ नागरिकांच्या जीवनात <span className="as-highlight-pink">नवा आनंद</span> पेरण्याचा ध्यास
            </motion.h3>

            <motion.p 
              className="as-story-paragraph"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              माझ्या जन्माची बीजे रुजली ती <strong>श्री. अभिनव जगन्नाथ काकाणी</strong> (ता. सांगली) यांच्या स्वप्नातून. 
              अभिनव यांनी <strong>२६ जानेवारी २०००</strong> रोजी व्यवसायाची सुरुवात केली. 
              दरवर्षी वाढदिवस दिन, स्नेहमेळावा व ज्येष्ठ नागरिक मेळावा आयोजित करून तो अत्यंत उत्साहात व प्रेमाने साजरा केला जातो.
            </motion.p>

            <motion.p 
              className="as-story-paragraph"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              ज्येष्ठ नागरिकांना हक्काचे व्यासपीठ, आरोग्यदायी वातावरण आणि विरंगुळा मिळावा या उद्देशाने सांगली शहरात 
              <strong> १.५ एकर निसर्गरम्य जागेवर </strong> हा भव्य प्रकल्प साकारला आहे.
            </motion.p>

            {/* Animated Trust Badges */}
            <div className="as-trust-pills">
              <motion.div 
                className="as-trust-item"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -2, backgroundColor: "#fce7f3" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <ShieldCheck className="as-trust-icon" />
                <span>१००% सुरक्षित व आपुलकीचे वातावरण</span>
              </motion.div>

              <motion.div 
                className="as-trust-item"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -2, backgroundColor: "#fce7f3" }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Star className="as-trust-icon" />
                <span>भारतातील एकमेव अद्वितीय संकल्पना</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Visual Overlapping Image Showcase */}
          <motion.div 
            className="as-visual-wrapper"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="as-image-frame-container">
              {/* Building Image */}
              <motion.div 
                className="as-main-img-box"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={buildingImage} 
                  alt="प्रीतम आनंदशाळा इमारत" 
                  className="as-main-img" 
                />
                <div className="as-img-overlay-gradient" />
              </motion.div>

              {/* Overlapping Event Image with Entrance & Hover Animations */}
              <motion.div 
                className="as-overlap-img-box"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.06, rotate: 1, y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <img 
                  src="/images/imgever.JPG" 
                  alt="आनंदशाळा स्नेहमिलन व दीपप्रज्वलन सोहळा" 
                  className="as-overlap-img"
                  onError={(e) => { e.currentTarget.src = buildingImage; }}
                />
                <div className="as-founder-label">
                  <span className="as-founder-name">आनंदशाळा सोहळा</span>
                  <span className="as-founder-role">स्नेहमिलन व दीपप्रज्वलन</span>
                </div>
              </motion.div>

              {/* Floating Glass Badge with Continuous Motion */}
              <motion.div 
                className="as-floating-glass-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.5, delay: 0.5 },
                  scale: { duration: 0.5, delay: 0.5 }
                }}
              >
                <div className="as-glass-badge-icon">
                  <Sparkles size={20} />
                </div>
                <div className="as-glass-badge-text">
                  <strong>सांगलीचे भूषण</strong>
                  <span>सर्वोत्कृष्ट सेवा संकल्पना</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ====================================
            3. STATS STRIP
        ==================================== */}
        <motion.div 
          className="as-stats-strip"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((st, idx) => (
            <div key={idx} className="as-stat-card">
              <div className="as-stat-icon-wrapper">
                {st.icon}
              </div>
              <div className="as-stat-details">
                <h4 className="as-stat-value">{st.value}</h4>
                <p className="as-stat-label">{st.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ====================================
            4. FOUR PILLARS GRID (FULL-WIDTH 1600px CANVAS - ZERO WASTED WHITESPACE)
        ==================================== */}
        <div className="as-pillars-section w-full max-w-[1600px] mx-auto bg-gradient-to-b from-slate-50/90 via-pink-50/50 to-purple-50/60 p-5 sm:p-8 lg:p-10 rounded-[3rem] border-2 border-pink-200/80 shadow-2xl my-12">
          <div className="as-pillars-header text-center mb-8">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-100/80 text-[#be185d] font-black text-sm mb-3 shadow-sm border border-pink-200"
            >
              <Sparkles size={16} className="text-pink-600 animate-pulse" />
              <span>आमची प्रमुख वैशिष्ट्ये</span>
            </motion.span>

            <motion.h3 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="as-pillars-title font-black text-3xl sm:text-4xl lg:text-5xl text-[#0f172a]"
            >
              आनंदशाळेचे <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">चार मुख्य स्तंभ</span>
            </motion.h3>

            <p className="text-slate-600 text-sm sm:text-lg font-black max-w-2xl mx-auto mt-3 leading-relaxed">
              ज्येष्ठ नागरिकांच्या सुखी, निरामय व सन्मानजनक आयुष्यासाठी उभारलेले ४ भक्कम आधारस्तंभ
            </p>
          </div>

          {/* FULL-WIDTH 4-COLUMN CARDS GRID (EXPANDS TO FILL 1600px SCREEN) */}
          <div className="as-pillars-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            {pillars.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 55 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -14 }}
                className="group relative p-[3.5px] rounded-[2.6rem] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:via-purple-400 hover:to-rose-500 shadow-xl hover:shadow-[0_25px_80px_rgba(219,39,119,0.45)] transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedPillar(item)}
                title={`${item.title} - सविस्तर माहिती पाहण्यासाठी क्लीक करा`}
              >
                {/* INNER CARD BODY */}
                <div className="as-pillar-card bg-white rounded-[2.35rem] overflow-hidden size-full flex flex-col justify-between">
                  <div>
                    {/* HUGE 320px IMAGE CONTAINER WITH ZOOM HOVER */}
                    <div className="as-pillar-img-box overflow-hidden relative h-64 sm:h-80 lg:h-[320px]">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="as-pillar-img w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => { e.currentTarget.src = buildingImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
                      
                      <span className="as-pillar-img-badge absolute top-5 right-5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-sm sm:text-base font-black px-5 py-2.5 rounded-full shadow-2xl border border-white/30 backdrop-blur-md">
                        ✨ {item.badge}
                      </span>
                    </div>

                    {/* MASSIVE CARD CONTENT & TYPOGRAPHY */}
                    <div className="as-pillar-body p-7 sm:p-9">
                      <div className="as-pillar-header-row flex items-center gap-5 mb-5">
                        <div className={`as-pillar-icon-badge bg-gradient-to-r ${item.color} size-16 sm:size-20 rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shrink-0`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="as-pillar-name text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] group-hover:text-pink-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className="as-pillar-subtitle text-sm sm:text-base font-black text-pink-600 block mt-1">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <p className="as-pillar-desc text-base sm:text-lg font-extrabold text-slate-700 leading-relaxed">
                        {item.desc}
                      </p>
                      
                      <div className="mt-4 text-xs sm:text-sm font-black text-pink-600 flex items-center gap-1">
                        <span>सविस्तर माहिती पहा</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  {/* GLOWING ACCENT BOTTOM BAR */}
                  <div className={`h-2.5 w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PILLAR CLICK DETAILS MODAL POPUP
           ══════════════════════════════════════════════════════════════ */}
        {selectedPillar && typeof document !== "undefined" && createPortal(
          <div 
            className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPillar(null)}
          >
            <div 
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border-4 border-pink-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPillar(null)}
                className="absolute top-4 right-4 size-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition font-black cursor-pointer z-20 shadow-md"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden mb-5 border-2 border-pink-100 shadow-md">
                <img src={selectedPillar.image} alt={selectedPillar.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
                  ✨ {selectedPillar.badge}
                </span>
                <h3 className="absolute bottom-3 left-4 text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                  {selectedPillar.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base font-extrabold text-slate-700 leading-relaxed mb-5">
                {selectedPillar.desc}
              </p>

              <div className="space-y-2.5 mb-6 bg-pink-50/60 p-4 rounded-2xl border border-pink-100">
                <h4 className="font-black text-pink-700 text-sm">वैशिष्ट्ये व प्रमुख माहिती:</h4>
                {selectedPillar.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                    <span className="text-pink-600 font-black shrink-0">✓</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setSelectedPillar(null)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black text-sm sm:text-base shadow-xl hover:scale-[1.02] transition cursor-pointer"
              >
                माहिती बंद करा
              </button>
            </div>
          </div>,
          document.body
        )}

        {/* ====================================
            5. HEARTFELT VISION QUOTE BANNER
        ==================================== */}
        <motion.div 
          className="as-quote-banner"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Quote className="as-quote-bg-icon" />

          <div className="as-quote-content">
            <div className="as-quote-badge">
              <Flower2 size={18} />
              <span>संस्थापकांचे मनोगत</span>
            </div>

            <blockquote className="as-quote-text">
              "माणूस एकटा राहणारा, बोलणारा, नाती जपणारा असतो. पाखरे मोठी होऊन दूर देशी जातात तेव्हा मागे उरतात त्या फक्त आठवणी आणि एकांत...<br />
              याच विचारातून ही संकल्पना समोर आली – <strong>ज्येष्ठ नागरिकांसाठी एक अशी 'शाळा', जिथे रोज नवा आनंद शिकायला मिळेल.</strong>"
            </blockquote>

            <div className="as-quote-author">
              <div className="as-author-line" />
              <div>
                <h4 className="as-author-name">श्री. अभिनव जगन्नाथ काकाणी</h4>
                <p className="as-author-title">संस्थापक व मार्गदर्शक • प्रीतम आनंदशाळा, सांगली</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AnandshalaStory;

