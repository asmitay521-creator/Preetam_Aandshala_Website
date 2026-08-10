import React, { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { useLanguage } from "@/lib/use-language";

interface ScheduleSectionProps {
  type?: "anandshala" | "sports";
}

export default function ScheduleSection({ type = "anandshala" }: ScheduleSectionProps) {
  const store = useAdminStore();
  const { isEn } = useLanguage();
  const config = type === "sports" ? store.sportsScheduleConfig : store.scheduleConfig;
  const items = config.items?.length ? config.items : [];
  const rules = config.rules?.length ? config.rules : [];
  const [showPosterModal, setShowPosterModal] = useState(false);

  return (
    <section className="w-full bg-[#fdfafb] py-16 px-4 md:px-8 font-sans" id="schedule">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-3">
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-xs sm:text-sm shadow-sm border ${
              type === "sports" 
                ? "bg-indigo-50 border-indigo-200 text-[#1A05A2]" 
                : "bg-pink-50 border-pink-200 text-[#810B38]"
            }`}>
              <span>{type === "sports" ? (isEn ? "🏋️‍♂️ Preetam Sports & Fitness Club" : "🏋️‍♂️ प्रीतम स्पोर्ट्स अँड फिटनेस क्लब") : (isEn ? "🌸 Preetam Senior Citizen Anandshala" : "🌸 प्रीतम ज्येष्ठ नागरिक आनंदशाळा")}</span>
            </span>
          </div>

          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md flex items-center justify-center flex-wrap gap-2 md:gap-3 py-1.5 bg-gradient-to-r bg-clip-text text-transparent ${
            type === "sports"
              ? "from-[#1A05A2] via-purple-700 to-[#db2777]"
              : "from-[#810B38] via-rose-700 to-amber-700"
          }`}>
            <span className="text-amber-500 opacity-90 text-2xl sm:text-3xl">✨</span>
            <span>
              {isEn
                ? (type === "sports" ? "Preetam Sports Club Timetable" : "Preetam Senior Citizen Anandshala Timetable")
                : (config.headerTitle || (type === "sports" ? "प्रीतम स्पोर्ट्स क्लब वेळापत्रक" : "प्रीतम ज्येष्ठ नागरिक आनंदशाळा वेळापत्रक"))}
            </span>
            <span className="text-amber-500 opacity-90 text-2xl sm:text-3xl">✨</span>
          </h2>

          <p className="mt-3 text-slate-800 font-black text-sm sm:text-lg md:text-xl flex items-center justify-center flex-wrap gap-2 max-w-4xl leading-relaxed">
            <span className="text-pink-600 text-base sm:text-xl">💖</span> 
            <span>
              {isEn
                ? (type === "sports" ? "Complete experience of fitness, sports and wellness... Modern gym, swimming pool & all sports facilities." : "Joyful life, beautiful thoughts... Ideal center of health, entertainment, values and togetherness.")
                : (config.subtitle || (type === "sports" ? "फिटनेस, क्रीडा आणि आरोग्याचा परिपूर्ण अनुभव... आधुनिक जिम, स्विमिंग पुल व सर्व खेळांची सोय." : "आनंदी जीवन, सुंदर विचार... आरोग्य, मनोरंजन, संस्कार आणि सहवास यांचं आदर्श केंद्र."))}
            </span>
            <span className="text-pink-600 text-base sm:text-xl">💖</span>
          </p>

          {/* UPLOADED TIMETABLE POSTER / DOCUMENT BANNER BUTTON (IF UPLOADED BY ADMIN) */}
          {config.posterUrl && (
            <div className="mt-6">
              <button
                onClick={() => setShowPosterModal(true)}
                className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-white/40 ${
                  type === "sports"
                    ? "bg-gradient-to-r from-[#1A05A2] to-purple-700 hover:shadow-indigo-500/40"
                    : "bg-gradient-to-r from-[#810B38] to-pink-700 hover:shadow-pink-500/40"
                }`}
              >
                <span>📜</span>
                <span>ॲडमिनद्वारे अपलोड केलेले अधिकृत वेळापत्रक (पहा / डाउनलोड करा)</span>
                <span className="bg-amber-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-black">पहा</span>
              </button>
            </div>
          )}
        </div>

        {/* TIMETABLE POSTER LIGHTBOX MODAL */}
        {showPosterModal && config.posterUrl && (
          <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
            <div className="relative max-w-4xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-[#1a1a40]">
                  📜 अधिकृत आनंदशाळा वेळापत्रक (Timetable Poster)
                </h3>
                <button
                  onClick={() => setShowPosterModal(false)}
                  className="size-9 rounded-full bg-slate-100 text-slate-700 font-extrabold hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {config.posterType === "pdf" ? (
                <iframe src={config.posterUrl} className="w-full h-[70vh] rounded-2xl border" title="Schedule PDF" />
              ) : (
                <div className="max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-200">
                  <img src={config.posterUrl} alt="Official Timetable Schedule" className="w-full h-auto object-contain rounded-2xl" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <a
                  href={config.posterUrl}
                  download="anandshala_timetable.png"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>📥</span>
                  <span>डाऊनलोड करा</span>
                </a>
                <button
                  onClick={() => setShowPosterModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-extrabold text-xs hover:bg-slate-300 transition-colors"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DATE & TIME BADGES */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-t-3xl border-b-4 border-[#1A05A2] shadow-sm p-4 px-6 md:px-12 z-10 relative mt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f472b6] text-white flex items-center justify-center text-2xl shadow-md">
              📅
            </div>
            <div>
              <div className="text-[#f472b6] font-extrabold text-sm">वेळापत्रक</div>
              <div className="text-[#1a1a40] font-black text-base sm:text-lg">{config.daysText || "सोमवार ते शुक्रवार (दैनिक हजेरी)"}</div>
            </div>
          </div>
          
          <div className="hidden lg:flex bg-[#1A05A2] text-white rounded-full px-8 py-2.5 items-center gap-2 shadow-md">
            <span className="opacity-70">🌿</span>
            <span className="font-black text-lg">{config.headerTitle || "प्रीतम ज्येष्ठ नागरिक आनंदशाळा वेळापत्रक"}</span>
            <span className="opacity-70">🌿</span>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="w-12 h-12 rounded-full border-4 border-[#1A05A2] text-[#1A05A2] flex items-center justify-center text-xl font-bold bg-[#e8eaf6]">
              🕐
            </div>
            <div>
              <div className="text-[#1A05A2] font-extrabold text-sm">सकाळी वेळ</div>
              <div className="text-[#1a1a40] font-black text-base sm:text-lg">{config.timeRange || "05:30 ते 09:30"}</div>
            </div>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto bg-white rounded-b-3xl shadow-xl border border-slate-100">
          <table className="w-full min-w-[900px] text-center border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#f472b6] via-[#1A05A2] to-[#6a0dad] text-white">
                <th className="py-2.5 px-2 font-black text-base border-r border-white/20 w-[15%]">वेळ</th>
                <th className="py-2.5 px-2 font-black text-base border-r border-white/20">सोमवार</th>
                <th className="py-2.5 px-2 font-black text-base border-r border-white/20">मंगळवार</th>
                <th className="py-2.5 px-2 font-black text-base border-r border-white/20">बुधवार</th>
                <th className="py-2.5 px-2 font-black text-base border-r border-white/20">गुरुवार</th>
                <th className="py-2.5 px-2 font-black text-base">शुक्रवार</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={row.id || i} className={`border-b border-slate-200 hover:bg-pink-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                  <td className="py-2.5 px-2 border-r border-slate-200">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span className="text-xl text-[#1A05A2]">{row.icon}</span>
                      <span className="font-extrabold text-[#1a1a40] text-xs sm:text-sm">{row.time}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200">
                    <div className="font-extrabold text-[#1a1a40] text-sm sm:text-base leading-tight mb-0.5">{row.mon?.main || ""}</div>
                    <div className="text-xs font-medium text-slate-500">{row.mon?.sub || ""}</div>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200">
                    <div className="font-extrabold text-[#1a1a40] text-sm sm:text-base leading-tight mb-0.5">{row.tue?.main || ""}</div>
                    <div className="text-xs font-medium text-slate-500">{row.tue?.sub || ""}</div>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200">
                    <div className="font-extrabold text-[#1a1a40] text-sm sm:text-base leading-tight mb-0.5">{row.wed?.main || ""}</div>
                    <div className="text-xs font-medium text-slate-500">{row.wed?.sub || ""}</div>
                  </td>
                  <td className="py-2 px-2 border-r border-slate-200">
                    <div className="font-extrabold text-[#1a1a40] text-sm sm:text-base leading-tight mb-0.5">{row.thu?.main || ""}</div>
                    <div className="text-xs font-medium text-slate-500">{row.thu?.sub || ""}</div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="font-extrabold text-[#1a1a40] text-sm sm:text-base leading-tight mb-0.5">{row.fri?.main || ""}</div>
                    <div className="text-xs font-medium text-slate-500">{row.fri?.sub || ""}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM 3 SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          
          {/* Features */}
          <div className="col-span-1 lg:col-span-4 bg-white rounded-[24px] shadow-lg border-2 border-pink-200 overflow-hidden relative flex flex-col justify-between">
            <div className="bg-[#f472b6] text-white text-center py-2.5 font-black text-base flex justify-center items-center gap-2 w-max mx-auto px-8 rounded-b-xl absolute top-0 inset-x-0 shadow-sm z-10">
              <span className="text-xs">✦</span> {isEn ? "Our Key Features" : "आमच्या वैशिष्ट्ये"} <span className="text-xs">✦</span>
            </div>
            <div className="pt-14 pb-5 px-4 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2.5 sm:gap-3.5 items-center justify-center h-full">
              <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/60 transition-colors border border-pink-100">
                <div className="w-11 h-11 rounded-full bg-[#1A05A2] text-white flex items-center justify-center text-xl shadow-md">🏢</div>
                <div className="text-xs sm:text-sm font-black text-[#1a1a40] leading-tight">{isEn ? "Modern Facilities" : "आधुनिक सुविधा"}</div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 transition-colors border border-blue-100">
                <div className="w-11 h-11 rounded-full bg-[#208dd7] text-white flex items-center justify-center text-xl shadow-md">🛡️</div>
                <div className="text-xs sm:text-sm font-black text-[#1a1a40] leading-tight">{isEn ? "Safety First" : "सुरक्षा प्रथम"}</div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-rose-50/60 hover:bg-rose-100/60 transition-colors border border-rose-100">
                <div className="w-11 h-11 rounded-full bg-[#f472b6] text-white flex items-center justify-center text-xl shadow-md">❤️</div>
                <div className="text-xs sm:text-sm font-black text-[#1a1a40] leading-tight">{isEn ? "Health Care" : "आरोग्याची काळजी"}</div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-purple-50/60 hover:bg-purple-100/60 transition-colors border border-purple-100">
                <div className="w-11 h-11 rounded-full bg-[#1A05A2] text-white flex items-center justify-center text-xl shadow-md">🎭</div>
                <div className="text-xs sm:text-sm font-black text-[#1a1a40] leading-tight">{isEn ? "Arts & Culture" : "मनोरंजन व संस्कृती"}</div>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/60 transition-colors border border-pink-100 col-span-2 sm:col-span-1 lg:col-span-2">
                <div className="w-11 h-11 rounded-full bg-[#f472b6] text-white flex items-center justify-center text-xl shadow-md">🧘</div>
                <div className="text-xs sm:text-sm font-black text-[#1a1a40] leading-tight">{isEn ? "Expert Trainers" : "अनुभवी मार्गदर्शक"}</div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="col-span-1 lg:col-span-5 bg-white rounded-[24px] shadow-lg border-2 border-indigo-200 relative pt-16 pb-6 px-5 sm:px-6">
            <div className="bg-[#1A05A2] text-white text-center py-2.5 font-black text-base flex justify-center items-center gap-2 w-max mx-auto px-8 sm:px-10 rounded-b-xl absolute top-0 inset-x-0 shadow-sm z-10">
              <span className="text-xs">🌿</span> {isEn ? "Club Rules & Guidelines" : "क्लबाचे नियम व सूचना"} <span className="text-xs">🌿</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-1">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#f472b6] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#1a1a40] leading-snug">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Happy Moments */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-[24px] shadow-lg border-2 border-pink-200 overflow-hidden relative flex flex-col justify-between min-h-[300px]">
             <div className="bg-[#f472b6] text-white text-center py-2.5 font-black text-base flex justify-center items-center gap-2 w-max mx-auto px-6 rounded-b-xl absolute top-0 inset-x-0 z-10 shadow-sm">
              <span className="text-xs">✦</span> {isEn ? "Moments of Happiness" : "आनंदी जीवनाचे सुंदर क्षण"} <span className="text-xs">✦</span>
            </div>
            <div className="w-full flex-1 pt-14 p-3 flex flex-col">
               <div className="w-full flex-1 min-h-[220px] rounded-2xl overflow-hidden border-2 border-pink-100 relative shadow-inner">
                  <img src="/images/aandmelav 10.jpeg" alt="Happy Seniors" className="absolute inset-0 w-full h-full object-cover" />
               </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
