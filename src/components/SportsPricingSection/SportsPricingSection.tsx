import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useAdminStore } from "@/lib/admin-store";
import { 
  CalendarDays, 
  Activity, 
  Gamepad2, 
  Dumbbell, 
  Crown, 
  Book, 
  Music, 
  Footprints, 
  Coffee, 
  ShieldCheck, 
  Award, 
  Trophy,
  X,
  HeartPulse,
  User,
  Users,
  Clock,
  Zap,
  Sparkles,
  CheckCircle2,
  Phone,
  PhoneCall,
  ArrowRight,
  Info,
  Check,
  Gift
} from "lucide-react";
import "./SportsPricingSection.css";

const sportsClubPhones = ["9370237633", "9423258859"];

interface PackageDetail {
  title: string;
  duration: string;
  rackRate: string;
  offerPrice: string;
  savings: string;
  facilityNote?: string;
  benefits: string[];
}

const SportsPricingSection = () => {
  const store = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("12 Months Package");
  const [selectedDetail, setSelectedDetail] = useState<PackageDetail | null>(null);

  const [durationFilter, setDurationFilter] = useState<"all" | "day" | "month" | "year">("all");
  const [selectedFacility, setSelectedFacility] = useState<string>("🏋️‍♂️ AC Gym व बॉडीबिल्डिंग");
  const [pricingView, setPricingView] = useState<"cards" | "table">("cards");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    package: "12 Months Package"
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenModal = (planName: string) => {
    setSelectedPlan(planName);
    setFormData((prev) => ({ ...prev, package: planName }));
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (detail: PackageDetail) => {
    setSelectedDetail(detail);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    store.addInquiry({
      name: formData.name,
      phone: formData.phone,
      email: "",
      subject: `🏋️ स्पोर्ट्स क्लब मेंबरशिप चौकशी (${formData.package})`,
      message: `प्रवेश / मेंबरशिप चौकशी: ${formData.package} साठी ऑनलाईन नाव नोंदवले आहे.`,
      category: "sports",
    });
    setIsSubmitted(true);
  };

  // Package Data Objects for easy re-use
  const pkgDayPass: PackageDetail = {
    title: "स्पोर्ट्स क्लब डे पास (Day Pass)",
    duration: "१ दिवस (Day Pass)",
    rackRate: "₹ ५००",
    offerPrice: "₹ ३००",
    savings: "सर्व क्रीडा सोयी एका दिवसासाठी!",
    facilityNote: "ऑलिंपिक स्विमिंग पूल, २४x७ जीम व सर्व इनडोअर गेम्स एका दिवसासाठी वापरा",
    benefits: [
      "ऑलिंपिक स्विमिंग पूल अमर्याद १ दिवस वापर",
      "२४x७ जिम व इनडोअर गेम्स वापर",
      "चहा व अल्पोपहार सोय विनामूल्य"
    ]
  };

  const pkgFreeTrialPass: PackageDetail = {
    title: "१-दिवसाचा फ्री ट्रायअल पास (Free 1-Day Trial Pass)",
    duration: "१ दिवस (विनामूल्य १-दिवस ट्रायल डेमो पास)",
    rackRate: "₹ ५००",
    offerPrice: "₹ ० (मोफत १-दिवस ट्रायअल)",
    savings: "१००% मोफत पास • शून्य शुल्क, शून्य अट!",
    facilityNote: "ऑलिंपिक स्विमिंग पूल, २४x७ जीम व क्रीडा सोयींचा प्रत्यक्ष विनामूल्य अनुभव घ्या",
    benefits: [
      "विनामूल्य ऑलिंपिक स्विमिंग पूल अमर्याद entry",
      "२४x७ हायटेक AC जिम व फिटनेस असेसमेंट मोफत",
      "प्रमाणित फिटनेस तज्ञांसोबत १-ऑन-१ विनामूल्य सल्लागार",
      "ग्रंथालय, जॉगिंग ट्रॅक व म्युझिक हॉल ॲक्सेस विनामूल्य",
      "चहा व अल्पोपहार सोय विनामूल्य"
    ]
  };

  const pkg12Months: PackageDetail = {
    title: "१२ महिने (१ वर्ष) मेंबरशिप पॅकेज",
    duration: "१२ महिने (12 Months / 1 Year)",
    rackRate: "₹ १८,०००",
    offerPrice: "₹ ११,९९९",
    savings: "₹ ६,००१ ची भरघोस बचत! (33% OFF)",
    facilityNote: "जिम, ऑलिंपिक स्विमिंग पूल, पिकलबॉल, इनडोअर बॅडमिंटन, स्क्वॅश, स्नूकर किंवा टेबल टेनिस पैकी एका विशिष्ट सुविधेचा प्रवेश",
    benefits: [
      "निवडलेल्या एका मुख्य सोयीचा (Gym/Pool/Badminton/Pickleball/Squash/Snooker/TT) अमर्याद प्रवेश",
      "ग्रंथालय (Library) व म्युझिक हॉल (Music Hall) मोफत विनामूल्य प्रवेश",
      "फिटनेस गार्डन व जागतिक दर्जाचा जॉगिंग ट्रॅक मोफत प्रवेश",
      "स्टीम बाथ (Steam Bath) सुविधा मोफत उपलब्ध",
      "प्रमाणित वैयक्तिक फिटनेस ट्रेनर्सचे मोफत मार्गदर्शन",
      "मोफत फिटनेस असेसमेंट व डाएट चार्ट सेशन"
    ]
  };

  const pkg6Months: PackageDetail = {
    title: "६ महिने मेंबरशिप पॅकेज",
    duration: "६ महिने (6 Months)",
    rackRate: "₹ १२,०००",
    offerPrice: "₹ ६,९९९",
    savings: "₹ ५,००१ ची भरघोस बचत! (42% OFF)",
    facilityNote: "जिम, ऑलिंपिक स्विमिंग पूल, पिकलबॉल, इनडोअर बॅडमिंटन, स्क्वॅश, स्नूकर किंवा टेबल टेनिस पैकी एका विशिष्ट सुविधेचा प्रवेश",
    benefits: [
      "निवडलेल्या एका मुख्य सोयीचा (Gym/Pool/Badminton/Pickleball/Squash/Snooker/TT) अमर्याद प्रवेश",
      "ग्रंथालय (Library) व म्युझिक हॉल (Music Hall) मोफत विनामूल्य प्रवेश",
      "फिटनेस गार्डन व जागतिक दर्जाचा जॉगिंग ट्रॅक मोफत प्रवेश",
      "स्टीम बाथ (Steam Bath) सुविधा मोफत उपलब्ध"
    ]
  };

  return (
    <section className="sports-pricing-section" id="sports-pricing">
      
      {/* Hero Widescreen Header */}
      <div className="sp-hero">
        <div className="sp-hero-bg"></div>
        <div className="sp-hero-overlay"></div>
        
        <div className="sp-hero-content animate-fade-right">
          <div className="sp-logo-area mb-2">
            <div className="sp-logo-circle">
              PREETAM
            </div>
            <div className="sp-title-text">
              <h1>PREETAM</h1>
              <h2>Sports & Fitness Club • सांगली</h2>
            </div>
          </div>
          <div className="sp-tagline">
            Fit Body &nbsp;•&nbsp; Strong Mind &nbsp;•&nbsp; Better Life &nbsp;•&nbsp; समृद्ध जीवनशैली
          </div>
        </div>
      </div>

      <div className="sp-container">
        
        {/* ============================================================== */}
        {/* SECTION I. INDIVIDUAL FACILITY PACKAGES (CREATIVE PRICING MATRIX) */}
        {/* ============================================================== */}
        <div className="relative my-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-pink-50/80 via-white to-rose-50/80 border-2 border-pink-300 shadow-2xl text-slate-900 overflow-hidden">
          
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute -top-24 -left-24 size-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-96 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />

          {/* Section I Top Header */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-pink-200">
            <div className="flex items-center gap-3.5">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-[#810B38] to-pink-700 text-white flex items-center justify-center font-black text-2xl shadow-xl border border-pink-400/40">
                🏆
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-[#810B38] font-black text-xs mb-1">
                  <span>✨</span> Pre-Launch Special Offer 2025
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-[#810B38] tracking-tight">
                  I. Individual Facility Packages (वैयक्तिक क्रीडा सोयी पॅकेजेस)
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                  PREETAM SPORTS & FITNESS CLUB® • १ सुविधेची मेंबरशिप (Gym, Swimming, Badminton, Pickleball, Squash, Snooker, TT)
                </p>
              </div>
            </div>

            {/* View Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-pink-100/80 border border-pink-300 shadow-inner self-center md:self-auto">
              <button
                type="button"
                onClick={() => setPricingView("cards")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  pricingView === "cards"
                    ? "bg-[#810B38] text-white shadow-md scale-105"
                    : "text-slate-700 hover:text-[#810B38]"
                }`}
              >
                📱 कार्ड्स व्ह्यू
              </button>
              <button
                type="button"
                onClick={() => setPricingView("table")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  pricingView === "table"
                    ? "bg-[#810B38] text-white shadow-md scale-105"
                    : "text-slate-700 hover:text-[#810B38]"
                }`}
              >
                📊 तक्ता व्ह्यू
              </button>
            </div>
          </div>

          {/* Interactive Facility Selection Chips */}
          <div className="relative z-10 mb-8">
            <p className="text-xs font-black text-[#810B38] uppercase tracking-wider mb-3 text-center sm:text-left flex items-center gap-1.5">
              <span>🎯</span> क्रीडा सोय निवडा (Select Facility):
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {[
                "🏋️‍♂️ AC Gym व बॉडीबिल्डिंग",
                "🏊‍♂️ ऑलिंपिक स्विमिंग पूल",
                "🏓 पिकलबॉल Court",
                "🏸 इनडोअर बॅडमिंटन",
                "🎾 स्क्वॅश ॲरेना",
                "🎱 स्नूकर लाउंज",
                "🏓 टेबल टेनिस"
              ].map((fac, idx) => {
                const isActive = selectedFacility === fac;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFacility(fac)}
                    className={`px-4 py-2 rounded-full font-black text-xs transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-[#810B38] to-pink-700 text-white shadow-lg shadow-pink-500/30 scale-105 border border-pink-400"
                        : "bg-white text-slate-800 border border-pink-200 hover:border-pink-500 hover:text-[#810B38] shadow-xs"
                    }`}
                  >
                    <span>{fac}</span>
                    {isActive && <span className="size-2 rounded-full bg-amber-300 animate-ping" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Active Facility Alert Pill */}
          <div className="relative z-10 bg-pink-100/90 border-2 border-pink-300 p-4 rounded-2xl mb-8 flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-[#810B38] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">⚡</span>
              <span>निवडलेली सोय: <strong>{selectedFacility}</strong> साठी खालील प्री-लाँच स्पेशल सवलती लागू आहेत!</span>
            </div>
            <span className="hidden sm:inline-block text-xs bg-[#810B38] text-white px-3 py-1 rounded-full font-black">
              1 Facility Access
            </span>
          </div>


          {/* VIEW MODE 1: MODERN 4-CARD MATRIX GRID */}
          {pricingView === "cards" ? (
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* 1 Month Card */}
              <div 
                onClick={() => handleOpenModal(`1 Month Package - ${selectedFacility} (₹1,499)`)}
                className="p-6 rounded-3xl bg-white border-2 border-pink-200 hover:border-pink-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1.5 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-pink-400 active:scale-98"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black">
                      🔥 57% OFF
                    </span>
                    <span className="text-xs font-bold text-slate-400">१ महिना</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-[#810B38] transition-colors">१ महिना मेंबरशिप</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{selectedFacility}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                    <div className="text-xs font-bold text-slate-400 line-through">मूळ दर: ₹ ३,५००</div>
                    <div className="text-3xl font-black text-[#810B38] mt-0.5">₹ १,४९९</div>
                    <div className="text-xs font-black text-emerald-600 mt-1 flex items-center gap-1">
                      <span>✓ ₹ २,००१ ची बचत (Save 57%)</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs font-bold text-slate-700 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span> {selectedFacility} १ महिना प्रवेश
                    </li>
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(`1 Month Package - ${selectedFacility} (₹1,499)`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#810B38] hover:bg-pink-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  ऑफर बुक करा ➔
                </button>
              </div>

              {/* 3 Months Card */}
              <div 
                onClick={() => handleOpenModal(`3 Months Package - ${selectedFacility} (₹3,999)`)}
                className="p-6 rounded-3xl bg-white border-2 border-purple-200 hover:border-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1.5 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-400 active:scale-98"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black">
                      ⚡ 47% OFF
                    </span>
                    <span className="text-xs font-bold text-slate-400">३ महिने</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">३ महिने मेंबरशिप</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{selectedFacility}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="text-xs font-bold text-slate-400 line-through">मूळ दर: ₹ ७,५००</div>
                    <div className="text-3xl font-black text-[#810B38] mt-0.5">₹ ३,९९९</div>
                    <div className="text-xs font-black text-emerald-600 mt-1 flex items-center gap-1">
                      <span>✓ ₹ ३,५०१ ची बचत (Save 47%)</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs font-bold text-slate-700 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span> {selectedFacility} ३ महिने प्रवेश
                    </li>
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(`3 Months Package - ${selectedFacility} (₹3,999)`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#810B38] hover:bg-pink-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  ऑफर बुक करा ➔
                </button>
              </div>

              {/* 6 Months Card */}
              <div 
                onClick={() => handleOpenModal(`6 Months Package - ${selectedFacility} (₹6,999)`)}
                className="p-6 rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1.5 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 active:scale-98"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                      ⭐ 42% OFF
                    </span>
                    <span className="text-xs font-bold text-slate-400">६ महिने</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors">६ महिने मेंबरशिप</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{selectedFacility}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                    <div className="text-xs font-bold text-slate-400 line-through">मूळ दर: ₹ १२,०००</div>
                    <div className="text-3xl font-black text-[#810B38] mt-0.5">₹ ६,९९९</div>
                    <div className="text-xs font-black text-emerald-600 mt-1 flex items-center gap-1">
                      <span>✓ ₹ ५,००१ ची बचत (Save 42%)</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs font-bold text-slate-700 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span> {selectedFacility} ६ महिने प्रवेश
                    </li>
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(`6 Months Package - ${selectedFacility} (₹6,999)`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#810B38] hover:bg-pink-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  ऑफर बुक करा ➔
                </button>
              </div>

              {/* 12 Months Card - FEATURED CROWN BOX */}
              <div 
                onClick={() => handleOpenModal(`12 Months Package - ${selectedFacility} (₹11,999)`)}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#810B38] via-rose-800 to-pink-800 text-white border-2 border-amber-300 shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-2 relative overflow-hidden ring-4 ring-pink-500/20 cursor-pointer hover:ring-amber-300 active:scale-98"
              >
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md animate-pulse">
                  बेस्ट व्हॅल्यू 👑
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-black">
                      👑 33% OFF • १ वर्ष
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-white">१२ महिने (१ वर्ष) पॅकेज</h4>
                    <p className="text-[11px] font-bold text-pink-200 mt-0.5">{selectedFacility}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                    <div className="text-xs font-bold text-rose-200 line-through">मूळ दर: ₹ १८,०००</div>
                    <div className="text-3xl font-black text-amber-300 mt-0.5">₹ ११,९९९</div>
                    <div className="text-xs font-black text-amber-200 mt-1 flex items-center gap-1">
                      <span>👑 ₹ ६,००१ सर्वात मोठी बचत!</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs font-bold text-pink-100 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="text-amber-300">✓</span> {selectedFacility} १ वर्ष अमर्याद प्रवेश
                    </li>
                  </ul>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(`12 Months Package - ${selectedFacility} (₹11,999)`);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  👑 १ वर्ष ऑफर बुक करा ➔
                </button>
              </div>

            </div>
          ) : (
            /* VIEW MODE 2: ELEGANT LIGHT TABLE */
            <div className="relative z-10 overflow-x-auto rounded-2xl border-2 border-pink-200 shadow-md bg-white">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-[#810B38] text-white uppercase font-black text-xs">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Membership Duration</th>
                    <th className="py-4 px-4 sm:px-6">Selected Facility</th>
                    <th className="py-4 px-4 sm:px-6">Rack Rate (₹)</th>
                    <th className="py-4 px-4 sm:px-6 text-amber-300">Pre-Launch Offer (₹)</th>
                    <th className="py-4 px-4 sm:px-6 text-emerald-300">Savings (₹)</th>
                    <th className="py-4 px-4 sm:px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100 font-bold">
                  
                  {/* 12 Months */}
                  <tr className="hover:bg-pink-50/80 transition-colors bg-gradient-to-r from-amber-50/50 to-transparent">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-amber-500 text-lg">👑</span> 12 Months (१२ महिने)
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#810B38] font-extrabold">{selectedFacility}</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-400 line-through">₹ 18,000</td>
                    <td className="py-4 px-4 sm:px-6 font-black text-[#810B38] text-base sm:text-xl">
                      ₹ 11,999
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                        ₹ 6,001 (33% Savings)
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleOpenModal(`12 Months Package - ${selectedFacility} (₹11,999)`)}
                        className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-pink-700 text-white text-xs font-black shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        ऑफर बुक करा ➔
                      </button>
                    </td>
                  </tr>

                  {/* 6 Months */}
                  <tr className="hover:bg-pink-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-purple-500 text-lg">⭐</span> 6 Months (६ महिने)
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#810B38] font-extrabold">{selectedFacility}</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-400 line-through">₹ 12,000</td>
                    <td className="py-4 px-4 sm:px-6 font-black text-[#810B38] text-base sm:text-xl">
                      ₹ 6,999
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                        ₹ 5,001 (42% Savings)
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleOpenModal(`6 Months Package - ${selectedFacility} (₹6,999)`)}
                        className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-pink-700 text-white text-xs font-black shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        ऑफर बुक करा ➔
                      </button>
                    </td>
                  </tr>

                  {/* 3 Months */}
                  <tr className="hover:bg-pink-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-blue-500 text-lg">⚡</span> 3 Months (३ महिने)
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#810B38] font-extrabold">{selectedFacility}</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-400 line-through">₹ 7,500</td>
                    <td className="py-4 px-4 sm:px-6 font-black text-[#810B38] text-base sm:text-xl">
                      ₹ 3,999
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                        ₹ 3,501 (47% Savings)
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleOpenModal(`3 Months Package - ${selectedFacility} (₹3,999)`)}
                        className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-pink-700 text-white text-xs font-black shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        ऑफर बुक करा ➔
                      </button>
                    </td>
                  </tr>

                  {/* 1 Month */}
                  <tr className="hover:bg-pink-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-rose-500 text-lg">🔥</span> 1 Month (१ महिना)
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-[#810B38] font-extrabold">{selectedFacility}</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-400 line-through">₹ 3,500</td>
                    <td className="py-4 px-4 sm:px-6 font-black text-[#810B38] text-base sm:text-xl">
                      ₹ 1,499
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
                        ₹ 2,001 (57% Savings)
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleOpenModal(`1 Month Package - ${selectedFacility} (₹1,499)`)}
                        className="px-4 py-2 rounded-xl bg-[#810B38] hover:bg-pink-700 text-white text-xs font-black shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        ऑफर बुक करा ➔
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          )}

        </div>





        {/* II and III Two Columns */}
        <div className="sp-two-cols">
          
          {/* II. ADD-ON FACILITIES */}
          <div className="sp-card-pink shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-pink-300 rounded-3xl overflow-hidden">
            <div className="sp-card-header-pink bg-gradient-to-r from-[#810B38] via-pink-700 to-rose-700 text-white p-4 font-black flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <span className="text-sm sm:text-base tracking-wide">II. ॲड-ऑन सोयी (ADD-ON ACTIVITY ZONE)</span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between h-[calc(100%-65px)] bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30">
              <div>
                <div className="text-xs sm:text-sm font-black text-[#810B38] bg-pink-100/90 p-4 rounded-2xl border border-pink-300 mb-6 flex items-center gap-2.5 shadow-xs">
                  <Sparkles size={18} className="text-pink-600 shrink-0 animate-pulse"/>
                  <span>या सोयी वैयक्तिक क्रीडा सोयी पॅकेजेससोबत ॲड-ऑन म्हणून उपलब्ध आहेत:</span>
                </div>
                
                <div className="space-y-4">
                  {/* Mind & Body */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-start gap-4 group hover:-translate-y-0.5">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Activity size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-2">1. Mind & Body (मन व शरीर स्वास्थ्य):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black shadow-2xs">🧘 झुंबा (Zumba)</span>
                        <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black shadow-2xs">💃 फिटनेस डान्स</span>
                        <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-black shadow-2xs">🧘‍♂️ योग व ध्यान</span>
                      </div>
                    </div>
                  </div>

                  {/* Recreation */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-start gap-4 group hover:-translate-y-0.5">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Gamepad2 size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-2">2. Recreation (मनोरंजन व कला):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black shadow-2xs">🎯 इनडोअर खेळ</span>
                        <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black shadow-2xs">🎵 संगीतमय हॉल</span>
                        <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black shadow-2xs">📚 वाचनालय</span>
                      </div>
                    </div>
                  </div>

                  {/* Outdoor Fitness */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-start gap-4 group hover:-translate-y-0.5">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <Footprints size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-2">3. Outdoor Fitness (मैदानी व्यायाम):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-2xs">🌳 फिटनेस गार्डन</span>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-2xs">🏃‍♂️ जॉगिंग ट्रॅक</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIRECT CALL BUTTONS SECTION */}
              <div className="mt-6 pt-5 border-t border-rose-200 text-center">
                <p className="text-xs font-black text-[#810B38] mb-3 flex items-center justify-center gap-1.5">
                  <PhoneCall size={16} className="animate-bounce text-pink-600" />
                  <span>अधिक माहिती व चौकशीसाठी थेट कॉल करा:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:9370237633"
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#810B38] to-pink-700 hover:from-pink-700 hover:to-rose-800 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-pink-400/30"
                  >
                    <Phone size={17} className="text-amber-300 animate-pulse" />
                    <span>📞 ९३७०२३७६३३</span>
                  </a>
                  <a
                    href="tel:9423258859"
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-700 hover:to-purple-800 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-pink-400/30"
                  >
                    <Phone size={17} className="text-amber-300 animate-pulse" />
                    <span>📞 ९४२३२५८८५९</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* III. PREETAM ELITE */}
          <div className="sp-card-blue shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-indigo-300 rounded-3xl overflow-hidden">
            <div className="sp-card-header-blue bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-4 font-black flex items-center gap-2.5 border-b border-indigo-700">
              <div className="size-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                <Crown size={22} className="shrink-0"/>
              </div>
              <span className="text-sm sm:text-base tracking-wide">III. प्रीतम एलिट – फॅमिली लाईफटाईम मेंबरशिप</span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between h-[calc(100%-65px)] bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/30">
              <div>
                <div className="text-xs sm:text-sm font-black text-indigo-950 bg-indigo-100/90 p-4 rounded-2xl border border-indigo-300 mb-6 flex items-center gap-2.5 shadow-xs">
                  <Sparkles size={18} className="text-indigo-600 shrink-0 animate-pulse"/>
                  <span>सर्व क्रीडा व ॲक्टिव्हिटी सोयींचा अमर्याद आनंद घेणारे भव्य कुटुंब मेंबरशिप पॅकेज:</span>
                </div>
                
                <div className="space-y-3.5">
                  <div className="p-4 sm:p-4.5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-3 group hover:-translate-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-pink-100 text-[#810B38] font-bold group-hover:scale-110 transition-transform">
                        <Clock size={18}/>
                      </span>
                      <span>कालावधी (Duration)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#810B38] bg-pink-50 px-3.5 py-1.5 rounded-xl border border-pink-200 shadow-2xs">१० वर्षे (10 Years Lifetime)</span>
                  </div>

                  <div className="p-4 sm:p-4.5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-3 group hover:-translate-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-purple-100 text-purple-700 font-bold group-hover:scale-110 transition-transform">
                        <Users size={18}/>
                      </span>
                      <span>समाविष्ट सदस्य (Members)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-purple-900 bg-purple-50 px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-2xs">४ कुटुंब सदस्य (4 Members)</span>
                  </div>

                  <div className="p-4 sm:p-4.5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-3 group hover:-translate-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-indigo-100 text-indigo-700 font-bold group-hover:scale-110 transition-transform">
                        <Zap size={18}/>
                      </span>
                      <span>सुविधांचा प्रवेश (Access)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-indigo-900 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">सर्व क्रीडा व सोयी समाविष्ट</span>
                  </div>

                  <div className="p-4 sm:p-4.5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between gap-3 group hover:-translate-y-0.5">
                    <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-700 font-bold group-hover:scale-110 transition-transform">
                        <CalendarDays size={18}/>
                      </span>
                      <span>नोंदणी नोट (Pre-booking)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs">स्लॉट-आधारित बुकिंग</span>
                  </div>
                </div>
              </div>

              {/* DIRECT CALL BUTTONS SECTION */}
              <div className="mt-6 pt-5 border-t border-indigo-200 text-center">
                <p className="text-xs font-black text-indigo-950 mb-3 flex items-center justify-center gap-1.5">
                  <PhoneCall size={16} className="animate-bounce text-indigo-600" />
                  <span>एलिट मेंबरशिप चौकशीसाठी थेट कॉल करा:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:9370237633"
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-indigo-400/30"
                  >
                    <Phone size={17} className="text-amber-300 animate-pulse" />
                    <span>📞 ९३७०२३७६३३</span>
                  </a>
                  <a
                    href="tel:9423258859"
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-indigo-400/30"
                  >
                    <Phone size={17} className="text-amber-300 animate-pulse" />
                    <span>📞 ९४२३२५८८५९</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* COMPLIMENTARY BENEFITS */}
        <div className="sp-comp-header">
          <span>❖</span> सर्व सभासदांसाठी मोफत मोकळ्या सोयी (COMPLIMENTARY BENEFITS) <span>❖</span>
        </div>
        <p className="text-center font-extrabold text-slate-600 text-xs sm:text-sm mb-8 max-w-xl mx-auto">
          सर्व सभासदांना (Individual किंवा Elite) खालील जागतिक दर्जाच्या सोयी मोफत व विनामूल्य उपलब्ध आहेत:
        </p>

        <div className="sp-comp-grid">
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Book size={28}/></div>
              <span>ग्रंथालय (Library)</span>
            </div>
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Library"/>
          </div>
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Music size={28}/></div>
              <span>म्युझिक हॉल (Music Hall)</span>
            </div>
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Music Hall"/>
          </div>
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Dumbbell size={28}/></div>
              <span>फिटनेस गार्डन</span>
            </div>
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Fitness Garden"/>
          </div>
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Footprints size={28}/></div>
              <span>जॉगिंग ट्रॅक</span>
            </div>
            <img src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Jogging Track"/>
          </div>
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Gamepad2 size={28}/></div>
              <span>इनडोअर गेम्स</span>
            </div>
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Indoor Games"/>
          </div>
          <div className="sp-comp-item">
            <div className="sp-comp-top">
              <div className="sp-comp-icon-circle"><Coffee size={28}/></div>
              <span>स्टीम बाथ</span>
            </div>
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=300&auto=format&fit=crop" className="sp-comp-img" alt="Steam Bath"/>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sp-bottom-bar">
          <div className="sp-bb-left">
            <div className="sp-pulse-icon">
              <HeartPulse size={28}/>
            </div>
            <div className="sp-bb-title">
              निरोगी, निरोगी आणि समृद्ध जीवनासाठी<br/>
              <span className="text-pink-400">आजच पहिले पाऊल उचला!</span>
            </div>
          </div>
          
          <button className="sp-inquire-btn" onClick={() => handleOpenModal("General Inquiry")}>
            आजच प्रवेश घ्या
            <ArrowRight size={20} className="ml-2"/>
          </button>
          
          <div className="sp-bb-badges hidden lg:flex">
            <div className="sp-badge-item">
              <div className="sp-badge-icon"><ShieldCheck size={20}/></div>
              <span>उत्कृष्ट<br/>सोयी</span>
            </div>
            <div className="sp-badge-item">
              <div className="sp-badge-icon"><Award size={20}/></div>
              <span>प्रमाणित<br/>ट्रेनर्स</span>
            </div>
            <div className="sp-badge-item">
              <div className="sp-badge-icon"><Trophy size={20}/></div>
              <span>उत्तम<br/>आरोग्य</span>
            </div>
          </div>
        </div>

        {/* Footer Strip */}
        <div className="sp-footer-strip">
          <div className="flex items-center gap-2"><HeartPulse size={18}/> निरोगी आरोग्य</div>
          <div className="flex items-center gap-2"><Activity size={18}/> समृद्ध जीवनशैली</div>
          <div className="flex items-center gap-2"><User size={18}/> आनंदी जीवन</div>
        </div>

      </div>

      {/* Package Detail Information Modal */}
      {selectedDetail && createPortal(
        <div 
          className="sp-modal-overlay"
          onClick={() => setSelectedDetail(null)}
        >
          <div 
            className="sp-modal-content max-w-lg border-2 border-pink-400/50 shadow-2xl animate-fade-down pt-8 pr-10 pb-6 pl-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="sp-modal-close" onClick={() => setSelectedDetail(null)}>
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-pink-600 font-extrabold text-xs mb-1 pt-2">
              <Sparkles size={16}/>
              <span>मेंबरशिप पॅकेज तपशील माहिती</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 pr-6">
              {selectedDetail.title}
            </h3>

            {/* Price Badge inside Detail Modal */}
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-4 rounded-2xl border border-pink-200 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-bold">मूळ दर (Rack Rate): <span className="line-through text-slate-400">{selectedDetail.rackRate}</span></div>
                  <div className="text-2xl font-black text-pink-600">{selectedDetail.offerPrice} <span className="text-xs text-slate-600 font-bold">/-</span></div>
                </div>
                <div className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-black">
                  {selectedDetail.savings}
                </div>
              </div>

              {selectedDetail.facilityNote && (
                <div className="mt-3 pt-3 border-t border-pink-200/60 text-xs font-bold text-slate-700">
                  📍 {selectedDetail.facilityNote}
                </div>
              )}
            </div>

            {/* Included Benefits List */}
            <h4 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600"/>
              <span>पॅकेजमध्ये समाविष्ट असणाऱ्या सोयी (Included Benefits):</span>
            </h4>

            <ul className="space-y-2.5 mb-6">
              {selectedDetail.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-800 text-xs font-bold bg-white p-3 rounded-xl border border-pink-100 shadow-xs">
                  <span className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Modal Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  const planName = selectedDetail.title;
                  setSelectedDetail(null);
                  handleOpenModal(planName);
                }}
                className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔥 या पॅकेजसाठी नोंदणी करा</span>
                <ArrowRight size={16}/>
              </button>

              <a 
                href={`https://wa.me/91${sportsClubPhones[0]}?text=नमस्कार,%20मला%20${encodeURIComponent(selectedDetail.title)}%20बद्दल%20अधिक%20माहिती%20हवी%20आहे.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
              >
                💬 WhatsApp
              </a>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Inquiry Form Modal via Portal */}
      {isModalOpen && createPortal(
        <div 
          className="sp-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="sp-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="sp-modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <>
                <h3 className="sp-modal-title">आजच ऑनलाईन नोंदणी करा</h3>
                <p className="sp-modal-desc">
                  खालील माहिती भरा. प्रीतम स्पोर्ट्स क्लब टीम आपल्याशी त्वरित संपर्क साधेल!
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="sp-form-group">
                    <label>१. आपले संपूर्ण नाव *</label>
                    <input 
                      type="text" 
                      placeholder="उदा. राहुल सचिन पाटील" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="sp-form-group">
                    <label>२. संपर्क मोबाईल नंबर *</label>
                    <input 
                      type="tel" 
                      placeholder="उदा. 9876543210" 
                      required 
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="sp-form-group">
                    <label>३. निवडलेले मेंबरशिप पॅकेज (Selected Offer)</label>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/80 to-purple-950/80 border border-pink-500/40 text-white font-black text-sm flex items-center justify-between shadow-inner">
                      <span className="flex items-center gap-2">
                        <span className="text-amber-400 text-base">✨</span>
                        <span>{formData.package || selectedPlan}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                        निवडलेली ऑफर ✓
                      </span>
                    </div>
                  </div>

                  <button type="submit" className="sp-submit-btn cursor-pointer">
                    ऑनलाईन फॉर्म सबमिट करा →
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-[#810B38]">
                  अभिनंदन! नोंदणी सबमिट झाली.
                </h3>
                <p className="text-sm font-extrabold text-slate-700 leading-relaxed max-w-md mx-auto">
                  धन्यवाद <strong className="text-[#810B38] font-black">{formData.name}</strong>! तुमची मेंबरशिप चौकशी सबमिट झाली आहे. आमची टीम लवकरच आपल्याशी संपर्क साधेल.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
                  <a 
                    href={`https://wa.me/91${sportsClubPhones[0]}?text=नमस्कार,%20मी%20मेंबरशिप%20फॉर्म%20भरला%20आहे.%20माझे%20नाव:%20${encodeURIComponent(formData.name)}%20पॅकेज:%20${encodeURIComponent(formData.package)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    💬 WhatsApp वर संपर्क करा
                  </a>

                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs border border-slate-300 transition cursor-pointer"
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

    </section>
  );
};

export default SportsPricingSection;
