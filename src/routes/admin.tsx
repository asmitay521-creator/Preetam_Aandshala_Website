import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdminStore, BrochureItem, PackageItem, uploadImageToFirebase } from "@/lib/admin-store";
import { auth, signInWithEmailAndPassword } from "@/firebase";

type TabKey =
  | "dashboard"
  | "home"
  | "about"
  | "schedule"
  | "sports-schedule"
  | "sports"
  | "packages"
  | "gallery"
  | "inquiries"
  | "brochure"
  | "testimonials";

const categoriesList = [
  "ज्येष्ठ नागरिक आनंदशाळा माहिती",
  "आनंदशाळा भूमिपूजन व बांधकाम",
  "ज्येष्ठ नागरिक आनंद सहल",
  "ज्येष्ठ नागरिक आनंद मेळावा",
  "ज्येष्ठ नागरिक विरंगुळा केंद्र",
  "सामाजिक कार्य माहिती",
  "प्रीतम व्यावसायिक माहिती",
  "रौप्य महोत्सव व प्रकाशन",
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("preetam_admin_auth") === "true";
  });
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = userInput.trim().toLowerCase().replace(/\s+/g, "");
    const cleanPass = passInput.trim();

    // 1. Default Admin Passcode / Quick Login
    if (
      (cleanUser === "admin123@gmail.com" || cleanUser === "admin123" || cleanUser === "admin") &&
      cleanPass === "admin123"
    ) {
      setIsLoggedIn(true);
      setLoginError("");
      localStorage.setItem("preetam_admin_auth", "true");
      return;
    }

    // 2. Firebase Auth Attempt
    try {
      await signInWithEmailAndPassword(auth, userInput.trim(), cleanPass);
      setIsLoggedIn(true);
      setLoginError("");
      localStorage.setItem("preetam_admin_auth", "true");
    } catch (err: any) {
      setLoginError("❌ युझरनेम (admin123@gmail.com) किंवा पासवर्ड (admin123) चुकीचा आहे!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("preetam_admin_auth");
  };

  const store = useAdminStore();

  // Firebase Syncing State
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [showRulesGuide, setShowRulesGuide] = useState(false);

  // Local Form States
  const [siteForm, setSiteForm] = useState(store.siteData);
  const [aboutForm, setAboutForm] = useState(store.aboutData);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "anandshala" | "sports">("all");
  const [sportsInquiryStatusFilter, setSportsInquiryStatusFilter] = useState<"all" | "unread" | "read">("all");

  // Schedule / Timetable Form State
  const [scheduleForm, setScheduleForm] = useState(store.scheduleConfig);
  const [newScheduleRule, setNewScheduleRule] = useState("");
  const [newScheduleRow, setNewScheduleRow] = useState({
    icon: "🧘‍♂️",
    time: "सकाळी ०५:३० ते ०६:१५",
    monMain: "योग व प्राणायाम",
    monSub: "आसने, प्राणायाम व हास्ययोग",
    tueMain: "योग व प्राणायाम",
    tueSub: "आसने, प्राणायाम व हास्ययोग",
    wedMain: "योग व प्राणायाम",
    wedSub: "आसने, प्राणायाम व हास्ययोग",
    thuMain: "योग व प्राणायाम",
    thuSub: "आसने, प्राणायाम व हास्ययोग",
    friMain: "योग व प्राणायाम",
    friSub: "आसने, प्राणायाम व हास्ययोग",
  });

  // Sports Schedule / Timetable Form State
  const [sportsScheduleForm, setSportsScheduleForm] = useState(store.sportsScheduleConfig);
  const [newSportsScheduleRule, setNewSportsScheduleRule] = useState("");
  const [newSportsScheduleRow, setNewSportsScheduleRow] = useState({
    icon: "🏋️‍♂️",
    time: "सकाळी ०६:०० ते ०७:००",
    monMain: "जिम & वेट ट्रेनिंग",
    monSub: "कार्डिओ व फिटनेस तालीम",
    tueMain: "जिम & वेट ट्रेनिंग",
    tueSub: "कार्डिओ व फिटनेस तालीम",
    wedMain: "जिम & वेट ट्रेनिंग",
    wedSub: "कार्डिओ व फिटनेस तालीम",
    thuMain: "जिम & वेट ट्रेनिंग",
    thuSub: "कार्डिओ व फिटनेस तालीम",
    friMain: "जिम & वेट ट्रेनिंग",
    friSub: "कार्डिओ व फिटनेस तालीम",
  });

  // About Highlight / New Feature Form State
  const [newHighlightObj, setNewHighlightObj] = useState({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
  });
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);

  // Home News Announcement Form State
  const [newNewsObj, setNewNewsObj] = useState({
    title: "",
    badge: "नवीन घोषणा",
    description: "",
    imageUrl: "",
    linkUrl: "",
  });

  // Brochure Form State
  const [newBrochureObj, setNewBrochureObj] = useState({
    title: "",
    category: "आनंदशाळा ब्रॉशर",
    fileUrl: "",
    fileType: "image" as "pdf" | "image",
    description: "",
  });

  // Gallery Form State
  const [newImageObj, setNewImageObj] = useState({
    url: "",
    caption: "",
    category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती"],
  });

  // Video Testimonial Form State
  const [newVideoTestObj, setNewVideoTestObj] = useState({
    name: "",
    role: "",
    text: "",
    videoUrl: "",
    videoThumbnail: "",
    rating: 5,
    approved: true,
  });

  // Package Form State
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgPeriodFilter, setPkgPeriodFilter] = useState<"all" | "days" | "month" | "year">("all");
  const [pkgForm, setPkgForm] = useState({
    title: "",
    price: "",
    sub: "",
    badge: "",
    periodType: "month" as "days" | "month" | "year",
    featuresText: "",
    featured: false,
  });

  // Sports Package Form State
  const [showSportsPkgModal, setShowSportsPkgModal] = useState(false);
  const [editingSportsPkgId, setEditingSportsPkgId] = useState<string | null>(null);
  const [sportsPkgFormState, setSportsPkgFormState] = useState({
    title: "",
    price: "",
    subtitle: "",
    featuresText: "",
  });

  // Sports Facility Form State & Photo Lightbox Preview State
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState<string>("all");
  const [showSportsFacilityModal, setShowSportsFacilityModal] = useState(false);
  const [editingSportsFacilityId, setEditingSportsFacilityId] = useState<string | null>(null);
  const [sportsFacilityFormState, setSportsFacilityFormState] = useState({
    title: "",
    description: "",
    icon: "🏊",
    imageUrl: "",
  });


  const handleSiteSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSiteData(siteForm);
    setSaveSuccessMsg("✅ फोटो आणि माहिती यशस्वीरित्या सेव्ह झाली! (Successfully Uploaded & Saved)");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleAddHomeNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsObj.title || !newNewsObj.description) return;
    store.addHomeNews(newNewsObj);
    setNewNewsObj({ title: "", badge: "नवीन घोषणा", description: "", imageUrl: "", linkUrl: "" });
    setSaveSuccessMsg("मुख्यपृष्ठावर नवीन बातमी/माहिती यशस्वीरित्या समाविष्ट केली!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAddBrochure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrochureObj.title || !newBrochureObj.fileUrl) return;
    store.addBrochure(newBrochureObj);
    setNewBrochureObj({ title: "", category: "आनंदशाळा ब्रॉशर", fileUrl: "", fileType: "image", description: "" });
    setSaveSuccessMsg("नवीन माहिती पत्रक (Brochure) यशस्वीरित्या अपलोड झाले!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAboutSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateAboutData(aboutForm);
    setSaveSuccessMsg("आमच्याविषयी माहिती यशस्वीरित्या सेव्ह झाली!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleSaveAboutHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlightObj.title || !newHighlightObj.description) return;

    const currentHighlights = aboutForm.highlights || [];

    if (editingHighlightId) {
      const updated = currentHighlights.map((h) =>
        h.id === editingHighlightId ? { ...h, ...newHighlightObj } : h
      );
      const newAbout = { ...aboutForm, highlights: updated };
      setAboutForm(newAbout);
      store.updateAboutData(newAbout);
      setEditingHighlightId(null);
      setSaveSuccessMsg("माहिती अपडेट झाली!");
    } else {
      const newItem = {
        id: "abh-" + Date.now(),
        ...newHighlightObj,
      };
      const newAbout = { ...aboutForm, highlights: [...currentHighlights, newItem] };
      setAboutForm(newAbout);
      store.updateAboutData(newAbout);
      setSaveSuccessMsg("नवीन माहिती यशस्वीरित्या जोडली गेली!");
    }

    setNewHighlightObj({ title: "", description: "", imageUrl: "", date: "" });
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleEditAboutHighlight = (item: any) => {
    setEditingHighlightId(item.id);
    setNewHighlightObj({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || "",
      date: item.date || "",
    });
  };

  const handleDeleteAboutHighlight = (id: string) => {
    const currentHighlights = aboutForm.highlights || [];
    const updated = currentHighlights.filter((h) => h.id !== id);
    const newAbout = { ...aboutForm, highlights: updated };
    store.updateAboutData(newAbout);
    setSaveSuccessMsg("माहिती डिलीट केली!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleDeleteAboutPhoto = (idx: number) => {
    const currentPhotos = aboutForm.photos || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== idx);
    const newAbout = { ...aboutForm, photos: updatedPhotos };
    setAboutForm(newAbout);
    store.updateAboutData(newAbout);
    setSaveSuccessMsg("फोटो डिलीट केला!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageObj.url || !newImageObj.caption) return;
    store.addGalleryItem(newImageObj);
    setNewImageObj({ url: "", caption: "", category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती"] });
    setSaveSuccessMsg("नवीन छायाचित्र गॅलरीमध्ये जोडले गेले!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  // Helper for computer file upload (single file with Firebase Storage upload)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string, fileType: "pdf" | "image") => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.type.includes("pdf");
    try {
      const firebaseUrl = await uploadImageToFirebase(file, isPdf ? "brochures" : "photos");
      callback(firebaseUrl, isPdf ? "pdf" : "image");
    } catch (err) {
      console.warn("Fallback upload:", err);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const rawUrl = (ev.target?.result as string) || URL.createObjectURL(file);
        const finalUrl = isPdf ? rawUrl : await compressImage(rawUrl);
        callback(finalUrl, isPdf ? "pdf" : "image");
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };

  // Helper for multiple computer file upload (with Firebase Storage upload)
  const handleMultipleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (urls: string[]) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    try {
      const uploadPromises = fileArray.map((file) => uploadImageToFirebase(file, "photos"));
      const uploadedUrls = await Promise.all(uploadPromises);
      callback(uploadedUrls);
    } catch (err) {
      console.warn("Fallback batch upload:", err);
      const readPromises = fileArray.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = async (ev) => {
              const rawUrl = (ev.target?.result as string) || URL.createObjectURL(file);
              const compressed = await compressImage(rawUrl);
              resolve(compressed);
            };
            reader.onerror = () => {
              resolve(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
          })
      );
      const compressedUrls = await Promise.all(readPromises);
      callback(compressedUrls);
    }
    if (e.target) e.target.value = "";
  };

  const handleAddVideoTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTestObj.name || (!newVideoTestObj.videoUrl && !newVideoTestObj.videoThumbnail)) return;
    store.addTestimonial(newVideoTestObj);
    setNewVideoTestObj({ name: "", role: "", text: "", videoUrl: "", videoThumbnail: "", rating: 5, approved: true });
    setSaveSuccessMsg("नवीन व्हिडिओ अभिप्राय यशस्वीरित्या समाविष्ट झाला!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  // Sync siteForm with live store.siteData updates
  useEffect(() => {
    setSiteForm(store.siteData);
  }, [JSON.stringify(store.siteData)]);

  // Image compression helper (resizes large camera photos to tiny footprint for instant localStorage saving)
  const compressImage = (dataUrl: string, maxWidth = 900, maxHeight = 900, quality = 0.65): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith("data:image")) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#4A0720] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* BACKGROUND DECORATION BLOBS WITH BRAND COLORS */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#810B38]/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-[#f472b6]/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#B8860B]/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-up space-y-6">
          {/* BRAND LOGO HEADER */}
          <div className="text-center space-y-2">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-[#810B38] to-[#68092D] border border-amber-300/40 grid place-items-center text-3xl mx-auto shadow-xl text-white">
              🏛️
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#810B38]/10 text-[#810B38] text-[11px] font-black tracking-wider uppercase border border-[#810B38]/20 mb-1">
                🌸 प्रीतम ज्येष्ठ नागरिक आनंदशाळा सांगली
              </span>
              <h1 className="font-display text-2xl font-black text-[#810B38]">
                प्रशासकीय लॉगिन (Admin Console)
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                वेबसाइट व्यवस्थापनासाठी अधिकृत युझरनेम व पासवर्ड टाका.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            {/* USERNAME / EMAIL INPUT */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>📧 युझरनेम / ई-मेल (Username / Email)</span>
                <span className="text-[10px] text-[#810B38] font-bold">admin 123@gmail.com</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin 123@gmail.com"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:bg-white shadow-xs transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  👤
                </span>
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>🔑 पासवर्ड (Password)</span>
                <span className="text-[10px] text-[#810B38] font-bold">admin123</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:bg-white shadow-xs transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  🔒
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {showPassword ? "🙈 लपवा" : "👁️ पहा"}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#810B38] to-[#68092D] hover:from-[#68092D] hover:to-[#500622] text-white font-extrabold text-sm hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-[#810B38]/30 flex items-center justify-center gap-2"
            >
              <span>🔐</span>
              <span>ॲडमिन पॅनेलमध्ये लॉगिन करा (Login)</span>
            </button>
          </form>

          {/* BACK TO MAIN WEBSITE LINK */}
          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#810B38] font-extrabold transition-colors"
            >
              <span>← मुख्य वेबसाईटवर परत जा</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredPackages = store.packages.filter((p) => {
    if (pkgPeriodFilter === "all") return true;
    return p.periodType === pkgPeriodFilter;
  });

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F1F5F9] text-slate-800 font-sans flex flex-col md:flex-row">
      {/* 100% PERMANENT FIXED SIDEBAR */}
      <aside className="w-full md:w-80 h-full bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0 shadow-sm z-30 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
          {/* BRAND HEADER */}
          <div className="shrink-0 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#810B38]/5 to-pink-50 border border-[#810B38]/20">
            <div className="size-11 rounded-xl bg-gradient-to-br from-[#810B38] to-[#68092D] text-amber-300 grid place-items-center text-xl font-bold shadow shrink-0">
              🏛️
            </div>
            <div>
              <h2 className="font-display text-base font-black text-[#810B38] tracking-tight leading-tight">
                प्रीतम आनंदशाळा
              </h2>
              <span className="inline-block rounded-md bg-[#810B38]/10 px-2 py-0.5 text-[10px] font-black text-[#810B38] tracking-wider uppercase border border-[#810B38]/20 mt-0.5">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200 shrink-0" />

          {/* SIDEBAR MENU BUTTONS (INTERNAL SCROLL WITH CLEAN BOTTOM GAP) */}
          <nav className="flex-1 overflow-y-auto pr-1.5 pb-8 mb-2 space-y-1.5">
            {[
              { id: "dashboard", icon: "📱", en: "Dashboard Overview", mr: "मुख्य डॅशबोर्ड" },
              { id: "home", icon: "🏠", en: "Home Page Manager", mr: "होम पेज माहिती व फोटो" },
              { id: "about", icon: "ℹ️", en: "About Us Manager", mr: "आमच्याविषयी माहिती" },
              { id: "schedule", icon: "🌸", en: "Anandshala Timetable", mr: "आनंदशाळा वेळापत्रक" },
              { id: "sports-schedule", icon: "🏋️‍♂️", en: "Sports Club Timetable", mr: "स्पोर्ट्स क्लब वेळापत्रक" },
              { id: "packages", icon: "📦", en: "Packages (Days/Month/Year)", mr: "प्रवेश योजना (पॅकेजेस)", count: store.packages.length },
              { id: "gallery", icon: "🖼️", en: "Gallery Manager", mr: "फोटो गॅलरी मॅनेजर", count: store.gallery.length },
              { id: "inquiries", icon: "✉️", en: "Inquiries & Messages", mr: "चौकशी संदेश", count: store.unreadInquiriesCount, highlightCount: true },
              { id: "brochure", icon: "📖", en: "Brochure Upload", mr: "माहिती पत्रक / ब्रोशर", count: store.brochures.length },
              { id: "testimonials", icon: "🎬", en: "Video Testimonials", mr: "व्हिडिओ अभिप्राय", count: store.testimonials.length },
              { id: "sports", icon: "🏋️‍♂️", en: "Sports Club Manager", mr: "प्रीतम स्पोर्ट्स क्लब मॅनेजर" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#810B38] to-[#68092D] text-white shadow-md scale-[1.01]"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-base">{tab.icon}</span>
                    <div className="leading-tight">
                      <span className="block">{tab.mr}</span>
                      <span className={`text-[10px] font-semibold block ${active ? "text-amber-200" : "text-slate-400"}`}>
                        {tab.en}
                      </span>
                    </div>
                  </div>

                  {tab.count !== undefined && (
                    <span
                      className={`grid size-6 place-items-center rounded-full text-xs font-black ${
                        active
                          ? "bg-amber-400 text-slate-900 shadow-xs"
                          : tab.highlightCount && tab.count > 0
                          ? "bg-emerald-600 text-white animate-pulse"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PERMANENTLY DOCKED BOTTOM BUTTONS */}
        <div className="pt-4 border-t border-slate-200 space-y-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-extrabold text-xs hover:bg-slate-200 transition-colors"
          >
            <span>🌐</span>
            <span>मुख्य वेबसाईट पहा (View Site)</span>
          </Link>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 font-extrabold text-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>लॉगआउट (Logout)</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA - INDEPENDENT SCROLLING */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-10 bg-[#F8FAFC]">
        {/* FIXED FLOATING TOAST NOTIFICATION (ALWAYS 100% VISIBLE AT TOP RIGHT REGARDLESS OF SCROLL) */}
        {saveSuccessMsg && (
          <div className="fixed top-6 right-6 z-[999999] max-w-md bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black text-sm px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/30 flex items-center gap-3 animate-fade-down shadow-emerald-900/30">
            <div className="size-9 rounded-full bg-white text-emerald-700 flex items-center justify-center text-xl font-black shrink-0 shadow-md">
              ✓
            </div>
            <div>
              <div className="text-[11px] text-emerald-200 font-extrabold uppercase tracking-wider">SUCCESSFULLY UPLOADED & SAVED</div>
              <div className="text-sm font-black text-white leading-snug drop-shadow-sm">{saveSuccessMsg}</div>
            </div>
          </div>
        )}

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 tracking-tight">
                Dashboard Overview (मुख्य डॅशबोर्ड)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                प्रीतम आनंदशाळा व स्पोर्ट्स क्लब अॅडमिन डॅशबोर्ड - सर्व माहिती संपादन व अपडेट्स.
              </p>
            </div>

            {/* FIREBASE CLOUD DATABASE SYNC BANNER */}
            <div className="bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border-2 border-amber-400/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white grid place-items-center text-2xl font-bold shadow-md shrink-0">
                  🔥
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>Firebase Cloud Database & Storage Sync</span>
                    <button
                      onClick={() => setShowRulesGuide(true)}
                      className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold hover:bg-amber-300 transition-colors"
                    >
                      ❓ नाविन्यपूर्ण नियम मदत
                    </button>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    सर्व फोटो, माहिती व ब्रोशर्स थेट Firebase क्लाऊड डेटाबेसमध्ये (Cloud Firestore & Storage) सेव्ह व सिंक करा.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={isSyncingFirebase}
                  onClick={async () => {
                    setIsSyncingFirebase(true);
                    try {
                      await store.syncAllToFirebaseCloud();
                      setSaveSuccessMsg("🔥 सर्व डेटा व फोटो यशस्वीरित्या Firebase Cloud मधील Collections मध्ये सेव्ह झाले!");
                      setTimeout(() => setSaveSuccessMsg(""), 5000);
                    } catch (err: any) {
                      setShowRulesGuide(true);
                    } finally {
                      setIsSyncingFirebase(false);
                    }
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-pink-600 text-white font-black text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSyncingFirebase ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Firebase मधील डेटा सेव्ह होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>सर्व फोटो व माहिती Firebase Cloud वर सेव्ह करा</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* FIREBASE RULES MODAL */}
            {showRulesGuide && (
              <div className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>🔥</span>
                      <span>Firebase Rules ऑन करण्याची सोपी पद्धत</span>
                    </h3>
                    <button
                      onClick={() => setShowRulesGuide(false)}
                      className="size-8 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 grid place-items-center"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-xs font-medium text-slate-700">
                    <p className="font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      ⚠️ Firebase Console मधील Security Rules बाय-डिफॉल्ट डेटा सेव्ह करणे ब्लॉक ठेवतात. खालील २ पायऱ्या पूर्ण करा:
                    </p>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <strong className="text-slate-900 text-sm block">1️⃣ Cloud Firestore Rules (तुम्ही ओपन केलेल्या स्क्रीनसाठी):</strong>
                      <p>Firestore Rules मधील सर्व कोड काढून हा संपूर्ण कोड पेस्ट करा (service cloud.firestore आवश्यक आहे):</p>
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[11px] overflow-x-auto font-mono">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                      </pre>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <strong className="text-slate-900 text-sm block">2️⃣ Storage Rules (फोटोंच्या सेव्हिंगसाठी):</strong>
                      <p>डाव्या बाजूच्या Storage मेनू ➔ Rules मध्ये हा संपूर्ण कोड पेस्ट करा:</p>
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[11px] overflow-x-auto font-mono">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRulesGuide(false)}
                    className="w-full py-3 rounded-xl bg-[#810B38] text-white font-bold text-sm hover:bg-[#68092D] transition-colors"
                  >
                    समजले! मी Rules बदलून Publish करतो 👍
                  </button>
                </div>
              </div>
            )}

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-wider font-extrabold text-slate-500">चौकशी संदेश</p>
                <p className="font-display text-4xl font-black text-[#f472b6] mt-2">{store.inquiries.length}</p>
                <p className="text-xs text-emerald-600 mt-1 font-bold">✓ {store.unreadInquiriesCount} नवीन अवाचित संदेश</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-wider font-extrabold text-slate-500">गॅलरी फोटो</p>
                <p className="font-display text-4xl font-black text-sky-600 mt-2">{store.gallery.length}</p>
                <p className="text-xs text-slate-500 mt-1 font-semibold">८ श्रेणींमध्ये वर्गीकृत</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-wider font-extrabold text-slate-500">अपलोड केलेले ब्रोशर्स</p>
                <p className="font-display text-4xl font-black text-amber-600 mt-2">{store.brochures.length}</p>
                <p className="text-xs text-amber-600 mt-1 font-bold">PDF व इमेज माहिती पत्रके</p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-wider font-extrabold text-slate-500">प्रवेश योजना (Packages)</p>
                <p className="font-display text-4xl font-black text-emerald-600 mt-2">{store.packages.length}</p>
                <p className="text-xs text-slate-600 mt-1 font-bold">Days, Month & Year wise</p>
              </div>
            </div>

            {/* RECENT INQUIRIES */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-display text-lg font-black text-slate-900">
                  अलीकडील चौकशी संदेश (Recent Inquiries)
                </h3>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="text-xs font-extrabold text-[#f472b6] hover:underline cursor-pointer"
                >
                  सर्व संदेश पहा →
                </button>
              </div>

              <div className="space-y-3">
                {store.inquiries.slice(0, 4).map((inq) => (
                  <div key={inq.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{inq.name} ({inq.phone})</p>
                      <p className="text-xs text-[#f472b6] font-extrabold mt-0.5">{inq.subject}</p>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">{inq.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-bold shrink-0">{inq.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. HOME PAGE MANAGER WITH DIRECT EDIT / UPDATE / UPLOAD / DELETE FOR ALL HOME SECTIONS */}
        {activeTab === "home" && (
          <div className="space-y-8 animate-fade-up max-w-5xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900">
                Home Page Manager (मुख्यपृष्ठ संपादन व फोटो व्यवस्थापन)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                मुख्यपृष्ठावरील इंत्रो पोस्टर, आनंदशाळा कार्ड, स्पोर्ट्स क्लब कार्ड व माहिती थेट संपादित, अपलोड व डिलीट करा.
              </p>
            </div>

            {/* SECTION 1: INTRO WELCOME POSTER MANAGEMENT */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
                <div>
                  <h3 className="font-display text-lg font-black text-[#810B38] flex items-center gap-2">
                    <span>🖼️</span>
                    <span>१. इंत्रो पोस्टर व मुख्य वेलकम बॅनर (Intro Welcome Poster)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    वेबसाईट उघडल्यावर दिसणारे वेलकम पोस्टर बदलण्यासाठी किंवा पूर्णपणे बंद करून काढून टाकण्यासाठी.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-extrabold text-slate-700 cursor-pointer flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={siteForm.showWelcomePoster !== false}
                      onChange={(e) => {
                        const updated = { ...siteForm, showWelcomePoster: e.target.checked };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg(e.target.checked ? "इंत्रो पोस्टर सुरू केले!" : "इंत्रो पोस्टर बंद केले!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="size-4 rounded text-[#810B38] focus:ring-[#810B38] cursor-pointer"
                    />
                    <span>इंत्रो पोस्टर ऑन ठेवा</span>
                  </label>

                  {siteForm.showWelcomePoster !== false ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("नक्की हा इंत्रो पोस्टर सेक्शन पूर्णपणे काढून टाकायचा / बंद करायचा?")) {
                          const updated = { ...siteForm, showWelcomePoster: false };
                          setSiteForm(updated);
                          store.updateSiteData(updated);
                          setSaveSuccessMsg("इंत्रो पोस्टर सेक्शन पूर्णपणे बंद करून काढून टाकला!");
                          setTimeout(() => setSaveSuccessMsg(""), 3000);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-700 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🗑️</span>
                      <span>सेक्शन काढून टाका (Remove Section)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...siteForm, showWelcomePoster: true };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg("इंत्रो पोस्टर सेक्शन पुन्हा चालू केला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>➕</span>
                      <span>सेक्शन पुन्हा चालू करा (Enable Section)</span>
                    </button>
                  )}
                </div>
              </div>

              {siteForm.showWelcomePoster === false ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                    <span>🚫</span>
                    <span>हा इंत्रो पोस्टर सेक्शन बंद व काढून टाकलेला आहे. (Intro Poster Disabled & Removed)</span>
                  </div>
                  <p className="text-xs font-semibold text-amber-800">
                    वेबसाईट उघडल्यावर आता ग्राहकांना हा इंत्रो पोस्टर पॉपअप दिसणार नाही. पुन्हा चालू करण्यासाठी वरील "सेक्शन पुन्हा चालू करा" बटणावर क्लिक करा.
                  </p>
                </div>
              ) : (
                /* POSTER PREVIEW & UPLOAD */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative rounded-2xl bg-slate-900 border border-slate-300 p-2 overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[220px]">
                    <p className="text-[11px] font-bold text-slate-400 mb-2">👁️ सध्याचा इंत्रो फोटो (Current Intro Poster)</p>
                    <img
                      src={siteForm.welcomePosterUrl || "/images/preetam-welcome.png"}
                      alt="Intro Poster Preview"
                      className="max-h-48 w-auto object-contain rounded-xl shadow-md border border-white/20"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        📤 नवीन इंत्रो पोस्टर फोटो अपलोड करा (Upload Computer Photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => {
                            const updated = { ...siteForm, welcomePosterUrl: url };
                            setSiteForm(updated);
                            store.updateSiteData(updated);
                            setSaveSuccessMsg("नवीन इंत्रो पोस्टर फोटो यशस्वीरित्या सेव्ह झाला!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-[#810B38] file:text-white hover:file:bg-[#68092D]"
                      />
                      <p className="text-[11px] text-slate-500 font-medium">
                        टीप: कॉम्प्युटरवरून फोटो निवडताच तो थेट इंत्रो स्क्रीनवर अपडेट होईल.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...siteForm, welcomePosterUrl: "/images/preetam-welcome.png" };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg("मूळ पोस्‍टरवर रीसेट केले!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      🔄 मूळ इंत्रो फोटोवर रीसेट करा (Reset to Default)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: SECTION 1 CARD - PREETAM AANANDSHALA */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-black text-pink-700 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>२. प्रकल्प १: प्रीतम आनंदशाळा कार्ड (Section 1 Card & Photos)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  मुख्यपृष्ठावरील आनंदशाळा कार्डचे नाव, माहिती व बॅकग्राउंड स्लायडर फोटो संपादन.
                </p>
              </div>

              {/* CARD INFO EDIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    प्रकल्पाचे नाव (Title)
                  </label>
                  <input
                    type="text"
                    value={siteForm.aanandshalaTitle || "प्रीतम ज्येष्ठ नागरिक आनंदशाळा व निवारा"}
                    onChange={(e) => setSiteForm({ ...siteForm, aanandshalaTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    टॅगलाईन / बॅज (Badge)
                  </label>
                  <input
                    type="text"
                    value={siteForm.aanandshalaBadge || "भारतातील पहिली ज्येष्ठ नागरिक आनंदशाळा"}
                    onChange={(e) => setSiteForm({ ...siteForm, aanandshalaBadge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  थोडक्यात वर्णन (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={siteForm.anandshalaDesc}
                  onChange={(e) => setSiteForm({ ...siteForm, anandshalaDesc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                />
              </div>

              {/* SLIDER PHOTOS MANAGER */}
              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-pink-900">
                      🖼️ आनंदशाळा कार्ड स्लायडर फोटो (Slider Photos)
                    </h4>
                    <p className="text-[11px] text-pink-700 font-semibold mt-0.5">
                      कॉम्प्युटरवरून एक किंवा अनेक फोटो निवडा. निवडलेले सर्व फोटो लगेच स्लायडरमध्ये दिसतील.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-transform hover:scale-105">
                    <span>➕ नवीन स्लायडर फोटो जोडा (Multiple)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMultipleFileUpload(e, (urls) => {
                          const currentImgs = siteForm.aanandshalaImages || [];
                          // Filter out default static fallback images if user uploads custom photos
                          const userOnlyImgs = currentImgs.filter(img => !img.startsWith("/images/Screenshot") && !img.startsWith("/images/anandashram") && !img.startsWith("/images/aandshala_img"));
                          const updatedImgs = [...urls, ...userOnlyImgs];
                          const updated = { ...siteForm, aanandshalaImages: updatedImgs };
                          setSiteForm(updated);
                          store.updateSiteData(updated);
                          setSaveSuccessMsg(`✅ ${urls.length} नवीन फोटो आनंदशाळा कार्ड स्लायडरमध्ये जोडले गेले!`);
                          setTimeout(() => setSaveSuccessMsg(""), 3500);
                        })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(siteForm.aanandshalaImages || [
                    "/images/anandashram_building_card.png",
                    "/images/aandshala_img.png",
                    "/images/Screenshot 2026-07-31 103107.png"
                  ]).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-pink-200 bg-white shadow-md transition-all hover:border-pink-500">
                      <span className="absolute top-1 left-1 z-10 bg-black/60 text-white font-black text-[10px] px-2 py-0.5 rounded-md backdrop-blur">
                        #{idx + 1}
                      </span>
                      <img src={imgUrl} alt={`Slider ${idx}`} className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = siteForm.aanandshalaImages || [
                            "/images/anandashram_building_card.png",
                            "/images/aandshala_img.png",
                            "/images/Screenshot 2026-07-31 103107.png"
                          ];
                          const updatedImgs = currentImgs.filter((_, i) => i !== idx);
                          const updated = { ...siteForm, aanandshalaImages: updatedImgs };
                          setSiteForm(updated);
                          store.updateSiteData(updated);
                          setSaveSuccessMsg("फोटो स्लायडरमधून काढून टाकला!");
                          setTimeout(() => setSaveSuccessMsg(""), 3000);
                        }}
                        className="absolute top-1 right-1 px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-extrabold text-[10px] shadow hover:bg-red-700 cursor-pointer z-10 backdrop-blur"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSiteSave}
                className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 font-extrabold text-white text-xs hover:scale-105 transition-all cursor-pointer shadow-md"
              >
                💾 आनंदशाळा कार्ड माहिती सेव्ह करा
              </button>
            </div>

            {/* SECTION 3: SECTION 2 CARD - PREETAM SPORTS & FITNESS CLUB */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-black text-purple-700 flex items-center gap-2">
                  <span>🏋️‍♂️</span>
                  <span>३. प्रकल्प २: प्रीतम स्पोर्ट्स अँड फिटनेस क्लब कार्ड (Section 2 Card & Photos)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  मुख्यपृष्ठावरील स्पोर्ट्स क्लब कार्डचे नाव, माहिती व बॅकग्राउंड स्लायडर फोटो संपादन.
                </p>
              </div>

              {/* CARD INFO EDIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    प्रकल्पाचे नाव (Title)
                  </label>
                  <input
                    type="text"
                    value={siteForm.sportsTitle || "प्रीतम स्पोर्ट्स अँड फिटनेस क्लब"}
                    onChange={(e) => setSiteForm({ ...siteForm, sportsTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    टॅगलाईन / बॅज (Badge)
                  </label>
                  <input
                    type="text"
                    value={siteForm.sportsBadge || "अद्ययावत १.५ एकर स्पोर्ट्स संकुल"}
                    onChange={(e) => setSiteForm({ ...siteForm, sportsBadge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  थोडक्यात वर्णन (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={siteForm.sportsDesc}
                  onChange={(e) => setSiteForm({ ...siteForm, sportsDesc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                />
              </div>

              {/* SLIDER PHOTOS MANAGER */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-900">
                      🖼️ स्पोर्ट्स क्लब कार्ड स्लायडर फोटो (Slider Photos)
                    </h4>
                    <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
                      कॉम्प्युटरवरून एक किंवा अनेक फोटो निवडा. निवडलेले सर्व फोटो लगेच स्लायडरमध्ये दिसतील.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-transform hover:scale-105">
                    <span>➕ नवीन स्लायडर फोटो जोडा (Multiple)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleMultipleFileUpload(e, (urls) => {
                          const currentImgs = siteForm.sportsImages || [];
                          // Filter out default static fallback images if user uploads custom photos
                          const userOnlyImgs = currentImgs.filter(img => !img.startsWith("/images/Screenshot") && !img.startsWith("/images/sports_club_building") && !img.startsWith("/images/epic_sports") && !img.startsWith("/images/pickleball"));
                          const updatedImgs = [...urls, ...userOnlyImgs];
                          const updated = { ...siteForm, sportsImages: updatedImgs };
                          setSiteForm(updated);
                          store.updateSiteData(updated);
                          setSaveSuccessMsg(`✅ ${urls.length} नवीन फोटो स्पोर्ट्स क्लब कार्ड स्लायडरमध्ये जोडले गेले!`);
                          setTimeout(() => setSaveSuccessMsg(""), 3500);
                        })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(siteForm.sportsImages || [
                    "/images/sports_club_building_card.png",
                    "/images/epic_sports_gym_bg.png",
                    "/images/pickleball-court.png"
                  ]).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border-2 border-purple-200 bg-white shadow-md transition-all hover:border-purple-500">
                      <span className="absolute top-1 left-1 z-10 bg-black/60 text-white font-black text-[10px] px-2 py-0.5 rounded-md backdrop-blur">
                        #{idx + 1}
                      </span>
                      <img src={imgUrl} alt={`Sports Slider ${idx}`} className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = siteForm.sportsImages || [
                            "/images/sports_club_building_card.png",
                            "/images/epic_sports_gym_bg.png",
                            "/images/pickleball-court.png"
                          ];
                          const updatedImgs = currentImgs.filter((_, i) => i !== idx);
                          const updated = { ...siteForm, sportsImages: updatedImgs };
                          setSiteForm(updated);
                          store.updateSiteData(updated);
                          setSaveSuccessMsg("फोटो स्लायडरमधून काढून टाकला!");
                          setTimeout(() => setSaveSuccessMsg(""), 3000);
                        }}
                        className="absolute top-1 right-1 px-2.5 py-1 rounded-lg bg-red-600/90 text-white font-extrabold text-[10px] shadow hover:bg-red-700 cursor-pointer z-10 backdrop-blur"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSiteSave}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-extrabold text-white text-xs hover:scale-105 transition-all cursor-pointer shadow-md"
              >
                💾 स्पोर्ट्स क्लब माहिती सेव्ह करा
              </button>
            </div>




          </div>
        )}

        {/* 3. ABOUT US UNIFIED MANAGER (THITHER ALL EDIT, UPDATE, UPLOAD, DELETE & ADD NEW OPTIONS IN ONE CLEAN SECTION) */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-fade-up max-w-5xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900">
                About Us Manager (आमच्याविषयी माहिती व फोटो व्यवस्थापन)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                'आमच्याविषयी' पेजबद्दलची कहाणी, परिच्छेद व फोटो याच विभागात थेट एडिट करा, कॉम्प्युटरवरून फोटो अपलोड करा, अपडेट करा किंवा नवीन परिच्छेद जोडा व डिलीट करा.
              </p>
            </div>

            {/* UNIFIED SINGLE CARD - EVERYTHING RIGHT IN THIS SECTION */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <h3 className="font-display text-lg font-black text-[#810B38] flex items-center gap-2">
                  <span>📜</span>
                  <span>कहाणी परिच्छेद व फोटो व्यवस्थापन (Story Paragraphs & Photos)</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    const currentParas = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                      ? aboutForm.paragraphs
                      : [
                          {
                            id: "p1",
                            label: "कहाणी परिच्छेद १ (STORY PARAGRAPH 1)",
                            text: aboutForm.storyP1 || "माझ्या जन्माची बीजे रुजली ती श्री. अभिनय जगन्नाथ कामाजी...",
                            imageUrl: (aboutForm.photos && aboutForm.photos[0]) || "/images/Screenshot 2026-07-31 103107.png",
                          },
                          {
                            id: "p2",
                            label: "कहाणी परिच्छेद २ (STORY PARAGRAPH 2)",
                            text: aboutForm.storyP2 || "माणूस हा एकत्र राहणारा, बोलणारा...",
                            imageUrl: (aboutForm.photos && aboutForm.photos[1]) || "/images/Screenshot 2026-07-31 103152.png",
                          },
                          {
                            id: "p3",
                            label: "कहाणी परिच्छेद ३ (STORY PARAGRAPH 3)",
                            text: aboutForm.storyP3 || "सांगली शहरातील दीड एकर जागेत...",
                            imageUrl: (aboutForm.photos && aboutForm.photos[2]) || "/images/aandshala sahal 1.jpeg",
                          },
                        ];

                    const newId = "p-" + Date.now();
                    const updated = [
                      ...currentParas,
                      {
                        id: newId,
                        label: `कहाणी परिच्छेद ${currentParas.length + 1}`,
                        text: "",
                        imageUrl: "",
                      },
                    ];
                    const newAbout = { ...aboutForm, paragraphs: updated };
                    setAboutForm(newAbout);
                    store.updateAboutData(newAbout);
                    setSaveSuccessMsg("नवीन परिच्छेद जोडला गेला! माहिती भरा व सेव्ह करा.");
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-sm transition-transform hover:scale-105"
                >
                  ➕ नवीन परिच्छेद जोडा (Add New Paragraph)
                </button>
              </div>

              {/* LIST OF PARAGRAPHS - EACH HAS TEXT, PHOTO UPLOAD, SAVE & DELETE */}
              <div className="space-y-6">
                {(aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                  ? aboutForm.paragraphs
                  : [
                      {
                        id: "p1",
                        label: "कहाणी परिच्छेद १ (STORY PARAGRAPH 1)",
                        text: aboutForm.storyP1 || "माझ्या जन्माची बीजे रुजली ती श्री. अभिनय जगन्नाथ कामाजी (रा. सांगली) यांच्या स्वप्न प्रकल्पातून. अभिनय यांनी २६ जानेवारी २००० रोजी व्यवसाय सुरू केला आणि दरवर्षी वर्धापन दिन, वाढदिवस व ज्येष्ठ नागरिक मेळाव्याचे आयोजन करून साजरा करतात. १५ ऑगस्ट २०२३ रोजी भूमिपूजन झाले असून २६ जानेवारी २०२६ रोजी भव्य शुभारंभ होत आहे.",
                        imageUrl: (aboutForm.photos && aboutForm.photos[0]) || "/images/Screenshot 2026-07-31 103107.png",
                      },
                      {
                        id: "p2",
                        label: "कहाणी परिच्छेद २ (STORY PARAGRAPH 2)",
                        text: aboutForm.storyP2 || "माणूस हा एकत्र राहणारा, बोलणारा, नाती जपणारा असतो. पाल्य मोठे होऊन दूर देशी जाते तेव्हा मागे उरतात त्या आठवणी आणि एकांत... याच विचारातून ही संकल्पना समोर आली — ज्येष्ठ नागरिकांसाठी एक अशी ‘आनंदशाळा’, जिथे रोज नवा आनंद शिकायला मिळेल!",
                        imageUrl: (aboutForm.photos && aboutForm.photos[1]) || "/images/Screenshot 2026-07-31 103152.png",
                      },
                      {
                        id: "p3",
                        label: "कहाणी परिच्छेद ३ (STORY PARAGRAPH 3)",
                        text: aboutForm.storyP3 || "सांगली शहरातील दीड एकर जागेत, निसर्गाच्या सानिध्यात उभा राहणारा हा भारतातील पहिलाच भव्य प्रकल्प आहे. येथे १ दिवसापासून ते शेवटच्या क्षणापर्यंत आनंदाने राहता येते.",
                        imageUrl: (aboutForm.photos && aboutForm.photos[2]) || "/images/aandshala sahal 1.jpeg",
                      },
                    ]
                ).map((para: any, idx: number) => (
                  <div
                    key={para.id || idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-pink-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200/80 pb-2">
                      <span className="font-extrabold text-xs text-[#810B38] uppercase tracking-wider">
                        {para.label || `कहाणी परिच्छेद ${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`नक्की हा परिच्छेद डिलीट करायचा?`)) {
                            const current = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                              ? aboutForm.paragraphs
                              : [
                                  { id: "p1", label: "कहाणी परिच्छेद १", text: aboutForm.storyP1, imageUrl: "/images/Screenshot 2026-07-31 103107.png" },
                                  { id: "p2", label: "कहाणी परिच्छेद २", text: aboutForm.storyP2, imageUrl: "/images/Screenshot 2026-07-31 103152.png" },
                                  { id: "p3", label: "कहाणी परिच्छेद ३", text: aboutForm.storyP3, imageUrl: "/images/aandshala sahal 1.jpeg" },
                                ];
                            const updated = current.filter((_: any, i: number) => i !== idx);
                            const newAbout = { ...aboutForm, paragraphs: updated };
                            setAboutForm(newAbout);
                            store.updateAboutData(newAbout);
                            setSaveSuccessMsg("परिच्छेद डिलीट केला!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-700 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        🗑️ डिलीट (Remove)
                      </button>
                    </div>

                    {/* TEXT CONTENT EDIT */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                        परिच्छेदाचा मजकूर (Paragraph Content)
                      </label>
                      <textarea
                        rows={3}
                        value={para.text}
                        onChange={(e) => {
                          const current = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                            ? [...aboutForm.paragraphs]
                            : [
                                { id: "p1", label: "कहाणी परिच्छेद १", text: aboutForm.storyP1, imageUrl: "/images/Screenshot 2026-07-31 103107.png" },
                                { id: "p2", label: "कहाणी परिच्छेद २", text: aboutForm.storyP2, imageUrl: "/images/Screenshot 2026-07-31 103152.png" },
                                { id: "p3", label: "कहाणी परिच्छेद ३", text: aboutForm.storyP3, imageUrl: "/images/aandshala sahal 1.jpeg" },
                              ];
                          current[idx] = { ...current[idx], text: e.target.value };
                          setAboutForm({ ...aboutForm, paragraphs: current });
                        }}
                        placeholder="परिच्छेदाची सविस्तर माहिती इथे लिहा..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                      />
                    </div>

                    {/* PHOTO UPLOAD & PREVIEW FOR THIS PARAGRAPH */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                          🖼️ परिच्छेदासाठी फोटो (Upload Photo for Paragraph)
                        </label>

                        <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-transform hover:scale-105">
                          <span>📤 कॉम्प्युटरवरून फोटो जोडा / बदला</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (url) => {
                                const current = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                                  ? [...aboutForm.paragraphs]
                                  : [
                                      { id: "p1", label: "कहाणी परिच्छेद १", text: aboutForm.storyP1, imageUrl: "/images/Screenshot 2026-07-31 103107.png" },
                                      { id: "p2", label: "कहाणी परिच्छेद २", text: aboutForm.storyP2, imageUrl: "/images/Screenshot 2026-07-31 103152.png" },
                                      { id: "p3", label: "कहाणी परिच्छेद ३", text: aboutForm.storyP3, imageUrl: "/images/aandshala sahal 1.jpeg" },
                                    ];
                                current[idx] = { ...current[idx], imageUrl: url };
                                const newAbout = { ...aboutForm, paragraphs: current };
                                setAboutForm(newAbout);
                                store.updateAboutData(newAbout);
                                setSaveSuccessMsg("या परिच्छेदाचा फोटो अपडेट झाला!");
                                setTimeout(() => setSaveSuccessMsg(""), 3000);
                              })
                            }
                          />
                        </label>
                      </div>

                      {para.imageUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={para.imageUrl}
                            alt="Paragraph photo"
                            className="h-20 w-32 object-cover rounded-lg border border-slate-300 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                                ? [...aboutForm.paragraphs]
                                : [
                                    { id: "p1", label: "कहाणी परिच्छेद १", text: aboutForm.storyP1, imageUrl: "/images/Screenshot 2026-07-31 103107.png" },
                                    { id: "p2", label: "कहाणी परिच्छेद २", text: aboutForm.storyP2, imageUrl: "/images/Screenshot 2026-07-31 103152.png" },
                                    { id: "p3", label: "कहाणी परिच्छेद ३", text: aboutForm.storyP3, imageUrl: "/images/aandshala sahal 1.jpeg" },
                                  ];
                              current[idx] = { ...current[idx], imageUrl: "" };
                              const newAbout = { ...aboutForm, paragraphs: current };
                              setAboutForm(newAbout);
                              store.updateAboutData(newAbout);
                              setSaveSuccessMsg("फोटो काढला!");
                              setTimeout(() => setSaveSuccessMsg(""), 3000);
                            }}
                            className="px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            🗑️ फोटो डिलीट करा
                          </button>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-semibold italic">
                          (या परिच्छेदासाठी फोटो जोडलेला नाही - 'कॉम्प्युटरवरून फोटो जोडा' बटणावर क्लिक करा)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* AWARD NOTICE EDIT */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  पुरस्कार व सन्मान माहिती (Award Notice)
                </label>
                <input
                  type="text"
                  value={aboutForm.awardNotice || "'साई दिशा प्रतिष्ठान' मुंबई यांच्याकडून व्यवसाय व सामाजिक कार्यासाठी 'समाजभूषण पुरस्कार' प्राप्त!"}
                  onChange={(e) => setAboutForm({ ...aboutForm, awardNotice: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                />
              </div>

              {/* SAVE ALL BUTTON */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const current = aboutForm.paragraphs && aboutForm.paragraphs.length > 0
                      ? aboutForm.paragraphs
                      : [
                          { id: "p1", label: "कहाणी परिच्छेद १", text: aboutForm.storyP1, imageUrl: "/images/Screenshot 2026-07-31 103107.png" },
                          { id: "p2", label: "कहाणी परिच्छेद २", text: aboutForm.storyP2, imageUrl: "/images/Screenshot 2026-07-31 103152.png" },
                          { id: "p3", label: "कहाणी परिच्छेद ३", text: aboutForm.storyP3, imageUrl: "/images/aandshala sahal 1.jpeg" },
                        ];
                    store.updateAboutData({ ...aboutForm, paragraphs: current });
                    setSaveSuccessMsg("आमच्याविषयी सर्व माहिती व फोटो सेव्ह झाले!");
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="px-8 py-3 rounded-xl bg-[#810B38] hover:bg-[#68092D] font-extrabold text-white hover:scale-105 transition-all cursor-pointer shadow-md text-sm"
                >
                  💾 सर्व बद‌ल सेव्ह व अपडेट करा (Save & Update All)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3.1. DEDICATED ANANDSHALA TIMETABLE MANAGER */}
        {activeTab === "schedule" && (
          <div className="space-y-8 animate-fade-up max-w-5xl">
            {/* TOP SUB-TAB TOGGLE SWITCHER */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-sm bg-[#810B38] text-white"
              >
                🌸 १. आनंदशाळा वेळापत्रक
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sports-schedule")}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all text-slate-700 hover:bg-slate-300/60"
              >
                🏋️‍♂️ २. प्रीतम स्पोर्ट्स क्लब वेळापत्रक
              </button>
            </div>

            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>🌸</span>
                <span>आनंदशाळा वेळापत्रक मॅनेजर (Anandshala Timetable)</span>
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                फक्त 'ज्येष्ठ नागरिक आनंदशाळा' प्रकल्पाचे दैनिक वेळापत्रक, नियम व अधिकृत वेळापत्रक फोटो/PDF संपादन व अपलोड करा.
              </p>
            </div>

            {/* 1. UPLOAD TIMETABLE POSTER / DOCUMENT CARD */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <span>📜</span>
                    <span>१. आनंदशाळा वेळापत्रक फोटो / PDF पोस्टर अपलोड</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    संगणकावरून आनंदशाळेचा वेळापत्रक फोटो किंवा PDF जोडा.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-transform hover:scale-105">
                  <span>📁 आनंदशाळा वेळापत्रक फोटो/PDF जोडा</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url, type) => {
                        store.updateScheduleConfig({ posterUrl: url, posterType: type });
                        setScheduleForm({ ...scheduleForm, posterUrl: url, posterType: type });
                        setSaveSuccessMsg("✅ आनंदशाळा वेळापत्रक फोटो/PDF यशस्वीरित्या अपलोड झाले!");
                        setTimeout(() => setSaveSuccessMsg(""), 4000);
                      })
                    }
                  />
                </label>
              </div>

              {store.scheduleConfig.posterUrl ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-2xl font-bold">
                      {store.scheduleConfig.posterType === "pdf" ? "📄" : "🖼️"}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">
                        अ‍ॅक्टिव्ह आनंदशाळा वेळापत्रक {store.scheduleConfig.posterType === "pdf" ? "PDF" : "फोटो"}
                      </div>
                      <a
                        href={store.scheduleConfig.posterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-pink-700 font-bold hover:underline"
                      >
                        पहा / डाऊनलोड करा →
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("नक्की हे आनंदशाळा पोस्टर काढायचे?")) {
                        store.updateScheduleConfig({ posterUrl: "" });
                        setScheduleForm({ ...scheduleForm, posterUrl: "" });
                        setSaveSuccessMsg("आनंदशाळा पोस्टर काढले!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs border border-red-200 transition-colors cursor-pointer"
                  >
                    🗑️ पोस्टर हटवा
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-500 text-xs font-semibold">
                  सध्या कोणतेही आनंदशाळा वेळापत्रक पोस्टर अपलोड केलेले नाही.
                </div>
              )}
            </div>

            {/* 2. HEADER INFO EDIT CARD */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.updateScheduleConfig(scheduleForm);
                setSaveSuccessMsg("✅ आनंदशाळा वेळापत्रक माहिती यशस्वीरित्या सेव्ह झाली!");
                setTimeout(() => setSaveSuccessMsg(""), 4000);
              }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>⚙️</span>
                <span>२. मुख्य माहिती व वेळा</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.headerTitle || "प्रीतम ज्येष्ठ नागरिक आनंदशाळा वेळापत्रक"}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, headerTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    दिवस / हजेरी (Days)
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.daysText || "सोमवार ते शुक्रवार (दैनिक हजेरी)"}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, daysText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    वेळ (Time Range)
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.timeRange || "05:30 ते 09:30"}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, timeRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  थोडक्यात संदेश / घोषवाक्य (Subtitle)
                </label>
                <input
                  type="text"
                  value={scheduleForm.subtitle || "आनंदी जीवन, सुंदर विचार... आरोग्य, मनोरंजन, संस्कार आणि सहवास यांचं आदर्श केंद्र."}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#810B38] hover:bg-[#68092D] text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                💾 सेव्ह करा
              </button>
            </form>

            {/* 3. DAILY SCHEDULE ROWS MANAGER */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>📋</span>
                <span>३. दैनिक वेळापत्रक तक्ता संपादन</span>
              </h3>

              {/* ADD NEW SCHEDULE ROW FORM */}
              <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200 space-y-3">
                <h4 className="font-extrabold text-xs text-pink-900 uppercase tracking-wider">
                  ➕ नवीन वेळापत्रक स्लोट जोडा
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">आयकॉन (Emoji)</label>
                    <input
                      type="text"
                      value={newScheduleRow.icon}
                      onChange={(e) => setNewScheduleRow({ ...newScheduleRow, icon: e.target.value })}
                      placeholder="उदा. 🧘‍♂️"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">वेळ (Time Slot)</label>
                    <input
                      type="text"
                      value={newScheduleRow.time}
                      onChange={(e) => setNewScheduleRow({ ...newScheduleRow, time: e.target.value })}
                      placeholder="उदा. सकाळी ०५:३० ते ०६:१५"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">मुख्य उपक्रम (Activity)</label>
                    <input
                      type="text"
                      value={newScheduleRow.monMain}
                      onChange={(e) =>
                        setNewScheduleRow({
                          ...newScheduleRow,
                          monMain: e.target.value,
                          tueMain: e.target.value,
                          wedMain: e.target.value,
                          thuMain: e.target.value,
                          friMain: e.target.value,
                        })
                      }
                      placeholder="उदा. योग व प्राणायाम"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">स्पष्टीकरण / तपशील (Sub Text)</label>
                  <input
                    type="text"
                    value={newScheduleRow.monSub}
                    onChange={(e) =>
                      setNewScheduleRow({
                        ...newScheduleRow,
                        monSub: e.target.value,
                        tueSub: e.target.value,
                        wedSub: e.target.value,
                        thuSub: e.target.value,
                        friSub: e.target.value,
                      })
                    }
                    placeholder="उदा. आसने, प्राणायाम व हास्ययोग"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newScheduleRow.time || !newScheduleRow.monMain) return;
                    store.addScheduleRow({
                      icon: newScheduleRow.icon || "✨",
                      time: newScheduleRow.time,
                      mon: { main: newScheduleRow.monMain, sub: newScheduleRow.monSub },
                      tue: { main: newScheduleRow.tueMain, sub: newScheduleRow.tueSub },
                      wed: { main: newScheduleRow.wedMain, sub: newScheduleRow.wedSub },
                      thu: { main: newScheduleRow.thuMain, sub: newScheduleRow.thuSub },
                      fri: { main: newScheduleRow.friMain, sub: newScheduleRow.friSub },
                    });
                    setSaveSuccessMsg("✅ नवीन वेळापत्रक स्लोट समाविष्ट झाला!");
                    setTimeout(() => setSaveSuccessMsg(""), 3500);
                  }}
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  ➕ वेळापत्रकात जोडा
                </button>
              </div>

              {/* LIST OF EXISTING SCHEDULE ROWS */}
              <div className="space-y-3">
                {store.scheduleConfig.items.map((row, idx) => (
                  <div key={row.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.icon}</span>
                      <div>
                        <div className="text-xs font-black text-pink-900">{row.time}</div>
                        <div className="text-xs font-extrabold text-slate-800">{row.mon.main}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{row.mon.sub}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("नक्की हा वेळापत्रक स्लोट डिलीट करायचा?")) {
                          store.deleteScheduleRow(row.id);
                          setSaveSuccessMsg("वेळापत्रक स्लोट डिलीट झाला!");
                          setTimeout(() => setSaveSuccessMsg(""), 3000);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs border border-red-200 transition-colors cursor-pointer"
                    >
                      🗑️ डिलीट
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. RULES & REGULATIONS MANAGER CARD */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>🌿</span>
                <span>४. नियम व सूचना व्यवस्थापन</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newScheduleRule}
                  onChange={(e) => setNewScheduleRule(e.target.value)}
                  placeholder="उदा. वेळेवर हजेरी लावणे सर्व सदस्यांसाठी अनिवार्य आहे."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newScheduleRule) return;
                    store.addScheduleRule(newScheduleRule);
                    setNewScheduleRule("");
                    setSaveSuccessMsg("✅ नवीन नियम जोडला गेला!");
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  ➕ नियम जोडा
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {store.scheduleConfig.rules.map((rule, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 leading-snug">{rule}</span>
                    <button
                      type="button"
                      onClick={() => {
                        store.deleteScheduleRule(idx);
                        setSaveSuccessMsg("नियम हटवला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3.2. DEDICATED PREETAM SPORTS CLUB TIMETABLE MANAGER */}
        {activeTab === "sports-schedule" && (
          <div className="space-y-8 animate-fade-up max-w-5xl">
            {/* TOP SUB-TAB TOGGLE SWITCHER */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all text-slate-700 hover:bg-slate-300/60"
              >
                🌸 १. आनंदशाळा वेळापत्रक
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sports-schedule")}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-sm bg-[#1A05A2] text-white"
              >
                🏋️‍♂️ २. प्रीतम स्पोर्ट्स क्लब वेळापत्रक
              </button>
            </div>

            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>🏋️‍♂️</span>
                <span>स्पोर्ट्स क्लब वेळापत्रक मॅनेजर (Sports Club Timetable)</span>
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                फक्त 'प्रीतम स्पोर्ट्स अँड फिटनेस क्लब' चे दैनिक वेळापत्रक, क्रीडा नियम व अधिकृत वेळापत्रक फोटो/PDF संपादन व अपलोड करा.
              </p>
            </div>

            {/* 1. UPLOAD TIMETABLE POSTER / DOCUMENT CARD */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <span>📜</span>
                    <span>१. स्पोर्ट्स क्लब वेळापत्रक फोटो / PDF पोस्टर अपलोड</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    संगणकावरून स्पोर्ट्स क्लबचा वेळापत्रक फोटो किंवा PDF जोडा.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer shadow-md transition-transform hover:scale-105">
                  <span>📁 स्पोर्ट्स क्लब वेळापत्रक फोटो/PDF जोडा</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url, type) => {
                        store.updateSportsScheduleConfig({ posterUrl: url, posterType: type });
                        setSportsScheduleForm({ ...sportsScheduleForm, posterUrl: url, posterType: type });
                        setSaveSuccessMsg("✅ स्पोर्ट्स क्लब वेळापत्रक फोटो/PDF यशस्वीरित्या अपलोड झाले!");
                        setTimeout(() => setSaveSuccessMsg(""), 4000);
                      })
                    }
                  />
                </label>
              </div>

              {store.sportsScheduleConfig.posterUrl ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                      {store.sportsScheduleConfig.posterType === "pdf" ? "📄" : "🖼️"}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">
                        अ‍ॅक्टिव्ह स्पोर्ट्स क्लब वेळापत्रक {store.sportsScheduleConfig.posterType === "pdf" ? "PDF" : "फोटो"}
                      </div>
                      <a
                        href={store.sportsScheduleConfig.posterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-700 font-bold hover:underline"
                      >
                        पहा / डाऊनलोड करा →
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("नक्की हे स्पोर्ट्स क्लब पोस्टर काढायचे?")) {
                        store.updateSportsScheduleConfig({ posterUrl: "" });
                        setSportsScheduleForm({ ...sportsScheduleForm, posterUrl: "" });
                        setSaveSuccessMsg("स्पोर्ट्स क्लब पोस्टर काढले!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs border border-red-200 transition-colors cursor-pointer"
                  >
                    🗑️ पोस्टर हटवा
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-500 text-xs font-semibold">
                  सध्या कोणतेही स्पोर्ट्स क्लब वेळापत्रक पोस्टर अपलोड केलेले नाही.
                </div>
              )}
            </div>

            {/* 2. HEADER INFO EDIT CARD */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.updateSportsScheduleConfig(sportsScheduleForm);
                setSaveSuccessMsg("✅ स्पोर्ट्स क्लब वेळापत्रक माहिती यशस्वीरित्या सेव्ह झाली!");
                setTimeout(() => setSaveSuccessMsg(""), 4000);
              }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>⚙️</span>
                <span>२. मुख्य माहिती व वेळा</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    value={sportsScheduleForm.headerTitle || "प्रीतम स्पोर्ट्स अँड फिटनेस क्लब वेळापत्रक"}
                    onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, headerTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    दिवस / हजेरी (Days)
                  </label>
                  <input
                    type="text"
                    value={sportsScheduleForm.daysText || "सोमवार ते रविवार (सर्व दिवस खुली)"}
                    onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, daysText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    वेळ (Time Range)
                  </label>
                  <input
                    type="text"
                    value={sportsScheduleForm.timeRange || "सकाळी ०५:०० ते रात्री १०:००"}
                    onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, timeRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  थोडक्यात संदेश / घोषवाक्य (Subtitle)
                </label>
                <input
                  type="text"
                  value={sportsScheduleForm.subtitle || "फिटनेस, क्रीडा आणि आरोग्याचा परिपूर्ण अनुभव... आधुनिक जिम, स्विमिंग पुल व सर्व खेळांची सोय."}
                  onChange={(e) => setSportsScheduleForm({ ...sportsScheduleForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#1A05A2] hover:bg-indigo-900 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                💾 स्पोर्ट्स वेळापत्रक सेव्ह करा
              </button>
            </form>

            {/* 3. DAILY SCHEDULE ROWS MANAGER */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>📋</span>
                <span>३. दैनिक स्पोर्ट्स वेळापत्रक तक्ता संपादन</span>
              </h3>

              {/* ADD NEW SCHEDULE ROW FORM */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                <h4 className="font-extrabold text-xs text-indigo-900 uppercase tracking-wider">
                  ➕ नवीन स्पोर्ट्स वेळापत्रक स्लोट जोडा
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">आयकॉन (Emoji)</label>
                    <input
                      type="text"
                      value={newSportsScheduleRow.icon}
                      onChange={(e) => setNewSportsScheduleRow({ ...newSportsScheduleRow, icon: e.target.value })}
                      placeholder="उदा. 🏋️‍♂️"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">वेळ (Time Slot)</label>
                    <input
                      type="text"
                      value={newSportsScheduleRow.time}
                      onChange={(e) => setNewSportsScheduleRow({ ...newSportsScheduleRow, time: e.target.value })}
                      placeholder="उदा. सकाळी ०६:०० ते ०७:००"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-700 mb-1">मुख्य उपक्रम (Activity)</label>
                    <input
                      type="text"
                      value={newSportsScheduleRow.monMain}
                      onChange={(e) =>
                        setNewSportsScheduleRow({
                          ...newSportsScheduleRow,
                          monMain: e.target.value,
                          tueMain: e.target.value,
                          wedMain: e.target.value,
                          thuMain: e.target.value,
                          friMain: e.target.value,
                        })
                      }
                      placeholder="उदा. जिम & वेट ट्रेनिंग"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">स्पष्टीकरण / तपशील (Sub Text)</label>
                  <input
                    type="text"
                    value={newSportsScheduleRow.monSub}
                    onChange={(e) =>
                      setNewSportsScheduleRow({
                        ...newSportsScheduleRow,
                        monSub: e.target.value,
                        tueSub: e.target.value,
                        wedSub: e.target.value,
                        thuSub: e.target.value,
                        friSub: e.target.value,
                      })
                    }
                    placeholder="उदा. कार्डिओ व फिटनेस तालीम"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newSportsScheduleRow.time || !newSportsScheduleRow.monMain) return;
                    store.addSportsScheduleRow({
                      icon: newSportsScheduleRow.icon || "🏋️‍♂️",
                      time: newSportsScheduleRow.time,
                      mon: { main: newSportsScheduleRow.monMain, sub: newSportsScheduleRow.monSub },
                      tue: { main: newSportsScheduleRow.tueMain, sub: newSportsScheduleRow.tueSub },
                      wed: { main: newSportsScheduleRow.wedMain, sub: newSportsScheduleRow.wedSub },
                      thu: { main: newSportsScheduleRow.thuMain, sub: newSportsScheduleRow.thuSub },
                      fri: { main: newSportsScheduleRow.friMain, sub: newSportsScheduleRow.friSub },
                    });
                    setSaveSuccessMsg("✅ नवीन स्पोर्ट्स वेळापत्रक स्लोट समाविष्ट झाला!");
                    setTimeout(() => setSaveSuccessMsg(""), 3500);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  ➕ वेळापत्रकात जोडा
                </button>
              </div>

              {/* LIST OF EXISTING SCHEDULE ROWS */}
              <div className="space-y-3">
                {store.sportsScheduleConfig.items.map((row, idx) => (
                  <div key={row.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.icon}</span>
                      <div>
                        <div className="text-xs font-black text-indigo-900">{row.time}</div>
                        <div className="text-xs font-extrabold text-slate-800">{row.mon.main}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{row.mon.sub}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("नक्की हा स्पोर्ट्स वेळापत्रक स्लोट डिलीट करायचा?")) {
                          store.deleteSportsScheduleRow(row.id);
                          setSaveSuccessMsg("स्पोर्ट्स वेळापत्रक स्लोट डिलीट झाला!");
                          setTimeout(() => setSaveSuccessMsg(""), 3000);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs border border-red-200 transition-colors cursor-pointer"
                    >
                      🗑️ डिलीट
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. RULES & REGULATIONS MANAGER CARD */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>🌿</span>
                <span>४. स्पोर्ट्स क्लब नियम व सूचना व्यवस्थापन</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSportsScheduleRule}
                  onChange={(e) => setNewSportsScheduleRule(e.target.value)}
                  placeholder="उदा. स्पोर्ट्स क्लबमध्ये स्पोर्ट्स शुझ व योग्य कपडे घालणे अनिवार्य आहे."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSportsScheduleRule) return;
                    store.addSportsScheduleRule(newSportsScheduleRule);
                    setNewSportsScheduleRule("");
                    setSaveSuccessMsg("✅ नवीन स्पोर्ट्स नियम जोडला गेला!");
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  ➕ नियम जोडा
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {store.sportsScheduleConfig.rules.map((rule, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 leading-snug">{rule}</span>
                    <button
                      type="button"
                      onClick={() => {
                        store.deleteSportsScheduleRule(idx);
                        setSaveSuccessMsg("नियम हटवला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3.5. DEDICATED PREETAM SPORTS CLUB MANAGER */}
        {activeTab === "sports" && (
          <div className="space-y-8 animate-fade-up max-w-5xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>🏋️‍♂️</span>
                <span>प्रीतम स्पोर्ट्स क्लब मॅनेजर (Sports Club Manager)</span>
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                'प्रीतम स्पोर्ट्स अँड फिटनेस क्लब' बद्दलची सर्व माहिती, ब्रोशर, क्रीडा सोयी-सुविधा, पॅकेजेस व फोटो थेट संपादन, अपलोड व डिलीट करा.
              </p>
            </div>

            {/* 1. SPORTS TITLES & DESCRIPTION CARD */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.updateSiteData(siteForm);
                setSaveSuccessMsg("स्पोर्ट्स क्लबची मुख्य माहिती सेव्ह झाली!");
                setTimeout(() => setSaveSuccessMsg(""), 3000);
              }}
              className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-5 shadow-sm"
            >
              <h3 className="font-display text-lg font-black text-purple-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>🏆</span>
                <span>१. क्रीडा संकुल मुख्य मथळा व माहिती संपादन (Sports Titles & Info)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    प्रकल्पाचे नाव (Sports Club Title)
                  </label>
                  <input
                    type="text"
                    value={siteForm.sportsTitle || "प्रीतम स्पोर्ट्स अँड फिटनेस क्लब"}
                    onChange={(e) => setSiteForm({ ...siteForm, sportsTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    टॅगलाईन / बॅज (Badge)
                  </label>
                  <input
                    type="text"
                    value={siteForm.sportsBadge || "अद्ययावत १.५ एकर स्पोर्ट्स संकुल"}
                    onChange={(e) => setSiteForm({ ...siteForm, sportsBadge: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  सविस्तर वर्णन (Sports Club Description)
                </label>
                <textarea
                  rows={3}
                  value={siteForm.sportsDesc || "सांगलीतील १.५ एकर भव्य अद्ययावत क्रीडा संकुल! ओलंपिक स्टाईल स्विमिंग पूल, इनडोअर बॅडमिंटन, टेनिस कोर्ट, वातानुकूलित जीम व रेस्टॉरंट."}
                  onChange={(e) => setSiteForm({ ...siteForm, sportsDesc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 font-extrabold text-white hover:scale-105 transition-all cursor-pointer shadow-md text-sm"
              >
                💾 क्रीडा संकुल मुख्य माहिती सेव्ह करा
              </button>
            </form>

            {/* 2. SPORTS SLIDER PHOTOS CARD */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-black text-purple-700 flex items-center gap-2">
                    <span>🖼️</span>
                    <span>२. क्रीडा संकुल बॅकग्राउंड स्लायडर फोटो (Sports Slider Photos)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    मुख्यपृष्ठावरील स्पोर्ट्स क्लब कार्डच्या बॅकग्राउंडमध्ये फिरणारे फोटो.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs cursor-pointer shadow-sm transition-transform hover:scale-105">
                  <span>➕ नवीन स्लायडर फोटो जोडा</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        const currentImgs = siteForm.sportsImages || [
                          "/images/epic_sports_gym_bg.png",
                          "/images/Screenshot 2026-07-31 103712.png",
                          "/images/Screenshot 2026-07-31 103659.png",
                        ];
                        const updated = { ...siteForm, sportsImages: [...currentImgs, url] };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg("स्पोर्ट्स स्लायडर फोटो अपडेट झाला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      })
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(siteForm.sportsImages || [
                  "/images/epic_sports_gym_bg.png",
                  "/images/Screenshot 2026-07-31 103712.png",
                  "/images/Screenshot 2026-07-31 103659.png",
                ]).map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                    <img src={imgUrl} alt={`Sports Slider ${idx}`} className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const currentImgs = siteForm.sportsImages || [];
                        const updatedImgs = currentImgs.filter((_, i) => i !== idx);
                        const updated = { ...siteForm, sportsImages: updatedImgs };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg("फोटो स्लायडरमधून काढून टाकला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] shadow cursor-pointer transition-colors"
                    >
                      🗑️ डिलीट
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. SPORTS FACILITIES CARD - 1-CLICK CATEGORY FORM GENERATION */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-black text-purple-700 flex items-center gap-2">
                  <span>🏊</span>
                  <span>३. श्रेणीनुसार क्रीडा सुविधा व माहिती व्यवस्थापन (Sports Facilities & Arenas)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  खालीलपैकी कोणत्या क्रीडा प्रकारची माहिती किंवा फोटो अपडेट करायचा आहे त्या श्रेणीवर क्लिक करा:
                </p>
              </div>

              {/* TOP CATEGORY SELECTOR BUTTONS */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "sf-1", icon: "🏊", label: "स्विमिंग पूल", defaultTitle: "ओलंपिक स्टाईल स्विमिंग पूल", defaultDesc: "स्वच्छ व फिल्टर केलेल्या पाण्यातील स्विमिंग पूल.", defaultImg: "/images/swimming hall.png" },
                  { id: "sf-2", icon: "🏋️", label: "जीम & फिटनेस", defaultTitle: "वातानुकूलित जीम व फिटनेस सेंटर", defaultDesc: "अद्ययावत जीम व व्यायाम साधने.", defaultImg: "/images/vyayam hall.png" },
                  { id: "sf-3", icon: "🏸", label: "बॅडमिंटन & टेनिस", defaultTitle: "इनडोअर बॅडमिंटन व कोर्ट्स", defaultDesc: "प्रोफेशनल बॅडमिंटन, टेबल टेनिस व टर्फ.", defaultImg: "/images/tebal tenis.png" },
                  { id: "sf-4", icon: "🏓", label: "पिकलबॉल", defaultTitle: "पिकलबॉल कोर्ट", defaultDesc: "भारतातील लोकप्रिय नवीन पिकलबॉल क्रीडा कोर्ट.", defaultImg: "/images/pickleball-court.png" },
                  { id: "sf-5", icon: "🎾", label: "स्क्वॅश & टर्फ", defaultTitle: "स्क्वॅश व स्पोर्ट्स टर्फ", defaultDesc: "ऑल वेदर स्पोर्ट्स टर्फ व स्क्वॅश कोर्ट.", defaultImg: "" },
                  { id: "sf-6", icon: "🎱", label: "स्नूकर & बैठे खेळ", defaultTitle: "स्नूकर व इनडोअर क्लब", defaultDesc: "प्रीमियम स्नूकर टेबल व बुद्धीबळ.", defaultImg: "" },
                  { id: "sf-7", icon: "⚽", label: "इतर क्रीडा सोयी", defaultTitle: "इतर क्रीडा सुविधा", defaultDesc: "क्लबमधील इतर सर्व क्रीडा सोयी.", defaultImg: "" },
                ].map((cat) => {
                  const currentFacs = siteForm.sportsFacilities || [];
                  const existingItem = currentFacs.find((f) => f.id === cat.id || f.icon === cat.icon || f.title.includes(cat.label));
                  const isSelected = selectedFacilityCategory === cat.id;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setSelectedFacilityCategory(cat.id);
                        if (existingItem) {
                          setEditingSportsFacilityId(existingItem.id);
                          setSportsFacilityFormState({
                            title: existingItem.title,
                            description: existingItem.description,
                            icon: existingItem.icon || cat.icon,
                            imageUrl: existingItem.imageUrl || "",
                          });
                        } else {
                          setEditingSportsFacilityId(cat.id);
                          setSportsFacilityFormState({
                            title: cat.defaultTitle,
                            description: cat.defaultDesc,
                            icon: cat.icon,
                            imageUrl: cat.defaultImg,
                          });
                        }
                        setShowSportsFacilityModal(true);
                      }}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer border transition-all shadow-xs ${
                        isSelected && showSportsFacilityModal
                          ? "bg-purple-700 text-white border-purple-700 shadow-md scale-[1.04]"
                          : "bg-purple-50/60 text-purple-950 border-purple-200 hover:bg-purple-600 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    const newId = "sf-" + Date.now();
                    setSelectedFacilityCategory(newId);
                    setEditingSportsFacilityId(null);
                    setSportsFacilityFormState({
                      title: "",
                      description: "",
                      icon: "⚽",
                      imageUrl: "",
                    });
                    setShowSportsFacilityModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  ➕ नवीन क्रीडा सोय जोडा
                </button>
              </div>

              {/* DIRECT EDIT / ADD FORM GENERATED UPON CATEGORY CLICK */}
              {showSportsFacilityModal && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!sportsFacilityFormState.title) return;

                    const currentFacs = siteForm.sportsFacilities || [
                      { id: "sf-1", title: "ओलंपिक स्टाईल स्विमिंग पूल", description: "स्वच्छ व फिल्टर केलेल्या पाण्यातील स्विमिंग पूल.", icon: "🏊", imageUrl: "/images/swimming hall.png" },
                      { id: "sf-2", title: "वातानुकूलित जीम व फिटनेस सेंटर", description: "अद्ययावत जीम व व्यायाम साधने.", icon: "🏋️", imageUrl: "/images/vyayam hall.png" },
                      { id: "sf-3", title: "इनडोअर बॅडमिंटन व कोर्ट्स", description: "प्रोफेशनल बॅडमिंटन, टेबल टेनिस व टर्फ.", icon: "🏸", imageUrl: "/images/tebal tenis.png" },
                      { id: "sf-4", title: "पिकलबॉल कोर्ट", description: "भारतातील लोकप्रिय नवीन पिकलबॉल क्रीडा कोर्ट.", icon: "🏓", imageUrl: "/images/pickleball-court.png" },
                    ];

                    let updatedFacs = [];
                    const targetId = editingSportsFacilityId || selectedFacilityCategory || ("sf-" + Date.now());
                    const exists = currentFacs.some((fac) => fac.id === targetId);

                    if (exists) {
                      updatedFacs = currentFacs.map((fac) =>
                        fac.id === targetId
                          ? {
                              ...fac,
                              title: sportsFacilityFormState.title,
                              description: sportsFacilityFormState.description,
                              icon: sportsFacilityFormState.icon,
                              imageUrl: sportsFacilityFormState.imageUrl,
                            }
                          : fac
                      );
                    } else {
                      updatedFacs = [
                        ...currentFacs,
                        {
                          id: targetId,
                          title: sportsFacilityFormState.title,
                          description: sportsFacilityFormState.description,
                          icon: sportsFacilityFormState.icon || "⚽",
                          imageUrl: sportsFacilityFormState.imageUrl,
                        },
                      ];
                    }

                    const updatedSite = { ...siteForm, sportsFacilities: updatedFacs };
                    setSiteForm(updatedSite);
                    store.updateSiteData(updatedSite);
                    setSaveSuccessMsg("माहिती व फोटो सेव्ह व अपडेट झाले!");
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="p-6 rounded-2xl bg-purple-50/90 border-2 border-purple-400 space-y-4 animate-fade-in shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-purple-200 pb-3">
                    <h4 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                      <span className="text-lg">{sportsFacilityFormState.icon || "⚽"}</span>
                      <span>
                        {sportsFacilityFormState.title
                          ? `✏️ "${sportsFacilityFormState.title}" चे फॉर्म`
                          : "➕ नवीन क्रीडा सोय फॉर्म"}
                      </span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSportsFacilityModal(false);
                        setEditingSportsFacilityId(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2.5 py-1 bg-white rounded-lg border border-slate-200 cursor-pointer"
                    >
                      ✖️ फॉर्म बंद करा
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                        क्रीडा सुविधेचे नाव (Facility Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. ओलंपिक स्टाईल स्विमिंग पूल"
                        value={sportsFacilityFormState.title}
                        onChange={(e) => setSportsFacilityFormState({ ...sportsFacilityFormState, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                        🖼️ सुविधेचा फोटो (Upload Photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, (url) =>
                            setSportsFacilityFormState({ ...sportsFacilityFormState, imageUrl: url })
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-purple-700 file:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                      सविस्तर माहिती / वर्णन (Description)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="या क्रीडा सोयीबद्दल सविस्तर माहिती लिहा..."
                      value={sportsFacilityFormState.description}
                      onChange={(e) => setSportsFacilityFormState({ ...sportsFacilityFormState, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none shadow-xs"
                    />
                  </div>

                  {sportsFacilityFormState.imageUrl && (
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-purple-200 shadow-xs">
                      <div
                        className="relative group cursor-pointer shrink-0"
                        onClick={() => setPreviewModalImg(sportsFacilityFormState.imageUrl)}
                        title="मोठा फोटो पाहण्यासाठी क्लिक करा"
                      >
                        <img
                          src={sportsFacilityFormState.imageUrl}
                          alt="Preview"
                          className="h-20 w-32 object-cover rounded-lg border border-slate-300 transition-transform group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                          👁️ झूम करा
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                          <span>📷</span>
                          <span>अपलोड केलेला फोटो (Uploaded Image)</span>
                        </p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(sportsFacilityFormState.imageUrl)}
                            className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-700 hover:text-white text-purple-800 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>👁️</span>
                            <span>मोठा फोटो पहा (Preview Photo)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSportsFacilityFormState({ ...sportsFacilityFormState, imageUrl: "" })}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>🗑️</span>
                            <span>फोटो काढा</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
                    >
                      💾 माहिती व फोटो सेव्ह करा
                    </button>
                    {editingSportsFacilityId && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`नक्की "${sportsFacilityFormState.title}" डिलीट करायचे?`)) {
                            const current = siteForm.sportsFacilities || [];
                            const updated = current.filter((item) => item.id !== editingSportsFacilityId);
                            const newSite = { ...siteForm, sportsFacilities: updated };
                            setSiteForm(newSite);
                            store.updateSiteData(newSite);
                            setShowSportsFacilityModal(false);
                            setSaveSuccessMsg("क्रीडा सुविधा डिलीट केली!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs cursor-pointer transition-colors"
                      >
                        🗑️ डिलीट करा
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* 4. SPORTS PACKAGES & PRICING CARD */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-black text-purple-700 flex items-center gap-2">
                    <span>💳</span>
                    <span>४. स्पोर्ट्स क्लब प्रवेश योजना व फी स्ट्रक्चर (Sports Packages & Plans)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    स्पोर्ट्स क्लबचे डे-पास, मासिक व वार्षिक मेंबरशिप पॅकेजेस.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSportsPkgId(null);
                    setSportsPkgFormState({ title: "", price: "", subtitle: "", featuresText: "" });
                    setShowSportsPkgModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  ➕ नवीन स्पोर्ट्स पॅकेज जोडा (Add Sports Package)
                </button>
              </div>

              {/* DYNAMIC SPORTS PACKAGE ADD / EDIT FORM */}
              {showSportsPkgModal && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!sportsPkgFormState.title || !sportsPkgFormState.price) return;
                    const features = sportsPkgFormState.featuresText
                      .split("\n")
                      .map((f) => f.trim())
                      .filter(Boolean);

                    const currentPkgs = siteForm.sportsPackages || [
                      { id: "spk-1", title: "स्पोर्ट्स क्लब डे पास", price: "₹ ३०० / दिवस", subtitle: "सर्व क्रीडा सोयी वापरता येतील", features: ["स्विमिंग पूल प्रवेश", "जीम व इनडोअर गेम्स"] },
                      { id: "spk-2", title: "मासिक जीम व स्पोर्ट्स मेंबरशिप", price: "₹ २,५०० / महिना", subtitle: "नियमित सदस्यांसाठी सवलत", features: ["२४x७ जीम प्रवेश", "स्विमिंग पूल व बॅडमिंटन"] },
                      { id: "spk-3", title: "वार्षिक फॅमिली स्पोर्ट्स मेंबरशिप", price: "₹ २५,००० / वर्ष", subtitle: "संपूर्ण कुटुंबासाठी ऑल-इन-वन", features: ["४ सदस्यांसाठी मोफत प्रवेश", "क्लब इव्हेंट्स प्राधान्य"] },
                    ];

                    let updatedPkgs = [];
                    if (editingSportsPkgId) {
                      updatedPkgs = currentPkgs.map((p) =>
                        p.id === editingSportsPkgId
                          ? {
                              ...p,
                              title: sportsPkgFormState.title,
                              price: sportsPkgFormState.price,
                              subtitle: sportsPkgFormState.subtitle,
                              features: features.length ? features : ["विशेष क्रीडा सुविधा"],
                            }
                          : p
                      );
                      setSaveSuccessMsg("स्पोर्ट्स पॅकेज अपडेट झाले!");
                    } else {
                      const newId = "spk-" + Date.now();
                      updatedPkgs = [
                        ...currentPkgs,
                        {
                          id: newId,
                          title: sportsPkgFormState.title,
                          price: sportsPkgFormState.price,
                          subtitle: sportsPkgFormState.subtitle,
                          features: features.length ? features : ["विशेष क्रीडा सुविधा"],
                        },
                      ];
                      setSaveSuccessMsg("नवीन स्पोर्ट्स पॅकेज सेव्ह झाले!");
                    }

                    const updatedSite = { ...siteForm, sportsPackages: updatedPkgs };
                    setSiteForm(updatedSite);
                    store.updateSiteData(updatedSite);
                    setShowSportsPkgModal(false);
                    setEditingSportsPkgId(null);
                    setSportsPkgFormState({ title: "", price: "", subtitle: "", featuresText: "" });
                    setTimeout(() => setSaveSuccessMsg(""), 3000);
                  }}
                  className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-300 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <h4 className="font-extrabold text-sm text-purple-900">
                      {editingSportsPkgId ? "✏️ स्पोर्ट्स पॅकेज संपादित करा" : "➕ नवीन स्पोर्ट्स पॅकेज फॉर्म (Add Sports Package)"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSportsPkgModal(false);
                        setEditingSportsPkgId(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                    >
                      ✖️ रद्द करा
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        पॅकेजचे नाव (Title) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. ६ महिने व्हआयपी क्लब मेंबरशिप"
                        value={sportsPkgFormState.title}
                        onChange={(e) => setSportsPkgFormState({ ...sportsPkgFormState, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        किंमत / शुल्क (Price) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. ₹ ६,९९९ / ६ महिने"
                        value={sportsPkgFormState.price}
                        onChange={(e) => setSportsPkgFormState({ ...sportsPkgFormState, price: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      उप-शीर्षक / सवलत (Subtitle / Offer)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. ५,००० रुपयांची भरघोस बचत! (42% OFF)"
                      value={sportsPkgFormState.subtitle}
                      onChange={(e) => setSportsPkgFormState({ ...sportsPkgFormState, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      वैशिष्ट्ये व सुविधा (Features List - एका ओळीत एक सोय लिहा)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="जीम, ऑलिंपिक स्विमिंग पूल व पिकलबॉल प्रवेश&#10;ग्रंथालय व म्युझिक हॉल मोफत प्रवेश&#10;स्टीम बाथ सुविधा विनामूल्य"
                      value={sportsPkgFormState.featuresText}
                      onChange={(e) => setSportsPkgFormState({ ...sportsPkgFormState, featuresText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
                    >
                      💾 पॅकेज सेव्ह व अपडेट करा
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSportsPkgModal(false);
                        setEditingSportsPkgId(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      रद्द करा
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF SPORTS PACKAGES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(siteForm.sportsPackages || [
                  { id: "spk-1", title: "स्पोर्ट्स क्लब डे पास", price: "₹ ३०० / दिवस", subtitle: "सर्व क्रीडा सोयी वापरता येतील", features: ["स्विमिंग पूल प्रवेश", "जीम व इनडोअर गेम्स", "चहा व अल्पोपहार"] },
                  { id: "spk-2", title: "मासिक जीम व स्पोर्ट्स मेंबरशिप", price: "₹ २,५०० / महिना", subtitle: "नियमित सदस्यांसाठी सवलत", features: ["२४x७ जीम प्रवेश", "स्विमिंग पूल व बॅडमिंटन", "पर्सनल फिटनेस ट्रेनर सल्ला"] },
                  { id: "spk-3", title: "वार्षिक फॅमिली स्पोर्ट्स मेंबरशिप", price: "₹ २५,००० / वर्ष", subtitle: "संपूर्ण कुटुंबासाठी ऑल-इन-वन", features: ["४ सदस्यांसाठी मोफत प्रवेश", "क्लब इव्हेंट्स प्राधान्य", "विनामूल्य स्पोर्ट्स किट"] },
                ]).map((spk, idx) => (
                  <div key={spk.id || idx} className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-400 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2 border-b border-purple-100 pb-2">
                        <span className="font-extrabold text-sm text-purple-950">{spk.title}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSportsPkgId(spk.id);
                              setSportsPkgFormState({
                                title: spk.title,
                                price: spk.price,
                                subtitle: spk.subtitle || "",
                                featuresText: spk.features ? spk.features.join("\n") : "",
                              });
                              setShowSportsPkgModal(true);
                            }}
                            className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                            title="एडिट"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`नक्की "${spk.title}" पॅकेज डिलीट करायचे?`)) {
                                const current = siteForm.sportsPackages || [];
                                const updated = current.filter((_, i) => i !== idx);
                                const newSite = { ...siteForm, sportsPackages: updated };
                                setSiteForm(newSite);
                                store.updateSiteData(newSite);
                                setSaveSuccessMsg("स्पोर्ट्स पॅकेज डिलीट केले!");
                                setTimeout(() => setSaveSuccessMsg(""), 3000);
                              }
                            }}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                            title="डिलीट"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="font-black text-lg text-purple-700">{spk.price}</p>
                      {spk.subtitle && <p className="text-xs font-bold text-emerald-700">{spk.subtitle}</p>}

                      <ul className="pt-2 space-y-1 text-xs font-semibold text-slate-700 border-t border-slate-100">
                        {(spk.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <span className="text-purple-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SPORTS PHOTO GALLERY CARD */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-black text-purple-700 flex items-center gap-2">
                    <span>📷</span>
                    <span>५. स्पोर्ट्स क्लब फोटो गॅलरी (Sports Gallery Photos)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    स्पोर्ट्स क्लबचे सर्व फोटो येथे जोडा व व्यवस्थापित करा.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs cursor-pointer shadow-sm transition-transform hover:scale-105">
                  <span>📷 कॉम्प्युटरवरून फोटो अपलोड करा</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        const current = siteForm.sportsGallery || [
                          "/images/epic_sports_gym_bg.png",
                          "/images/Screenshot 2026-07-31 103712.png",
                          "/images/Screenshot 2026-07-31 103659.png",
                        ];
                        const updated = { ...siteForm, sportsGallery: [...current, url] };
                        setSiteForm(updated);
                        store.updateSiteData(updated);
                        setSaveSuccessMsg("गॅलरीमध्ये स्पोर्ट्स फोटो अपलोड झाला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      })
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(siteForm.sportsGallery || [
                  "/images/epic_sports_gym_bg.png",
                  "/images/Screenshot 2026-07-31 103712.png",
                  "/images/Screenshot 2026-07-31 103659.png",
                  "/images/pickleball-court.png",
                ]).map((photoUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                    <img src={photoUrl} alt={`Sports Photo ${idx}`} className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const current = siteForm.sportsGallery || [];
                        const updated = current.filter((_, i) => i !== idx);
                        const newSite = { ...siteForm, sportsGallery: updated };
                        setSiteForm(newSite);
                        store.updateSiteData(newSite);
                        setSaveSuccessMsg("फोटो गॅलरीतून डिलीट केला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] shadow cursor-pointer transition-colors"
                    >
                      🗑️ डिलीट
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. PACKAGES & PLANS MANAGER (WITH DAYS, MONTH & YEAR CATEGORIZATION) */}
        {activeTab === "packages" && (
          <div className="space-y-8 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900">
                Packages & Plans Manager (दिवसनिहाय, महिनानिहाय व वर्षनिहाय योजना)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                दिवसनिहाय (Days-wise), महिनानिहाय (Month-wise) आणि वर्षनिहाय (Year-wise / Lifetime) प्रवेश योजना जोडा किंवा बदला.
              </p>
            </div>

            {/* FILTER CATEGORY TAB BUTTONS */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-max">
              {[
                { id: "all", label: "सर्व योजना (All Packages)", icon: "⠿" },
                { id: "days", label: "☀️ दिवसनिहाय (Days-wise)", icon: "☀️" },
                { id: "month", label: "🗓️ महिनानिहाय (Month-wise)", icon: "🗓️" },
                { id: "year", label: "🎆 वर्षनिहाय (Year-wise / Lifetime)", icon: "🎆" },
              ].map((filterTab) => (
                <button
                  key={filterTab.id}
                  onClick={() => setPkgPeriodFilter(filterTab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                    pkgPeriodFilter === filterTab.id
                      ? "bg-[#810B38] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-300/60"
                  }`}
                >
                  {filterTab.label}
                </button>
              ))}
            </div>

            {/* ADD / EDIT PACKAGE FORM */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 max-w-4xl shadow-sm">
              <h3 className="font-display text-lg font-black text-[#810B38]">
                {editingPkgId ? "✏️ पॅकेज एडिट करा (Edit Package)" : "➕ नवीन पॅकेज जोडा (Add New Package)"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!pkgForm.title || !pkgForm.price) return;
                  const features = pkgForm.featuresText
                    .split("\n")
                    .map((f) => f.trim())
                    .filter(Boolean);

                  if (editingPkgId) {
                    store.updatePackage(editingPkgId, {
                      title: pkgForm.title,
                      price: pkgForm.price,
                      sub: pkgForm.sub,
                      badge: pkgForm.badge,
                      periodType: pkgForm.periodType,
                      featured: pkgForm.featured,
                      features: features.length ? features : ["विशेष सुविधा उपलब्ध"],
                    });
                    setSaveSuccessMsg("पॅकेज अपडेट झाले!");
                  } else {
                    store.addPackage({
                      title: pkgForm.title,
                      price: pkgForm.price,
                      sub: pkgForm.sub,
                      badge: pkgForm.badge || "विशेष योजना",
                      periodType: pkgForm.periodType,
                      featured: pkgForm.featured,
                      features: features.length ? features : ["विशेष सुविधा उपलब्ध"],
                    });
                    setSaveSuccessMsg("नवीन पॅकेज जोडले गेले!");
                  }

                  setEditingPkgId(null);
                  setPkgForm({ title: "", price: "", sub: "", badge: "", periodType: "month", featuresText: "", featured: false });
                  setTimeout(() => setSaveSuccessMsg(""), 3000);
                }}
                className="space-y-4"
              >
                {/* DURATION TYPE SELECTOR */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    कालावधी प्रकार (Select Package Duration Type) *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "days", label: "☀️ दिवसनिहाय (Days-wise)" },
                      { id: "month", label: "🗓️ महिनानिहाय (Month-wise)" },
                      { id: "year", label: "🎆 वर्षनिहाय (Year-wise / Lifetime)" },
                    ].map((pType) => (
                      <button
                        type="button"
                        key={pType.id}
                        onClick={() => setPkgForm({ ...pkgForm, periodType: pType.id as any })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                          pkgForm.periodType === pType.id
                            ? "bg-[#810B38] text-white border-[#810B38] shadow-sm"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {pType.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      पॅकेजचे नाव (Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. आनंदनिवास (राहण्यासह) किंवा १ दिवस सहल"
                      value={pkgForm.title}
                      onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      किंमत / शुल्क (Price) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. ₹ ६०० /- किंवा ₹ ११,००० /-"
                      value={pkgForm.price}
                      onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      उप-शीर्षक / कालावधी (Subtitle)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. वेळ: स. ११ ते सायं. ५ किंवा प्रति महिना"
                      value={pkgForm.sub}
                      onChange={(e) => setPkgForm({ ...pkgForm, sub: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      टॅग / बॅज (Badge Tag)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. १ दिवस सहल भेट पास / महिना पर्याय"
                      value={pkgForm.badge}
                      onChange={(e) => setPkgForm({ ...pkgForm, badge: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    वैशिष्ट्ये / सोयी-सुविधा (प्रत्येक ओळीवर १ वैशिष्ट्य)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`फुल फर्निश्ड निवास + आनंदशाळा\nनाश्ता २ वेळ, जेवण २ वेळ\n२४x७ वैद्यकीय काळजी`}
                    value={pkgForm.featuresText}
                    onChange={(e) => setPkgForm({ ...pkgForm, featuresText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featuredPkg"
                    checked={pkgForm.featured}
                    onChange={(e) => setPkgForm({ ...pkgForm, featured: e.target.checked })}
                    className="size-5 rounded border-slate-300 bg-white accent-[#810B38] cursor-pointer"
                  />
                  <label htmlFor="featuredPkg" className="text-sm font-bold text-slate-800 cursor-pointer">
                    ह्या पॅकेजला हायलाइट (Featured Highlighted Card) करा
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#68092D] font-extrabold text-white hover:scale-105 transition-all cursor-pointer shadow-md text-xs sm:text-sm"
                  >
                    {editingPkgId ? "✓ अपडेट करा (Save Package)" : "➕ पॅकेज जोडा (Save Package)"}
                  </button>

                  {editingPkgId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPkgId(null);
                        setPkgForm({ title: "", price: "", sub: "", badge: "", periodType: "month", featuresText: "", featured: false });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 text-xs sm:text-sm"
                    >
                      रद्द करा (Cancel)
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* EXISTING PACKAGES LIST */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-black text-slate-900">
                उपलब्ध पॅकेजेस ({filteredPackages.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between shadow-sm relative ${
                      pkg.featured
                        ? "border-[#810B38] bg-[#810B38]/5"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#810B38]/10 text-[#810B38] border border-[#810B38]/30">
                          {pkg.badge || "पॅकेज"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white shadow-sm">
                          {pkg.periodType === "days" ? "☀️ दिवसनिहाय" : pkg.periodType === "month" ? "🗓️ महिनानिहाय" : "🎆 वर्षनिहाय"}
                        </span>
                      </div>

                      <h4 className="font-display text-xl font-extrabold text-slate-900">{pkg.title}</h4>
                      <p className="mt-2 text-2xl font-black text-[#810B38]">{pkg.price}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-bold">{pkg.sub}</p>

                      <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                        {pkg.features.map((f, idx) => (
                          <li key={idx} className="flex gap-1.5">
                            <span className="text-[#810B38] font-bold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setEditingPkgId(pkg.id);
                          setPkgForm({
                            title: pkg.title,
                            price: pkg.price,
                            sub: pkg.sub || "",
                            badge: pkg.badge || "",
                            periodType: pkg.periodType || "month",
                            featuresText: pkg.features.join("\n"),
                            featured: !!pkg.featured,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-[#810B38] hover:text-white transition-all font-extrabold text-xs cursor-pointer"
                      >
                        ✏️ एडिट करा
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`नक्की "${pkg.title}" पॅकेज डिलीट करायचे?`)) {
                            store.deletePackage(pkg.id);
                            setSaveSuccessMsg("पॅकेज डिलीट केले!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-all font-bold text-xs cursor-pointer"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SIMPLE CLEAN GALLERY MANAGER */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-fade-up max-w-5xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900">
                Gallery Manager (फोटो गॅलरी मॅनेजर)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                कॉम्प्युटरवरून फोटो निवडताच तो थेट गॅलरीमध्ये सेव्ह होईल व गॅलरी पेजवर दिसेल.
              </p>
            </div>

            {/* SIMPLE UPLOAD CARD */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-display text-lg font-black text-[#810B38] flex items-center gap-2">
                    <span>📤</span>
                    <span>नवीन फोटो अपलोड करा (Upload Photo)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    कॉम्प्युटरवरून फोटो फाईल निवडा:
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#68092D] text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md transition-transform hover:scale-105">
                  <span>📷 कॉम्प्युटरवरून फोटो फाईल निवडा</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, (url) => {
                        store.addGalleryItem({
                          url,
                          caption: "आनंदशाळा फोटो",
                          category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती"],
                        });
                        setSaveSuccessMsg("नवीन फोटो गॅलरीत यशस्वीरित्या जोडला गेला!");
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      })
                    }
                  />
                </label>
              </div>
            </div>

            {/* GALLERY PHOTOS GRID */}
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>🖼️</span>
                  <span>गॅलरीमधील सर्व फोटो ({store.gallery.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                {store.gallery.map((g) => (
                  <div key={g.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm flex flex-col justify-between">
                    <img src={g.url} alt={g.caption || "Gallery Photo"} className="h-36 w-full object-cover" />
                    
                    <div className="p-2 bg-slate-900/90 flex items-center justify-between gap-1">
                      <span className="text-[11px] text-slate-200 font-extrabold truncate px-1">
                        {g.caption || "फोटो"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`नक्की हा फोटो डिलीट करायचा?`)) {
                            store.deleteGalleryItem(g.id);
                            setSaveSuccessMsg("फोटो डिलीट केला!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          }
                        }}
                        className="px-2 py-0.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] shadow cursor-pointer transition-colors"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. INQUIRIES & MESSAGES (ANANDSHALA & ALL) */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="font-display text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>✉️</span>
                  <span>चौकशी संदेश (Inquiries & Messages)</span>
                </h1>
                <p className="text-slate-600 text-sm mt-1 font-semibold">
                  वेबसाइटवरून आलेल्या सर्व चौकशी संदेशांची यादी व माहिती.
                </p>
              </div>

              {/* CATEGORY FILTER TABS */}
              <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-xl text-xs font-black">
                <button
                  onClick={() => setInquiryFilter("all")}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    inquiryFilter === "all"
                      ? "bg-[#810B38] text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  सर्व संदेश ({store.inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter("anandshala")}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    inquiryFilter === "anandshala"
                      ? "bg-[#810B38] text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  🏠 आनंदशाळा ({store.anandshalaInquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter("sports")}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    inquiryFilter === "sports"
                      ? "bg-purple-700 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  🏆 स्पोर्ट्स ({store.sportsInquiries.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(inquiryFilter === "all"
                ? store.inquiries
                : inquiryFilter === "anandshala"
                ? store.anandshalaInquiries
                : store.sportsInquiries
              ).map((inq) => (
                <div
                  key={inq.id}
                  className={`bg-white border rounded-2xl p-6 transition-all shadow-sm ${
                    !inq.read
                      ? "border-[#810B38] ring-1 ring-[#810B38]/30 shadow-md"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg font-black text-slate-900">{inq.name}</h3>
                        {!inq.read && (
                          <span className="bg-[#810B38] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                            NEW MESSAGE
                          </span>
                        )}
                        {inq.category === "sports" && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
                            🏋️ स्पोर्ट्स क्लब
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#810B38] font-black mt-1 flex-wrap">
                        <a href={`tel:${inq.phone}`} className="hover:underline flex items-center gap-1">
                          📞 {inq.phone}
                        </a>
                        {inq.email && <span>| ✉️ {inq.email}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-extrabold">{inq.date}</span>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide">विषय: {inq.subject}</p>
                    <p className="text-sm text-slate-800 mt-1.5 leading-relaxed font-medium">{inq.message}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-3 flex-wrap">
                    <a
                      href={`https://wa.me/91${inq.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      💬 WhatsApp
                    </a>
                    {!inq.read && (
                      <button
                        onClick={() => store.markInquiryRead(inq.id)}
                        className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-300 text-sky-800 text-xs font-black hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
                      >
                        ✓ वाचित (Mark as Read)
                      </button>
                    )}
                    <button
                      onClick={() => store.deleteInquiry(inq.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-black hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                      🗑️ डिलीट संदेश
                    </button>
                  </div>
                </div>
              ))}

              {(inquiryFilter === "all"
                ? store.inquiries
                : inquiryFilter === "anandshala"
                ? store.anandshalaInquiries
                : store.sportsInquiries
              ).length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
                  <span className="text-4xl">📬</span>
                  <h3 className="font-display text-lg font-black text-slate-800">
                    कोणतेही संदेश उपलब्ध नाहीत
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    या कॅटेगरीमध्ये सध्या कोणतेही नवीन किंवा जुने संदेश नाहीत.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. BROCHURE MANAGER (ADD / EDIT / UPLOAD NEW BROCHURES) */}
        {activeTab === "brochure" && (
          <div className="space-y-8 animate-fade-up max-w-5xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900">
                Brochure Manager (माहिती पत्रक / ब्रॉशर व्यवस्थापन)
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                आनंदशाळेचे नवीन PDF / इमेज **माहिती पत्रक (Brochures)** अपलोड करा किंवा जोडा.
              </p>
            </div>

            {/* ADD BROCHURE FORM WITH COMPUTER FILE PICKER */}
            <form onSubmit={handleAddBrochure} className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-display text-lg font-black text-[#810B38]">
                📑 नवीन माहिती पत्रक / ब्रॉशर अपलोड करा (Add New Brochure)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    ब्रॉशरचे नाव / शीर्षक (Brochure Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. प्रीतम आनंदशाळा दरपत्रक व उपक्रम माहिती"
                    value={newBrochureObj.title}
                    onChange={(e) => setNewBrochureObj({ ...newBrochureObj, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={newBrochureObj.category}
                    onChange={(e) => setNewBrochureObj({ ...newBrochureObj, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                  >
                    <option value="आनंदशाळा ब्रॉशर">आनंदशाळा ब्रॉशर</option>
                    <option value="दरपत्रक व फी तक्ता">दरपत्रक व फी तक्ता</option>
                    <option value="विशेष सोहळा व माहिती">विशेष सोहळा व माहिती</option>
                  </select>
                </div>
              </div>

              {/* FILE PICKER FOR PDF OR IMAGE BROCHURE */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  📄 १. कॉम्प्युटरवरून PDF किंवा इमेज फाईल निवडा (Upload PDF / Image File)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    handleFileUpload(e, (url, type) =>
                      setNewBrochureObj({ ...newBrochureObj, fileUrl: url, fileType: type })
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-[#810B38] file:text-white hover:file:bg-[#68092D]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  २. किंवा फाईल ऑनलाईन लिंक / URL (Direct File Link)
                </label>
                <input
                  type="text"
                  placeholder="/images/Screenshot 2026-07-31 103107.png किंवा https://..."
                  value={newBrochureObj.fileUrl}
                  onChange={(e) => setNewBrochureObj({ ...newBrochureObj, fileUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  वर्णन / माहिती (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="ब्रोशरमधील मुख्य वैशिष्ट्यांचे वर्णन..."
                  value={newBrochureObj.description}
                  onChange={(e) => setNewBrochureObj({ ...newBrochureObj, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#68092D] font-extrabold text-white hover:scale-105 transition-all cursor-pointer shadow-md text-xs sm:text-sm"
              >
                📄 ब्रॉशर अपलोड करा (Save Brochure)
              </button>
            </form>

            {/* BROCHURES LIST */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-black text-slate-900">
                उपलब्ध माहिती पत्रके ({store.brochures.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {store.brochures.map((b) => (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#810B38]/10 text-[#810B38] border border-[#810B38]/30">
                          {b.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{b.date}</span>
                      </div>

                      <h4 className="font-display text-lg font-black text-slate-900">{b.title}</h4>
                      {b.description && <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">{b.description}</p>}

                      {/* PREVIEW IMAGE OR FILE LINK */}
                      {b.fileUrl && (
                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                          {b.fileUrl.startsWith("data:image") || b.fileUrl.endsWith(".png") || b.fileUrl.endsWith(".jpeg") || b.fileUrl.endsWith(".jpg") ? (
                            <img src={b.fileUrl} alt={b.title} className="h-44 w-full object-cover rounded-lg" />
                          ) : (
                            <div className="p-4 text-center">
                              <span className="text-3xl">📄</span>
                              <p className="text-xs font-bold text-slate-700 mt-1">PDF फाईल उपलब्ध आहे</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={b.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-300 text-sky-800 text-xs font-black hover:bg-sky-600 hover:text-white transition-colors cursor-pointer"
                      >
                        👁️ पहा / डाउनलोड करा
                      </a>

                      <button
                        onClick={() => {
                          if (confirm(`नक्की "${b.title}" ब्रॉशर डिलीट करायचे?`)) {
                            store.deleteBrochure(b.id);
                            setSaveSuccessMsg("ब्रॉशर डिलीट केले!");
                            setTimeout(() => setSaveSuccessMsg(""), 3000);
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      >
                        🗑️ डिलीट
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. VIDEO MANAGER (व्हिडिओ मॅनेजर) */}
        {activeTab === "testimonials" && (
          <div className="space-y-8 animate-fade-up max-w-4xl">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 flex items-center gap-3">
                <span>🎬</span>
                <span>व्हिडिओ अभिप्राय मॅनेजर (Video Manager)</span>
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-semibold">
                वेबसाईटसाठी व्हिडिओ फाईल किंवा युट्युब/ऑनलाईन व्हिडिओ लिंक सहजपणे जोडण्यासाठी, सेव्ह व डिलीट करण्यासाठी.
              </p>
            </div>

            {/* ADD VIDEO FORM */}
            <form onSubmit={handleAddVideoTestimonial} className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-display text-lg font-black text-[#810B38] flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>🎥</span>
                <span>नवीन व्हिडिओ जोडा (Add Video File / Link)</span>
              </h3>

              {/* OPTIONAL VIDEO TITLE */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  व्हिडिओचे नाव / शीर्षक (Video Name - Optional)
                </label>
                <input
                  type="text"
                  placeholder="उदा. आनंदशाळा मनोगत व्हिडिओ"
                  value={newVideoTestObj.name}
                  onChange={(e) => setNewVideoTestObj({ ...newVideoTestObj, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:border-[#810B38] focus:ring-2 focus:ring-[#810B38]/20 focus:outline-none"
                />
              </div>

              {/* TWO VIDEO INPUT OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OPTION 1: COMPUTER FILE UPLOAD */}
                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                  <label className="block text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📁</span>
                    <span>१. कॉम्प्युटरवरून थेट व्हिडिओ अपलोड करा</span>
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const res = event.target?.result as string;
                          setNewVideoTestObj({
                            ...newVideoTestObj,
                            videoUrl: res || URL.createObjectURL(file),
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 text-slate-800 text-xs font-semibold cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-[#810B38] file:text-white hover:file:bg-[#68092D]"
                  />
                  <p className="text-[11px] text-purple-700 font-bold">
                    (MP4, WEBM, MOV फाईल्स सपोर्टेड)
                  </p>
                </div>

                {/* OPTION 2: VIDEO LINK / YOUTUBE URL */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <label className="block text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔗</span>
                    <span>२. किंवा ऑनलाईन व्हिडिओ / YouTube लिंक टाका</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/... किंवा video.mp4"
                    value={newVideoTestObj.videoUrl}
                    onChange={(e) => setNewVideoTestObj({ ...newVideoTestObj, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-blue-300 text-slate-900 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-blue-700 font-bold">
                    (YouTube, Drive किंवा डायरेक्ट व्हिडिओ URL)
                  </p>
                </div>
              </div>

              {/* LIVE FORM VIDEO PREVIEW & CLOSE BUTTON */}
              {newVideoTestObj.videoUrl && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <span>🎬</span>
                      <span>निवडलेल्या व्हिडिओचा लाईव्ह प्रिव्ह्यू (Live Video Preview):</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setNewVideoTestObj({ ...newVideoTestObj, videoUrl: "" })}
                      className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                    >
                      <span>✖️</span>
                      <span>प्रिव्ह्यू बंद करा / व्हिडिओ काढून टाका</span>
                    </button>
                  </div>

                  <div className="aspect-video max-h-64 rounded-xl overflow-hidden bg-black">
                    {newVideoTestObj.videoUrl.startsWith("data:video") || newVideoTestObj.videoUrl.startsWith("blob:") || newVideoTestObj.videoUrl.endsWith(".mp4") || newVideoTestObj.videoUrl.endsWith(".webm") ? (
                      <video controls src={newVideoTestObj.videoUrl} className="w-full h-full object-contain" />
                    ) : (
                      <iframe src={newVideoTestObj.videoUrl} className="w-full h-full border-0" allowFullScreen />
                    )}
                  </div>
                </div>
              )}

              {/* SAVE & CLEAR BUTTONS */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={!newVideoTestObj.videoUrl}
                  className="px-8 py-3 rounded-xl bg-[#810B38] hover:bg-[#68092D] disabled:opacity-50 font-extrabold text-white hover:scale-105 transition-all cursor-pointer shadow-md text-sm flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  <span>व्हिडिओ सेव्ह करा (Save Video)</span>
                </button>

                {newVideoTestObj.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setNewVideoTestObj({ ...newVideoTestObj, videoUrl: "" })}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🗑️</span>
                    <span>निवडलेला व्हिडिओ काढून टाका (Clear Selection)</span>
                  </button>
                )}
              </div>
            </form>

            {/* UPLOADED VIDEOS LIST */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-black text-slate-900 flex items-center gap-2">
                <span>📹</span>
                <span>अपलोड केलेले व्हिडिओ ({store.testimonials.length})</span>
              </h3>

              {store.testimonials.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-500 font-semibold text-sm">
                  सध्या कोणताही व्हिडिओ जोडलेला नाही. वरील फॉर्ममधून नवीन व्हिडिओ जोडा.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {store.testimonials.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        {/* VIDEO PLAYER */}
                        <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                          {t.videoUrl?.startsWith("data:video") || t.videoUrl?.startsWith("blob:") || t.videoUrl?.endsWith(".mp4") || t.videoUrl?.endsWith(".webm") ? (
                            <video controls src={t.videoUrl} className="w-full h-full object-cover" />
                          ) : t.videoUrl?.includes("youtube") || t.videoUrl?.includes("youtu.be") || t.videoUrl?.startsWith("http") ? (
                            <iframe
                              src={t.videoUrl}
                              title={t.name || "Video"}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-slate-900 text-white font-bold text-xs">
                              📹 नो व्हिडियो प्रिव्ह्यू
                            </div>
                          )}
                        </div>

                        {t.name && (
                          <div className="p-4 border-b border-slate-100">
                            <h4 className="font-extrabold text-sm text-slate-900">{t.name}</h4>
                          </div>
                        )}
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold">अभिप्राय व्हिडिओ</span>
                        <button
                          onClick={() => {
                            if (confirm("नक्की हा व्हिडिओ डिलीट करायचा?")) {
                              store.deleteTestimonial(t.id);
                              setSaveSuccessMsg("व्हिडिओ डिलीट झाला!");
                              setTimeout(() => setSaveSuccessMsg(""), 3000);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-red-700 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>🗑️</span>
                          <span>व्हिडिओ डिलीट करा (Delete)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FULL-SCREEN IMAGE PREVIEW LIGHTBOX MODAL */}
        {previewModalImg && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setPreviewModalImg(null)}
          >
            <div
              className="bg-white p-4 rounded-3xl max-w-3xl max-h-[90vh] flex flex-col items-center relative shadow-2xl overflow-hidden space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full border-b border-slate-200 pb-2 px-2">
                <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <span>👁️</span>
                  <span>फोटो प्रीव्ह्यू (Photo Full Preview)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewModalImg(null)}
                  className="px-3.5 py-1.5 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  ✖️ बंद करा
                </button>
              </div>

              <div className="max-h-[75vh] overflow-auto rounded-2xl border border-slate-200 p-2 bg-slate-900">
                <img
                  src={previewModalImg}
                  alt="Full Preview"
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop";
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
