import { motion } from "framer-motion";
import "@/styles/journey.css";
import JourneyHeader from "./JourneyHeader";
import JourneyTimeline from "./JourneyTimeline";
import BackgroundEffects from "./BackgroundEffects";
import FloatingParticles from "./FloatingParticles";
import FloatingGlow from "./FloatingGlow";
import FloatingStars from "./FloatingStars";
import MouseParallax from "./MouseParallax";
import ScrollIndicator from "./ScrollIndicator";

export default function JourneySection() {
  return (
    <>
      <MouseParallax />
      <ScrollIndicator />

      <section
        id="journey"
        className="relative overflow-hidden isolate bg-gradient-to-b from-[#fff5f8] via-[#fce7f3] to-white pt-8 pb-16 sm:pt-12 sm:pb-20"
      >
        {/* Background Overlay Grid */}
        <div
          className="
          absolute
          inset-0
          opacity-[0.04]
          pointer-events-none
          z-0
          "
          style={{
            backgroundImage: `
              linear-gradient(#94A3B8 1px, transparent 1px),
              linear-gradient(90deg, #94A3B8 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Background Effects & Stars */}
        <BackgroundEffects />
        <FloatingGlow />
        <FloatingStars />
        <FloatingParticles />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Timeline */}
          <JourneyTimeline />
        </div>
      </section>
    </>
  );
}
