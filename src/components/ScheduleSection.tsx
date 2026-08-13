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
        
        {/* HEADER AREA (MATCHING IMAGE 1 EXACTLY) */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* TOP OVAL BRAND LOGO BADGE */}
          <div className="mb-3">
            <span className={`inline-flex items-center justify-center px-6 py-1.5 rounded-full font-black text-xs sm:text-sm tracking-wider shadow-md ${
              type === "sports" 
                ? "bg-[#1A05A2] text-white" 
                : "bg-gradient-to-r from-[#1A05A2] to-[#1e3a8a] text-white"
            }`}>
              {type === "sports" ? (isEn ? "PREETAM SPORTS ®" : "PREETAM SPORTS ®") : "PREETAM ®"}
            </span>
          </div>

          {/* MAIN TITLE (CLEAN MAROON HEADING) */}
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-center ${
            type === "sports"
              ? "text-[#1A05A2]"
              : "text-[#70092b]"
          }`}>
            {isEn
              ? (type === "sports" ? "Preetam Sports Club Timetable" : <>Preetam Senior Citizen <span className="text-[#be185d] font-black">Anandshala</span> Timetable</>)
              : (config.headerTitle || (type === "sports" ? "प्रीतम स्पोर्ट्स क्लब वेळापत्रक" : <>प्रीतम ज्येष्ठ नागरिक <span className="text-[#be185d] font-black">आनंदशाळा</span> वेळापत्रक</>))}
          </h2>

          {/* SUB-PILL BADGE (BABY PINK GRADIENT) */}
          <div className={`inline-block text-xs sm:text-base md:text-lg font-black px-6 py-2 sm:px-8 sm:py-2.5 rounded-full shadow-md border ${
            type === "sports"
              ? "bg-gradient-to-r from-indigo-600 via-indigo-800 to-[#1A05A2] text-white border-white/40"
              : "bg-gradient-to-r from-[#1A05A2] via-[#1e40af] to-[#1e3a8a] text-white border-blue-200"
          }`}>
            {type === "sports"
              ? (isEn ? "Monday to Saturday (6 AM to 9 PM)" : "सोमवार ते शनिवार (सकाळी ६ ते रात्री ९)")
              : (isEn ? "Monday to Saturday (11 AM to 5 PM)" : "सोमवार ते शनिवार स. ११ ते ५")}
          </div>

          {/* UPLOADED TIMETABLE POSTER / DOCUMENT BANNER BUTTON (IF UPLOADED BY ADMIN) */}
          {config.posterUrl && (
            <div className="mt-6">
              <button
                onClick={() => setShowPosterModal(true)}
                className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-white/40 ${
                  type === "sports"
                    ? "bg-gradient-to-r from-[#1A05A2] to-purple-700 hover:shadow-indigo-500/40"
                    : "bg-gradient-to-r from-[#be185d] to-pink-600 hover:shadow-pink-500/40"
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

        {/* ANANDSHALA BROCHURE TIMETABLE GRID LAYOUT (EXACTLY MATCHING PRINTED PAMPHLET) */}
        {type === "anandshala" ? (
          <div className="bg-[#fff0f6] border-4 border-[#f472b6]/40 rounded-[2.5rem] p-5 sm:p-8 shadow-2xl relative my-6 text-center">

            {/* 8-CARD GRID LAYOUT WITH ANIMATED BORDERS */}
            <div className="bg-white/90 rounded-3xl p-4 sm:p-6 border-2 border-pink-200 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { time: "११:०० ते ११:१०", title: "राष्ट्रगीत व प्रार्थना" },
                  { time: "११:१५ ते १२:००", title: "म्युझिक इन्स्ट्रुमेंट हॉल, कराओके गाणे म्हणणे व वाद्य वाजवणे याचा आनंद घेणे, विनोद, कविता, वाचन" },
                  { time: "१२:१५ ते ०१:००", title: "बैठे खेळ हॉलमध्ये विविध खेळांचा आनंद घेणे" },
                  { time: "०१:१५ ते ०२:००", title: "स्नेहभोजन अन्नपूर्णा भोजनकक्ष" },
                  { time: "०२:१५ ते ०३:००", title: "निवांत विश्रांती" },
                  { time: "०३:१५ ते ०४:००", title: "माहिती तंत्रज्ञान हॉल, वाचनालय व बैठे खेळ हॉल मध्ये आनंद घेणे" },
                  { time: "०४:१५ ते ०५:००", title: "करमणूक हॉल, टेबल टेनिस व स्नूकर हॉल येथे आनंद घेणे" },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl p-[2px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* ANIMATED GLOWING GRADIENT BORDER */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 rounded-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

                    {/* INNER CARD CONTENT */}
                    <div className="relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-[14px] bg-white text-center min-h-[135px] w-full h-full z-10 transition-all group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-pink-50/60">
                      <div className="text-xs sm:text-sm font-black text-[#be185d] mb-2 bg-gradient-to-r from-pink-100 to-rose-100 px-3.5 py-1 rounded-full border border-pink-200 shadow-xs">
                        {card.time}
                      </div>
                      <div className="text-xs sm:text-sm md:text-base font-extrabold text-[#70092b] leading-snug group-hover:text-[#be185d] transition-colors">
                        {card.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* SPORTS CLUB TIMETABLE MATRIX */
          <div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-pink-100 mt-6">
            <table className="w-full min-w-[900px] text-center border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#f472b6] via-[#810B38] to-[#db2777] text-white">
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
                  <tr key={row.id || i} className={`border-b border-pink-100 hover:bg-pink-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fff5f8]'}`}>
                    <td className="py-2.5 px-2 border-r border-pink-100">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="text-xl text-[#810B38]">{row.icon}</span>
                        <span className="font-extrabold text-[#810B38] text-xs sm:text-sm">{row.time}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 border-r border-pink-100">
                      <div className="font-extrabold text-[#810B38] text-sm sm:text-base leading-snug">{row.mon?.main || ""}</div>
                      {row.mon?.sub ? <div className="text-xs font-medium text-pink-600 mt-0.5">{row.mon.sub}</div> : null}
                    </td>
                    <td className="py-3 px-3 border-r border-pink-100">
                      <div className="font-extrabold text-[#810B38] text-sm sm:text-base leading-snug">{row.tue?.main || ""}</div>
                      {row.tue?.sub ? <div className="text-xs font-medium text-pink-600 mt-0.5">{row.tue.sub}</div> : null}
                    </td>
                    <td className="py-3 px-3 border-r border-pink-100">
                      <div className="font-extrabold text-[#810B38] text-sm sm:text-base leading-snug">{row.wed?.main || ""}</div>
                      {row.wed?.sub ? <div className="text-xs font-medium text-pink-600 mt-0.5">{row.wed.sub}</div> : null}
                    </td>
                    <td className="py-3 px-3 border-r border-pink-100">
                      <div className="font-extrabold text-[#810B38] text-sm sm:text-base leading-snug">{row.thu?.main || ""}</div>
                      {row.thu?.sub ? <div className="text-xs font-medium text-pink-600 mt-0.5">{row.thu.sub}</div> : null}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-[#810B38] text-sm sm:text-base leading-snug">{row.fri?.main || ""}</div>
                      {row.fri?.sub ? <div className="text-xs font-medium text-pink-600 mt-0.5">{row.fri.sub}</div> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


      </div>
    </section>
  );
}
