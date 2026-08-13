import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdminStore, uploadImageToFirebase, BrochureItem } from "@/lib/admin-store";
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "@/firebase";

type TabKey =
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("inquiries");
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

  // Keep forms in sync with store when store loads
  useEffect(() => {
    setSiteForm(store.siteData);
    setAboutForm(store.aboutData);
    setScheduleForm(store.scheduleConfig);
    setSportsScheduleForm(store.sportsScheduleConfig);
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
      onSuccess(url);
      showToast("✅ फाईल / फोटो यशस्वीरित्या अपलोड झाला!");
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
            <p className="text-xs sm:text-sm font-bold text-pink-700 mt-1">अ‍ॅडमिन लॉगिन पॅनेल (Gulabi Theme)</p>
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
    { key: "contact", label: "संपर्क व माहिती", icon: "⚙️", count: null },
  ];

  return (
    <div className="min-h-screen bg-[#fdf7f9] font-sans flex flex-col md:flex-row">
      
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

      {/* ==================================================================== */}
      {/* LEFT SIDEBAR (PINK THEME GULABI SIDEBAR) */}
      {/* ==================================================================== */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-72 bg-gradient-to-b from-[#810B38] via-[#6b092b] to-[#4a061d] text-white flex flex-col shrink-0 sticky top-0 h-auto md:h-screen z-40 shadow-2xl p-4 sm:p-6 overflow-y-auto`}
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
            <p className="text-[11px] font-bold text-pink-200">अ‍ॅडमिन पॅनेल (Gulabi Theme)</p>
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
                  setActiveTab(item.key as TabKey);
                  setIsMobileMenuOpen(false);
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
      {/* MAIN RIGHT CONTENT AREA */}
      {/* ==================================================================== */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto overflow-y-auto space-y-6">
        
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

          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-pink-100 text-[#810B38] text-xs font-black border border-pink-200">
              🌸 गुलाबी थीम (Active)
            </span>
          </div>
        </div>

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
                        setScheduleForm({
                          ...scheduleForm,
                          posterUrl: url,
                          posterType: isPdf ? "pdf" : "image",
                        });
                      })
                    }
                  />
                </label>

                {scheduleForm.posterUrl && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-pink-200">
                    <span className="text-xs font-extrabold text-emerald-700">✅ पोस्टर अपलोड आहे</span>
                    <a href={scheduleForm.posterUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline font-bold">
                      पहा (View)
                    </a>
                    <button
                      onClick={() => setScheduleForm({ ...scheduleForm, posterUrl: "" })}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      हटवा
                    </button>
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
                        setSportsScheduleForm({
                          ...sportsScheduleForm,
                          posterUrl: url,
                          posterType: isPdf ? "pdf" : "image",
                        });
                      })
                    }
                  />
                </label>

                {sportsScheduleForm.posterUrl && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-indigo-200">
                    <span className="text-xs font-extrabold text-emerald-700">✅ पोस्टर अपलोड आहे</span>
                    <a href={sportsScheduleForm.posterUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline font-bold">
                      पहा (View)
                    </a>
                    <button
                      onClick={() => setSportsScheduleForm({ ...sportsScheduleForm, posterUrl: "" })}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      हटवा
                    </button>
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
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">ℹ️ आमच्याविषयी माहिती संपादन (About Us)</h3>
              <p className="text-xs text-slate-500 font-bold">प्रीतम आनंदशाळेचा प्रवास, संस्थापक कथा आणि फोटो संपादन.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">आनंदशाळा कथा १ (Story Paragraph 1)</label>
                <textarea
                  value={aboutForm.storyP1 || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyP1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">आनंदशाळा कथा २ (Story Paragraph 2)</label>
                <textarea
                  value={aboutForm.storyP2 || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyP2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">पुरस्कार व सन्मान (Award Notice)</label>
                <input
                  type="text"
                  value={aboutForm.awardNotice || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, awardNotice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                />
              </div>
            </div>

            {/* ABOUT PHOTOS SHOWCASE */}
            <div className="p-6 rounded-2xl bg-pink-50/70 border-2 border-pink-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h4 className="text-base font-black text-[#810B38]">🖼️ अबाउट फोटो संकुल (About Photos)</h4>
                <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#810B38] to-[#be185d] text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-2">
                  <span>➕ नवीन फोटो जोडा</span>
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
                      })
                    }
                  />
                </label>
              </div>

              {(!aboutForm.photos || aboutForm.photos.length === 0) ? (
                <div className="text-center py-6 text-slate-400 font-bold text-xs">
                  कोणतेही कस्टम अबाउट फोटो जोडलेले नाहीत.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {aboutForm.photos.map((imgUrl, idx) => (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border-2 border-pink-200 bg-white shadow-sm">
                      <img src={imgUrl} alt={`About ${idx}`} className="w-full h-28 object-cover" />
                      <button
                        onClick={() => {
                          if (confirm("नक्की हा अबाउट फोटो डिलीट करायचा?")) {
                            const updated = aboutForm.photos?.filter((_, i) => i !== idx);
                            setAboutForm({ ...aboutForm, photos: updated });
                            store.updateAboutData({ photos: updated });
                            store.syncAllToFirebaseCloud();
                            showToast("फोटो डिलीट झाला!");
                          }
                        }}
                        className="absolute top-2 right-2 bg-rose-600 text-white size-7 rounded-full text-xs font-black flex items-center justify-center shadow-md cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={saveAboutInfo}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer"
              >
                💾 आमच्याविषयी माहिती सेव्ह करा (Save About)
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
        {activeTab === "packages" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">🏷️ आनंदशाळा प्रवेश योजना व फी (Packages)</h3>
              <p className="text-xs text-slate-500 font-bold">मासिक फी, १ दिवस सहल पास आणि इतर योजनांचे दर संपादित करा.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.packages.map((pkg) => (
                <div key={pkg.id} className="p-5 rounded-2xl border-2 border-pink-200 bg-[#fffafd] space-y-3 relative shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-100 text-[#810B38]">{pkg.badge}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">योजनेचे नाव (Plan Name)</label>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => store.updatePackage(pkg.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">फी / किंमत (Price)</label>
                    <input
                      type="text"
                      value={pkg.price}
                      onChange={(e) => store.updatePackage(pkg.id, { price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 font-bold text-sm text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">थोडक्यात वर्णन (Subtitle)</label>
                    <input
                      type="text"
                      value={pkg.sub}
                      onChange={(e) => store.updatePackage(pkg.id, { sub: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 font-medium text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  store.syncAllToFirebaseCloud();
                  showToast("✅ सर्व योजनांचे दर सेव्ह झाले!");
                }}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer"
              >
                💾 सर्व योजना सेव्ह करा (Save Packages)
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PAGE 10: CONTACT & SITE INFO (संपर्क व मुख्य माहिती) */}
        {/* ==================================================================== */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-pink-100 space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="text-lg font-black text-[#810B38]">⚙️ संपर्क माहिती व फोन नंबर्स</h3>
              <p className="text-xs text-slate-500 font-bold">वेबसाईटवर दिसणारे मोबाईल नंबर, पत्ता व नोटीस संदेश येथे बदला.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">मोबाईल नंबर १ (Primary Phone)</label>
                <input
                  type="text"
                  value={siteForm.phone1 || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, phone1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">मोबाईल नंबर २ (Secondary Phone)</label>
                <input
                  type="text"
                  value={siteForm.phone2 || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, phone2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">ईमेल पत्ता (Email)</label>
                <input
                  type="email"
                  value={siteForm.email || ""}
                  onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">पत्ता (Address)</label>
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

            <div className="flex justify-end pt-2">
              <button
                onClick={saveSiteInfo}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg cursor-pointer"
              >
                💾 संपर्क माहिती सेव्ह करा (Save Info)
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
