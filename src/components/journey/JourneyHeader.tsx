import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function JourneyHeader() {
  return (
    <section className="relative mb-28 overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-pink-300/20 blur-[120px]" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-300/20 blur-[140px]" />
      </div>

      {/* Heading */}
      <div className="mx-auto max-w-7xl text-center">
        {/* Small Badge */}
        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-xl px-6 py-3 shadow-xl"
        >
          <Sparkles size={18} className="text-pink-400" />
          <span className="font-semibold uppercase tracking-[4px] text-pink-400">
            वाट चाल
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="mt-6 text-6xl sm:text-7xl md:text-8xl font-black text-[#be185d] tracking-tight drop-shadow-sm"
          style={{ color: "#be185d" }}
        >
          आमचा प्रवास
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-4 max-w-3xl text-xl sm:text-2xl font-bold leading-relaxed text-slate-800"
        >
          प्रेम, विश्वास आणि सेवांचा प्रवास — <span className="text-[#be185d] font-black">आनंदशाळेच्या</span> सोबत...
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{
            scaleX: 0,
          }}
          whileInView={{
            scaleX: 1,
          }}
          transition={{
            delay: 0.55,
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-12 h-[5px] w-44 origin-center rounded-full bg-gradient-to-r from-pink-400 via-blue-500 to-green-500"
        />
      </div>
    </section>
  );
}

export default memo(JourneyHeader);
