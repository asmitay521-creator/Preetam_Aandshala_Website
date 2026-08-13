import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  Gift, 
  Sparkles, 
  Bus, 
  Utensils, 
  Home, 
  Heart,
  Table as TableIcon,
  Grid as GridIcon,
  Tag,
  BadgePercent,
  Check,
  Star,
  Award,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAdminStore } from "@/lib/admin-store";
import "./PricingSection.css";

interface RateItem {
  id: string;
  title: string;
  category: string;
  sectionGroup: "school" | "stay" | "food" | "bus";
  icon: string;
  yearly: string;
  monthly: string;
  weekly: string;
  daily: string;
  popular?: boolean;
  desc: string;
  features: string[];
}

const rateItems: RateItem[] = [
  {
    id: "01",
    title: "ज्येष्ठ नागरिक आनंद शाळा (११ ते ५) फी",
    category: "आनंदशाळा उपक्रम फी",
    sectionGroup: "school",
    icon: "🏫",
    yearly: "₹३६,०००/-",
    monthly: "₹३,६००/-",
    weekly: "₹१,०११/-",
    daily: "₹१८०/-",
    popular: true,
    desc: "सकाळी ११ ते ५ आनंदशाळा हजेरी, १५ उपक्रम हॉल्स, संगीत, कला, वाचनालय व गप्पागोष्टी सोयी.",
    features: ["सकाळी ११:०० ते ५:०० उपस्थिती", "१५ विशेष उपक्रम हॉल्स वापर", "योगा, प्राणायाम व ध्यानधारणा"]
  },
  {
    id: "02",
    title: "आनंद निवास ३ शेअरिंग रेग्युलर रूम फी",
    category: "निवास (३ शेअरिंग)",
    sectionGroup: "stay",
    icon: "🛏️",
    yearly: "₹३६,०००/-",
    monthly: "₹३,६००/-",
    weekly: "₹१,०११/-",
    daily: "₹१८०/-",
    desc: "३ व्यक्ती शेअरिंग आरामदायक रूम, बेड, कपाट, टेबल, टी.व्ही. व आवश्यक सर्व सुविधा.",
    features: ["३ प्लायवूड बेड व कपाट", "टी.व्ही. व एअर कूलर", "२४ तास देखभाल व सुरक्षा"]
  },
  {
    id: "03",
    title: "आनंद निवास २ शेअरिंग रेग्युलर रूम फी",
    category: "निवास (२ शेअरिंग रेग्युलर)",
    sectionGroup: "stay",
    icon: "🏠",
    yearly: "₹४८,०००/-",
    monthly: "₹४,८००/-",
    weekly: "₹१,३५०/-",
    daily: "₹२३०/-",
    desc: "२ व्यक्ती शेअरिंग रेग्युलर रूम, दुहेरी सोयींनी युक्त निवास व मोकळे वातावरण.",
    features: ["२ प्लायवूड बेड व २ कपाटे", "टी.व्ही. व आराम खुर्ची", "स्वच्छ पायपुसणी व स्लिपर सोय"]
  },
  {
    id: "04",
    title: "आनंद निवास २ शेअरिंग डीलक्स रूम फी",
    category: "निवास (२ शेअरिंग डीलक्स)",
    sectionGroup: "stay",
    icon: "✨",
    yearly: "₹६०,०००/-",
    monthly: "₹६,०००/-",
    weekly: "₹१,६८०/-",
    daily: "₹२९०/-",
    popular: true,
    desc: "२ व्यक्ती शेअरिंग वातानुकूलित डीलक्स रूम, डबल बेड, काचेचा टीपॉय व उत्तम इंटीरियर.",
    features: ["डबल बेड व २ कपाटे", "काचेचा टीपॉय व टी.व्ही.", "वातानुकूलित / एअर कूलर सोय"]
  },
  {
    id: "05",
    title: "आनंद निवास २ शेअरिंग प्रिमीअर रूम फी",
    category: "निवास (२ शेअरिंग प्रिमीअर)",
    sectionGroup: "stay",
    icon: "👑",
    yearly: "₹७२,०००/-",
    monthly: "₹७,२००/-",
    weekly: "₹२,०००/-",
    daily: "₹३५०/-",
    desc: "२ व्यक्ती शेअरिंग लक्झरी प्रिमीअर बेडरूम सेट, वॉर्डरोब, टी.व्ही. शोकेस व प्रिमियम फर्निचर.",
    features: ["बेडरूम सेट व प्रिमियम वॉर्डरोब", "फॅन्सी इंटीरियर व टी.व्ही. शोकेस", "लक्झरी कम्फर्ट व रूम सर्व्हिस"]
  },
  {
    id: "06",
    title: "आनंद शाळा चहा १, नाष्टा १, जेवण १",
    category: "खानपान (१ वेळ चहा/नाष्टा/जेवण)",
    sectionGroup: "food",
    icon: "🍽️",
    yearly: "₹३०,०००/-",
    monthly: "₹३,०००/-",
    weekly: "₹८५०/-",
    daily: "₹१५०/-",
    desc: "१ वेळ ताजा चहा, १ वेळ स्वादिष्ट नाष्टा व १ वेळ घरगुती पौष्टिक शाकाहारी जेवण.",
    features: ["सकस व पचनास हलका आहार", "ताजे सेंद्रिय पदार्थ", "स्वच्छ वातानुकूलित डायनिंग"]
  },
  {
    id: "07",
    title: "आनंद शाळा चहा २, नाष्टा २, जेवण २",
    category: "खानपान (२ वेळ संपूर्ण आहार)",
    sectionGroup: "food",
    icon: "🍲",
    yearly: "₹६०,०००/-",
    monthly: "₹६,०००/-",
    weekly: "₹१,७००/-",
    daily: "₹३००/-",
    popular: true,
    desc: "२ वेळ चहा, २ वेळ नाष्टा आणि २ वेळ पूर्ण जेवण (दुपारी व संध्याकाळी).",
    features: ["२ वेळ चहा & २ वेळ नाष्टा", "दुपारचे & संध्याकाळचे पूर्ण जेवण", "पौष्टिक गोड & सॅलड सोय"]
  },
  {
    id: "08",
    title: "आनंद शाळा स्कुल बसने जाणे-येणे रेग्युलर",
    category: "वाहतूक (रेग्युलर रूट बस)",
    sectionGroup: "bus",
    icon: "🚌",
    yearly: "₹१८,०००/-",
    monthly: "₹१,८००/-",
    weekly: "₹५००/-",
    daily: "₹९०/-",
    desc: "सांगली शहरातील मुख्य स्टॉप्सवरून आनंदशाळेत सुरक्षित बसने जाणे-येणे सोय.",
    features: ["सुरक्षित बस प्रवास", "वेळेवर पिकअप व ड्रॉप", "प्रशिक्षित बस चालक & मदतनीस"]
  },
  {
    id: "09",
    title: "आनंद शाळा स्कुल बसने जाणे-येणे प्रिमीअर",
    category: "वाहतूक (प्रिमीअर दारातून पिकअप)",
    sectionGroup: "bus",
    icon: "🚐",
    yearly: "₹२७,०००/-",
    monthly: "₹२,७००/-",
    weekly: "₹७६०/-",
    daily: "₹१३०/-",
    desc: "घरच्या दारातून थेट पिकअप व ड्रॉप करणारी विशेष लक्झरी प्रिमीअर ट्रान्सपोर्ट सेवा.",
    features: ["थेट घराच्या दारातून पिकअप", "वातानुकूलित आरामदायी गाडी", "विशेष वैयक्तिक काळजी"]
  }
];

type FreqType = "overview" | "yearly" | "monthly" | "weekly" | "daily";

interface SelectedPackageModal {
  item: RateItem;
  priceInfo: { amount: string; term: string; unit: string };
}

const PricingSection: React.FC = () => {
  const store = useAdminStore();
  const [activeTab, setActiveTab] = useState<FreqType>("overview");
  const [clickedTab, setClickedTab] = useState<FreqType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackageModal | null>(null);

  const tabLabels = [
    { key: "overview", label: "पॅकेज मुख्य पृष्ठ", icon: "🌟", badge: "४ मुख्य पर्याय", sub: "१ वार्षिक, १ मासिक, १ आठवडा, १ दैनिक" },
    { key: "yearly", label: "वार्षिक पॅकेजेस", icon: "📅", badge: "सर्वात लोकप्रिय", sub: "३६,०००/वर्ष पासून" },
    { key: "monthly", label: "मासिक पॅकेजेस", icon: "🗓️", badge: "सुविधाजनक", sub: "३,६००/महिना पासून" },
    { key: "weekly", label: "आठवडा पॅकेजेस", icon: "📆", badge: "शॉर्ट टर्म", sub: "८५०/आठवडा पासून" },
    { key: "daily", label: "दैनिक पॅकेजेस", icon: "⏰", badge: "डे-पास", sub: "९०/दिवस पासून" },
  ];

  const getPriceForTab = (item: RateItem, tab: FreqType) => {
    switch (tab) {
      case "yearly": return { amount: item.yearly, term: "वार्षिक फी", unit: "/ वर्ष" };
      case "monthly": return { amount: item.monthly, term: "मासिक फी", unit: "/ महिना" };
      case "weekly": return { amount: item.weekly, term: "आठवडा फी", unit: "/ आठवडा" };
      case "daily": return { amount: item.daily, term: "दैनिक फी", unit: "/ दिवस" };
      default: return { amount: item.monthly, term: "मासिक फी", unit: "/ महिना" };
    }
  };

  const selectTabHandler = (tabKey: FreqType) => {
    setActiveTab(tabKey);
    setClickedTab(tabKey);
  };

  return (
    <section className="ps-official-section" id="pricing">
      
      {/* ── HEADER BANNER ── */}
      <Reveal>
        <div className="ps-official-header text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight flex flex-col items-center gap-1.5 text-[#831843]">
            <span className="text-[#831843] font-black drop-shadow-sm">
              प्रीतम ज्येष्ठ नागरिक <span className="text-[#be185d] font-black">आनंदशाळा</span>
            </span>
            <span className="text-[#be185d] font-black drop-shadow">— अधिकृत दरपत्रक —</span>
          </h2>

          <p className="text-base sm:text-xl font-extrabold text-[#70092b] leading-relaxed max-w-4xl mx-auto">
            आनंदात जगायच, आरोग्य जपायच, <span className="text-[#be185d] font-black">आनंदशाळेत</span> येऊन स्वप्न साकारायच!
          </p>
        </div>
      </Reveal>

      {/* ── STANDALONE TAB CARDS NAVIGATION (ALL WHITE UNTIL CLICKED) ── */}
      <Reveal delay={100}>
        <div className="ps-tabs-grid mb-10">
          {tabLabels.map((t) => {
            const isClickedActive = clickedTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => selectTabHandler(t.key as FreqType)}
                className={`ps-standalone-tab-card ${isClickedActive ? "ps-tab-card-active" : ""}`}
              >
                <div className="ps-tab-card-top">
                  <span className="ps-tab-card-icon">{t.icon}</span>
                  {t.badge && (
                    <span className={`ps-tab-card-badge ${isClickedActive ? "bg-white text-pink-700 font-black text-xs" : "bg-pink-100 text-pink-700 font-extrabold text-xs"}`}>
                      {t.badge}
                    </span>
                  )}
                </div>

                <div className="text-left mt-2">
                  <span className="ps-tab-card-title">{t.label}</span>
                  <span className="ps-tab-card-sub">{t.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════
          MODE 1: OVERVIEW SHOWING 4 DISTINCT FREQUENCY SUMMARY CARDS
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <Reveal delay={200}>
          <div className="ps-overview-section">


            <div className="ps-overview-4grid">
              
              {/* 1. YEARLY SUMMARY CARD */}
              <div 
                className="ps-overview-card"
                onClick={() => selectTabHandler("yearly")}
              >
                <div className="ps-card-top-tag"><Sparkles size={14}/> १. सर्वात लोकप्रिय</div>
                <div className="ps-card-icon-circle">📅</div>
                <span className="ps-card-cat">वार्षिक कालावधी दर</span>
                <h4 className="text-2xl font-black text-[#541A1A] mb-2">वार्षिक पॅकेजेस (Yearly)</h4>
                <p className="text-sm font-bold text-slate-700 mb-4 leading-relaxed">
                  वर्षातून एकदाच फी भरून वर्षभर टेन्शन-फ्री राहा. शाळा, निवास, खानपान व वाहतुकीत सर्वाधिक वार्षिक सवलत.
                </p>
                <div className="ps-card-price-container">
                  <div>
                    <span className="block text-xs font-black uppercase text-pink-700">वार्षिक फी प्रारंभ</span>
                    <span className="ps-card-price-amount">₹३६,०००/-</span>
                  </div>
                  <span className="ps-card-price-unit">/ वर्ष</span>
                </div>
                <button className="ps-card-book-btn w-full mt-4">
                  <span>सविस्तर ९ वार्षिक पॅकेजेस पहा</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* 2. MONTHLY SUMMARY CARD */}
              <div 
                className="ps-overview-card"
                onClick={() => selectTabHandler("monthly")}
              >
                <div className="ps-card-icon-circle">🗓️</div>
                <span className="ps-card-cat">मासिक कालावधी दर</span>
                <h4 className="text-2xl font-black text-[#541A1A] mb-2">मासिक पॅकेजेस (Monthly)</h4>
                <p className="text-sm font-bold text-slate-700 mb-4 leading-relaxed">
                  दरमहा सोयीस्कर फी भरून सर्व १५ उपक्रम हॉल्स, ३/२ शेअरिंग निवास व पौष्टिक खानपान सुविधांचा लाभ घ्या.
                </p>
                <div className="ps-card-price-container">
                  <div>
                    <span className="block text-xs font-black uppercase text-pink-700">मासिक फी प्रारंभ</span>
                    <span className="ps-card-price-amount">₹३,६००/-</span>
                  </div>
                  <span className="ps-card-price-unit">/ महिना</span>
                </div>
                <button className="ps-card-book-btn w-full mt-4">
                  <span>सविस्तर ९ मासिक पॅकेजेस पहा</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* 3. WEEKLY SUMMARY CARD */}
              <div 
                className="ps-overview-card"
                onClick={() => selectTabHandler("weekly")}
              >
                <div className="ps-card-icon-circle">📆</div>
                <span className="ps-card-cat">आठवडा कालावधी दर</span>
                <h4 className="text-2xl font-black text-[#541A1A] mb-2">आठवडा पॅकेजेस (Weekly)</h4>
                <p className="text-sm font-bold text-slate-700 mb-4 leading-relaxed">
                  शॉर्ट टर्म अनुभव व १ आठवड्यासाठी ट्रायल आनंदशाळा पॅकेज. सुट्ट्यांमध्ये ७ दिवस राहण्यासाठी उत्तम.
                </p>
                <div className="ps-card-price-container">
                  <div>
                    <span className="block text-xs font-black uppercase text-pink-700">आठवडा फी प्रारंभ</span>
                    <span className="ps-card-price-amount">₹८५०/-</span>
                  </div>
                  <span className="ps-card-price-unit">/ आठवडा</span>
                </div>
                <button className="ps-card-book-btn w-full mt-4">
                  <span>सविस्तर ९ आठवडा पॅकेजेस पहा</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* 4. DAILY SUMMARY CARD */}
              <div 
                className="ps-overview-card"
                onClick={() => selectTabHandler("daily")}
              >
                <div className="ps-card-icon-circle">⏰</div>
                <span className="ps-card-cat">दैनिक कालावधी दर</span>
                <h4 className="text-2xl font-black text-[#541A1A] mb-2">दैनिक पॅकेजेस (Daily)</h4>
                <p className="text-sm font-bold text-slate-700 mb-4 leading-relaxed">
                  एक दिवस भेट, डे-पास, चहा नाष्टा जेवण व १५ उपक्रम परिसर भेट (रु. ६००/- विशेष सहल प्रवेश पास उपलब्ध).
                </p>
                <div className="ps-card-price-container">
                  <div>
                    <span className="block text-xs font-black uppercase text-pink-700">दैनिक फी प्रारंभ</span>
                    <span className="ps-card-price-amount">₹९०/-</span>
                  </div>
                  <span className="ps-card-price-unit">/ दिवस</span>
                </div>
                <button className="ps-card-book-btn w-full mt-4">
                  <span>सविस्तर ९ दैनिक पॅकेजेस पहा</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </div>
        </Reveal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODE 2: SPECIFIC FREQUENCY TAB ACTIVE (Yearly / Monthly / Weekly / Daily)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab !== "overview" && (
        <Reveal delay={200}>
          <div className="ps-packages-container">

            {/* IF DAILY TAB: SHOW SPECIAL 1-DAY PASS FIRST */}

            {/* IF DAILY TAB: SHOW SPECIAL 1-DAY PASS FIRST */}
            {activeTab === "daily" && (
              <div 
                className="ps-one-day-pass-card mb-8 cursor-pointer"
                onClick={() => setSelectedPackage({
                  item: {
                    id: "PASS",
                    title: "एक दिवस सहल भेट प्रवेश पास (एक व्यक्तींसाठी)",
                    category: "विशेष ऑफर पास",
                    sectionGroup: "school",
                    icon: "🎫",
                    yearly: "रु. ६००/-",
                    monthly: "रु. ६००/-",
                    weekly: "रु. ६००/-",
                    daily: "रु. ६००/-",
                    desc: "चहा, नाष्टा, जेवण, १.५ एकर परिसर दर्शन, बैठे खेळ व सर्व १५ विशेष उपक्रम सुविधांचा आनंद घेता येईल. वेळ सकाळी ११:०० ते ५:००.",
                    features: [
                      "चहा, नाष्टा & घरगुती जेवण समाविष्ट",
                      "१.५ एकर परिसर दर्शन & निसर्ग कट्टा",
                      "सर्व १५ उपक्रम हॉल्स & बैठे खेळ",
                      "५ वर्षापासून पुढील मुले व ज्येष्ठ नागरिक वापरू शकतात"
                    ]
                  },
                  priceInfo: { amount: "रु. ६००/-", term: "पास मूल्य", unit: "/ दिवस (११ ते ५)" }
                })}
              >
                <div className="pass-top-flex">
                  <div className="pass-left flex items-center gap-3">
                    <div className="size-16 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
                      🎫
                    </div>
                    <div>
                      <span className="inline-block bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
                        विशेष ऑफर प्रवेश पास
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        एक दिवस सहल भेट प्रवेश पास (एक व्यक्तींसाठी)
                      </h3>
                    </div>
                  </div>

                  <div className="pass-right-price text-right">
                    <span className="block text-sm font-black text-amber-200 uppercase">पास मूल्य</span>
                    <span className="text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-md">रु. ६००/-</span>
                  </div>
                </div>

                <div className="pass-details-box">
                  <p className="text-base font-extrabold text-white leading-relaxed mb-3">
                    ☕ चहा, नाष्टा, 🍲 जेवण, 🏡 १.५ एकर परिसर दर्शन, ♟️ बैठे खेळ व सर्व १५ विशेष उपक्रम सुविधांचा आनंद घेऊ शकता!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-black text-amber-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-amber-300 shrink-0" />
                      <span>५ वर्षापासून पुढील मुले व ज्येष्ठ नागरिक वापर करू शकतात.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-amber-300 shrink-0" />
                      <span>नातेवाईक व मित्रांना भेट देऊन पुण्य व शुभाशिर्वाद कमवा!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CARDS GRID FOR THE SELECTED FREQUENCY TAB */}
            <div className="ps-active-packages-grid">
              {rateItems.map((item) => {
                const priceInfo = getPriceForTab(item, activeTab);
                return (
                  <div 
                    key={item.id} 
                    className={`ps-package-card ${item.popular ? "ps-card-popular" : ""}`}
                    onClick={() => setSelectedPackage({ item, priceInfo })}
                    role="button"
                    tabIndex={0}
                  >
                    {item.popular && (
                      <div className="ps-card-top-tag">
                        <Sparkles size={14} /> विशेष लोकप्रिय
                      </div>
                    )}

                    <div className="ps-card-head">
                      <span className="ps-card-num-badge">{item.id}</span>
                      <span className="ps-card-icon-emoji">{item.icon}</span>
                    </div>

                    <span className="ps-card-cat">{item.category}</span>
                    
                    <h4 className="font-black text-lg sm:text-xl mb-2 text-[#541A1A] leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-700 font-bold mb-4 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* FEATURES LIST */}
                    <div className="space-y-2 mb-5 bg-pink-50/60 p-3.5 rounded-xl border border-pink-100">
                      {item.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800">
                          <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* PRICE CONTAINER */}
                    <div className="ps-card-price-container">
                      <div>
                        <span className="block text-xs font-black uppercase text-pink-700">{priceInfo.term}</span>
                        <span className="ps-card-price-amount">{priceInfo.amount}</span>
                      </div>
                      <span className="ps-card-price-unit">{priceInfo.unit}</span>
                    </div>

                    {/* CLICK TO OPEN MODAL BUTTON */}
                    <div className="ps-card-book-btn">
                      <span>सविस्तर माहिती & बुकिंग</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </Reveal>
      )}

      {/* ── ADDITIONAL PAID SERVICES BANNER ── */}
      <Reveal delay={300}>
        <div className="ps-extra-services-strip">
          <h4 className="text-lg sm:text-xl font-black text-[#541A1A] mb-2 flex items-center justify-center gap-2">
            <Sparkles size={22} className="text-pink-600" />
            जास्तीचे पेमेंट करून खालील अतिरीक्त सुविधा घेऊ शकता:
          </h4>
          <p className="text-sm sm:text-base font-extrabold text-slate-800">
            स्पेशल चहा, कॉफी, नाष्टा, सुप, जेवण, सॅलड, आईस्क्रीम, मिठाई, लॉंड्री, फर्निचर, उपकरणे व बरंच काही......!
          </p>
        </div>
      </Reveal>



      {/* ══════════════════════════════════════════════════════════════
          POPUP MODAL WINDOW FOR PACKAGES (ON CLICK)
         ══════════════════════════════════════════════════════════════ */}
      {selectedPackage && typeof document !== "undefined" && createPortal(
        <div 
          className="ps-modal-overlay"
          onClick={() => setSelectedPackage(null)}
        >
          <div 
            className="ps-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              className="ps-modal-close-btn"
              onClick={() => setSelectedPackage(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* LEFT SIDE: VISUAL & PRICE BADGE */}
            <div className="ps-modal-left-box">
              <div className="ps-modal-icon-circle">
                <span>{selectedPackage.item.icon}</span>
              </div>
              
              <span className="ps-modal-cat-tag">
                {selectedPackage.item.category}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-4 leading-snug">
                {selectedPackage.item.title}
              </h3>

              <div className="ps-modal-price-box">
                <span className="block text-xs font-black text-pink-200 uppercase tracking-wider">{selectedPackage.priceInfo.term}</span>
                <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">{selectedPackage.priceInfo.amount}</span>
                <span className="text-xs font-black text-pink-200">{selectedPackage.priceInfo.unit}</span>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles size={14} className="text-amber-300" />
                <span>ॲडव्हान्स् बुकींग शुभारंभ ऑफर</span>
              </div>
            </div>

            {/* RIGHT SIDE: RICH DETAILED INFORMATION */}
            <div className="ps-modal-right-content">
              <h3 className="text-xl font-black text-[#541A1A] mb-2 flex items-center gap-2">
                <span>{selectedPackage.item.icon}</span>
                <span>पॅकेज सविस्तर तपशील</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed mb-4">
                {selectedPackage.item.desc}
              </p>

              {/* INCLUDED FACILITIES & AMENITIES */}
              <div className="mb-4 bg-pink-50/60 border border-pink-100 p-3.5 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-pink-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> समाविष्ट सुविधा व वैशिष्ट्ये:
                </h4>
                <div className="space-y-1.5 text-xs font-bold text-slate-800">
                  {selectedPackage.item.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="text-pink-600 shrink-0" size={15} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALL 4 FREQUENCY PRICES COMPARISON INSIDE MODAL */}
              <div className="mb-5 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                  इतर सर्व कालावधीचे अधिकृत दर:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs sm:text-sm font-black">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] text-slate-500">वार्षिक</span>
                    <span className="text-slate-900">{selectedPackage.item.yearly}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] text-slate-500">मासिक</span>
                    <span className="text-pink-700">{selectedPackage.item.monthly}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] text-slate-500">आठवडा</span>
                    <span className="text-slate-900">{selectedPackage.item.weekly}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] text-slate-500">दैनिक</span>
                    <span className="text-slate-900">{selectedPackage.item.daily}</span>
                  </div>
                </div>
              </div>

              {/* CALL TO ACTION BUTTON */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto border-t border-slate-100">
                <a 
                  href="tel:9970079090" 
                  className="flex-1 bg-gradient-to-r from-[#541A1A] to-[#db2777] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition"
                >
                  <PhoneCall size={18} />
                  <span>थेट बुकिंगसाठी कॉल करा: 99 7007 9090</span>
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

export default PricingSection;
