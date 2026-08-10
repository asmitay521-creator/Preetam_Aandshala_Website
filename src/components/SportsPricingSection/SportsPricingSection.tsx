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
  PhoneCall,
  ArrowRight,
  Info,
  Check,
  Gift
} from "lucide-react";
import "./SportsPricingSection.css";

const sportsClubPhones = ["9370237633", "9370237634"];

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
      "स्टीम बाथ (Steam Bath) सुविधा उपलब्ध",
      "प्रमाणित फिटनेस ट्रेनर्सचे मोफत मार्गदर्शन"
    ]
  };

  const pkg3Months: PackageDetail = {
    title: "३ महिने मेंबरशिप पॅकेज",
    duration: "३ महिने (3 Months)",
    rackRate: "₹ ७,५००",
    offerPrice: "₹ ३,९९९",
    savings: "₹ ३,५०१ ची भरघोस बचत! (47% OFF)",
    facilityNote: "जिम, ऑलिंपिक स्विमिंग पूल, पिकलबॉल, इनडोअर बॅडमिंटन, स्क्वॅश, स्नूकर किंवा टेबल टेनिस पैकी एका विशिष्ट सुविधेचा प्रवेश",
    benefits: [
      "निवडलेल्या एका मुख्य सोयीचा अमर्याद प्रवेश",
      "ग्रंथालय व म्युझिक हॉल मोफत प्रवेश",
      "फिटनेस गार्डन व जॉगिंग ट्रॅक मोफत प्रवेश",
      "इनडोअर सिटिंग गेम्स सोयी मोफत"
    ]
  };

  const pkg1Month: PackageDetail = {
    title: "१ महिना ट्रायलर पॅकेज",
    duration: "१ महिना (1 Month)",
    rackRate: "₹ ३,५००",
    offerPrice: "₹ १,४९९",
    savings: "₹ २,००१ ची बचत! (57% OFF)",
    facilityNote: "जिम, ऑलिंपिक स्विमिंग पूल, पिकलबॉल, इनडोअर बॅडमिंटन, स्क्वॅश, स्नूकर किंवा टेबल टेनिस पैकी एका विशिष्ट सुविधेचा प्रवेश",
    benefits: [
      "निवडलेल्या एका मुख्य सोयीचा १ महिना अमर्याद प्रवेश",
      "ग्रंथालय व म्युझिक हॉल मोफत प्रवेश",
      "आउटडोअर फिटनेस गार्डन व जॉगिंग ट्रॅक मोफत"
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
        
        {/* Section Title & Explanation Header */}
        <div className="sp-section-header mt-6 flex flex-col sm:flex-row items-center justify-center text-center gap-3 sm:gap-4">
          <div className="sp-section-icon shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white size-12 rounded-2xl flex items-center justify-center shrink-0">
            <User size={24}/>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-white text-base sm:text-xl font-black tracking-tight text-center">
              I. PREETAM SPORTS & FITNESS CLUB: MEMBERSHIP RATE CARD
            </div>
            <div className="inline-flex items-center justify-center gap-2 mt-1.5 px-4 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-black shadow-inner">
              <Sparkles size={13} className="text-amber-300 animate-pulse"/>
              <span>प्री-लाँच स्पेशल ऑफर दर पत्रक • PRE-LAUNCH OFFER 2025</span>
            </div>
          </div>
        </div>

        {/* Individual Facility Packages Callout Card */}
        <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-slate-900/5 p-5 sm:p-6 rounded-3xl border-2 border-pink-300/80 my-5 shadow-lg relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-pink-200/80">
            <div className="flex items-center gap-2.5 text-pink-700 font-black text-base sm:text-lg">
              <span className="grid size-8 place-items-center rounded-xl bg-pink-600 text-white font-bold text-sm shadow-md">१</span>
              <span>वैयक्तिक क्रीडा सोयी पॅकेजेस (Individual Facility Packages)</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-black text-xs border border-pink-200 shadow-sm self-start sm:self-auto">
              🎯 एका सुविधेची मेंबरशिप (One Facility Access)
            </span>
          </div>

          <p className="text-slate-700 text-xs sm:text-sm font-bold mb-3">
            हे दर खालीलपैकी एका विशिष्ट सुविधेच्या १ महिना, ३ महिने, ६ महिने किंवा १ वर्षाच्या मेंबरशिपसाठी लागू आहेत (कार्ड किंवा रोवर क्लिक करून संपूर्ण माहिती पहा):
          </p>

          {/* COLORFUL FACILITY CHIPS */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🏋️‍♂️ AC जिम व बॉडीबिल्डिंग
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🏊‍♂️ ऑलिंपिक स्विमिंग पूल
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🏓 पिकलबॉल Court
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🏸 इनडोअर बॅडमिंटन
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🎾 स्क्वॅश ॲरेना
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🎱 स्नूकर लाउंज
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 font-black text-xs border border-slate-200 shadow-sm hover:border-pink-500 hover:text-pink-600 transition cursor-pointer">
              🏓 टेबल टेनिस
            </span>
          </div>
        </div>

        {/* DURATION FILTER TABS (DAYWISE, MONTHWISE, YEARWISE, ALL) */}
        <div className="flex items-center justify-center gap-2 flex-wrap my-6 p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-pink-500/30 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => setDurationFilter("all")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              durationFilter === "all"
                ? "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-lg shadow-pink-500/40 scale-105"
                : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            🌟 सर्व योजना (All Plans)
          </button>
          <button
            type="button"
            onClick={() => setDurationFilter("day")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              durationFilter === "day"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40 scale-105"
                : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            ☀️ दिवसवार (Day Pass)
          </button>
          <button
            type="button"
            onClick={() => setDurationFilter("month")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              durationFilter === "month"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40 scale-105"
                : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            📆 महिनेवार (1, 3 & 6 Months)
          </button>
          <button
            type="button"
            onClick={() => setDurationFilter("year")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              durationFilter === "year"
                ? "bg-gradient-to-r from-pink-600 to-amber-600 text-white shadow-lg shadow-pink-500/40 scale-105"
                : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            👑 वार्षिक (1 Year Annual)
          </button>
        </div>

        {/* MODERN VISUAL PRICING CARDS GRID */}
        <div className="sp-visual-cards-grid my-8">
          
          {/* 1. DAY PASS (REPRESENTATIVE FOR DAYWISE & ALL) */}
          {(durationFilter === "all" || durationFilter === "day") && (
            <div 
              className="sp-price-card cursor-pointer group bg-white border-2 border-emerald-400 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all relative flex flex-col justify-between hover:-translate-y-1.5"
              onClick={() => handleOpenDetailModal(pkgDayPass)}
            >
              <div className="sp-pop-badge bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md z-10">
                🔥 विशेष डे-पास ऑफर
              </div>
              <div>
                <div className="sp-card-dur flex items-center gap-2 text-emerald-900 font-black text-lg mb-1">
                  <CalendarDays className="text-emerald-600 shrink-0" size={22}/>
                  <span>१ दिवस (Day Pass)</span>
                </div>
                <div className="sp-rack-price text-xs font-bold text-slate-500 mb-1">
                  मूळ दर: <span className="sp-rack-num line-through text-slate-400">₹ ५००</span>
                </div>
                <div className="sp-offer-price text-2xl sm:text-3xl font-black text-emerald-600 mb-2">
                  ₹ ३०० <span className="text-xs text-slate-500 font-bold">/ दिवस</span>
                </div>
                <div className="sp-save-badge bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                  <Sparkles size={13}/> सर्व क्रीडा सोयी वापरा!
                </div>

                <ul className="mt-3 space-y-2 text-xs font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>ऑलिंपिक स्विमिंग पूल अमर्याद १ दिवस</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>२४x७ जिम व इनडोअर गेम्स</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>चहा व अल्पोपहार सोय विनामूल्य</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(pkgDayPass); }}
                  className="w-full py-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info size={15}/>
                  <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. 1 MONTH (REPRESENTATIVE FOR MONTHWISE & ALL) */}
          {(durationFilter === "all" || durationFilter === "month") && (
            <div 
              className="sp-price-card cursor-pointer group bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all relative flex flex-col justify-between hover:-translate-y-1.5"
              onClick={() => handleOpenDetailModal(pkg1Month)}
            >
              <div>
                <div className="sp-card-dur flex items-center gap-2 text-blue-900 font-black text-lg mb-1">
                  <CalendarDays className="text-blue-500 shrink-0" size={22}/>
                  <span>१ महिना मेंबरशिप</span>
                </div>
                <div className="sp-rack-price text-xs font-bold text-slate-500 mb-1">
                  मूळ दर: <span className="sp-rack-num line-through text-slate-400">₹ ३,५००</span>
                </div>
                <div className="sp-offer-price text-2xl sm:text-3xl font-black text-blue-600 mb-2">
                  ₹ १,४९९ <span className="text-xs text-slate-500 font-bold">/ महिना</span>
                </div>
                <div className="sp-save-badge bg-blue-100 text-blue-800 border border-blue-300 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                  <Sparkles size={13}/> ₹ २,००१ ची बचत! (57% OFF)
                </div>

                <ul className="mt-3 space-y-2 text-xs font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>निवडलेल्या एका मुख्य सोयीचा १ महिना वापर</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>ग्रंथालय व म्युझिक हॉल मोफत</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    <span>फिटनेस गार्डन व जॉगिंग ट्रॅक मोफत</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(pkg1Month); }}
                  className="w-full py-2.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info size={15}/>
                  <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. 3 MONTHS (SHOWN IN MONTHWISE TAB) */}
          {durationFilter === "month" && (
            <div 
              className="sp-price-card cursor-pointer group bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all relative flex flex-col justify-between hover:-translate-y-1.5"
              onClick={() => handleOpenDetailModal(pkg3Months)}
            >
              <div>
                <div className="sp-card-dur flex items-center gap-2 text-indigo-900 font-black text-lg mb-1">
                  <CalendarDays className="text-indigo-500 shrink-0" size={22}/>
                  <span>३ महिने मेंबरशिप</span>
                </div>
                <div className="sp-rack-price text-xs font-bold text-slate-500 mb-1">
                  मूळ दर: <span className="sp-rack-num line-through text-slate-400">₹ ७,५००</span>
                </div>
                <div className="sp-offer-price text-2xl sm:text-3xl font-black text-indigo-600 mb-2">
                  ₹ ३,९९९ <span className="text-xs text-slate-500 font-bold">/ ३ महिने</span>
                </div>
                <div className="sp-save-badge bg-indigo-100 text-indigo-800 border border-indigo-300 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                  <Sparkles size={13}/> ₹ ३,५०१ ची बचत! (47% OFF)
                </div>

                <ul className="mt-3 space-y-2 text-xs font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                    <span>निवडलेल्या एका सोयीचा ३ महिने अमर्याद प्रवेश</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                    <span>ग्रंथालय व म्युझिक हॉल मोफत</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                    <span>इनडोअर गेम्स सोयी मोफत</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(pkg3Months); }}
                  className="w-full py-2.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info size={15}/>
                  <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. 6 MONTHS (SHOWN IN MONTHWISE TAB) */}
          {durationFilter === "month" && (
            <div 
              className="sp-price-card cursor-pointer group bg-white border-2 border-purple-200 hover:border-purple-400 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all relative flex flex-col justify-between hover:-translate-y-1.5"
              onClick={() => handleOpenDetailModal(pkg6Months)}
            >
              <div>
                <div className="sp-card-dur flex items-center gap-2 text-purple-900 font-black text-lg mb-1">
                  <CalendarDays className="text-purple-500 shrink-0" size={22}/>
                  <span>६ महिने मेंबरशिप</span>
                </div>
                <div className="sp-rack-price text-xs font-bold text-slate-500 mb-1">
                  मूळ दर: <span className="sp-rack-num line-through text-slate-400">₹ १२,०००</span>
                </div>
                <div className="sp-offer-price text-2xl sm:text-3xl font-black text-purple-600 mb-2">
                  ₹ ६,९९९ <span className="text-xs text-slate-500 font-bold">/ ६ महिने</span>
                </div>
                <div className="sp-save-badge bg-purple-100 text-purple-800 border border-purple-300 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                  <Sparkles size={13}/> ₹ ५,००१ ची बचत! (42% OFF)
                </div>

                <ul className="mt-3 space-y-2 text-xs font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                    <span>मुख्य सोयीचा ६ महिने अमर्याद प्रवेश</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                    <span>स्टीम बाथ सुविधा उपलब्ध</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                    <span>प्रमाणित फिटनेस ट्रेनर्स सल्ला</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(pkg6Months); }}
                  className="w-full py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info size={15}/>
                  <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. 12 MONTHS / 1 YEAR (REPRESENTATIVE FOR YEARWISE & ALL) */}
          {(durationFilter === "all" || durationFilter === "year") && (
            <div 
              className="sp-price-card popular cursor-pointer group bg-gradient-to-b from-pink-50 via-white to-pink-50/40 border-2 border-pink-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all relative flex flex-col justify-between hover:-translate-y-1.5"
              onClick={() => handleOpenDetailModal(pkg12Months)}
            >
              <div className="sp-pop-badge bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md z-10">
                🔥 सर्वोत्कृष्ट बचत • MOST POPULAR
              </div>
              <div>
                <div className="sp-card-dur flex items-center gap-2 text-pink-900 font-black text-lg mb-1">
                  <CalendarDays className="text-pink-600 shrink-0" size={22}/>
                  <span>१२ महिने (१ वर्ष)</span>
                </div>
                <div className="sp-rack-price text-xs font-bold text-slate-500 mb-1">
                  मूळ दर: <span className="sp-rack-num line-through text-slate-400">₹ १८,०००</span>
                </div>
                <div className="sp-offer-price text-2xl sm:text-3xl font-black text-pink-600 mb-2">
                  ₹ ११,९९९ <span className="text-xs text-slate-500 font-bold">/ वर्ष</span>
                </div>
                <div className="sp-save-badge bg-pink-100 text-pink-800 border border-pink-300 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                  <Sparkles size={13}/> ₹ ६,००१ ची बचत! (33% OFF)
                </div>

                <ul className="mt-3 space-y-2 text-xs font-bold text-slate-800 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                    <span>मुख्य सोयीचा १ वर्ष अमर्याद प्रवेश</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                    <span>ग्रंथालय, म्युझिक हॉल व स्टीम बाथ मोफत</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                    <span>पर्सनल फिटनेस ट्रेनर व डाएट चार्ट</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(pkg12Months); }}
                  className="w-full py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Info size={15}/>
                  <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC SPORTS PACKAGES FROM ADMIN STORE (SHOWN ON SPECIFIC TABS) */}
          {durationFilter !== "all" && store.siteData.sportsPackages?.map((spk) => {
            const isDay = spk.title.includes("दिवस") || spk.title.toLowerCase().includes("day");
            const isYear = spk.title.includes("वर्ष") || spk.title.toLowerCase().includes("year") || spk.title.includes("वार्षिक");
            const isMonth = !isDay && !isYear;

            if (durationFilter === "day" && !isDay) return null;
            if (durationFilter === "month" && !isMonth) return null;
            if (durationFilter === "year" && !isYear) return null;

            const spkDetail: PackageDetail = {
              title: spk.title,
              duration: spk.title,
              rackRate: spk.price,
              offerPrice: spk.price,
              savings: spk.subtitle || "विशेष स्पोर्ट्स ऑफर",
              benefits: spk.features || ["विशेष क्रीडा सोयी"],
            };

            return (
              <div 
                key={spk.id}
                className="sp-price-card cursor-pointer group border-2 border-purple-300 bg-white text-slate-900 rounded-3xl p-6 shadow-xl relative overflow-visible flex flex-col justify-between hover:-translate-y-1.5 transition-all"
                onClick={() => handleOpenDetailModal(spkDetail)}
              >
                <div className="sp-pop-badge bg-gradient-to-r from-purple-600 to-pink-600 text-white z-10 shadow-md">
                  ✨ विशेष स्पोर्ट्स ऑफर
                </div>
                <div>
                  <div className="sp-card-dur text-purple-900 font-black flex items-center gap-2 text-lg mb-1">
                    <CalendarDays className="text-purple-600 shrink-0" size={22}/>
                    <span>{spk.title}</span>
                  </div>
                  <div className="sp-offer-price text-purple-700 font-black text-2xl mb-2">
                    {spk.price}
                  </div>
                  {spk.subtitle && (
                    <div className="sp-save-badge bg-purple-100 text-purple-800 border border-purple-200 font-extrabold text-xs px-3 py-1 rounded-full mb-3 inline-flex items-center gap-1">
                      <Sparkles size={13}/> {spk.subtitle}
                    </div>
                  )}

                  <ul className="mt-3 space-y-2 text-xs text-slate-800 font-bold border-t border-slate-200 pt-3">
                    {(spk.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetailModal(spkDetail);
                    }}
                    className="w-full py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Info size={15}/>
                    <span>संपूर्ण माहिती व नोंदणी उघडा 👁️</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ULTRA-MODERN SPECIAL VIP OFFER SHOWCASE & TIER CARDS - ZERO TABLE CLUTTER */}
        <div className="my-10 space-y-6">

          {/* HERO VIP ANNUAL OFFER BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-pink-900 to-rose-950 p-6 sm:p-8 text-white shadow-2xl border-2 border-amber-400/40">
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs">
                  <Sparkles size={14} className="text-amber-300 animate-spin" />
                  <span>✨ SPECIAL VIP ANNUAL DISCOUNT DEAL</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  एकावेळी १ वर्षाचे मेंबरशिप शुल्क भरल्यास<br />
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                    दरमहा दर फक्त ₹१,००० / महिना!
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-pink-200/90 font-semibold max-w-xl">
                  जिम, ऑलिंपिक पूल, टेनिस व सर्व सोयींसह १ वर्षाचा अमर्याद VIP स्पोर्ट्स क्लब एक्सेस.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 shrink-0 text-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl">
                  <div className="text-[11px] text-pink-200 font-bold uppercase tracking-wider">वार्षिक स्पेशल सवलत दर</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">₹ १२,००० <span className="text-xs text-white font-bold">+ GST</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenModal("Annual Special Offer (₹12,000 + GST)")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔥 या VIP ऑफरची नोंदणी करा</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* EXCITING ATTRACTIVE REPLACEMENT: 1-DAY FREE DEMO PASS & WHY PREETAM HUB */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-10">

            {/* LEFT 7 COLS: WHY CHOOSE PREETAM SPORTS CLUB FEATURE MATRIX */}
            <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-purple-500/30 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-24 -left-24 size-60 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-extrabold text-xs">
                  <Sparkles size={14} className="text-pink-400" />
                  <span>🏆 सांगलीतील नंबर १ आंतरराष्ट्रीय दर्जाचे क्रीडा संकुल</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  प्रीतम स्पोर्ट्स क्लबच का निवडावा?<br />
                  <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
                    जागतिक दर्जाच्या क्रीडा सोयी एकाच छताखाली!
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition group">
                    <div className="text-2xl mb-1">🏊‍♂️</div>
                    <div className="font-black text-white text-sm">ऑलिंपिक स्विमिंग पूल</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">तापमान नियंत्रित ५० मी. आंतरराष्ट्रीय ट्रॅक व वॉटर प्युरिफायर सोय.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition group">
                    <div className="text-2xl mb-1">🏋️‍♀️</div>
                    <div className="font-black text-white text-sm">२४x७ हायटेक AC जिम</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">USA इम्पोर्टेड आधुनिक व्यायाम उपकरणे व बायोमेट्रिक ॲक्सेस.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition group">
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <div className="font-black text-white text-sm">प्रमाणित पर्सनल ट्रेनर्स</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">राष्ट्रीय खेळाडू व फिटनेस तज्ञांचे मोफत वैयक्तिक मार्गदर्शन.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition group">
                    <div className="text-2xl mb-1">♨️</div>
                    <div className="font-black text-white text-sm">स्टीम बाथ व स्पा सोय</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">वर्कआऊटनंतर संपूर्ण ताणतणाव मुक्तीसाठी मोफत स्टीम बाथ.</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="text-xs text-purple-200 font-bold">
                  📍 आनंदशाळा, सांगली-मिरज रोड • <span className="text-amber-300 font-black">५०००+ समाधानी सभासद</span>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: FREE 1-DAY DEMO TRIAL PASS BOOKING CARD */}
            <div 
              onClick={() => handleOpenDetailModal(pkgFreeTrialPass)}
              className="lg:col-span-5 bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.01] transition-all"
            >
              <div className="absolute -bottom-16 -right-16 size-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md animate-pulse">
                  <Gift size={15} className="text-slate-950" />
                  <span>LIMITED PERIOD GIFT PASS</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  🎁 १-दिवसाचा फ्री ट्रायअल डेमो पास क्लेम करा!
                </h3>

                <p className="text-xs sm:text-sm text-pink-100 font-medium leading-relaxed">
                  पॅकेज घेण्यापूर्वी स्वतः येऊन जिम, ऑलिंपिक पूल व क्रीडा सोयींचा प्रत्यक्ष अनुभव घ्या! शून्य शुल्क, शून्य अट!
                </p>

                <ul className="space-y-2 text-xs font-extrabold text-white bg-black/20 p-4 rounded-2xl border border-white/20">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                    <span>विनामूल्य ऑलिंपिक स्विमिंग पूल entry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                    <span>जिम व फिटनेस असेसमेंट मोफत</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                    <span>फिटनेस तज्ञांसोबत १-ऑन-१ सल्लागार</span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetailModal(pkgFreeTrialPass);
                  }}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} className="text-slate-950" />
                  <span>माझा मोफत १-दिवस पास माहिती उघडा 👁️</span>
                </button>
                <div className="text-center text-[11px] text-pink-200 font-bold mt-2.5">
                  ⚡ आजच ५० पास शिल्लक आहेत!
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* II and III Two Columns */}
        <div className="sp-two-cols">
          
          {/* II. ADD-ON FACILITIES */}
          <div className="sp-card-pink">
            <div className="sp-card-header-pink">
              <User size={22} className="text-pink-200 shrink-0"/>
              <span>II. ॲड-ऑन सोयी (ADD-ON ACTIVITY ZONE)</span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between h-[calc(100%-65px)] bg-gradient-to-b from-pink-50/30 to-white">
              <div>
                <div className="text-xs font-bold text-pink-900 bg-pink-100/80 p-4 rounded-2xl border border-pink-200 mb-6 flex items-center gap-2.5 shadow-xs">
                  <Sparkles size={18} className="text-pink-600 shrink-0"/>
                  <span>या सोयी वैयक्तिक क्रीडा सोयी पॅकेजेससोबत ॲड-ऑन म्हणून उपलब्ध आहेत:</span>
                </div>
                
                <div className="space-y-4">
                  {/* Mind & Body */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 transition shadow-sm hover:shadow-md flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Activity size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-1.5">1. Mind & Body (मन व शरीर स्वास्थ्य):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">🧘 झुंबा (Zumba)</span>
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">💃 फिटनेस डान्स</span>
                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">🧘‍♂️ योग व ध्यान</span>
                      </div>
                    </div>
                  </div>

                  {/* Recreation */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-100 hover:border-purple-300 transition shadow-sm hover:shadow-md flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Gamepad2 size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-1.5">2. Recreation (मनोरंजन व कला):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black">🎯 इनडोअर खेळ</span>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black">🎵 संगीतमय हॉल</span>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black">📚 वाचनालय</span>
                      </div>
                    </div>
                  </div>

                  {/* Outdoor Fitness */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 transition shadow-sm hover:shadow-md flex items-start gap-4">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Footprints size={24}/>
                    </div>
                    <div className="flex-1">
                      <strong className="text-slate-900 block text-sm font-black mb-1.5">3. Outdoor Fitness (मैदानी व्यायाम):</strong>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">🌳 फिटनेस गार्डन</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">🏃‍♂️ जॉगिंग ट्रॅक</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenModal("Add-on Activity Zone Inquiry")}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-black text-sm shadow-lg transition cursor-pointer mt-6 flex items-center justify-center gap-2"
              >
                <span>💬 ॲड-ऑन सोयींबद्दल चौकशी करा</span>
                <ArrowRight size={18}/>
              </button>
            </div>
          </div>

          {/* III. PREETAM ELITE */}
          <div className="sp-card-blue">
            <div className="sp-card-header-blue">
              <Crown size={22} className="text-amber-300 shrink-0"/>
              <span>III. प्रीतम एलिट – फॅमिली लाईफटाईम मेंबरशिप</span>
            </div>

            <div className="p-6 sm:p-7 flex flex-col justify-between h-[calc(100%-65px)] bg-gradient-to-b from-indigo-50/30 to-white">
              <div>
                <div className="text-xs font-bold text-indigo-900 bg-indigo-100/80 p-4 rounded-2xl border border-indigo-200 mb-6 flex items-center gap-2.5 shadow-xs">
                  <Sparkles size={18} className="text-indigo-600 shrink-0"/>
                  <span>सर्व क्रीडा व ॲक्टिव्हिटी सोयींचा अमर्याद आनंद घेणारे भव्य कुटुंब मेंबरशिप पॅकेज:</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition shadow-sm hover:shadow-md flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-pink-100 text-pink-600 font-bold">
                        <Clock size={18}/>
                      </span>
                      <span>कालावधी (Duration)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-xl border border-pink-200 shadow-xs">१० वर्षे (10 Years Lifetime)</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition shadow-sm hover:shadow-md flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-purple-100 text-purple-600 font-bold">
                        <Users size={18}/>
                      </span>
                      <span>समाविष्ट सदस्य (Members)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200 shadow-xs">४ कुटुंब सदस्य (4 Members)</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition shadow-sm hover:shadow-md flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-indigo-100 text-indigo-600 font-bold">
                        <Zap size={18}/>
                      </span>
                      <span>सुविधांचा प्रवेश (Access)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200 shadow-xs">सर्व क्रीडा व सोयी समाविष्ट</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-300 transition shadow-sm hover:shadow-md flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                        <CalendarDays size={18}/>
                      </span>
                      <span>नोंदणी नोट (Pre-booking)</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-800 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 shadow-xs">स्लॉट-आधारित बुकिंग</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenModal("Preetam Elite Lifetime Membership (10 Years)")}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg transition cursor-pointer mt-6 flex items-center justify-center gap-2"
              >
                <span>👑 प्रीतम एलिट मेंबरशिप बद्दल चौकशी करा</span>
                <ArrowRight size={18}/>
              </button>
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
                    <label>३. निवडलेले पॅकेज (Package)</label>
                    <select 
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      className="bg-[#0f172a] text-white font-bold"
                    >
                      <option value="१-दिवसाचा फ्री ट्रायअल पास (Free 1-Day Trial Pass)" className="bg-[#0f172a] text-white font-bold">१-दिवसाचा फ्री ट्रायअल पास (मोफत)</option>
                      <option value="1 Day Pass (₹300)" className="bg-[#0f172a] text-white font-bold">१ दिवस डे-पास (₹३००)</option>
                      <option value="12 Months Package" className="bg-[#0f172a] text-white font-bold">१२ महिने पॅकेज (₹११,९९९)</option>
                      <option value="6 Months Package" className="bg-[#0f172a] text-white font-bold">६ महिने पॅकेज (₹६,९९९)</option>
                      <option value="3 Months Package" className="bg-[#0f172a] text-white font-bold">३ महिने पॅकेज (₹३,९९९)</option>
                      <option value="1 Month Package" className="bg-[#0f172a] text-white font-bold">१ महिना पॅकेज (₹१,४९९)</option>
                      <option value="Annual Special Offer" className="bg-[#0f172a] text-white font-bold">विशेष वार्षिक ऑफर (₹१२,००० + GST)</option>
                      <option value="Preetam Elite Lifetime Membership" className="bg-[#0f172a] text-white font-bold">प्रीतम एलिट १० वर्षे फॅमिली मेंबरशिप</option>
                    </select>
                  </div>

                  <button type="submit" className="sp-submit-btn cursor-pointer">
                    ऑनलाईन फॉर्म सबमिट करा →
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  अभिनंदन! नोंदणी सबमिट झाली.
                </h3>
                <p className="text-sm font-bold text-slate-300 mb-6">
                  धन्यवाद <strong>{formData.name}</strong>! तुमची मेंबरशिप चौकशी सबमिट झाली आहे. आमची टीम लवकरच फोन करेल.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a 
                    href={`https://wa.me/91${sportsClubPhones[0]}?text=नमस्कार,%20मी%20मेंबरशिप%20फॉर्म%20भरला%20आहे.%20माझे%20नाव:%20${encodeURIComponent(formData.name)}%20पॅकेज:%20${encodeURIComponent(formData.package)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-emerald-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp वर संपर्क करा
                  </a>

                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-full bg-white/10 text-white font-black text-xs border border-white/20"
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
