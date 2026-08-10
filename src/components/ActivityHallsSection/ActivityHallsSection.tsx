import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Puzzle, 
  Palette, 
  Music, 
  Monitor, 
  Ticket, 
  Waves, 
  Landmark,
  Users,
  ShieldCheck,
  Heart,
  Award,
  X,
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  BookOpen,
  Utensils,
  Film,
  Smile,
  Trees,
  Stethoscope
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useLanguage } from "@/lib/use-language";
import "./ActivityHallsSection.css";

interface HallDetail {
  id: string;
  title: string;
  category: string;
  desc: string;
  gamesList: string[];
  features: string[];
  icon: React.ReactNode;
  image: string;
  theme: string;
}

const hallsData: HallDetail[] = [
  {
    id: "01",
    title: "बौद्धिक खेळ हॉल",
    category: "इनडोअर गेम्स & मेमरी",
    desc: "ज्येष्ठ नागरिकांच्या बौद्धिक क्षमतेला चालना देण्यासाठी व मनोरंजनासाठी विशेष सुसज्ज बैठे खेळ हॉल. येथे मित्र-मैत्रिणींसोबत कॅरम, बुद्धिबळ व पत्त्यांच्या विविध खेळांचा आनंद घेता येतो.",
    gamesList: ["बुद्धीबळ (Chess)", "कॅरम (Carrom)", "पत्त्यांचे खेळ", "सापाशिडी व ल्युडो", "व्यापार व मेमरी गेम्स"],
    features: ["आरामदायक सोफे व टेबल", "प्रसन्न व वातानुकूलित वातावरण", "बौद्धिक विकास व ताणतणाव मुक्ती"],
    icon: <Puzzle size={28} />,
    image: "/images/subimg/baithe khel.png",
    theme: "theme-pink"
  },
  {
    id: "02",
    title: "आर्ट हॉल",
    category: "हस्तकला & चित्रकला",
    desc: "चित्रकला, हस्तकला, विणकाम आणि सर्जनशील कला शिकण्यासाठी व सराव करण्यासाठी प्रेरणादायी कला दालन. स्वतःच्या हाताने सुंदर वस्तू बनवून आनंद व मानधन मिळवण्याची सोय.",
    gamesList: ["चित्रकला (Painting)", "हस्तकला (Handicrafts)", "विणकाम व शिलाई", "मातीकाम व कागदी वस्तू", "ओरिगामी आर्ट"],
    features: ["सर्व कला साहित्य विनामूल्य उपलब्ध", "तज्ज्ञ शिक्षकांचे मार्गदर्शन", "तयार केलेल्या वस्तूंचे प्रदर्शन"],
    icon: <Palette size={28} />,
    image: "/images/subimg/aart hall.png",
    theme: "theme-blue"
  },
  {
    id: "03",
    title: "संगीत उपकरणे हॉल",
    category: "गायन व वाद्यवृंद",
    desc: "संगीत प्रेमींसाठी तबला, हार्मोनियम, पेटी, गिटार, पियानो, सॅक्सोफोन व बासरी शिकण्याचा व जुनी आवडती भावगीते-भक्तीगीते गाण्याचा विशेष संगीत हॉल.",
    gamesList: ["तबला व पेटी सराव", "गिटार व पियानो शिकणे", "बासरी व सॅक्सोफोन", "जुनी भावगीते व भक्तीगीते", "भजन & कीर्तन रियाझ"],
    features: ["ध्वनिरोधक (Soundproof) हॉल", "आधुनिक वाद्यवृंद उपकरणे", "सांस्कृतिक संगीतमय वातावरण"],
    icon: <Music size={28} />,
    image: "/images/subimg/sangit hall.png",
    theme: "theme-pink"
  },
  {
    id: "04",
    title: "माहिती तंत्रज्ञान हॉल",
    category: "डिजिटल लर्निंग & IT",
    desc: "आधुनिक युगात कॉम्प्युटर, लॅपटॉप, स्मार्टफोन, इंटरनेट, व्हॉट्सॲप, युट्यूब व ऑनलाइन सेवा सहज सोप्या भाषेत शिकण्यासाठी अत्याधुनिक डिजिटल लर्निंग हॉल.",
    gamesList: ["संगणक पायाभूत शिक्षण", "स्मार्टफोन & व्हॉट्सॲप", "ऑनलाइन बँकिंग & बिल पेमेंट", "व्हिडिओ कॉलिंग सोय", "डिजिटल फोटो एडिटिंग"],
    features: ["हाय-स्पीड विनामूल्य वाय-फाय", "वैयक्तिक मार्गदर्शक प्रशिक्षक", "अत्याधुनिक कॉम्प्युटर्स"],
    icon: <Monitor size={28} />,
    image: "/images/subimg/mahiti tantradyan hall.png",
    theme: "theme-blue"
  },
  {
    id: "05",
    title: "करमणूक हॉल",
    category: "मनोरंजन & अंताक्षरी",
    desc: "गप्पा-गोष्टी, अंताक्षरी, पासिंग गेम, जुने किस्से सांगणे आणि समूह खेळ खेळून हसत-खेळत वेळ घालवण्यासाठी आनंददायी मनोरंजन हॉल.",
    gamesList: ["अंताक्षरी स्पर्धा", "पासिंग द पार्सल", "गोष्टी व किस्से सांगणे", "नाटक व विनोदी स्कीट", "समूह मनोरंजन खेळ"],
    features: ["होम थिएटर & साऊंड सिस्टिम", "हसते-खेळते कौटुंबिक वातावरण", "प्रसन्न आसन व्यवस्था"],
    icon: <Ticket size={28} />,
    image: "/images/subimg/karmnuk hall.png",
    theme: "theme-purple"
  },
  {
    id: "06",
    title: "स्विमिंग पूल",
    category: "जलतरण & वॉटर थेरपी",
    desc: "ज्येष्ठ नागरिकांच्या आरोग्यासाठी व ताजगीसाठी ऑलिंपिक मानकांचा स्वच्छ फिल्टर केलेला तरणतलाव. वॉटर ॲरोबिक्स व हायड्रोथेरपी सराव सोय.",
    gamesList: ["जलतरण (Swimming)", "वॉटर ॲरोबिक्स", "हायड्रोथेरपी सराव", "जलक्रिडा व मनोरंजन"],
    features: ["२४ तास शुद्ध फिल्टर पाणी", "ज्येष्ठांसाठी सोपी खोली", "अनुभवी लाईफगार्ड्स व सुरक्षितता"],
    icon: <Waves size={28} />,
    image: "/images/subimg/swimming hall.png",
    theme: "theme-blue"
  },
  {
    id: "07",
    title: "संस्कार व संवाद हॉल",
    category: "धार्मिक & अध्यात्म",
    desc: "धार्मिक, सांस्कृतिक आणि अध्यात्मिक कार्यक्रमांसाठी पवित्र आणि शांत हॉल. प्रवचन, कीर्तन, भगवद्गीता पठण व ध्यानधारणेने मनःशांती मिळवण्याचे ठिकाण.",
    gamesList: ["प्रवचन व कीर्तन श्रवण", "भगवद्गीता व अध्यात्म पठण", "संस्कार वर्ग", "सामूहिक प्रार्थना & आरती"],
    features: ["शांत व प्रसन्न अध्यात्मिक ऊर्जा", "वातानुकूलित बैठक व्यवस्था", "अनुभवी वक्त्यांचे मार्गदर्शन"],
    icon: <Landmark size={28} />,
    image: "/images/subimg/sanskar sampraday hall.png",
    theme: "theme-pink"
  }
];

const ActivityHallsSection = () => {
  const [selectedHall, setSelectedHall] = useState<HallDetail | null>(null);
  const { isEn } = useLanguage();

  return (
    <section className="ah-section" id="activity-halls">
      
      {/* Header */}
      <Reveal>
        <div className="ah-header">
          {/* Left Badge */}
          <div className="ah-badge-left">
            <Users size={60} color="white" />
          </div>
          
          {/* Right Badge */}
          <div className="ah-badge-right">
            <Award size={30} />
            <span>
              {isEn ? "Joy, Health\n& Values" : "आनंद, आरोग्य\nआणि संस्कार\nयांचा संगम"}
            </span>
          </div>

          <div className="ah-header-subtitle">
            <span style={{ color: '#f472b6' }}>❖</span> {isEn ? "Anandshala's" : "आनंदशाळेतील"} <span style={{ color: '#f472b6' }}>❖</span>
          </div>
          <h2 className="ah-header-title">
            {isEn ? "15 Specialized " : "१५ विशेष "}
            <span className="blue-text">{isEn ? "Activity Halls" : "उपक्रम हॉल्स"}</span>
          </h2>
          <div className="ah-header-desc">
            {isEn
              ? "15 fully equipped luxury activity halls for daily joy, recreation and wellness! (Click card to view details)"
              : "आनंदशाळेत दररोज तुमच्या आवडीनुसार मनोरंजक आनंद घेता येईल असे 15 समृद्ध आणि सुसज्जीत हॉल्स! (माहिती पाहण्यासाठी कार्डवर क्लीक करा)"}
          </div>
        </div>
      </Reveal>

      <div className="ah-container">
        {/* Grid of Clean Non-Flipping Interactive Cards */}
        <div className="ah-grid">
          {hallsData.map((hall, index) => (
            <Reveal key={hall.id} delay={index * 80}>
              <div 
                className={`ah-card-clean ${hall.theme}`}
                onClick={() => setSelectedHall(hall)}
              >
                <div className="ah-card-num">{hall.id}</div>
                
                <div className="ah-card-img-wrapper">
                  <img src={hall.image} alt={hall.title} className="ah-card-img" />
                </div>

                <div className="ah-card-content">
                  <div className="ah-card-icon">{hall.icon}</div>
                  <h3 className="ah-card-title">{hall.title}</h3>
                  <div className="ah-card-action-btn">
                    <span>माहिती उघडा</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* HIGH-IMPACT ATTRACTIVE FEATURES CARDS STRIP */}
        <Reveal delay={300}>
          <div className="ah-features-strip">
            <div className="ah-feature-item">
              <div className="ah-feature-icon"><Users size={24}/></div>
              <span>सर्व वयोगटांसाठी<br/>उपयुक्त व सोयीचे</span>
            </div>
            <div className="ah-feature-item">
              <div className="ah-feature-icon"><ShieldCheck size={24}/></div>
              <span>सुरक्षित आणि<br/>अत्याधुनिक सुसज्ज सुविधा</span>
            </div>
            <div className="ah-feature-item">
              <div className="ah-feature-icon"><Heart size={24}/></div>
              <span>आरोग्य, आनंद आणि<br/>संस्कारांचा सुंदर संगम</span>
            </div>
            <div className="ah-feature-item">
              <div className="ah-feature-icon"><Award size={24}/></div>
              <span>अनुभवी आणि<br/>समर्पित तज्ज्ञ टीम</span>
            </div>
          </div>
        </Reveal>

        {/* ELEGANT SLEEK CTA BUTTON (SMALLER & COMPACT) */}
        <Reveal delay={400}>
          <div className="flex justify-center mt-6">
            <a href="tel:9370237633" className="ah-footer-cta-pill">
              <Sparkles size={18} className="text-amber-300 animate-pulse" />
              <span>आजच भेट द्या आणि आनंदशाळेचा अनुभव घ्या!</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </Reveal>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          POPUP MODAL WINDOW: ONE SIDE IMAGE, OTHER SIDE RICH DETAILS
         ══════════════════════════════════════════════════════════════ */}
      {selectedHall && typeof document !== "undefined" && createPortal(
        <div 
          className="ah-modal-overlay"
          onClick={() => setSelectedHall(null)}
        >
          <div 
            className="ah-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              className="ah-modal-close-btn"
              onClick={() => setSelectedHall(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* LEFT SIDE: HIGH-RES IMAGE & BADGE */}
            <div className="ah-modal-left-img-box">
              <img src={selectedHall.image} alt={selectedHall.title} className="ah-modal-img" />
              <div className="ah-modal-img-gradient" />
              <div className="ah-modal-img-badge">
                <Sparkles size={16} className="text-amber-300" />
                <span>आनंदशाळा उपक्रम हॉल {selectedHall.id}</span>
              </div>
            </div>

            {/* RIGHT SIDE: RICH DETAILED INFORMATION */}
            <div className="ah-modal-right-content">
              {/* CATEGORY BADGE */}
              <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 w-fit">
                <span>{selectedHall.category}</span>
              </div>

              {/* TITLE */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 shrink-0 shadow-sm">
                  {selectedHall.icon}
                </div>
                <h3 className="text-2xl font-black text-[#541A1A]">
                  {selectedHall.title}
                </h3>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-4">
                {selectedHall.desc}
              </p>

              {/* GAMES & ACTIVITIES LIST */}
              <div className="mb-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-pink-700 mb-2 flex items-center gap-1.5">
                  <Puzzle size={15} /> खेळ व उपक्रम सूची:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-extrabold text-slate-800">
                  {selectedHall.gamesList.map((g, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-pink-500">•</span>
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KEY FEATURES */}
              <div className="mb-5 space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  हॉलची मुख्य वैशिष्ट्ये:
                </h4>
                {selectedHall.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* CALL BUTTON & CLOSE */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto border-t border-slate-100">
                <a 
                  href="tel:9370237633" 
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition"
                >
                  <PhoneCall size={18} />
                  <span>अधिक माहितीसाठी कॉल करा: 9370237633</span>
                </a>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
};

export default ActivityHallsSection;
