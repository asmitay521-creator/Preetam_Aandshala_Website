import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAdminStore, uploadImageToFirebase, BrochureItem, AboutHighlightItem } from "@/lib/admin-store";
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "@/firebase";

export type TabKey =
  | "dashboard"
  | "inquiries"
  | "home-cards"
  | "sliders"
  | "anandshala-schedule"
  | "sports-schedule"
  | "about"
  | "brochures"
  | "testimonials"
  | "gallery"
  | "packages"
  | "contact";

const VALID_TABS: TabKey[] = [
  "dashboard",
  "inquiries",
  "home-cards",
  "sliders",
  "anandshala-schedule",
  "sports-schedule",
  "about",
  "brochures",
  "testimonials",
  "gallery",
  "packages",
  "contact",
];

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname: string): TabKey => {
    const cleanPath = pathname.replace(/\/$/, "");
    const parts = cleanPath.split("/");
    const sub = parts[parts.length - 1];
    if (VALID_TABS.includes(sub as TabKey)) {
      return sub as TabKey;
    }
    return "dashboard";
  };

  const activeTab = getTabFromPath(location.pathname);

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/$/, "");
    const parts = cleanPath.split("/");
    const sub = parts[parts.length - 1];
    if (cleanPath === "/admin" || !VALID_TABS.includes(sub as TabKey)) {
      navigate(`/admin/${activeTab}`, { replace: true });
    }
  }, [location.pathname, activeTab, navigate]);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleTabSelect = (tab: TabKey) => {
    navigate(`/admin/${tab}`);
    setIsMobileMenuOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("preetam_admin_auth") === "true";
  });
  const [userInput, setUserInput] = useState("admin123@gmail.com");
  const [passInput, setPassInput] = useState("admin123");
  const [loginError, setLoginError] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const store = useAdminStore();

  // Local Editable Forms
  const [siteForm, setSiteForm] = useState(store.siteData);
  const [aboutForm, setAboutForm] = useState(store.aboutData);
  const [scheduleForm, setScheduleForm] = useState(store.scheduleConfig);
  const [sportsScheduleForm, setSportsScheduleForm] = useState(store.sportsScheduleConfig);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "anandshala" | "sports">("all");
  const [selectedInquiryModal, setSelectedInquiryModal] = useState<any | null>(null);

  // New Brochure Form State
  const [newBrochureTitle, setNewBrochureTitle] = useState("");
  const [newBrochureCategory, setNewBrochureCategory] = useState("आनंदशाळा ब्रोशर");
  const [newBrochureUrl, setNewBrochureUrl] = useState("");
  const [newBrochureFileType, setNewBrochureFileType] = useState<"pdf" | "image">("pdf");

  // New Testimonial Form State
  const [newTestimonialName, setNewTestimonialName] = useState("");
  const [newTestimonialRole, setNewTestimonialRole] = useState("आनंदशाळा सदस्य, सांगली");
  const [newTestimonialText, setNewTestimonialText] = useState("");
  const [newTestimonialVideoUrl, setNewTestimonialVideoUrl] = useState("");
  const [newTestimonialRating, setNewTestimonialRating] = useState(5);

  // Package period tab state (must be top-level, not inside IIFE)
  const [pkgPeriod, setPkgPeriod] = useState<"days" | "week" | "month" | "year">("days");
  const [showAddPkgForm, setShowAddPkgForm] = useState(false);
  const [newPkg, setNewPkg] = useState({ title: "", price: "", sub: "", badge: "", features: [""] });

  // New Contact Form State (top-level)
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ title: "", name: "", phone: "", email: "" });

  // Keep forms in sync with store on initial load
  const isFormInitialized = useRef(false);
  useEffect(() => {
    if (!isFormInitialized.current && store.siteData && Object.keys(store.siteData).length > 0) {
      setSiteForm(store.siteData);
      setAboutForm(store.aboutData);
      setScheduleForm(store.scheduleConfig);
      setSportsScheduleForm(store.sportsScheduleConfig);
      isFormInitialized.current = true;
    }
  }, [store.siteData, store.aboutData, store.scheduleConfig, store.sportsScheduleConfig]);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem("preetam_admin_auth", "true");
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = userInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (cleanUser === "admin123@gmail.com" || cleanUser === "admin" || cleanPass === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
      localStorage.setItem("preetam_admin_auth", "true");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, userInput.trim(), cleanPass);
      setIsLoggedIn(true);
      setLoginError("");
      localStorage.setItem("preetam_admin_auth", "true");
    } catch (err) {
      setLoginError("❌ युझरनेम किंवा पासवर्ड चुकीचा आहे!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setIsLoggedIn(false);
    localStorage.removeItem("preetam_admin_auth");
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const openMediaInNewTab = (url?: string) => {
    if (!url) return;
    if (url.startsWith("data:")) {
      try {
        const parts = url.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, "_blank");
        if (!win) {
          alert("कृपया फाईल नवीन विंडोमध्ये उघडण्यासाठी पॉप-अप ब्लॉक डिझॅबल करा.");
        }
      } catch (e) {
        const win = window.open();
        if (win) {
          win.document.write(`<iframe src="${url}" style="width:100vw; height:100vh; border:none; margin:0; padding:0;"></iframe>`);
        }
      }
    } else {
      window.open(url, "_blank");
    }
  };

  // Single Image/File Upload Helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const file = files[0];
      const url = await uploadImageToFirebase(file);
      if (url) {
        onSuccess(url);
      } else {
        alert("फोटो अपलोड करताना समस्या आली.");
      }
    } catch (err) {
      alert("अपलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setIsUploading(false);
      try { e.target.value = ""; } catch (e) {}
    }
  };

  // Multiple Image Upload Helper for Sliders & About Photos
  const handleMultipleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (urls: string[]) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToFirebase(files[i]);
        uploadedUrls.push(url);
      }
      onSuccess(uploadedUrls);
      showToast(`✅ ${uploadedUrls.length} फोटो यशस्वीरित्या जोडले!`);
    } catch (err) {
      alert("फोटो अपलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setIsUploading(false);
      try { e.target.value = ""; } catch (err) {}
    }
  };

  // Save Actions
  const saveSiteInfo = () => {
    store.updateSiteData(siteForm);
    store.syncAllToFirebaseCloud();
    showToast("✅ माहिती व फोटो सेव्ह झाले!");
  };

  const saveAboutInfo = () => {
    store.updateAboutData(aboutForm);
    store.syncAllToFirebaseCloud();
    showToast("✅ आमचेविषयी माहिती सेव्ह झाली!");
  };

  const saveAnandshalaSchedule = () => {
    store.updateScheduleConfig(scheduleForm);
    store.syncAllToFirebaseCloud();
    showToast("✅ आनंदशाळा वेळापत्रक सेव्ह झाले!");
  };

  const saveSportsSchedule = () => {
    store.updateSportsScheduleConfig(sportsScheduleForm);
    store.syncAllToFirebaseCloud();
    showToast("✅ स्पोर्ट्स क्लब वेळापत्रक सेव्ह झाले!");
  };

  // Add Brochure Helper
  const handleAddBrochure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrochureTitle.trim() || !newBrochureUrl.trim()) {
      alert("कृपया शीर्षक आणि फाईल/लिंक प्रविष्ट करा.");
      return;
    }
    store.addBrochure({
      title: newBrochureTitle.trim(),
      category: newBrochureCategory,
      fileUrl: newBrochureUrl.trim(),
      fileType: newBrochureFileType,
    });
    store.syncAllToFirebaseCloud();
    setNewBrochureTitle("");
    setNewBrochureUrl("");
    showToast("✅ नवीन माहिती पत्रक समाविष्ट झाले!");
  };

  // Add Testimonial Helper
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialName.trim()) {
      alert("कृपया सदस्याचे नाव प्रविष्ट करा.");
      return;
    }
    store.addTestimonial({
      name: newTestimonialName.trim(),
      role: newTestimonialRole.trim(),
      text: newTestimonialText.trim(),
      videoUrl: newTestimonialVideoUrl.trim(),
      rating: newTestimonialRating,
      approved: true,
    });
    store.syncAllToFirebaseCloud();
    setNewTestimonialName("");
    setNewTestimonialText("");
    setNewTestimonialVideoUrl("");
    showToast("✅ सदस्य अनुभव व व्हिडिओ सेव्ह झाला!");
  };

  // LOGIN SCREEN (PINK THEME)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4a051d] via-[#810B38] to-[#9f1239] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border-4 border-pink-200 text-center space-y-6">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-[#810B38] to-[#be185d] text-white text-3xl shadow-lg mx-auto border-4 border-pink-100">
            🏫
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#810B38]">प्रीतम आनंदशाळा</h1>
            <p className="text-xs sm:text-sm font-bold text-pink-700 mt-1">अ‍ॅडमिन लॉगिन पॅनेल</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl text-center border border-rose-200">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">युझरनेम / ईमेल</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-[#810B38] font-bold text-slate-800 outline-none"
                placeholder="admin123@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">पासवर्ड</label>
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-[#810B38] font-bold text-slate-800 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#810B38] to-[#be185d] hover:opacity-95 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer"
            >
              लॉगिन करा (Login)
            </button>
          </form>

          <div className="pt-2 border-t border-pink-100 text-slate-400 text-xs font-bold">
            डिफॉल्ट लॉगिन: <span className="text-[#810B38]">admin123@gmail.com</span> / <span className="text-[#810B38]">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Inquiries
  const filteredInquiries = store.inquiries.filter((inq) => {
    if (inquiryFilter === "anandshala") return !inq.category || inq.category === "anandshala";
    if (inquiryFilter === "sports") return inq.category === "sports";
    return true;
  });

  const sidebarMenuItems = [
    { key: "dashboard", label: "मुख्य डॅशबोर्ड (Overview)", icon: "📊", count: null },
    { key: "inquiries", label: "ग्राहकांच्या चौकशी", icon: "📞", count: store.inquiries.length },
    { key: "home-cards", label: "होमपेज कार्ड्स व सेक्शन्स", icon: "🎴", count: null },
    { key: "sliders", label: "स्लायडर फोटो", icon: "🎠", count: (siteForm.aanandshalaImages?.length || 0) + (siteForm.sportsImages?.length || 0) },
    { key: "anandshala-schedule", label: "आनंदशाळा वेळापत्रक", icon: "🌸", count: null },
    { key: "sports-schedule", label: "स्पोर्ट्स क्लब वेळापत्रक", icon: "🏋️‍♂️", count: null },
    { key: "about", label: "आमच्याविषयी माहिती", icon: "ℹ️", count: null },
    { key: "brochures", label: "माहिती पत्रक व ब्रोशर्स", icon: "📜", count: store.brochures.length },
    { key: "testimonials", label: "सदस्य अनुभव व व्हिडिओ", icon: "🎬", count: store.testimonials.length },
    { key: "gallery", label: "फोटो व गॅलरी", icon: "🖼️", count: store.gallery.length },
    { key: "packages", label: "प्रवेश योजना व फी", icon: "🏷️", count: store.packages.length },
    { key: "contact", label: "संपर्क व माहिती", icon: "⚙️", count: (siteForm.contactsList || []).length },
  ];

  return (
    <div className="min-h-screen md:h-screen bg-[#fdf7f9] font-sans flex flex-col md:flex-row md:overflow-hidden">
      
      {/* MOBILE TOP BAR WITH TOGGLE BUTTON */}
      <div className="md:hidden bg-[#810B38] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏫</span>
          <span className="font-black text-sm">प्रीतम अ‍ॅडमिन पॅनेल</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="px-3 py-1.5 rounded-xl bg-white/20 text-white font-extrabold text-xs"
        >
          {isMobileMenuOpen ? "✕ बंद करा" : "☰ मेनू (Menu)"}
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* ==================================================================== */}
      {/* LEFT SIDEBAR (PINK THEME GULABI SIDEBAR) */}
      {/* ==================================================================== */}
      <aside
        className={`${
          isMobileMenuOpen
            ? "fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] shadow-2xl flex flex-col"
            : "hidden"
        } md:flex md:w-72 bg-gradient-to-b from-[#810B38] via-[#6b092b] to-[#4a061d] text-white flex-col shrink-0 md:h-screen z-40 p-4 sm:p-6 overflow-y-auto`}
      >
        {/* BRAND LOGO HEADER */}
        <div className="flex items-center gap-3 pb-6 border-b border-pink-400/30 mb-6">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/40">
            🏫
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black leading-tight tracking-wide text-white">
              प्रीतम आनंदशाळा
            </h1>
            <p className="text-[11px] font-bold text-pink-200">अ‍ॅडमिन पॅनेल</p>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION PAGES */}
        <nav className="space-y-2 flex-1">
          <div className="text-[10px] font-black text-pink-300 uppercase tracking-widest px-3 mb-2">
            मुख्य पेजेस (Admin Pages)
          </div>
          {sidebarMenuItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  handleTabSelect(item.key as TabKey);
                }}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-[#810B38] shadow-xl scale-[1.02] border-2 border-pink-200"
                    : "text-pink-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-lg">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? "bg-[#810B38] text-white" : "bg-pink-900/60 text-pink-200"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER ACTIONS */}
        <div className="pt-6 border-t border-pink-400/30 space-y-2.5 mt-6">
          <Link
            to="/"
            target="_blank"
            className="w-full py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors border border-white/20"
          >
            <span>🌐</span>
            <span>वेबसाईट पहा (View Site)</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <span>🚪</span>
            <span>बाहेर पडा (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MAIN RIGHT CONTENT AREA (INDEPENDENT SCROLL) */}
      {/* ==================================================================== */}
      <main ref={mainContentRef} className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto md:h-screen overflow-y-auto space-y-6">
        
        {/* TOAST SUCCESS NOTIFICATION */}
        {saveSuccessMsg && (
          <div className="fixed top-6 right-6 z-[99999] bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-2xl animate-bounce flex items-center gap-2 border-2 border-white">
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* TOP TITLE HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#810B38] flex items-center gap-2">
              <span>{sidebarMenuItems.find((i) => i.key === activeTab)?.icon}</span>
              <span>{sidebarMenuItems.find((i) => i.key === activeTab)?.label}</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              प्रीतम आनंदशाळा अ‍ॅडमिन पॅनेलवरून सर्व माहिती सोप्या पद्धतीने संपादित करा.
            </p>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* DASHBOARD OVERVIEW PAGE */}
        {/* ==================================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#810B38] via-[#a20e47] to-[#be185d] p-6 sm:p-8 text-white shadow-xl">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black backdrop-blur-md">
                  <span>✨</span> प्रीतम अ‍ॅडमिन मुख्य डॅशबोर्ड
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-sm">
                  नमस्कार! प्रीतम आनंदशाळा पोर्टलमध्ये स्वागत आहे 🏫
                </h3>
                <p className="text-xs sm:text-sm font-medium text-pink-100 max-w-2xl leading-relaxed">
                  येथून तुम्ही आनंदशाळेची चौकशी, स्लायडर फोटो, वेळापत्रक, प्रवेश योजनांचे दर, ब्रोशर्स व संपर्क माहिती सहज नियंत्रित करू शकता.
                </p>
              </div>

              <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute right-1/4 -top-10 size-40 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />
            </div>

            {/* STATISTICS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* Card 1: Inquiries */}
              <div
                onClick={() => handleTabSelect("inquiries")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-pink-50 text-[#810B38] group-hover:scale-110 transition">📞</span>
                  <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">चौकशी</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">{store.inquiries.length}</div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">ग्राहक संदेश</div>
                </div>
              </div>

              {/* Card 2: Sliders */}
              <div
                onClick={() => handleTabSelect("sliders")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition">🎠</span>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">फोटो</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">
                    {(siteForm.aanandshalaImages?.length || 0) + (siteForm.sportsImages?.length || 0)}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">स्लायडर फोटो</div>
                </div>
              </div>

              {/* Card 3: Packages */}
              <div
                onClick={() => handleTabSelect("packages")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition">🏷️</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">दर</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">{store.packages.length}</div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">प्रवेश योजना</div>
                </div>
              </div>

              {/* Card 4: Brochures */}
              <div
                onClick={() => handleTabSelect("brochures")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition">📜</span>
                  <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">फायली</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">{store.brochures.length}</div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">ब्रोशर्स / पत्रक</div>
                </div>
              </div>

              {/* Card 5: Testimonials */}
              <div
                onClick={() => handleTabSelect("testimonials")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition">🎬</span>
                  <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">व्हिडिओ</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">{store.testimonials.length}</div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">सदस्य अनुभव</div>
                </div>
              </div>

              {/* Card 6: Contacts */}
              <div
                onClick={() => handleTabSelect("contact")}
                className="p-4 rounded-2xl bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl p-2 rounded-xl bg-rose-50 text-rose-700 group-hover:scale-110 transition">⚙️</span>
                  <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">संपर्क</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800">
                    {(siteForm.contactsList || []).length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 truncate">अतिरिक्त संपर्क</div>
                </div>
              </div>

            </div>

            {/* SPLIT GRID: RECENT INQUIRIES & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left 2 Cols: Recent Inquiries */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-pink-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-pink-100 pb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="text-base font-black text-[#810B38] flex items-center gap-2">
                      <span>📩</span> अलिकडील ग्राहक चौकशी संदेश (Recent Inquiries)
                    </h4>
                    <p className="text-xs text-slate-500 font-bold">वेबसाईटवरून प्राप्त झालेले सर्वात नवीन संदेश.</p>
                  </div>
                  <button
                    onClick={() => handleTabSelect("inquiries")}
                    className="px-3.5 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-[#810B38] font-black text-xs cursor-pointer transition"
                  >
                    सर्व चौकशी पहा →
                  </button>
                </div>

                {store.inquiries.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-bold text-xs bg-pink-50/30 rounded-2xl border border-dashed border-pink-200">
                    कोणताही चौकशी संदेश आलेला नाही.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {store.inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-pink-50/40 border border-pink-200 flex items-center justify-between flex-wrap gap-3 hover:bg-pink-50 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-slate-800">{inq.name}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-pink-200 text-[#810B38]">
                              {inq.subject || "चौकशी"}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-emerald-700 flex items-center gap-3">
                            <span>📞 {inq.phone}</span>
                            {inq.email && <span className="text-slate-500">✉️ {inq.email}</span>}
                          </div>
                          {inq.message && (
                            <p className="text-xs text-slate-600 font-medium line-clamp-1 italic">
                              "{inq.message}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedInquiryModal(inq)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#810B38] text-white font-black text-xs hover:bg-[#68082c] cursor-pointer shadow-sm active:scale-95"
                        >
                          पहा 👁️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 1 Col: Quick Actions & System Info */}
              <div className="space-y-6">

                {/* Quick Shortcuts */}
                <div className="bg-white rounded-3xl p-6 border-2 border-pink-100 shadow-sm space-y-4">
                  <h4 className="text-base font-black text-[#810B38] flex items-center gap-2 border-b border-pink-100 pb-3">
                    <span>⚡</span> क्विक ॲक्शन्स (Quick Shortcuts)
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      onClick={() => handleTabSelect("sliders")}
                      className="w-full p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-between transition cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2"><span>📷</span> स्लायडर फोटो बदला</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => handleTabSelect("packages")}
                      className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-black text-xs flex items-center justify-between transition cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2"><span>🏷️</span> प्रवेश योजना दर बदला</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => handleTabSelect("about")}
                      className="w-full p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#810B38] font-black text-xs flex items-center justify-between transition cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2"><span>ℹ️</span> आमच्याविषयी संपादन</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => handleTabSelect("contact")}
                      className="w-full p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-black text-xs flex items-center justify-between transition cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2"><span>⚙️</span> फोन व संपर्क बदला</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Cloud Sync Banner */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#810B38] text-white rounded-3xl p-6 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> रीअल-टाईम क्लाऊड सिंक
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">Live Database</span>
                  </div>
                  <div className="text-sm font-black text-white">
                    🔥 फाईलबेस क्लाऊड डेटाबेस कनेक्टेड
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    ॲडमिन पॅनेलवर केलेले सर्व संपादन क्लाऊडवर ऑन-द-स्पॉट सेव्ह होते व वेबसाईटवर लगेच दिसते.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 1: CUSTOMER INQUIRIES (ग्राहकांच्या चौकशी) */}
        {/* ==================================================================== */}
        {activeTab === "inquiries" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-black text-[#810B38]">📞 आलेल्या चौकशी आणि संदेश</h3>
                <p className="text-xs text-slate-500 font-bold">वेबसाईटवरून ग्राहकांनी भरलेली माहिती व मोबाईल नंबर येथे दिसतील.</p>
              </div>
              <div className="flex items-center gap-2">
                {(["all", "anandshala", "sports"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setInquiryFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                      inquiryFilter === f ? "bg-[#810B38] text-white" : "bg-pink-50 text-pink-950 hover:bg-pink-100"
                    }`}
                  >
                    {f === "all" ? "सर्व (All)" : f === "anandshala" ? "आनंदशाळा" : "स्पोर्ट्स क्लब"}
                  </button>
                ))}
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-bold">
                अद्याप कोणतीही चौकशी आलेली नाही.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryModal(inq)}
                    className="p-5 rounded-2xl border-2 border-pink-200 bg-[#fffafd] space-y-3 relative shadow-sm hover:border-[#810B38] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-pink-100 text-[#810B38] mb-1 border border-pink-200">
                          {inq.category === "sports" ? "🏋️‍♂️ स्पोर्ट्स क्लब चौकशी" : "🌸 आनंदशाळा चौकशी"}
                        </span>
                        <h4 className="font-black text-lg text-slate-900 group-hover:text-[#810B38] transition-colors">
                          {inq.name || "नाव दिलेले नाही"}
                        </h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("नक्की ही चौकशी डिलीट करायची?")) {
                            store.deleteInquiry(inq.id);
                            showToast("चौकशी डिलीट झाली!");
                          }
                        }}
                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer bg-rose-50 px-2 py-1 rounded-lg border border-rose-100"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>

                    <div className="text-sm font-extrabold text-emerald-700 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span>📞 मोबाईल:</span>
                        <a 
                          href={`tel:${inq.phone}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-black"
                        >
                          {inq.phone || "नंबर नाही"}
                        </a>
                      </div>
                      <span className="text-[11px] font-black text-[#810B38] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        🔍 पूर्ण माहिती पहा ➔
                      </span>
                    </div>

                    {inq.email && <div className="text-xs font-bold text-slate-600">✉️ ईमेल: {inq.email}</div>}
                    
                    {inq.message && (
                      <div className="text-xs bg-white p-3 rounded-xl border border-pink-100 text-slate-700 font-medium line-clamp-2 shadow-inner">
                        "{inq.message}"
                      </div>
                    )}
                    
                    <div className="text-[10px] text-slate-400 font-bold text-right pt-1">
                      तारीख: {inq.date || "ताजी"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 2: HOME CARDS MANAGER (होमपेज कार्ड्स संपादन) */}
        {/* ==================================================================== */}
        {activeTab === "home-cards" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-black text-[#810B38] flex items-center gap-2">
                  <span>🎴</span> होमपेज कार्ड्स संपादन (Home Cards Manager)
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  कार्डचा फोटो बदला आणि कार्डवरील १ ओळीचा मजकूर थेट सोप्या पद्धतीने संपादित करा.
                </p>
              </div>

              <button
                onClick={saveSiteInfo}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition active:scale-95"
              >
                <span>💾 बदलेले फोटो व नाव सेव्ह करा (Save All)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* CARD 1: ANANDSHALA */}
              {(() => {
                const isExplicitlyDeleted = siteForm.aanandshalaCardImage === "NO_IMAGE";
                const displayPhoto = siteForm.aanandshalaCardImage && siteForm.aanandshalaCardImage !== "NO_IMAGE"
                  ? siteForm.aanandshalaCardImage
                  : (isExplicitlyDeleted ? null : (siteForm.aanandshalaImages?.[0] || "/images/anandshala_building_sky.jpg"));

                return (
                  <div className="p-6 rounded-3xl bg-rose-50/70 border-2 border-rose-200 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-[#810B38] flex items-center gap-2">
                        <span>🌸</span> १. आनंदशाळा कार्ड (Anandshala Card)
                      </h4>
                    </div>

                    {/* 1-Line Text Field */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                        ✏️ कार्डवरील १ ओळीचा मजकूर (Card Title):
                      </label>
                      <input
                        type="text"
                        value={siteForm.aanandshalaTitle || ""}
                        onChange={(e) => setSiteForm({ ...siteForm, aanandshalaTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-rose-200 font-black text-sm bg-white text-slate-900 focus:outline-none focus:border-[#810B38] shadow-inner"
                        placeholder="उदा. प्रीतम ज्येष्ठ नागरिक आनंदशाळा व निवारा"
                      />
                    </div>

                    {/* Image Upload Option */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                        🖼️ कार्ड फोटो संपादन (Card Image):
                      </label>
                      
                      {/* Current Uploaded Image Preview or Empty State */}
                      {displayPhoto ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-rose-200 mb-3 h-48 bg-slate-900 group shadow-md">
                          <img 
                            src={displayPhoto} 
                            alt="Anandshala Card Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          
                          {/* TOP-RIGHT DELETE BUTTON OVERLAY */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...siteForm,
                                  aanandshalaCardImage: "NO_IMAGE",
                                  aanandshalaImages: []
                                };
                                setSiteForm(updated);
                                store.updateSiteData(updated);
                                store.syncAllToFirebaseCloud();
                                showToast("🗑️ आनंदशाळा फोटो यशस्वीरित्या डिलीट झाला!");
                              }}
                              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-2xl transition cursor-pointer flex items-center gap-1.5 border border-white/50 active:scale-95"
                            >
                              🗑️ फोटो डिलीट करा
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-100/60 flex flex-col items-center justify-center text-center p-4 space-y-2 mb-3 shadow-inner">
                          <span className="text-3xl">📷</span>
                          <span className="text-xs font-black text-rose-900">कोणताही फोटो जोडलेला नाही (फोटो डिलीट केला आहे)</span>
                          <span className="text-[10px] font-bold text-rose-700">नवीन फोटो जोडण्यासाठी खालील बटणावर क्लिक करा</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="w-full py-3 rounded-2xl bg-white hover:bg-rose-100 border-2 border-dashed border-[#810B38] text-[#810B38] font-black text-xs cursor-pointer flex items-center justify-center gap-2 transition shadow-sm active:scale-98">
                          <span>📷 नवीन फोटो निवडा / अपलोड करा</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleFileUpload(e, (url: string) => {
                                const updated = {
                                  ...siteForm,
                                  aanandshalaCardImage: url,
                                  aanandshalaImages: [url]
                                };
                                setSiteForm(updated);
                                store.updateSiteData(updated);
                                store.syncAllToFirebaseCloud();
                                showToast("✅ आनंदशाळा फोटो अपलोड झाला व सेव्ह झाला!");
                              });
                            }}
                          />
                        </label>

                        {displayPhoto && (
                          <div className="text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200 text-center flex items-center justify-center gap-1 shadow-sm">
                            <span>✅ फोटो अपलोड केलेला आहे. फोटो काढून टाकण्यासाठी वरील डिलीट बटण वापरा.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CARD 2: SPORTS CLUB */}
              {(() => {
                const isExplicitlyDeleted = siteForm.sportsCardImage === "NO_IMAGE";
                const displayPhoto = siteForm.sportsCardImage && siteForm.sportsCardImage !== "NO_IMAGE"
                  ? siteForm.sportsCardImage
                  : (isExplicitlyDeleted ? null : (siteForm.sportsImages?.[0] || "/images/preetam_sports_building.jpg"));

                return (
                  <div className="p-6 rounded-3xl bg-indigo-50/70 border-2 border-indigo-200 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-indigo-900 flex items-center gap-2">
                        <span>🏋️‍♂️</span> २. स्पोर्ट्स क्लब कार्ड (Sports Club Card)
                      </h4>
                    </div>

                    {/* 1-Line Text Field */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                        ✏️ कार्डवरील १ ओळीचा मजकूर (Card Title):
                      </label>
                      <input
                        type="text"
                        value={siteForm.sportsTitle || ""}
                        onChange={(e) => setSiteForm({ ...siteForm, sportsTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 font-black text-sm bg-white text-slate-900 focus:outline-none focus:border-indigo-700 shadow-inner"
                        placeholder="उदा. प्रीतम स्पोर्ट्स अँड फिटनेस क्लब"
                      />
                    </div>

                    {/* Image Upload Option */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                        🖼️ कार्ड फोटो संपादन (Card Image):
                      </label>

                      {/* Current Uploaded Image Preview or Empty State */}
                      {displayPhoto ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 mb-3 h-48 bg-slate-900 group shadow-md">
                          <img 
                            src={displayPhoto} 
                            alt="Sports Club Card Preview" 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />

                          {/* TOP-RIGHT DELETE BUTTON OVERLAY */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...siteForm,
                                  sportsCardImage: "NO_IMAGE",
                                  sportsImages: []
                                };
                                setSiteForm(updated);
                                store.updateSiteData(updated);
                                store.syncAllToFirebaseCloud();
                                showToast("🗑️ स्पोर्ट्स क्लब फोटो यशस्वीरित्या डिलीट झाला!");
                              }}
                              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-2xl transition cursor-pointer flex items-center gap-1.5 border border-white/50 active:scale-95"
                            >
                              🗑️ फोटो डिलीट करा
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-100/60 flex flex-col items-center justify-center text-center p-4 space-y-2 mb-3 shadow-inner">
                          <span className="text-3xl">📷</span>
                          <span className="text-xs font-black text-indigo-900">कोणताही फोटो जोडलेला नाही (फोटो डिलीट केला आहे)</span>
                          <span className="text-[10px] font-bold text-indigo-700">नवीन फोटो जोडण्यासाठी खालील बटणावर क्लिक करा</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="w-full py-3 rounded-2xl bg-white hover:bg-indigo-100 border-2 border-dashed border-indigo-700 text-indigo-900 font-black text-xs cursor-pointer flex items-center justify-center gap-2 transition shadow-sm active:scale-98">
                          <span>📷 नवीन फोटो निवडा / अपलोड करा</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              handleFileUpload(e, (url: string) => {
                                const updated = {
                                  ...siteForm,
                                  sportsCardImage: url,
                                  sportsImages: [url]
                                };
                                setSiteForm(updated);
                                store.updateSiteData(updated);
                                store.syncAllToFirebaseCloud();
                                showToast("✅ स्पोर्ट्स फोटो अपलोड झाला व सेव्ह झाला!");
                              });
                            }}
                          />
                        </label>

                        {displayPhoto && (
                          <div className="text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200 text-center flex items-center justify-center gap-1 shadow-sm">
                            <span>✅ फोटो अपलोड केलेला आहे. फोटो काढून टाकण्यासाठी वरील डिलीट बटण वापरा.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Bottom Save Button */}
            <div className="flex justify-end pt-4 border-t border-pink-100">
              <button
                onClick={() => {
                  saveSiteInfo();
                  showToast("✅ कार्ड फोटो व १ ओळीचा मजकूर यशस्वीरित्या सेव्ह झाला!");
                }}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition active:scale-95"
              >
                <span>💾 बदलेले फोटो व नाव सेव्ह करा (Save All)</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 3: SLIDER PHOTOS MANAGER (स्लायडर फोटो मॅनेजर) */}
        {/* ==================================================================== */}
        {activeTab === "sliders" && (
          <div className="space-y-6">
            
            {/* 1. ANANDSHALA CARD SLIDER PHOTOS */}
            {(() => {
              const aanandshalaList = Array.isArray(siteForm.aanandshalaImages)
                ? siteForm.aanandshalaImages
                : ["/images/anandshala_building_sky.jpg", "/images/slider4.JPG", "/images/aandshala_img.png"];

              return (
                <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="text-lg font-black text-[#810B38]">🌸 १. आनंदशाळा कार्ड स्लायडर फोटो (Anandshala Slider Photos)</h3>
                      <p className="text-xs text-slate-500 font-bold">होमपेजवरील पहिल्या कार्डमधील बॅकग्राउंड स्लायडर फोटो अपलोड करा किंवा डिलीट करा.</p>
                    </div>

                    <div>
                      <input
                        id="aanandshala-slider-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleMultipleFileUpload(e, (urls) => {
                            const updated = [...aanandshalaList, ...urls];
                            setSiteForm((prev) => ({ ...prev, aanandshalaImages: updated }));
                            store.updateSiteData({ aanandshalaImages: updated });
                            store.syncAllToFirebaseCloud();
                            showToast(`✅ ${urls.length} नवीन स्लायडर फोटो जोडले व सेव्ह झाले!`);
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("aanandshala-slider-file-input")?.click()}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#810B38] to-[#be185d] hover:opacity-95 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition active:scale-95"
                      >
                        <span>➕ नवीन फोटो जोडा (Add Photo)</span>
                      </button>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="p-4 bg-pink-50 text-pink-900 font-extrabold text-xs rounded-xl text-center border border-pink-200 animate-pulse">
                      ⏳ स्लायडर फोटो अपलोड होत आहेत... कृपया थोडा वेळ थांबा.
                    </div>
                  )}

                  {aanandshalaList.length === 0 ? (
                    <div className="text-center py-10 bg-pink-50/50 rounded-2xl border-2 border-dashed border-pink-200 text-pink-900 space-y-2">
                      <span className="text-3xl block">📷</span>
                      <span className="text-sm font-black block">सर्व स्लायडर फोटो डिलीट झाले आहेत.</span>
                      <span className="text-xs font-bold text-pink-700 block">नवीन फोटो जोडण्यासाठी वरील "➕ नवीन फोटो जोडा" बटणावर क्लिक करा.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {aanandshalaList.map((imgUrl, idx) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-slate-900 shadow-md">
                          <img src={imgUrl} alt={`Anandshala Slider ${idx}`} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                          
                          {/* TOP RIGHT RED DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = aanandshalaList.filter((_, i) => i !== idx);
                              setSiteForm((prev) => ({ ...prev, aanandshalaImages: updated }));
                              store.updateSiteData({ aanandshalaImages: updated });
                              store.syncAllToFirebaseCloud();
                              showToast("🗑️ आनंदशाळा स्लायडर फोटो डिलीट झाला!");
                            }}
                            className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-xl border border-white/40 cursor-pointer flex items-center gap-1 active:scale-95"
                            title="फोटो डिलीट करा"
                          >
                            🗑️ डिलीट
                          </button>
                          
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                            फोटो #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 2. SPORTS CLUB CARD SLIDER PHOTOS */}
            {(() => {
              const sportsList = Array.isArray(siteForm.sportsImages)
                ? siteForm.sportsImages
                : ["/images/sports img.png", "/images/pickleball-court.png"];

              return (
                <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-indigo-100 space-y-6">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="text-lg font-black text-[#1A05A2]">🏋️‍♂️ २. स्पोर्ट्स क्लब कार्ड स्लायडर फोटो (Sports Slider Photos)</h3>
                      <p className="text-xs text-slate-500 font-bold">होमपेजवरील स्पोर्ट्स क्लब कार्डमधील स्लायडर फोटो जोडा किंवा हटवा.</p>
                    </div>

                    <div>
                      <input
                        id="sports-slider-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleMultipleFileUpload(e, (urls) => {
                            const updated = [...sportsList, ...urls];
                            setSiteForm((prev) => ({ ...prev, sportsImages: updated }));
                            store.updateSiteData({ sportsImages: updated });
                            store.syncAllToFirebaseCloud();
                            showToast(`✅ ${urls.length} नवीन स्पोर्ट्स फोटो जोडले व सेव्ह झाले!`);
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("sports-slider-file-input")?.click()}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1A05A2] to-indigo-700 hover:opacity-95 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2 transition active:scale-95"
                      >
                        <span>➕ नवीन स्पोर्ट्स फोटो जोडा</span>
                      </button>
                    </div>
                  </div>

                  {sportsList.length === 0 ? (
                    <div className="text-center py-10 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200 text-indigo-900 space-y-2">
                      <span className="text-3xl block">📷</span>
                      <span className="text-sm font-black block">सर्व स्पोर्ट्स स्लायडर फोटो डिलीट झाले आहेत.</span>
                      <span className="text-xs font-bold text-indigo-700 block">नवीन फोटो जोडण्यासाठी वरील "➕ नवीन स्पोर्ट्स फोटो जोडा" बटणावर क्लिक करा.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {sportsList.map((imgUrl, idx) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-900 shadow-md">
                          <img src={imgUrl} alt={`Sports Slider ${idx}`} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                          
                          {/* TOP RIGHT RED DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = sportsList.filter((_, i) => i !== idx);
                              setSiteForm((prev) => ({ ...prev, sportsImages: updated }));
                              store.updateSiteData({ sportsImages: updated });
                              store.syncAllToFirebaseCloud();
                              showToast("🗑️ स्पोर्ट्स स्लायडर फोटो डिलीट झाला!");
                            }}
                            className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-xl border border-white/40 cursor-pointer flex items-center gap-1 active:scale-95"
                            title="फोटो डिलीट करा"
                          >
                            🗑️ डिलीट
                          </button>
                          
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20">
                            फोटो #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  saveSiteInfo();
                  showToast("✅ सर्व स्लायडर फोटो यशस्वीरित्या सेव्ह झाले!");
                }}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg cursor-pointer transition active:scale-95"
              >
                💾 सर्व स्लायडर फोटो सेव्ह करा (Save All Sliders)
              </button>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 3: ANANDSHALA SCHEDULE (आनंदशाळा वेळापत्रक) */}
        {/* ==================================================================== */}
        {activeTab === "anandshala-schedule" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">🌸 आनंदशाळा वेळापत्रक संपादन</h3>
              <p className="text-xs text-slate-500 font-bold">ज्येष्ठ नागरिक आनंदशाळेचा वेळापत्रक फोटो किंवा PDF पोस्टर अपलोड करा.</p>
            </div>

            {/* UPLOAD TIMETABLE POSTER PHOTO / PDF */}
            <div className="p-6 rounded-2xl bg-pink-50/70 border-2 border-pink-200 space-y-4">
              <h4 className="text-base font-black text-[#810B38]">🖼️ १. वेळापत्रक फोटो किंवा PDF पोस्टर अपलोड करा</h4>
              <p className="text-xs text-slate-600 font-medium">संगणकावरून वेळापत्रकाचा फोटो किंवा PDF फाईल निवडा. ती लगेच साईटवर दिसेल.</p>
              
              <div className="flex items-center gap-4 flex-wrap">
                <label className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#810B38] to-[#be185d] hover:opacity-95 text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                  <span>📁 फोटो / PDF निवडा</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        const isPdf = e.target.files?.[0]?.type.includes("pdf");
                        const updated = {
                          ...scheduleForm,
                          posterUrl: url,
                          posterType: (isPdf ? "pdf" : "image") as "pdf" | "image",
                        };
                        setScheduleForm(updated);
                        store.updateScheduleConfig(updated);
                        store.syncAllToFirebaseCloud();
                      })
                    }
                  />
                </label>

                {scheduleForm.posterUrl ? (
                  <div className="w-full mt-4 p-5 rounded-3xl bg-white border-2 border-pink-200 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-sm">
                          <span>✅</span>
                          {scheduleForm.posterType === "pdf" || scheduleForm.posterUrl.includes(".pdf") || scheduleForm.posterUrl.startsWith("data:application/pdf") ? "PDF पोस्टर फाईल" : "फोटो पोस्टर फाईल"}
                        </span>
                        <span className="text-xs font-black text-rose-900">अपलोड केलेले आनंदशाळा वेळापत्रक पोस्टर:</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openMediaInNewTab(scheduleForm.posterUrl)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>👁️ नवीन विंडोमध्ये उघडा (View Full Screen)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...scheduleForm, posterUrl: "" };
                            setScheduleForm(updated);
                            store.updateScheduleConfig(updated);
                            store.syncAllToFirebaseCloud();
                            showToast("🗑️ आनंदशाळा पोस्टर यशस्वीरित्या हटवले!");
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-md inline-flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>🗑️ पोस्टर हटवा (Delete)</span>
                        </button>
                      </div>
                    </div>

                    {scheduleForm.posterType === "pdf" || scheduleForm.posterUrl.includes(".pdf") || scheduleForm.posterUrl.startsWith("data:application/pdf") ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                            📄
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-rose-950">आनंदशाळा वेळापत्रक PDF फाईल तयार आहे</h5>
                            <p className="text-[11px] font-extrabold text-emerald-700">✨ खालील बॉक्समध्ये व मुख्य वेबसाईटवर ही PDF थेट वाचता येईल.</p>
                          </div>
                        </div>

                        {/* Embedded PDF Viewer Box */}
                        <div className="w-full rounded-2xl overflow-hidden border-2 border-pink-300 shadow-md bg-slate-900">
                          <iframe
                            src={scheduleForm.posterUrl}
                            title="Anandshala Timetable PDF Preview"
                            className="w-full h-[500px] border-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-slate-900 shadow-inner group p-2 text-center">
                        <img
                          src={scheduleForm.posterUrl}
                          alt="Anandshala Timetable Poster"
                          className="max-h-[500px] w-auto object-contain mx-auto rounded-xl group-hover:scale-102 transition duration-300"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full mt-2 p-4 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/50 text-center space-y-1">
                    <span className="text-2xl block">📄</span>
                    <span className="text-xs font-black text-pink-900">कोणतेही वेळापत्रक फोटो किंवा PDF पोस्टर जोडलेले नाही.</span>
                  </div>
                )}
              </div>
            </div>

            {/* TEXT FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">मुख्य शीर्षक (Header Title)</label>
                <input
                  type="text"
                  value={scheduleForm.headerTitle || ""}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, headerTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 focus:border-[#810B38] font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">दिवस व वेळ (Days & Batch Text)</label>
                <input
                  type="text"
                  value={scheduleForm.daysText || ""}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, daysText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 focus:border-[#810B38] font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveAnandshalaSchedule}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer transition-all"
              >
                💾 आनंदशाळा वेळापत्रक सेव्ह करा (Save Schedule)
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 4: SPORTS SCHEDULE (स्पोर्ट्स क्लब वेळापत्रक) */}
        {/* ==================================================================== */}
        {activeTab === "sports-schedule" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">🏋️‍♂️ प्रीतम स्पोर्ट्स क्लब वेळापत्रक संपादन</h3>
              <p className="text-xs text-slate-500 font-bold">क्रीडा व फिटनेस संकुलाचे दैनिक वेळापत्रक व पोस्टर बदला.</p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-4">
              <h4 className="text-base font-black text-[#1A05A2]">🏋️‍♂️ १. स्पोर्ट्स क्लब वेळापत्रक फोटो किंवा PDF पोस्टर</h4>
              
              <div className="flex items-center gap-4 flex-wrap">
                <label className="px-6 py-3 rounded-xl bg-[#1A05A2] hover:bg-indigo-900 text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                  <span>📁 फोटो / PDF निवडा</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        const isPdf = e.target.files?.[0]?.type.includes("pdf");
                        const updated = {
                          ...sportsScheduleForm,
                          posterUrl: url,
                          posterType: (isPdf ? "pdf" : "image") as "pdf" | "image",
                        };
                        setSportsScheduleForm(updated);
                        store.updateSportsScheduleConfig(updated);
                        store.syncAllToFirebaseCloud();
                      })
                    }
                  />
                </label>

                {sportsScheduleForm.posterUrl ? (
                  <div className="w-full mt-4 p-5 rounded-3xl bg-white border-2 border-indigo-200 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 shadow-sm">
                          <span>✅</span>
                          {sportsScheduleForm.posterType === "pdf" || sportsScheduleForm.posterUrl.includes(".pdf") || sportsScheduleForm.posterUrl.startsWith("data:application/pdf") ? "PDF पोस्टर फाईल" : "फोटो पोस्टर फाईल"}
                        </span>
                        <span className="text-xs font-black text-indigo-900">अपलोड केलेले स्पोर्ट्स वेळापत्रक पोस्टर:</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openMediaInNewTab(sportsScheduleForm.posterUrl)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>👁️ नवीन विंडोमध्ये उघडा (View Full Screen)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...sportsScheduleForm, posterUrl: "" };
                            setSportsScheduleForm(updated);
                            store.updateSportsScheduleConfig(updated);
                            store.syncAllToFirebaseCloud();
                            showToast("🗑️ स्पोर्ट्स पोस्टर यशस्वीरित्या हटवले!");
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-md inline-flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>🗑️ पोस्टर हटवा (Delete)</span>
                        </button>
                      </div>
                    </div>

                    {sportsScheduleForm.posterType === "pdf" || sportsScheduleForm.posterUrl.includes(".pdf") || sportsScheduleForm.posterUrl.startsWith("data:application/pdf") ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                            📄
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-indigo-950">स्पोर्ट्स क्लब वेळापत्रक PDF फाईल तयार आहे</h5>
                            <p className="text-[11px] font-extrabold text-emerald-700">✨ खालील बॉक्समध्ये व मुख्य वेबसाईटवर ही PDF थेट वाचता येईल.</p>
                          </div>
                        </div>

                        {/* Embedded PDF Viewer Box */}
                        <div className="w-full rounded-2xl overflow-hidden border-2 border-indigo-300 shadow-md bg-slate-900">
                          <iframe
                            src={sportsScheduleForm.posterUrl}
                            title="Sports Timetable PDF Preview"
                            className="w-full h-[500px] border-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-900 shadow-inner group p-2 text-center">
                        <img
                          src={sportsScheduleForm.posterUrl}
                          alt="Sports Timetable Poster"
                          className="max-h-[500px] w-auto object-contain mx-auto rounded-xl group-hover:scale-102 transition duration-300"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full mt-2 p-4 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 text-center space-y-1">
                    <span className="text-2xl block">📄</span>
                    <span className="text-xs font-black text-indigo-900">कोणतेही स्पोर्ट्स वेळापत्रक फोटो किंवा PDF पोस्टर जोडलेले नाही.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">मुख्य शीर्षक (Sports Title)</label>
                <input
                  type="text"
                  value={sportsScheduleForm.headerTitle || ""}
                  onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, headerTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-200 font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">दिवस व वेळ (Days & Hours)</label>
                <input
                  type="text"
                  value={sportsScheduleForm.daysText || ""}
                  onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, daysText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-200 font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveSportsSchedule}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer transition-all"
              >
                💾 स्पोर्ट्स वेळापत्रक सेव्ह करा
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 5: ABOUT US INFO (आमच्याविषयी माहिती) */}
        {/* ==================================================================== */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">

            {/* ── 1. MAIN TITLE ─────────────────────────────── */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-[#810B38] uppercase tracking-wide flex items-center gap-1.5">
                🏷️ मुख्य शीर्षक (Main Title):
              </label>
              <input
                type="text"
                value={aboutForm.mainTitle || ""}
                onChange={(e) => setAboutForm({ ...aboutForm, mainTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 font-black text-base bg-white text-slate-800 focus:outline-none focus:border-[#810B38] shadow-inner transition"
                placeholder="उदा. प्रीतम आनंदशाळा — आमच्याविषयी"
              />
            </div>

            {/* ── 2. MAIN CONTENT ───────────────────────────── */}
            <div className="space-y-2">
              <label className="block text-sm font-black text-[#810B38] uppercase tracking-wide flex items-center gap-1.5">
                📝 मुख्य मजकूर (Main Content):
              </label>
              <textarea
                value={aboutForm.storyP1 || ""}
                onChange={(e) => setAboutForm({ ...aboutForm, storyP1: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 font-medium text-sm bg-white text-slate-800 focus:outline-none focus:border-[#810B38] shadow-inner leading-relaxed resize-y transition"
                placeholder="आनंदशाळेची संपूर्ण माहिती, इतिहास व प्रवास येथे लिहा..."
              />
            </div>

            {/* ── 3. PHOTOS ─────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="text-sm font-black text-[#810B38] uppercase tracking-wide flex items-center gap-1.5">
                  🖼️ फोटो संकुल (Photos):
                </label>
                <label className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#810B38] to-[#be185d] hover:opacity-90 text-white font-black text-xs shadow-md cursor-pointer inline-flex items-center gap-2 active:scale-95 transition">
                  📷 फोटो अपलोड करा
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      handleMultipleFileUpload(e, (urls) => {
                        const current = aboutForm.photos || [];
                        const updated = [...current, ...urls];
                        setAboutForm({ ...aboutForm, photos: updated });
                        store.updateAboutData({ photos: updated });
                        store.syncAllToFirebaseCloud();
                        showToast("✅ फोटो अपलोड व सेव्ह झाले!");
                      })
                    }
                  />
                </label>
              </div>

              {(!aboutForm.photos || aboutForm.photos.length === 0) ? (
                <div className="w-full py-12 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/40 text-center space-y-2">
                  <span className="text-4xl block">🖼️</span>
                  <span className="text-sm font-black text-pink-900 block">अजून कोणतेही फोटो जोडलेले नाहीत.</span>
                  <span className="text-xs font-bold text-pink-500 block">वरील बटणावर क्लिक करून फोटो अपलोड करा.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {aboutForm.photos.map((imgUrl, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-slate-900 shadow-md aspect-square">
                      <img
                        src={imgUrl}
                        alt={`About Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                        <button
                          type="button"
                          onClick={() => openMediaInNewTab(imgUrl)}
                          className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] cursor-pointer text-center"
                        >
                          👁️ पहा
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("हा फोटो डिलीट करायचा आहे?")) {
                              const updated = aboutForm.photos?.filter((_, i) => i !== idx);
                              setAboutForm({ ...aboutForm, photos: updated });
                              store.updateAboutData({ photos: updated });
                              store.syncAllToFirebaseCloud();
                              showToast("🗑️ फोटो डिलीट झाला!");
                            }
                          }}
                          className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] cursor-pointer text-center"
                        >
                          🗑️ डिलीट
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── SAVE BUTTON ───────────────────────────────── */}
            <div className="flex justify-end border-t border-pink-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  store.updateAboutData({ mainTitle: aboutForm.mainTitle, storyP1: aboutForm.storyP1, photos: aboutForm.photos });
                  store.syncAllToFirebaseCloud();
                  showToast("💾 माहिती यशस्वीरित्या सेव्ह झाली!");
                }}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg cursor-pointer transition active:scale-95"
              >
                💾 सेव्ह करा (Save)
              </button>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 6: MAHITI PATRAK & BROCHURES (माहिती पत्रक व ब्रोशर्स) */}
        {/* ==================================================================== */}
        {activeTab === "brochures" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">📜 माहिती पत्रक व अधिकृत ब्रोशर्स (Mahiti Patrak)</h3>
              <p className="text-xs text-slate-500 font-bold">संगणकावरून PDF/फोटो फाईल अपलोड करा किंवा ऑनलाईन फाईल लिंक जोडा.</p>
            </div>

            {/* ADD NEW BROCHURE FORM */}
            <form onSubmit={handleAddBrochure} className="p-6 rounded-2xl bg-pink-50/70 border-2 border-pink-200 space-y-4">
              <h4 className="text-base font-black text-[#810B38]">➕ नवीन माहिती पत्रक जोडा (Add New Brochure)</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">माहिती पत्रक शीर्षक (Title)</label>
                  <input
                    type="text"
                    value={newBrochureTitle}
                    onChange={(e) => setNewBrochureTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                    placeholder="उदा. आनंदशाळा अधिकृत माहिती पत्रक २०२६"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">वर्गवारी (Category)</label>
                  <select
                    value={newBrochureCategory}
                    onChange={(e) => setNewBrochureCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm bg-white"
                  >
                    <option value="आनंदशाळा ब्रोशर">आनंदशाळा ब्रोशर</option>
                    <option value="स्पोर्ट्स क्लब ब्रोशर">स्पोर्ट्स क्लब ब्रोशर</option>
                    <option value="विशेष माहिती पत्रक">विशेष माहिती पत्रक</option>
                  </select>
                </div>
              </div>

              {/* UPLOAD FILE FROM PC OR PASTE LINK */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-slate-700">फाईल स्रोत (Upload or Link)</label>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#810B38] to-[#be185d] text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                    <span>📁 संगणकावरून PDF / फोटो निवडा</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => {
                          const isPdf = e.target.files?.[0]?.type.includes("pdf");
                          setNewBrochureUrl(url);
                          setNewBrochureFileType(isPdf ? "pdf" : "image");
                        })
                      }
                    />
                  </label>

                  <span className="text-xs font-black text-slate-400">किंवा</span>

                  <input
                    type="url"
                    value={newBrochureUrl}
                    onChange={(e) => setNewBrochureUrl(e.target.value)}
                    className="flex-1 min-w-[240px] px-4 py-2 rounded-xl border-2 border-pink-200 font-bold text-xs"
                    placeholder="🔗 ऑनलाईन PDF किंवा फोटो फाईल लिंक टाका..."
                  />
                </div>

                {newBrochureUrl && (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 inline-block">
                    ✅ फाईल तयार आहे: {newBrochureFileType.toUpperCase()} ({newBrochureUrl.slice(0, 45)}...)
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#810B38] hover:bg-[#6b092b] text-white font-black text-xs shadow-md cursor-pointer"
                >
                  ➕ माहिती पत्रक सेव्ह करा (Add Brochure)
                </button>
              </div>
            </form>

            {/* LIST OF BROCHURES */}
            <div className="space-y-3">
              <h4 className="text-base font-black text-[#810B38]">📜 सर्व माहिती पत्रके (Uploaded Brochures)</h4>
              {store.brochures.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold">
                  कोणतेही माहिती पत्रक जोडलेले नाही.
                </div>
              ) : (
                <div className="space-y-3">
                  {store.brochures.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl border-2 border-pink-100 bg-[#fffafd] flex items-center justify-between gap-4 flex-wrap shadow-sm">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-[#810B38]">
                          {b.category} • {b.fileType.toUpperCase()}
                        </span>
                        <h5 className="font-black text-base text-slate-900">{b.title}</h5>
                        <div className="text-[11px] text-slate-400 font-bold">तारीख: {b.date}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={b.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                        >
                          पहा / डाऊनलोड
                        </a>
                        <button
                          onClick={() => {
                            if (confirm("नक्की हे माहिती पत्रक डिलीट करायचे?")) {
                              store.deleteBrochure(b.id);
                              store.syncAllToFirebaseCloud();
                              showToast("माहिती पत्रक डिलीट झाले!");
                            }
                          }}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs border border-rose-200 cursor-pointer"
                        >
                          🗑️ डिलीट
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 7: TESTIMONIALS & VIDEOS (सदस्य अनुभव व व्हिडिओ) */}
        {/* ==================================================================== */}
        {activeTab === "testimonials" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">🎬 सदस्य अनुभव व व्हिडिओ (Testimonials & Member Videos)</h3>
              <p className="text-xs text-slate-500 font-bold">सदस्यांचे अभिप्राय आणि व्हिडिओ (YouTube / PC Upload) जोडा किंवा डिलीट करा.</p>
            </div>

            {/* ADD NEW TESTIMONIAL FORM */}
            <form onSubmit={handleAddTestimonial} className="p-6 rounded-2xl bg-pink-50/70 border-2 border-pink-200 space-y-4">
              <h4 className="text-base font-black text-[#810B38]">➕ नवीन सदस्य अनुभव / व्हिडिओ जोडा (Add Testimonial)</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">सदस्याचे नाव (Member Name)</label>
                  <input
                    type="text"
                    value={newTestimonialName}
                    onChange={(e) => setNewTestimonialName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                    placeholder="उदा. श्रीम. सुहासिनी जोशी"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">हुद्दा / शहर (Designation/Role)</label>
                  <input
                    type="text"
                    value={newTestimonialRole}
                    onChange={(e) => setNewTestimonialRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                    placeholder="आनंदशाळा सदस्य, सांगली"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">स्टार रेटिंग (Rating 1 to 5)</label>
                  <select
                    value={newTestimonialRating}
                    onChange={(e) => setNewTestimonialRating(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (५ स्टार)</option>
                    <option value={4}>⭐⭐⭐⭐ (४ स्टार)</option>
                    <option value={3}>⭐⭐⭐ (३ स्टार)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">सदस्याचा अभिप्राय / संदेश (Feedback Text)</label>
                <textarea
                  value={newTestimonialText}
                  onChange={(e) => setNewTestimonialText(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-medium text-sm"
                  placeholder="आनंदशाळेतील माझा अनुभव खूप छान आहे..."
                />
              </div>

              {/* VIDEO SOURCE OPTIONS: BOTH LINK & PC UPLOAD! */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border-2 border-pink-100">
                <label className="block text-xs font-extrabold text-[#810B38]">🎥 व्हिडिओ पर्याय (Video Link OR Upload from PC)</label>

                <div className="flex items-center gap-4 flex-wrap">
                  {/* OPTION A: UPLOAD VIDEO FROM PC */}
                  <label className="px-5 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#6b092b] text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                    <span>💻 संगणकावरून व्हिडिओ अपलोड करा (Upload Video)</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => {
                          setNewTestimonialVideoUrl(url);
                          showToast("✅ व्हिडिओ यशस्वीरित्या अपलोड झाला! (Video Uploaded Successfully!)");
                        })
                      }
                    />
                  </label>

                  <span className="text-xs font-black text-slate-400">किंवा</span>

                  {/* OPTION B: PASTE VIDEO LINK */}
                  <input
                    type="url"
                    value={newTestimonialVideoUrl}
                    onChange={(e) => setNewTestimonialVideoUrl(e.target.value)}
                    className="flex-1 min-w-[240px] px-4 py-2 rounded-xl border-2 border-pink-200 font-bold text-xs"
                    placeholder="🔗 YouTube / Google Drive / MP4 व्हिडिओ लिंक टाका..."
                  />
                </div>

                {/* LIVE UPLOADED VIDEO PREVIEW BOX */}
                {newTestimonialVideoUrl && (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                        <span>✅</span> व्हिडिओ तयार आहे (Video Ready)
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewTestimonialVideoUrl("")}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        ❌ काढा (Remove)
                      </button>
                    </div>

                    {newTestimonialVideoUrl.includes("firebasestorage") ||
                    newTestimonialVideoUrl.includes(".mp4") ||
                    newTestimonialVideoUrl.includes(".webm") ||
                    newTestimonialVideoUrl.includes(".mov") ||
                    newTestimonialVideoUrl.startsWith("data:video") ? (
                      <video
                        src={newTestimonialVideoUrl}
                        controls
                        className="w-full max-h-52 rounded-xl bg-black object-contain border border-emerald-200 shadow-inner"
                      />
                    ) : (
                      <div className="text-xs text-slate-600 font-bold truncate">
                        🔗 लिंक: {newTestimonialVideoUrl}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  ➕ सदस्य अनुभव व व्हिडिओ सेव्ह करा (Save Testimonial)
                </button>
              </div>
            </form>

            {/* LIST OF TESTIMONIALS WITH LIVE PLAYABLE VIDEO PLAYER */}
            <div className="space-y-3">
              <h4 className="text-base font-black text-[#810B38]">💬 सर्व सदस्य अभिप्राय व व्हिडिओ ({store.testimonials.length})</h4>
              {store.testimonials.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold">
                  कोणताही सदस्य अभिप्राय जोडलेला नाही.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.testimonials.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl border-2 border-pink-100 bg-[#fffafd] space-y-3 relative shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-black text-base text-slate-900">{t.name}</h5>
                          <div className="text-xs font-bold text-pink-700">{t.role}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("नक्की हा अभिप्राय डिलीट करायचा?")) {
                              store.deleteTestimonial(t.id);
                              store.syncAllToFirebaseCloud();
                              showToast("अभिप्राय डिलीट झाला!");
                            }
                          }}
                          className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          🗑️ डिलीट
                        </button>
                      </div>

                      {t.text && (
                        <div className="text-xs bg-white p-3 rounded-xl border border-pink-100 text-slate-700 font-medium">
                          "{t.text}"
                        </div>
                      )}

                      {/* PLAYABLE VIDEO PLAYER IN CARD */}
                      {t.videoUrl && (
                        <div className="space-y-1">
                          <div className="text-[11px] font-black text-[#810B38]">🎬 सदस्य व्हिडिओ:</div>
                          {t.videoUrl.includes("firebasestorage") ||
                          t.videoUrl.includes(".mp4") ||
                          t.videoUrl.includes(".webm") ||
                          t.videoUrl.includes(".mov") ||
                          t.videoUrl.startsWith("data:video") ? (
                            <video
                              src={t.videoUrl}
                              controls
                              className="w-full max-h-48 rounded-xl bg-black object-contain border border-pink-200"
                            />
                          ) : (
                            <div className="text-xs bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 text-indigo-900 font-bold flex items-center justify-between gap-2">
                              <span className="truncate">🔗 {t.videoUrl}</span>
                              <a href={t.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline shrink-0 font-extrabold">
                                पहा (View)
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 8: PHOTOS & GALLERY (फोटो व गॅलरी) */}
        {/* ==================================================================== */}
        {activeTab === "gallery" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-black text-[#810B38]">🖼️ फोटो व गॅलरी मॅनेजर</h3>
                <p className="text-xs text-slate-500 font-bold">नवीन फोटो अपलोड करा किंवा जुने फोटो पहा व डिलीट करा.</p>
              </div>

              <label className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#810B38] to-[#be185d] hover:opacity-95 text-white font-black text-xs shadow-lg cursor-pointer inline-flex items-center gap-2">
                <span>➕ नवीन फोटो अपलोड करा (Add Photo)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(e, (url) => {
                      store.addGalleryItem({
                        url,
                        caption: "आनंदशाळा फोटो",
                        category: ["सर्व", "ज्येष्ठ नागरिक आनंदशाळा"],
                      });
                      store.syncAllToFirebaseCloud();
                    })
                  }
                />
              </label>
            </div>

            {isUploading && (
              <div className="p-4 bg-pink-50 text-pink-900 font-extrabold text-xs rounded-xl text-center border border-pink-200 animate-pulse">
                ⏳ फोटो अपलोड होत आहे... कृपया थोडा वेळ थांबा.
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {store.gallery.map((img) => (
                <div key={img.id} className="group relative rounded-2xl overflow-hidden border-2 border-pink-100 shadow-sm bg-slate-50">
                  <img src={img.url} alt={img.caption} className="w-full h-36 object-cover" />
                  <div className="p-2 text-[11px] font-bold text-slate-700 truncate">{img.caption || "आनंदशाळा फोटो"}</div>
                  <button
                    onClick={() => {
                      if (confirm("नक्की हा फोटो डिलीट करायचा?")) {
                        store.deleteGalleryItem(img.id);
                        store.syncAllToFirebaseCloud();
                        showToast("फोटो डिलीट झाला!");
                      }
                    }}
                    className="absolute top-2 right-2 bg-rose-600 text-white size-7 rounded-full text-xs font-black flex items-center justify-center shadow-md hover:scale-110 cursor-pointer"
                    title="हटवा (Delete)"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 9: PACKAGES & PRICING (प्रवेश योजना व फी) */}
        {/* ==================================================================== */}
        {activeTab === "packages" && (() => {
          type PeriodType = "days" | "week" | "month" | "year";
          const periods: { key: PeriodType; label: string; icon: string; color: string }[] = [
            { key: "days",  label: "दिवस (Day)",    icon: "☀️", color: "amber"   },
            { key: "week",  label: "आठवडा (Week)",  icon: "📅", color: "blue"    },
            { key: "month", label: "महिना (Month)", icon: "🗓️", color: "violet"  },
            { key: "year",  label: "वर्ष (Year)",   icon: "🏆", color: "emerald" },
          ];

          const colorMap: Record<string, string> = {
            amber:   "border-amber-400 bg-amber-50 text-amber-800",
            blue:    "border-blue-400 bg-blue-50 text-blue-800",
            violet:  "border-violet-400 bg-violet-50 text-violet-800",
            emerald: "border-emerald-400 bg-emerald-50 text-emerald-800",
          };
          const activeBtnMap: Record<string, string> = {
            amber:   "bg-amber-500 text-white border-amber-500",
            blue:    "bg-blue-600 text-white border-blue-600",
            violet:  "bg-violet-600 text-white border-violet-600",
            emerald: "bg-emerald-600 text-white border-emerald-600",
          };
          const badgeMap: Record<string, string> = {
            amber:   "bg-amber-100 text-amber-800",
            blue:    "bg-blue-100 text-blue-800",
            violet:  "bg-violet-100 text-violet-800",
            emerald: "bg-emerald-100 text-emerald-800",
          };

          // Use top-level states (no useState inside IIFE — Rules of Hooks)
          const activePeriod = periods.find(p => p.key === pkgPeriod)!;
          const filteredPkgs = store.packages.filter(p => p.periodType === pkgPeriod);

          return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-5">
              {/* Header */}
              <div className="border-b border-pink-100 pb-4">
                <h3 className="text-lg font-black text-[#810B38]">🏷️ प्रवेश योजना व फी (Packages)</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">दिवस / आठवडा / महिना / वर्ष — सर्व योजना एकत्र व्यवस्थापित करा.</p>
              </div>

              {/* Period Tabs */}
              <div className="flex flex-wrap gap-2">
                {periods.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => { setPkgPeriod(p.key); setShowAddPkgForm(false); }}
                    className={`px-4 py-2 rounded-2xl text-xs font-black border-2 cursor-pointer transition active:scale-95 ${pkgPeriod === p.key ? activeBtnMap[p.color] : "bg-white border-slate-200 text-slate-600 hover:border-pink-300"}`}
                  >
                    {p.icon} {p.label}
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${pkgPeriod === p.key ? "bg-white/30 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {store.packages.filter(x => x.periodType === p.key).length}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddPkgForm(v => !v)}
                  className="ml-auto px-4 py-2 rounded-2xl text-xs font-black border-2 border-[#810B38] bg-[#810B38] text-white hover:bg-[#68082c] cursor-pointer transition active:scale-95"
                >
                  {showAddPkgForm ? "✕ बंद करा" : "➕ नवीन योजना जोडा"}
                </button>
              </div>

              {/* Add New Package Form */}
              {showAddPkgForm && (
                <div className={`p-5 rounded-3xl border-2 ${colorMap[activePeriod.color]} space-y-4`}>
                  <h4 className="text-sm font-black text-slate-800">
                    {activePeriod.icon} नवीन {activePeriod.label} योजना जोडा:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 mb-1">योजनेचे नाव (Title) *</label>
                      <input type="text" value={newPkg.title}
                        onChange={e => setNewPkg({...newPkg, title: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 text-sm font-bold bg-white"
                        placeholder="उदा. एक दिवस सहल पास" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 mb-1">किंमत / फी (Price) *</label>
                      <input type="text" value={newPkg.price}
                        onChange={e => setNewPkg({...newPkg, price: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 text-sm font-bold bg-white text-emerald-700"
                        placeholder="उदा. ₹ ६०० /-" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 mb-1">बॅज लेबल (Badge)</label>
                      <input type="text" value={newPkg.badge}
                        onChange={e => setNewPkg({...newPkg, badge: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 text-sm font-bold bg-white"
                        placeholder="उदा. १ दिवस पास" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 mb-1">थोडक्यात वर्णन (Subtitle)</label>
                      <input type="text" value={newPkg.sub}
                        onChange={e => setNewPkg({...newPkg, sub: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 text-sm font-medium bg-white"
                        placeholder="उदा. वेळ: सकाळी ११ ते सायं. ५" />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-600 mb-2">सुविधा / वैशिष्ट्ये (Features)</label>
                    <div className="space-y-2">
                      {newPkg.features.map((f, fi) => (
                        <div key={fi} className="flex gap-2">
                          <input type="text" value={f}
                            onChange={e => {
                              const upd = [...newPkg.features];
                              upd[fi] = e.target.value;
                              setNewPkg({...newPkg, features: upd});
                            }}
                            className="flex-1 px-3 py-2 rounded-xl border border-pink-200 text-xs font-medium bg-white"
                            placeholder={`सुविधा #${fi + 1}`} />
                          {newPkg.features.length > 1 && (
                            <button type="button" onClick={() => setNewPkg({...newPkg, features: newPkg.features.filter((_,i)=>i!==fi)})}
                              className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-700 font-black text-xs cursor-pointer hover:bg-rose-200">✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setNewPkg({...newPkg, features: [...newPkg.features, ""]})}
                        className="text-xs font-black text-[#810B38] hover:underline cursor-pointer">
                        + आणखी सुविधा जोडा
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button"
                      onClick={() => {
                        if (!newPkg.title.trim() || !newPkg.price.trim()) { showToast("❌ नाव व किंमत आवश्यक आहे!"); return; }
                        store.addPackage({ title: newPkg.title, price: newPkg.price, sub: newPkg.sub, badge: newPkg.badge || newPkg.title, periodType: pkgPeriod, features: newPkg.features.filter(f => f.trim()), featured: false });
                        store.syncAllToFirebaseCloud();
                        setNewPkg({ title: "", price: "", sub: "", badge: "", features: [""] });
                        setShowAddPkgForm(false);
                        showToast("✅ नवीन योजना जोडली!");
                      }}
                      className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer active:scale-95 shadow-md">
                      ✅ जोडा (Add)
                    </button>
                    <button type="button" onClick={() => setShowAddPkgForm(false)}
                      className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer active:scale-95">
                      रद्द करा
                    </button>
                  </div>
                </div>
              )}

              {/* Package Cards */}
              {filteredPkgs.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 space-y-2">
                  <span className="text-3xl block">{activePeriod.icon}</span>
                  <p className="text-sm font-black text-slate-500">{activePeriod.label} साठी कोणतीही योजना नाही.</p>
                  <p className="text-xs text-slate-400 font-bold">वरील "नवीन योजना जोडा" वापरा.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredPkgs.map((pkg) => (
                    <div key={pkg.id} className={`p-5 rounded-3xl border-2 ${colorMap[activePeriod.color]} space-y-4 shadow-sm`}>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${badgeMap[activePeriod.color]}`}>
                          {activePeriod.icon} {pkg.badge || activePeriod.label}
                        </span>
                        <button type="button"
                          onClick={() => { if(confirm("ही योजना डिलीट करायची आहे?")) { store.deletePackage(pkg.id); store.syncAllToFirebaseCloud(); showToast("🗑️ योजना डिलीट झाली!"); }}}
                          className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-[11px] cursor-pointer border border-rose-200">
                          🗑️ डिलीट
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">बॅज लेबल (Badge)</label>
                          <input type="text" value={pkg.badge}
                            onChange={e => store.updatePackage(pkg.id, { badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white/80" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">योजनेचे नाव (Plan Name) *</label>
                          <input type="text" value={pkg.title}
                            onChange={e => store.updatePackage(pkg.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white/80" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">किंमत / फी (Price) *</label>
                          <input type="text" value={pkg.price}
                            onChange={e => store.updatePackage(pkg.id, { price: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold bg-white/80 text-emerald-700" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">थोडक्यात वर्णन (Subtitle)</label>
                          <input type="text" value={pkg.sub}
                            onChange={e => store.updatePackage(pkg.id, { sub: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white/80" />
                        </div>

                        {/* Features */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase">सुविधा (Features)</label>
                          <div className="space-y-1.5">
                            {(pkg.features || []).map((f, fi) => (
                              <div key={fi} className="flex gap-2">
                                <input type="text" value={f}
                                  onChange={e => {
                                    const upd = [...(pkg.features || [])];
                                    upd[fi] = e.target.value;
                                    store.updatePackage(pkg.id, { features: upd });
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium bg-white/80"
                                  placeholder={`सुविधा #${fi + 1}`} />
                                <button type="button"
                                  onClick={() => store.updatePackage(pkg.id, { features: (pkg.features||[]).filter((_,i)=>i!==fi) })}
                                  className="px-2 py-1 rounded-xl bg-rose-100 text-rose-600 font-black text-[10px] cursor-pointer hover:bg-rose-200">✕</button>
                              </div>
                            ))}
                            <button type="button"
                              onClick={() => store.updatePackage(pkg.id, { features: [...(pkg.features||[]), ""] })}
                              className="text-[11px] font-black text-[#810B38] hover:underline cursor-pointer">
                              + सुविधा जोडा
                            </button>
                          </div>
                        </div>

                        {/* Featured toggle */}
                        <div className="flex items-center gap-2 pt-1">
                          <input type="checkbox" id={`feat-${pkg.id}`} checked={!!pkg.featured}
                            onChange={e => store.updatePackage(pkg.id, { featured: e.target.checked })}
                            className="w-4 h-4 accent-[#810B38] cursor-pointer" />
                          <label htmlFor={`feat-${pkg.id}`} className="text-xs font-black text-slate-700 cursor-pointer">
                            ⭐ Featured / लोकप्रिय योजना म्हणून दाखवा
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Save All */}
              <div className="flex justify-end border-t border-pink-100 pt-4">
                <button type="button"
                  onClick={() => { store.syncAllToFirebaseCloud(); showToast("💾 सर्व योजना सेव्ह झाल्या!"); }}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg cursor-pointer transition active:scale-95">
                  💾 सर्व योजना सेव्ह करा (Save All)
                </button>
              </div>
            </div>
          );
        })()}

        {/* ==================================================================== */}
        {/* PAGE 10: CONTACT & SITE INFO (संपर्क व मुख्य माहिती) */}
        {/* ==================================================================== */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">⚙️ संपर्क माहिती व फोन नंबर्स (Contact & Site Info)</h3>
              <p className="text-xs text-slate-500 font-bold">वेबसाईटवर दिसणारे मोबाईल नंबर, पत्ता, नोटीस आणि नवीन संपर्क जोडण्यासाठी खालील पर्याय वापरा.</p>
            </div>

            {/* Main Primary Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">📞 मोबाईल नंबर १ (Primary Phone)</label>
                <input
                  type="text"
                  value={siteForm.phone1 || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, phone1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">📞 मोबाईल नंबर २ (Secondary Phone)</label>
                <input
                  type="text"
                  value={siteForm.phone2 || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, phone2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">✉️ ईमेल पत्ता (Email)</label>
                <input
                  type="email"
                  value={siteForm.email || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">📍 पत्ता (Address)</label>
                <input
                  type="text"
                  value={siteForm.address || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">📢 महत्त्वाची जाहीर नोटीस (Announcement Notice)</label>
              <textarea
                value={siteForm.announcement || ""}
                onChange={(e) => setSiteForm({ ...siteForm, announcement: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-medium text-sm"
                placeholder="उदा. आनंदशाळेचे प्रवेश देणे सुरू आहे..."
              />
            </div>

            {/* ── ADDITIONAL CONTACTS SECTION ───────────────────────────── */}
            <div className="p-5 rounded-3xl bg-pink-50/50 border-2 border-pink-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="text-base font-black text-[#810B38] flex items-center gap-2">
                    <span>📇</span> अतिरिक्त संपर्क व्यक्ती व विभाग (Additional Contacts & Helplines)
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">विभाग / व्यवस्थापक / इमर्जन्सी संपर्क क्रमांक जोडा किंवा बदला.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddContactForm((v) => !v)}
                  className="px-4 py-2 rounded-2xl text-xs font-black bg-[#810B38] text-white hover:bg-[#68082c] cursor-pointer transition active:scale-95 shadow-sm"
                >
                  {showAddContactForm ? "✕ बंद करा" : "➕ नवीन संपर्क जोडा"}
                </button>
              </div>

              {/* Add New Contact Form */}
              {showAddContactForm && (
                <div className="p-4 rounded-2xl bg-white border-2 border-pink-300 space-y-3 shadow-inner">
                  <h5 className="text-xs font-black text-[#810B38]">➕ नवीन संपर्क माहिती प्रविष्ट करा:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">विभाग / पदनाम (Title/Dept) *</label>
                      <input
                        type="text"
                        value={newContact.title}
                        onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-xs bg-pink-50/30"
                        placeholder="उदा. चौकशी कक्ष / हेल्पलाईन / व्यवस्थापक"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">व्यक्तिचे नाव / उपशीर्षक (Name/Subtitle)</label>
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-xs bg-pink-50/30"
                        placeholder="उदा. श्री. सचिन पाटील (ऑफीस व्यवस्थापक)"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">मोबाईल नंबर (Phone) *</label>
                      <input
                        type="text"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-xs bg-pink-50/30 text-emerald-700"
                        placeholder="उदा. +91 98500 12345"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">ईमेल पत्ता (Email - optional)</label>
                      <input
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-xs bg-pink-50/30"
                        placeholder="उदा. info@aanadshala.org"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newContact.title.trim() || !newContact.phone.trim()) {
                          showToast("❌ विभाग नाव व मोबाईल नंबर आवश्यक आहे!");
                          return;
                        }
                        const itemToAdd = {
                          id: `cnt-${Date.now()}`,
                          title: newContact.title.trim(),
                          name: newContact.name.trim(),
                          phone: newContact.phone.trim(),
                          email: newContact.email.trim(),
                        };
                        const updatedList = [...(siteForm.contactsList || []), itemToAdd];
                        const updatedSiteForm = { ...siteForm, contactsList: updatedList };
                        setSiteForm(updatedSiteForm);
                        store.updateSiteData(updatedSiteForm);
                        store.syncAllToFirebaseCloud();
                        setNewContact({ title: "", name: "", phone: "", email: "" });
                        setShowAddContactForm(false);
                        showToast("✅ नवीन संपर्क जोडला व सेव्ह झाला!");
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-md active:scale-95"
                    >
                      ✅ जोडा (Add Contact)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddContactForm(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer active:scale-95"
                    >
                      रद्द करा
                    </button>
                  </div>
                </div>
              )}

              {/* Contact List Cards */}
              {(!siteForm.contactsList || siteForm.contactsList.length === 0) ? (
                <div className="py-6 text-center rounded-2xl border-2 border-dashed border-pink-200 bg-white text-slate-400 font-bold text-xs">
                  कोणताही अतिरिक्त संपर्क जोडलेला नाही. जोडण्यासाठी वरील "नवीन संपर्क जोडा" वापरा.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {siteForm.contactsList.map((cnt, idx) => (
                    <div key={cnt.id || idx} className="p-4 rounded-2xl bg-white border-2 border-pink-200 space-y-3 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-pink-100 text-[#810B38]">
                          📞 संपर्क #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("हा संपर्क डिलीट करायचा आहे?")) {
                              const updatedList = (siteForm.contactsList || []).filter((_, i) => i !== idx);
                              const updatedSiteForm = { ...siteForm, contactsList: updatedList };
                              setSiteForm(updatedSiteForm);
                              store.updateSiteData(updatedSiteForm);
                              store.syncAllToFirebaseCloud();
                              showToast("🗑️ संपर्क डिलीट झाला!");
                            }
                          }}
                          className="px-2 py-0.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-[10px] cursor-pointer"
                        >
                          🗑️ डिलीट
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">विभाग / पदनाम (Title)</label>
                          <input
                            type="text"
                            value={cnt.title || ""}
                            onChange={(e) => {
                              const updated = [...(siteForm.contactsList || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setSiteForm({ ...siteForm, contactsList: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">नाव / उपशीर्षक (Name)</label>
                          <input
                            type="text"
                            value={cnt.name || ""}
                            onChange={(e) => {
                              const updated = [...(siteForm.contactsList || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setSiteForm({ ...siteForm, contactsList: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-xs bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">फोन (Phone)</label>
                            <input
                              type="text"
                              value={cnt.phone || ""}
                              onChange={(e) => {
                                const updated = [...(siteForm.contactsList || [])];
                                updated[idx] = { ...updated[idx], phone: e.target.value };
                                setSiteForm({ ...siteForm, contactsList: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-white text-emerald-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-0.5">ईमेल (Email)</label>
                            <input
                              type="text"
                              value={cnt.email || ""}
                              onChange={(e) => {
                                const updated = [...(siteForm.contactsList || [])];
                                updated[idx] = { ...updated[idx], email: e.target.value };
                                setSiteForm({ ...siteForm, contactsList: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={saveSiteInfo}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer transition active:scale-95"
              >
                💾 सर्व संपर्क माहिती सेव्ह करा (Save Info)
              </button>
            </div>
          </div>
        )}

      </main>

      {/* INQUIRY DETAIL POP-UP MODAL WINDOW */}
      {selectedInquiryModal && (
        <div 
          className="fixed inset-0 z-[999999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedInquiryModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border-4 border-pink-200 text-slate-800 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedInquiryModal(null)}
              className="absolute top-4 right-4 size-9 rounded-full bg-pink-100 text-[#810B38] font-black flex items-center justify-center hover:bg-pink-200 transition cursor-pointer text-base"
              aria-label="Close"
            >
              ✕
            </button>

            {/* HEADER BADGE & TITLE */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-pink-100 text-[#810B38] border border-pink-200 shadow-sm">
                  {selectedInquiryModal.category === "sports" ? "🏋️‍♂️ स्पोर्ट्स क्लब ऑनलाईन चौकशी" : "🌸 प्रीतम आनंदशाळा चौकशी"}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  📅 तारीख: {selectedInquiryModal.date || "आजची नोंदणी"}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                👤 {selectedInquiryModal.name || "नाव दिलेले नाही"}
              </h3>
            </div>

            {/* DETAILS BOX */}
            <div className="space-y-4 bg-pink-50/60 p-5 rounded-2xl border border-pink-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm font-extrabold text-slate-700">
                  📞 संपर्क मोबाईल नंबर:
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${selectedInquiryModal.phone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                  >
                    📞 {selectedInquiryModal.phone}
                  </a>
                  <a 
                    href={`https://wa.me/91${selectedInquiryModal.phone}?text=${encodeURIComponent(`नमस्कार ${selectedInquiryModal.name || ''}, प्रीतम क्लबमधून संपर्क करत आहोत.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {selectedInquiryModal.email && (
                <div className="text-xs font-bold text-slate-600 flex items-center gap-2 pt-2 border-t border-pink-200/60">
                  <span>✉️ ईमेल आयडी:</span>
                  <span className="font-extrabold text-slate-900">{selectedInquiryModal.email}</span>
                </div>
              )}

              {selectedInquiryModal.subject && (
                <div className="text-xs font-bold text-slate-600 flex items-center gap-2 pt-2 border-t border-pink-200/60">
                  <span>🏷️ विषय / कॅटेगिरी:</span>
                  <span className="font-extrabold text-[#810B38] bg-pink-100/80 px-2.5 py-0.5 rounded-md border border-pink-200">
                    {selectedInquiryModal.subject}
                  </span>
                </div>
              )}

              {/* FULL MESSAGE BOX */}
              <div className="pt-2 border-t border-pink-200/60">
                <label className="block text-xs font-black text-[#810B38] mb-1.5 uppercase tracking-wide">
                  💬 ग्राहकाचा संपूर्ण संदेश व माहिती:
                </label>
                <div className="bg-white p-4 rounded-xl border border-pink-200 text-slate-800 font-bold text-sm leading-relaxed shadow-inner whitespace-pre-wrap">
                  {selectedInquiryModal.message || "कोणताही अतिरिक्त संदेश भरलेला नाही."}
                </div>
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  if (confirm("नक्की ही चौकशी डिलीट करायची?")) {
                    store.deleteInquiry(selectedInquiryModal.id);
                    setSelectedInquiryModal(null);
                    showToast("चौकशी डिलीट झाली!");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-xs transition cursor-pointer flex items-center gap-1.5 border border-rose-200"
              >
                🗑️ ही चौकशी डिलीट करा
              </button>

              <button
                onClick={() => setSelectedInquiryModal(null)}
                className="px-6 py-2.5 rounded-xl bg-[#810B38] hover:bg-pink-800 text-white font-black text-xs transition cursor-pointer shadow-md"
              >
                ✕ बंद करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
