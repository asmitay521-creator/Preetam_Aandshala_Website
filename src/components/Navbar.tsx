import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import "./Navbar.css";

const menuItems = [
  { title: "मुख्यपृष्ठ", path: "/" },
  { title: "आमच्याबद्दल", path: "/about" },
  { title: "सुविधा", path: "/facilities" },
  { title: "उपक्रम", path: "/activities" },
  { title: "गॅलरी", path: "/gallery" },
  { title: "संपर्क", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="navbar-root">
      {/* Background blur layer */}
      <div className="navbar-bg" />

      <div className="navbar-container">
        <div className="navbar-inner">

          {/* ── LOGO ── */}
          <Link 
            to="/" 
            className="navbar-logo"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("reset-section"));
            }}
          >
            <div className="navbar-logo-icon">
              <span>P</span>
            </div>
            <div>
              <h2 className="navbar-logo-title">PREETAM</h2>
              <p className="navbar-logo-sub">ज्येष्ठ नागरिक आनंदशाळा</p>
            </div>
          </Link>

          {/* ── DESKTOP MENU ── */}
          <nav className="navbar-desktop-nav">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`navbar-nav-link ${isActive ? "navbar-nav-link--active" : ""}`}
                >
                  {item.title}
                  {isActive && <span className="navbar-underline" />}
                </Link>
              );
            })}
          </nav>

          {/* ── DESKTOP CTA BUTTON & SECTION SWITCHER ── */}
          <div className="navbar-cta-wrap flex items-center gap-3">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("reset-section"));
              }}
              className="bg-white/20 hover:bg-white/35 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/50 shadow-md backdrop-blur-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
              title="विभाग १ व विभाग २ निवडा"
            >
              <span>✨ २ मुख्य विभाग</span>
            </button>

            <a href="tel:+919370237633" className="navbar-cta-btn">
              <Phone size={17} />
              <span>संपर्क साधा</span>
            </a>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="navbar-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className={`navbar-mobile-drawer ${mobileOpen ? "navbar-mobile-drawer--open" : ""}`}>
        <div className="navbar-mobile-links">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);
            return (
              <Link
                key={item.title}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`navbar-mobile-link ${isActive ? "navbar-mobile-link--active" : ""}`}
              >
                {item.title}
              </Link>
            );
          })}

          <a
            href="tel:+919370237633"
            className="navbar-mobile-cta"
            onClick={() => setMobileOpen(false)}
          >
            📞 संपर्क साधा
          </a>
        </div>
      </div>
    </header>
  );
}
