import React, { useState, useEffect, useMemo } from "react";
import "./HomeHero.css";
import { useLanguage } from "@/lib/use-language";
import { useAdminStore } from "@/lib/admin-store";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const HomeHero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { isEn } = useLanguage();
  const store = useAdminStore();

  const sliderImages = useMemo(() => {
    const custom = (store.siteData.aanandshalaImages || []).filter(Boolean);
    // If custom images exist and are not old defaults containing slider4
    if (custom.length > 0 && !custom.includes("/images/slider4.JPG")) {
      return custom;
    }
    return ["/images/slider1.JPG", "/images/slider2.JPG", "/images/slider3.png"];
  }, [store.siteData.aanandshalaImages]);

  const defaultSlidesInfo = [
    {
      tag: isEn ? "🏛️ Main Anandshala Campus" : "🏛️ मुख्य आनंदशाळा वास्तू",
      title: isEn ? "1.5 Acre Scenic Campus" : "१.५ एकर निसर्गरम्य परिसर",
      subtitle: isEn ? "Sangli's premier & fully equipped senior citizen hub" : "सांगली जिल्ह्यातील भव्य व सर्व सोयींनी युक्त ज्येष्ठ नागरिक संकूल",
    },
    {
      tag: isEn ? "🏊‍♂️ Preetam Sports & Fitness Club" : "🏊‍♂️ प्रीतम क्रीडा & फिटनेस क्लब",
      title: isEn ? "Olympic Pool & AC Gym" : "ऑलिंपिक स्विमिंग पूल व AC जिम",
      subtitle: isEn ? "Badminton, Pickleball, Table Tennis, Library & Modern Halls" : "बॅडमिंटन, पिकलबॉल, टेबल टेनिस, वाचनालय व अत्याधुनिक हॉल्स",
    },
    {
      tag: isEn ? "🌸 Joyful Golden Years" : "🌸 आनंदी सुवर्णवर्षे",
      title: isEn ? "Warm Belonging & Family Bond" : "आपुलकीचे नाते व कौटुंबिक आनंद",
      subtitle: isEn ? "Vibrant, joyful & secure golden years with peer friends" : "आपल्या वयाच्या मित्र-मैत्रिणींसोबत उत्साही व सुरक्षित जीवन सोहळा",
    },
  ];

  const heroSlides = useMemo(() => {
    return sliderImages.map((imgUrl, i) => {
      const info = defaultSlidesInfo[i % defaultSlidesInfo.length];
      return {
        image: imgUrl,
        tag: info.tag,
        title: info.title,
        subtitle: info.subtitle,
      };
    });
  }, [sliderImages, isEn]);

  // Preload all slider images in browser memory for zero delay
  useEffect(() => {
    heroSlides.forEach((s) => {
      if (s.image) {
        const img = new Image();
        img.src = s.image;
      }
    });
  }, [JSON.stringify(heroSlides.map((s) => s.image))]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="hero-section-clean">

      {/* ══════════════════════════════════════════════════════════════
          1. TOP HALF: 100% FULL-WIDTH PURE IMAGE CAROUSEL SLIDER (ZERO WHITESPACE)
         ══════════════════════════════════════════════════════════════ */}
      <div className="hero-top-slide-box">
        {/* SLIDING IMAGES */}
        {heroSlides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt={slide.title}
            loading="eager"
            decoding="async"
            className={`hero-slide-photo ${idx === activeSlide ? "slide-active" : "slide-hidden"}`}
          />
        ))}

        {/* PREV / NEXT NAV ARROWS */}
        <button 
          onClick={handlePrev}
          className="hero-arrow-btn left-arrow cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          className="hero-arrow-btn right-arrow cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* FLOATING TOP OVERLAY DOTS ON PHOTO */}
        <div className="hero-slide-top-bar justify-end">
          <div className="slider-dots-group">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`slider-dot-item ${idx === activeSlide ? "slider-dot-active" : ""}`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
