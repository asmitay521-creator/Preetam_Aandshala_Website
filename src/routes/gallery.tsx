import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/use-language";
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

import { useAdminStore } from "@/lib/admin-store";

// ===== Fallback Gallery Data =====
const fallbackGalleryImages = [
  { id: "g-img1", titleEn: "Anandshala Gallery Photo 1", titleMr: "आनंदशाळा गॅलरी चित्र १", date: "26 Jan 2026", url: "/images/gallery imgage1.JPG", category: ["सर्व"] },
  { id: "g-img2", titleEn: "Anandshala Gallery Photo 2", titleMr: "आनंदशाळा गॅलरी चित्र २", date: "26 Jan 2026", url: "/images/gallery image2.JPG", category: ["सर्व"] },
  { id: "g-img3", titleEn: "Anandshala Gallery Photo 3", titleMr: "आनंदशाळा गॅलरी चित्र ३", date: "26 Jan 2026", url: "/images/gallery image3.JPG", category: ["सर्व"] },
  { id: "g-img4", titleEn: "Anandshala Gallery Photo 4", titleMr: "आनंदशाळा गॅलरी चित्र ४", date: "26 Jan 2026", url: "/images/gallery image4.JPG", category: ["सर्व"] },
  { id: "g-img5", titleEn: "Anandshala Gallery Photo 5", titleMr: "आनंदशाळा गॅलरी चित्र ५", date: "26 Jan 2026", url: "/images/gallery image5.JPG", category: ["सर्व"] },
  { id: "g-img6", titleEn: "Anandshala Gallery Photo 6", titleMr: "आनंदशाळा गॅलरी चित्र ६", date: "26 Jan 2026", url: "/images/gallery image6.JPG", category: ["सर्व"] },
  { id: "g-img7", titleEn: "Anandshala Gallery Photo 7", titleMr: "आनंदशाळा गॅलरी चित्र ७", date: "26 Jan 2026", url: "/images/gallery image7.JPG", category: ["सर्व"] },
  { id: "g-img8", titleEn: "Anandshala Gallery Photo 8", titleMr: "आनंदशाळा गॅलरी चित्र ८", date: "26 Jan 2026", url: "/images/gallery image8.JPG", category: ["सर्व"] },
];

function Gallery() {
  const { isEn } = useLanguage();
  const store = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("सर्व");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear old cached gallery localStorage keys so old Screenshot images don't show
  useEffect(() => {
    const oldKeys = [
      "anandshala_gallery_distinguished_v1",
      "anandshala_gallery_distinguished_v2",
      "anandshala_gallery_distinguished_v3",
      "anandshala_gallery_distinguished_v4",
    ];
    oldKeys.forEach((k) => localStorage.removeItem(k));
  }, []);

  // Only use the defined 8 gallery images — filter store.gallery to only show gallery image files
  const ALLOWED_GALLERY_URLS = new Set(fallbackGalleryImages.map((f) => f.url));
  const storeGalleryFiltered = (store.gallery || []).filter((item: any) =>
    ALLOWED_GALLERY_URLS.has(item.url || item.image)
  );
  const rawImages = storeGalleryFiltered.length > 0 ? storeGalleryFiltered : fallbackGalleryImages;

  // Compute unique categories
  const categoriesSet = new Set<string>(["सर्व"]);
  rawImages.forEach((item: any) => {
    if (Array.isArray(item.category)) {
      item.category.forEach((c: string) => categoriesSet.add(c));
    } else if (typeof item.category === "string" && item.category) {
      categoriesSet.add(item.category);
    }
  });
  const categoriesList = Array.from(categoriesSet);

  const filteredImages = rawImages.filter((item: any) => {
    if (selectedCategory === "सर्व") return true;
    if (Array.isArray(item.category)) {
      return item.category.includes(selectedCategory);
    }
    return item.category === selectedCategory;
  });

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

  const activePhoto: any = selectedIndex !== null ? filteredImages[selectedIndex] : null;

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
            {isEn ? "Photo Gallery • GALLERY" : "फोटो गॅलरी • GALLERY"}
          </span>

          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-[#be185d]">
            {isEn ? "Anandshala Photo Gallery" : "आनंदशाळा फोटो गॅलरी"}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#f472b6] max-w-2xl mx-auto font-medium">
            सांगलीच्या कुशीत, निसर्गरम्य १५ एकर परिसरात साकारलेल्या आनंदी क्षणांची सुंदर चित्रे.
          </p>

          <div className="mt-6 w-24 h-1 rounded-full mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
        </div>






        {/* ===== GALLERY CARDS GRID ===== */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-semibold">
            {isEn ? "No photos available in this category." : "या श्रेणीत फोटो उपलब्ध नाहीत."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((item: any, index: number) => {
              const imgSrc = item.url || item.image || "/images/gallery imgage1.JPG";
              const titleText = item.caption || (isEn ? item.titleEn : item.titleMr) || "आनंदशाळा फोटो";
              return (
                <motion.div
                  key={item.id || index}
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
                  <img
                    src={imgSrc}
                    alt={titleText}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/gallery imgage1.JPG";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs sm:text-sm font-extrabold line-clamp-2">{titleText}</p>
                  </div>
                </motion.div>
              );
            })}
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
                  src={activePhoto.url || activePhoto.image || ""}
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