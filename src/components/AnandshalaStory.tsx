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
  Star,
  GraduationCap,
  Stethoscope,
  Bus,
  Utensils,
  Gift
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
              माझ्या जन्माची बीजे रुजली गेली ती <strong>श्री. अभिनव जगन्नाथ कामाजी</strong>, रा. सांगली यांच्या स्वप्न प्रकल्पातून. अभिनव यांनी <strong>२६ जानेवारी २००० रोजी</strong> व्यवसाय सुरु केला व प्रत्येक वर्षी वर्धापन दिन, वाढदिवस, ज्येष्ठ नागरिक आनंद मेळावा व सहलीचे आयोजन करुन साजरा करतात. दि. <strong>१५ ऑगस्ट २०२३ रोजी</strong> स्वातंत्र्य दिनाच्या व ज्येष्ठ नागरिक आनंद मेळाव्याच्या शुभ मुहूर्तावर भूमिपूजन संपन्न झाले.
            </motion.p>

            <motion.p 
              className="as-story-paragraph"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              माझा जन्म म्हणजेच <strong>शुभारंभ दि. २६ जानेवारी २०२६</strong> आपल्या उपस्थितीत होईलच! सर्व ज्येष्ठ नागरिकांनी प्रवेशाची तयारी करुन स्वतःचे व इतरांचे म्हातारपण आनंदाने, उत्साहाने व निरोगी घालवण्यासाठी प्रवेश घेऊन माझ्या कुशीत यायचे आहे हे विसरु नये.
            </motion.p>
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
                  src="/images/anandshala_building_sky.jpg" 
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
                  onError={(e) => { e.currentTarget.src = "/images/anandshala_building_sky.jpg"; }}
                />
                <div className="as-founder-label">
                  <span className="as-founder-name">आनंदशाळा सोहळा</span>
                  <span className="as-founder-role">स्नेहमिलन व दीपप्रज्वलन</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>



        {/* ====================================
            4. FOUR PILLARS GRID (FULL-WIDTH 1600px CANVAS - ZERO WASTED WHITESPACE)
        ==================================== */}
        {/* REPLACEMENT SECTION: "प्रीतम यांची मदत करण्याची कार्य पद्धती" (UNIQUE PINK THEME INTERLOCKING TIMELINE PATHWAY) */}
        <div className="w-full max-w-7xl mx-auto my-16 px-4 sm:px-6 relative z-10" id="philanthropy">
          <div className="bg-gradient-to-br from-[#fdf0f5] via-[#fce7f3] to-[#fbcfe8] border-4 border-pink-300 rounded-[3rem] p-6 sm:p-12 shadow-[0_20px_50px_rgba(244,114,182,0.25)] relative text-slate-900 overflow-hidden isolate font-sans">
            
            {/* FLOATING SOFT AMBIENT LIGHT ORBS */}
            <div className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-pink-300/40 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-rose-300/40 blur-[120px]" />

            {/* SECTION HEADER BADGE & TITLE (PINK THEME) */}
            <div className="text-center mb-12 relative z-10 space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 text-[#810B38] font-black text-xs sm:text-base border-2 border-pink-300 shadow-md backdrop-blur-md"
              >
                <Sparkles size={18} className="text-pink-600 animate-pulse" />
                <span>✨ मातृभूमी व समाजसेवेचे पवित्र कार्य ✨</span>
                <Sparkles size={18} className="text-pink-600 animate-pulse" />
              </motion.div>

              {/* GULABI PINK 3D PILL HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative inline-block max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-[#810B38] via-[#be185d] to-[#e11d48] text-white text-xl sm:text-3xl lg:text-4xl font-black px-8 sm:px-14 py-4 sm:py-5 rounded-full shadow-[0_10px_35px_rgba(190,24,93,0.35)] border-4 border-white tracking-wide drop-shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  प्रीतम यांची मदत करण्याची कार्य पद्धती
                </div>
              </motion.div>
              <p className="text-pink-950/80 text-xs sm:text-sm font-extrabold max-w-2xl mx-auto pt-1">
                गोरगरीब, आपद्ग्रस्त, गरजू विद्यार्थी व रुग्णांना पारदर्शक व प्रत्यक्ष स्वरूपात आधार देण्याचा उपक्रम.
              </p>
            </div>

            {/* UNIQUE DESIGN: VERTICAL INTERLOCKING TIMELINE PATHWAY (NO BOX CARDS!) */}
            <div className="relative max-w-5xl mx-auto z-10 py-6">
              
              {/* VERTICAL CONNECTING DASHED RIBBON LINE */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-pink-400 via-rose-500 to-pink-600 rounded-full hidden md:block opacity-60 shadow-sm" />

              <div className="space-y-8 sm:space-y-12 relative">
                {[
                  {
                    num: "१",
                    icon: GraduationCap,
                    title: "🎓 शैक्षणिक मदत & सुसंस्कार",
                    color: "from-pink-500 to-rose-600",
                    badgeColor: "bg-pink-100 text-[#810B38] border-pink-300",
                    text: "गरजू विद्यार्थ्यांना शैक्षणिक मदत करणे, शाळेची, कोर्सेसची फी भरणे, शालेय साहित्य, सायकल देणे, योग्य मार्गदर्शन करणे, चुकीच्या वळणावर जाण्यापासून रोखणे असे कार्य सुद्धा खूप समाधान, सुख, समृद्धी देणारे ठरते."
                  },
                  {
                    num: "२",
                    icon: Stethoscope,
                    title: "🏥 औषधोपचार व वैद्यकीय मदत",
                    color: "from-rose-600 to-red-600",
                    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
                    text: "आमच्याकडे ऑपरेशन, औषधोपचार, आजारपणासाठी मदत मागायला बरेच लोक येत असतात आम्ही त्यांची सविस्तर माहिती घेतो, खरंच जर त्याला मदतीची गरज आहे असे जाणवले तर आम्ही पेशंट ॲडमिट असेल तर त्याला बघायला जातो, जर ऑपरेशनसाठी पैसा गोळा करत असेल तर त्यांच्याकडील कागदपत्रावरून डॉक्टरांना फोन करून खात्रीशीर माहिती विचारतो व डॉक्टरांच्या किंवा हॉस्पिटलच्या नावे चेक देतो व गरजेनुसार चिठ्ठी प्रमाणे औषध स्वतः आणून देतो त्यामुळे मदत सत्कर्मी लागते."
                  },
                  {
                    num: "३",
                    icon: Bus,
                    title: "🚌 आपत्कालीन व प्रवासाची मदत",
                    color: "from-amber-500 to-rose-500",
                    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
                    text: "आमच्याकडे पाकीट हरवले, मुलगा सापडत नाही, गावाला जायला पैसे नाहीत असे मदत मागणारे बऱ्याच व्यक्ती येतात आम्ही त्यांना माहिती विचारून खरंच अडचण असेल तर आमचा माणूस एसटी स्टैंड ला पाठवून तिकीट काढून थोडे फार खर्चाला पैसे देऊन गरजवंतांनाच थोडा वेळ खर्च करून मदत करतो."
                  },
                  {
                    num: "४",
                    icon: Utensils,
                    title: "🍲 क्षुधाशांती व अन्नदान मदत",
                    color: "from-emerald-600 to-teal-600",
                    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
                    text: "आमच्याकडे उपाशी आहे, भूक लागली आहे, मदत करा असेही लोक येतात आम्ही त्यांना खरोखरच जर भूक लागली असेल जेवण किंवा नाष्टा करणार असतील तर शेजारच्या हॉटेल मध्ये त्याला पाठवून त्याचे बिल आमचा माणूस देऊन मदत करतो. रोख रक्कम न देता त्याचा दारू, मटका, सिगरेट इत्यादीसाठी होणारा गैरवापर टाळतो."
                  },
                  {
                    num: "५",
                    icon: HeartHandshake,
                    title: "🤝 मानवता व आपुलकीचा आधार",
                    color: "from-purple-600 to-[#810B38]",
                    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
                    text: "अपंग, वयोवृद्ध, लाचार, गोर गरीब, गरीब विद्यार्थी यांना आप-आपल्या परिस्थितीनुसार मदत करा सदर मदत आपण जी मंदिर, नवस, हार, फुले यासाठी खर्च करतो त्यापेक्षा कितीतरी पटीने आशीर्वाद व शुभेच्छा देणारी भावनिक व माणुसकीची मन प्रसन्न करणारी ठरेल."
                  },
                  {
                    num: "६",
                    icon: Gift,
                    title: "🎂 वाढदिवस & समाजसेवा संकल्प",
                    color: "from-[#810B38] to-[#be185d]",
                    badgeColor: "bg-pink-100 text-[#810B38] border-pink-300",
                    text: "आपल्या वाढदिवसा दिवशी आपण जेवढा खर्च करणार आहात त्यातील ५ ते १० % खर्च गरजू ज्येष्ठ नागरिकांसाठी करा त्यांना चॉकलेट, नाष्टा, भेटवस्तू, जेवण किंवा कपडे दान करा व त्यांनी दिलेल्या आशीर्वादात न्हाऊन त्यांचे आशीर्वाद घेऊन पुण्यवान बना. उत्पन्नातील १ ते ५ % खर्च सत्कर्म, समाज सेवेसाठी खर्च करणे. ही नम्र विनंती."
                  }
                ].map((step, idx) => {
                  const IconComponent = step.icon;
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                      className={`flex flex-col md:flex-row items-center gap-6 ${
                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* CONTENT RIBBON STEP */}
                      <div className="w-full md:w-1/2">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-pink-200 shadow-lg hover:shadow-2xl hover:border-pink-400 transition-all duration-300 space-y-3 relative group">
                          
                          {/* BADGE ROW */}
                          <div className="flex items-center justify-between gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black border shadow-sm ${step.badgeColor}`}>
                              {step.title}
                            </span>
                            <span className="size-8 rounded-full bg-pink-100 text-[#810B38] font-black text-xs flex items-center justify-center border border-pink-300">
                              #{step.num}
                            </span>
                          </div>

                          {/* TEXT CONTENT */}
                          <p className="text-slate-800 font-extrabold text-sm sm:text-base leading-relaxed">
                            "{step.text}"
                          </p>
                        </div>
                      </div>

                      {/* CENTER TIMELINE NODE WITH STEP NUMBER */}
                      <div className="shrink-0 size-14 sm:size-16 rounded-full bg-gradient-to-r from-[#810B38] to-[#be185d] text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-xl border-4 border-white z-20 group-hover:scale-110 transition-transform">
                        <IconComponent size={26} />
                      </div>

                      {/* EMPTY SPACE FOR ALTERNATING LAYOUT */}
                      <div className="hidden md:block w-1/2" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* FOOTER SIGNOFF SEAL BADGE (PINK THEME) */}
            <div className="mt-12 flex items-center justify-end relative z-10">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="inline-flex items-center gap-3.5 bg-gradient-to-r from-[#810B38] via-[#be185d] to-[#e11d48] text-white px-8 py-4 rounded-full shadow-2xl border-2 border-white"
              >
                <span className="text-2xl animate-bounce">✍️</span>
                <span className="text-base sm:text-xl font-black italic tracking-wide">
                  आपला : अभिनव ज. कामाजी
                </span>
              </motion.div>
            </div>

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

