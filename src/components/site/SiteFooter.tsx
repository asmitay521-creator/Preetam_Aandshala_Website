import { Link } from "react-router-dom";
import { navLinks, site } from "@/lib/site-info";
import { useLanguage } from "@/lib/use-language";

export function SiteFooter() {
  const { isEn } = useLanguage();

  return (
    <footer className="relative mt-0 overflow-hidden text-slate-100 bg-slate-900 border-t border-slate-800">
      {/* TOP ACCENT LINE */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, transparent, #f472b6, transparent)" }}
      />

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] animate-float opacity-20"
             style={{ background: "radial-gradient(circle, #f472b6 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[100px] animate-float-reverse opacity-10"
             style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }} />
      </div>

      {/* MAIN FOOTER BODY */}
      <div className="relative z-10">
        <div className="container-page grid gap-12 py-16 md:grid-cols-3">

          {/* BRAND COLUMN */}
          <div className="space-y-6">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-4 cursor-pointer transition-all duration-300 hover:opacity-90"
            >
              <div
                className="grid size-12 place-items-center rounded-xl font-display font-black text-white text-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: "linear-gradient(135deg, #f472b6 0%, #d946ef 100%)",
                }}
              >
                {isEn ? "P" : "प्री"}
              </div>
              <div>
                <h3 className="font-display text-xl font-black text-white tracking-wide group-hover:text-[#f472b6] transition-colors">
                  {isEn ? site.nameEn : site.nameMr}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mt-1">
                  Sangli · Maharashtra
                </p>
              </div>
            </Link>

            <p className="text-sm font-medium leading-relaxed max-w-sm text-slate-400">
              {isEn ? site.taglineEn : site.taglineMr}
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-slate-700 text-slate-300 bg-slate-800/50 backdrop-blur-sm"
            >
              <span className="text-[#f472b6]">🌿</span> {isEn ? site.launchEn : site.launchMr}
            </div>
          </div>

          {/* NAV LINKS */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#f472b6]"></span>
              {isEn ? "Quick Links" : "महत्त्वाची पृष्ठे"}
            </h4>
            <ul className="space-y-4">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-3 text-sm font-medium text-slate-400 transition-all duration-300 hover:text-[#f472b6]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#f472b6] transition-colors duration-300" />
                    <span>{isEn ? l.en : l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT COLUMN */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#f472b6]"></span>
              {isEn ? "Contact Us" : "संपर्क"}
            </h4>
            <ul className="space-y-4 text-sm">
              {site.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="group flex items-center gap-3 font-medium text-slate-400 transition-all duration-300 hover:text-[#f472b6]"
                  >
                    <div className="grid size-8 place-items-center rounded-lg bg-slate-800 text-[#f472b6] group-hover:bg-[#f472b6] group-hover:text-white transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <span>{p}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center gap-3 font-medium text-slate-400 transition-all duration-300 hover:text-[#f472b6]"
                >
                  <div className="grid size-8 place-items-center rounded-lg bg-slate-800 text-[#f472b6] group-hover:bg-[#f472b6] group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 pt-1 leading-relaxed font-medium text-slate-400">
                <div className="grid size-8 place-items-center rounded-lg bg-slate-800 text-[#f472b6] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <span>{isEn ? site.addressEn : site.addressMr}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-800 bg-slate-950/50">
          <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-[13px] sm:flex-row font-medium text-slate-500">
            <span className="flex items-center gap-2">
              © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">{isEn ? site.nameEn : site.nameMr}</span>. {isEn ? "All Rights Reserved." : "सर्व हक्क राखीव."}
            </span>
            <span className="flex items-center gap-2 font-semibold text-[#f472b6]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {isEn ? "Preetam Apulki & Jivhala Trust, Sangli" : "प्रीतम आपुलकी व जिव्हाळा ट्रस्ट, सांगली"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}