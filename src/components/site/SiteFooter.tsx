import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { navLinks, site } from "@/lib/site-info";
import { useLanguage } from "@/lib/use-language";
import { useAdminStore } from "@/lib/admin-store";

export function SiteFooter() {
  const { isEn } = useLanguage();
  const store = useAdminStore();
  const siteData = store.siteData;
  const location = useLocation();

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const checkHidden = () => {
      if (typeof document !== "undefined") {
        setIsHidden(document.body.classList.contains("hide-footer"));
      }
    };
    checkHidden();
    const observer = new MutationObserver(checkHidden);
    if (typeof document !== "undefined") {
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    }
    return () => observer.disconnect();
  }, [location.pathname]);

  if (isHidden) return null;

  const phoneList = [siteData.phone1, siteData.phone2].filter(Boolean);
  const emailAddr = siteData.email || site.email;
  const addressText = isEn ? site.addressEn : (siteData.address || site.addressMr);

  return (
    <footer className="relative mt-0 overflow-hidden text-pink-950 bg-gradient-to-br from-[#fff0f6] via-[#fce7f3] to-[#fbcfe8] border-t-2 border-[#f472b6]/40 shadow-inner">
      {/* TOP ACCENT LINE */}
      <div
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(90deg, #db2777, #f472b6, #ec4899, #f472b6, #db2777)" }}
      />

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] animate-float opacity-30"
          style={{ background: "radial-gradient(circle, #f472b6 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[100px] animate-float-reverse opacity-20"
          style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
        />
      </div>

      {/* MAIN FOOTER BODY */}
      <div className="relative z-10">
        <div className="container-page grid gap-12 py-14 md:grid-cols-3">

          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-4 cursor-pointer transition-all duration-300 hover:opacity-95"
            >
              <div
                className="grid size-12 place-items-center rounded-xl font-display font-black text-white text-lg shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                }}
              >
                {isEn ? "P" : "प्री"}
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-[#831843] tracking-wide group-hover:text-[#be185d] transition-colors">
                  {isEn ? site.nameEn : site.nameMr}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-pink-800/90 mt-0.5">
                  Sangli · Maharashtra
                </p>
              </div>
            </Link>

            <p className="text-sm font-semibold leading-relaxed max-w-sm text-pink-900/80">
              {isEn ? site.taglineEn : site.taglineMr}
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-pink-300 text-pink-950 bg-white/80 backdrop-blur-sm shadow-sm"
            >
              <span className="text-[#be185d]">🌸</span> {isEn ? site.launchEn : site.launchMr}
            </div>
          </div>

          {/* NAV LINKS */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-extrabold text-[#9d174d] mb-6 flex items-center gap-3">
              <span className="w-8 h-[3px] rounded-full bg-[#ec4899]"></span>
              {isEn ? "Quick Links" : "महत्त्वाची पृष्ठे"}
            </h4>
            <ul className="space-y-3.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-3 text-sm font-bold text-pink-900/85 transition-all duration-300 hover:text-[#be185d] hover:translate-x-1"
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-400 group-hover:bg-[#be185d] transition-colors duration-300" />
                    <span>{isEn ? l.en : l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT COLUMN */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-extrabold text-[#9d174d] mb-6 flex items-center gap-3">
              <span className="w-8 h-[3px] rounded-full bg-[#ec4899]"></span>
              {isEn ? "Contact Us" : "संपर्क"}
            </h4>
            <ul className="space-y-4 text-sm">
              {phoneList.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="group flex items-center gap-3 font-bold text-pink-950 transition-all duration-300 hover:text-[#be185d]"
                  >
                    <div className="grid size-8.5 place-items-center rounded-lg bg-white/90 text-pink-700 shadow-sm border border-pink-200 group-hover:bg-[#be185d] group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <span>{p}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${emailAddr}`}
                  className="group flex items-center gap-3 font-bold text-pink-950 transition-all duration-300 hover:text-[#be185d]"
                >
                  <div className="grid size-8.5 place-items-center rounded-lg bg-white/90 text-pink-700 shadow-sm border border-pink-200 group-hover:bg-[#be185d] group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="break-all">{emailAddr}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Preetamsportclub@gmail.com"
                  className="group flex items-center gap-3 font-bold text-pink-950 transition-all duration-300 hover:text-[#be185d]"
                >
                  <div className="grid size-8.5 place-items-center rounded-lg bg-white/90 text-pink-700 shadow-sm border border-pink-200 group-hover:bg-[#be185d] group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="break-all">Preetamsportclub@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 pt-1 leading-relaxed font-semibold text-pink-950">
                <div className="grid size-8.5 place-items-center rounded-lg bg-white/90 text-pink-700 shadow-sm border border-pink-200 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <span>{addressText}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-pink-200/80 bg-[#fbcfe8]/80 backdrop-blur-md">
          <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-[13px] sm:flex-row font-bold text-pink-900">
            <span className="flex items-center gap-2">
              © {new Date().getFullYear()} <span className="text-[#831843] font-extrabold">{isEn ? site.nameEn : site.nameMr}</span>. {isEn ? "All Rights Reserved." : "सर्व हक्क राखीव."}
            </span>
            <span className="flex items-center gap-2 font-extrabold text-[#be185d]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {isEn ? "Preetam Apulki & Jivhala Trust, Sangli" : "प्रीतम आपुलकी व जिव्हाळा ट्रस्ट, सांगली"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}