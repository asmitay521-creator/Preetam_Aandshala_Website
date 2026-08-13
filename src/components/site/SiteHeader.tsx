import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site-info";
import { useLanguage } from "@/lib/use-language";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { lang, isMr, isEn, toggleLanguage } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const checkHide = () => {
      setHideHeader(document.body.classList.contains("hide-nav-links"));
    };
    checkHide();
    const observer = new MutationObserver(checkHide);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [pathname]);

  if (hideHeader && pathname === "/") {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 border-b-2 ${
        scrolled
          ? "shadow-[0_6px_28px_rgba(236,72,153,0.15)] border-pink-300/80"
          : "border-pink-300/60"
      }`}
      style={{
        background: scrolled
          ? "rgba(253, 242, 248, 0.98)"
          : "linear-gradient(90deg, #fff0f5 0%, #fce7f3 50%, #fbcfe8 100%)",
        backdropFilter: "blur(20px)",
      }}
    >

      {/* ── MAIN NAV ROW (COMPACT HEIGHT & SPACING) ── */}
      <div className="w-full max-w-[1480px] mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 py-2 sm:py-2.5">
        
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.dispatchEvent(new CustomEvent("reset-section"));
          }}
          className="group flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="leading-tight">
            <span
              className="block font-display text-xs sm:text-base lg:text-base font-black tracking-tight"
              style={{ color: "#831843" }}
            >
              {isMr ? (
                <>
                  प्रीतम ज्येष्ठ नागरिक <span className="text-[#be185d] font-black">आनंदशाळा</span> व स्पोर्ट्स क्लब
                </>
              ) : (
                <>
                  Preetam <span className="text-[#be185d] font-black">Anandshala</span> &amp; Sports Fitness Club
                </>
              )}
            </span>
            <span
              className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black mt-0.5"
              style={{ color: "#be185d" }}
            >
              SANGLI • MAHARASHTRA
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => {
                  if (l.to === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.dispatchEvent(new CustomEvent("reset-section"));
                  }
                }}
                className="group relative rounded-full px-3.5 py-1.5 text-sm font-extrabold transition-all duration-300 hover:text-[#be185d]"
                style={{ color: isActive ? "#be185d" : "#831843" }}
              >
                {isMr ? l.label : l.en}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  style={{ background: "#be185d" }}
                />
              </Link>
            );
          })}

          {/* LANGUAGE TOGGLE BUTTON */}
          <button
            onClick={toggleLanguage}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-xs font-black transition-all duration-300 cursor-pointer shadow-sm hover:scale-105"
            style={{
              borderColor: "rgba(244, 114, 182, 0.6)",
              background: "#FFFFFF",
              color: "#831843",
            }}
            title="Switch Language / भाषा बदला"
          >
            <span className="text-sm">🌐</span>
            <span>{isMr ? "मराठी | ENG" : "ENG | मराठी"}</span>
          </button>

          {/* TOP RIGHT ADMISSION CTA BUTTON */}
          <a
            href="tel:+919370237633"
            className="ml-2 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-black text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
            }}
          >
            <span className="text-sm">🏛️</span>
            <span>{isMr ? "आजच प्रवेश घ्या" : "Book Admission"}</span>
          </a>
        </nav>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* MOBILE LANGUAGE TOGGLE BUTTON */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-black cursor-pointer shadow-sm hover:scale-105 transition-all"
            style={{
              borderColor: "rgba(244, 114, 182, 0.4)",
              background: "#FFFFFF",
              color: "#810B38",
            }}
            title="Switch Language / भाषा बदला"
          >
            <span className="text-sm">🌐</span>
            <span className={isEn ? "text-[#db2777] font-black underline" : "text-slate-500 font-bold"}>ENG</span>
            <span className="text-slate-300">|</span>
            <span className={isMr ? "text-[#db2777] font-black underline" : "text-slate-500 font-bold"}>मराठी</span>
          </button>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid size-11 place-items-center rounded-2xl transition-all duration-200 cursor-pointer shadow-sm"
            style={{
              border: "2px solid rgba(244, 114, 182, 0.4)",
              background: "#FFFFFF",
              color: "#810B38",
            }}
          >
            <span className="text-xl font-black">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {open && (
        <div
          className="animate-fade-up border-t lg:hidden"
          style={{
            borderColor: "rgba(244, 114, 182, 0.2)",
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #810B38, #db2777, #f472b6)" }} />
          <nav className="w-full px-6 py-6 flex flex-col gap-2">
            {navLinks.map((l) => {
              const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => {
                    setOpen(false);
                    if (l.to === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      window.dispatchEvent(new CustomEvent("reset-section"));
                    }
                  }}
                  className="rounded-2xl px-5 py-3.5 text-base font-black transition-all"
                  style={{
                    color: isActive ? "#db2777" : "#810B38",
                    background: isActive ? "rgba(219, 39, 119, 0.08)" : "transparent",
                  }}
                >
                  {isMr ? l.label : l.en}
                </Link>
              );
            })}

            <a
              href="tel:+919370237633"
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-black text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, #db2777 0%, #810B38 100%)",
              }}
            >
              <span>🏛️</span>
              <span>{isMr ? "आजच प्रवेश घ्या (कॉल करा)" : "Book Admission (Call)"}</span>
            </a>
          </nav>
        </div>
      )}

    </header>
  );
}