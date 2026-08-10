import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Sparkles,
  Calendar,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

// ===== Gallery Data =====
const galleryImages = [
  { id: 1,  title: "आनंदशाळा संकुल गॅलरी १", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "26 जानेवारी 2026", image: "/images/gallery imgage1.JPG" },
  { id: 2,  title: "आनंदशाळा परिसर चित्र २", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "26 जानेवारी 2026", image: "/images/gallery image2.JPG" },
  { id: 3,  title: "आनंदशाळा उपक्रम चित्र ३", category: "विशेष कार्यक्रम", date: "26 जानेवारी 2026", image: "/images/gallery image3.JPG" },
  { id: 4,  title: "आनंदशाळा सोहळा चित्र ४", category: "वार्षिक स्नेहसंमेलन", date: "26 जानेवारी 2026", image: "/images/gallery image4.JPG" },
  { id: 5,  title: "आनंदशाळा कार्यक्रम ५", category: "आनंद मेळावा", date: "26 जानेवारी 2026", image: "/images/gallery image5.JPG" },
  { id: 6,  title: "आनंदशाळा क्रीडा & गॅलरी ६", category: "विशेष कार्यक्रम", date: "26 जानेवारी 2026", image: "/images/gallery image6.JPG" },
  { id: 7,  title: "आनंदशाळा परिसर दृश्य ७", category: "बांधकाम", date: "26 जानेवारी 2026", image: "/images/gallery image7.JPG" },
  { id: 8,  title: "आनंदशाळा विशेष सोहळा ८", category: "मान्यवर भेट", date: "26 जानेवारी 2026", image: "/images/gallery image8.JPG" },
  { id: 9,  title: "आनंदभवन परिसर", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "26 जानेवारी 2024", image: "/images/Screenshot 2026-07-31 103107.png" },
  { id: 10, title: "आनंद मेळावा सोहळा", category: "आनंद मेळावा", date: "15 ऑगस्ट 2023", image: "/images/aandmelav 10.jpeg" },
  { id: 11, title: "भूमिपूजन कार्यक्रम", category: "भूमिपूजन", date: "09 जानेवारी 2024", image: "/images/ropya mahotsv1.jpg" },
  { id: 12, title: "वार्षिक स्नेहसंमेलन", category: "वार्षिक स्नेहसंमेलन", date: "25 डिसेंबर 2023", image: "/images/aandshala sahal 1.jpeg" },
  { id: 13, title: "सांस्कृतिक महोत्सव", category: "आनंद मेळावा", date: "14 नोव्हेंबर 2023", image: "/images/aandmelava1.jpg" },
  { id: 14, title: "योगा व ध्यान कक्ष", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "21 जून 2023", image: "/images/Screenshot 2026-07-31 103545.png" },
  { id: 15, title: "संगीत संध्या व सांस्कृतिक", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "05 मार्च 2023", image: "/images/aandmelav 5.jpg" },
  { id: 16, title: "गार्डन, लॉन व संकुल", category: "बांधकाम", date: "10 फेब्रुवारी 2024", image: "/images/Screenshot 2026-07-31 103213.png" },
  { id: 17, title: "रौप्य महोत्सव भूमिपूजन", category: "भूमिपूजन", date: "26 जानेवारी 2024", image: "/images/ropya mahotsv 2.jpg" },
  { id: 18, title: "सामाजिक कार्य शिबिर", category: "सामाजिक कार्य", date: "02 ऑक्टोबर 2023", image: "/images/samajik karya 2.jpeg" },
  { id: 21, title: "मान्यवर सत्कार भेट", category: "मान्यवर भेट", date: "20 डिसेंबर 2023", image: "/images/vyavsaik mahiti 3.jpeg" },
  { id: 22, title: "खेळ व विरंगुळा केंद्र", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "18 नोव्हेंबर 2023", image: "/images/Screenshot 2026-07-31 103517.png" },
  { id: 23, title: "आनंद निवास संकुल", category: "ज्येष्ठ नागरिक आनंदशाळा", date: "10 जानेवारी 2024", image: "/images/Screenshot 2026-07-31 103842.png" },
  { id: 24, title: "आनंद सहल २", category: "वार्षिक स्नेहसंमेलन", date: "2024", image: "/images/aandshala sahal 2.jpg" },
  { id: 25, title: "आनंद सहल ३", category: "वार्षिक स्नेहसंमेलन", date: "2024", image: "/images/aandshala sahal 3.jpg" },
  { id: 26, title: "आनंद सहल ४", category: "वार्षिक स्नेहसंमेलन", date: "2024", image: "/images/aandshala sahal 4.jpg" },
  { id: 27, title: "आनंद सहल ५", category: "वार्षिक स्नेहसंमेलन", date: "2024", image: "/images/aandshala sahal 5.jpeg" },
  { id: 28, title: "आनंद मेळावा ९", category: "आनंद मेळावा", date: "2023", image: "/images/aandmelava 9.jpg" },
];

const categories = [
  "सर्व",
  "ज्येष्ठ नागरिक आनंदशाळा",
  "आनंद मेळावा",
  "भूमिपूजन",
  "बांधकाम",
  "सामाजिक कार्य",
  "वार्षिक स्नेहसंमेलन",
  "मान्यवर भेट",
  "विशेष कार्यक्रम",
];

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("सर्व");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredImages =
    selectedCategory === "सर्व"
      ? galleryImages
      : galleryImages.filter((item) => item.category === selectedCategory);

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setIsPlaying(false);
    setZoomLevel(1);
  };

  const closeImage = () => {
    setSelectedIndex(null);
    setIsPlaying(false);
    setZoomLevel(1);
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : 0));
    setZoomLevel(1);
  };

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0));
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  const resetZoom = () => setZoomLevel(1);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, filteredImages.length]);

  // Slideshow auto-play effect
  useEffect(() => {
    if (isPlaying && selectedIndex !== null) {
      timerRef.current = setInterval(() => {
        nextImage();
      }, 3000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedIndex, filteredImages.length]);

  const activePhoto = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff]">

      {/* Ambient background glows */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-[120px] pointer-events-none" />

      <style>{`
        @keyframes galBorderRotate {
          0% { background-position: 0% 0%, 0% 50%; }
          50% { background-position: 0% 0%, 100% 50%; }
          100% { background-position: 0% 0%, 0% 50%; }
        }
        .gallery-card-anim {
          position: relative;
          background: #0f172a;
          border-radius: 1.25rem;
          overflow: hidden;
          border: 2.5px solid transparent;
          background-image: linear-gradient(#0f172a, #0f172a), 
                            linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6, #f59e0b, #ec4899);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          background-size: 100% 100%, 300% 300%;
          animation: galBorderRotate 6s linear infinite;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
        }
        .gallery-card-anim:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 45px rgba(236, 72, 153, 0.3), 0 0 25px rgba(139, 92, 246, 0.2);
          animation-duration: 2.5s;
        }
        .gal-img-wrapper::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: rotate(25deg);
          transition: all 0.75s ease;
          pointer-events: none;
          opacity: 0;
          z-index: 10;
        }
        .gallery-card-anim:hover .gal-img-wrapper::after {
          left: 130%;
          opacity: 1;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* ===== HEADING ===== */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-pink-200 text-pink-600 font-bold text-xs sm:text-sm">
            <Sparkles size={16} />
            फोटो गॅलरी • GALLERY
          </span>

          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-[#541A1A]">
            आनंदशाळा फोटो गॅलरी
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
            सांगलीच्या कुशीत, निसर्गरम्य १५ एकर परिसरात साकारलेल्या आनंदी क्षणांची सुंदर चित्रे.
          </p>

          <div className="mt-6 w-24 h-1 rounded-full mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
        </div>

        {/* ===== CATEGORY FILTER BUTTONS ===== */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md scale-105"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:shadow-sm"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ===== PHOTO COUNT INFO ===== */}
        <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 mb-8">
          एकूण <span className="text-pink-600 font-extrabold">{filteredImages.length}</span> फोटो उपलब्ध (फोटोवर क्लीक करून मोठ्या स्क्रीनवर स्लाइडर पहा)
        </p>

        {/* ===== GALLERY CARDS GRID ===== */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-semibold">
            या श्रेणीत फोटो उपलब्ध नाहीत.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                onClick={() => {
                  setSelectedIndex(index);
                  setIsPlaying(false);
                  setZoomLevel(1);
                }}
                className="gallery-card-anim gal-img-wrapper group cursor-pointer relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden shadow-md"
              >
                {/* 100% PURE FULL-COVERAGE CRYSTAL CLEAR PHOTO */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/gallery imgage1.JPG";
                  }}
                />

                {/* MINIMAL SLIM BOTTOM GRADIENT OVERLAY ONLY FOR TEXT READABILITY */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

                {/* TOP BADGES */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-pink-600/95 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md border border-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-20">
                  <span className="bg-black/60 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    📸 HD
                  </span>
                </div>

                {/* CRISP MINIMALIST TEXT OVERLAY AT BOTTOM EDGE */}
                <div className="absolute bottom-2.5 inset-x-3 text-white z-20">
                  <div className="flex items-center gap-1.5 text-pink-300 text-[11px] font-bold mb-0.5">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1 group-hover:text-pink-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ===== INTERACTIVE FULLSCREEN PURE PHOTO MODAL ===== */}
      <AnimatePresence>
        {selectedIndex !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden"
          >
            {/* TOP FLOATING TOOLBAR */}
            <div 
              className="w-full max-w-7xl flex items-center justify-end gap-3 z-30 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ZOOM CONTROLS */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/20 backdrop-blur shadow-lg">
                <button
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={18} />
                </button>

                <button
                  onClick={resetZoom}
                  className="px-2.5 py-0.5 text-xs font-extrabold text-pink-300 hover:text-white transition cursor-pointer"
                  title="Reset Zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>

                <button
                  onClick={zoomIn}
                  disabled={zoomLevel >= 3.5}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn size={18} />
                </button>

                {zoomLevel !== 1 && (
                  <button
                    onClick={resetZoom}
                    className="p-1.5 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Reset"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={closeImage}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center transition border border-white/25 shadow-lg cursor-pointer"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* MAIN PURE PHOTO DISPLAY AREA */}
            <div 
              className="relative w-full max-w-6xl flex-1 flex items-center justify-center select-none overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* PREV BUTTON */}
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-pink-600 text-white border border-white/20 backdrop-blur flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 cursor-pointer"
                title="मागील फोटो"
              >
                <ChevronLeft size={24} className="sm:size-8" />
              </button>

              {/* 100% PURE PHOTO */}
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="relative max-h-[85vh] max-w-[90vw] rounded-2xl overflow-auto shadow-2xl border border-white/10 flex items-center justify-center bg-black/90 p-2"
              >
                <img
                  src={activePhoto.image}
                  alt=""
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                  className="max-h-[82vh] max-w-[88vw] object-contain select-none transition-transform"
                />
              </motion.div>

              {/* NEXT BUTTON */}
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 z-30 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-pink-600 text-white border border-white/20 backdrop-blur flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 cursor-pointer"
                title="पुढील फोटो"
              >
                <ChevronRight size={24} className="sm:size-8" />
              </button>
            </div>

            <div className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Gallery;