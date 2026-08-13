import React, { useState } from "react";
import { useAdminStore, TestimonialItem } from "@/lib/admin-store";
import { Star, Play, X, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const store = useAdminStore();
  const [activeVideo, setActiveVideo] = useState<TestimonialItem | null>(null);

  // Filter approved testimonials
  const testimonials = store.testimonials.filter((t) => t.approved !== false);

  if (testimonials.length === 0) return null;

  const formatEmbedUrl = (url?: string): string => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/watch")) {
      const id = new URLSearchParams(url.split("?")[1]).get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-br from-[#1a0429] via-[#2d0739] to-[#0c0216] text-white relative overflow-hidden font-sans border-t border-b border-pink-500/20" id="testimonials">
      {/* AMBIENT LIGHT BLOBS */}
      <div className="pointer-events-none absolute top-10 left-10 size-[400px] rounded-full bg-pink-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 size-[400px] rounded-full bg-purple-600/20 blur-[130px]" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* HEADER AREA */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-black uppercase tracking-widest shadow-lg">
            <span>🎬 व्हिडिओ व सदस्यांचे मनोगत</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            मान्यवर व सभासदांचे <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-300 bg-clip-text text-transparent">व्हिडिओ अभिप्राय</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-semibold">
            प्रीतम आनंदशाळा व स्पोर्ट्स क्लबबद्दल प्रसिद्ध अभिनेते, क्रीडापटू व सभासदांचे उत्स्फूर्त अनुभव व संदेश.
          </p>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => {
            const embedUrl = formatEmbedUrl(item.videoUrl);
            const isVideo = Boolean(embedUrl);

            return (
              <div
                key={item.id}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-pink-400/50 flex flex-col justify-between"
              >
                {/* VIDEO THUMBNAIL / EMBED PLAYER */}
                {isVideo ? (
                  <div className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => setActiveVideo(item)}>
                    {item.videoThumbnail ? (
                      <img
                        src={item.videoThumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 grid place-items-center">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    {/* PLAY BUTTON OVERLAY */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="size-16 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="size-7 fill-white translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-amber-300 border border-white/20 flex items-center gap-1.5">
                      <span>▶️</span> व्हिडिओ पहा
                    </span>
                  </div>
                ) : (
                  <div className="p-6 pb-2">
                    <Quote className="size-10 text-pink-400/40" />
                  </div>
                )}

                {/* TEXT CONTENT & SPEAKER INFO */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  {item.text && (
                    <p className="text-slate-200 text-xs sm:text-sm font-semibold italic leading-relaxed line-clamp-3">
                      "{item.text}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h4>
                      {item.role && (
                        <p className="text-xs font-bold text-pink-300/90">{item.role}</p>
                      )}
                    </div>

                    {/* STAR RATING */}
                    <div className="flex items-center gap-1 shrink-0">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN VIDEO LIGHTBOX MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl p-4 sm:p-6 border border-pink-500/30 shadow-2xl space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">{activeVideo.name}</h3>
                <p className="text-xs font-extrabold text-pink-300">{activeVideo.role}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="size-9 rounded-full bg-white/10 hover:bg-red-600 text-white font-extrabold flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
              {activeVideo.videoUrl && (
                activeVideo.videoUrl.includes("firebasestorage") ||
                activeVideo.videoUrl.includes(".mp4") ||
                activeVideo.videoUrl.includes(".webm") ||
                activeVideo.videoUrl.includes(".mov") ||
                activeVideo.videoUrl.startsWith("data:video") ? (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={`${formatEmbedUrl(activeVideo.videoUrl)}?autoplay=1`}
                    title={activeVideo.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )
              )}
            </div>

            {activeVideo.text && (
              <p className="text-xs sm:text-sm text-slate-300 font-semibold italic bg-white/5 p-4 rounded-xl border border-white/10">
                "{activeVideo.text}"
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
