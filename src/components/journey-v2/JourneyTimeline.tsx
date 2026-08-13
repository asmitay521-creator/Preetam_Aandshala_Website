import { motion } from "framer-motion";
import { HeartHandshake, Users, Building2, Target, Sprout } from "lucide-react";
import "./journey.css";

const timelineData = [
  {
    id: 1,
    date: "२६ जानेवारी, २०००",
    titleNormal: "श्री. अभिनव जगन्नाथ कामाजी यांची",
    titleHighlight: "व्यवसाय सुरुवात & आनंद मेळावा",
    description: "माझ्या जन्माची बीजे रुजली गेली ती श्री. अभिनव जगन्नाथ कामाजी, रा. सांगली यांच्या स्वप्न प्रकल्पातून. अभिनव यांनी २६ जानेवारी २००० रोजी व्यवसाय सुरु केला व प्रत्येक वर्षी वर्धापन दिन, वाढदिवस, ज्येष्ठ नागरिक आनंद मेळावा व सहलीचे आयोजन करुन साजरा करतात.",
    color: "#f472b6",
    bgColor: "#FDE8F3",
    borderColor: "#FCCEE4",
    nodeIcon: Sprout,
    cardIcon: HeartHandshake,
    side: "left",
  },
  {
    id: 2,
    date: "१५ ऑगस्ट, २०२३",
    titleNormal: "स्वातंत्र्य दिन & ज्येष्ठ नागरिक आनंद मेळावा",
    titleHighlight: "भूमीपूजन संपन्न",
    description: "दि. १५ ऑगस्ट २०२३ रोजी स्वातंत्र्य दिनाच्या व ज्येष्ठ नागरिक आनंद मेळाव्याच्या शुभ मुहूर्तावर भूमिपूजन संपन्न झाले.",
    color: "#1D4ED8",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    nodeIcon: Users,
    cardIcon: Users,
    side: "right",
  },
  {
    id: 3,
    date: "२६ जानेवारी, २०२६",
    titleNormal: "माझा जन्म म्हणजेच भव्य",
    titleHighlight: "शुभारंभ सोहळा",
    description: "माझा जन्म म्हणजेच शुभारंभ दि. २६ जानेवारी २०२६ आपल्या उपस्थितीत होईलच, परंतु आतापासूनच सर्व ज्येष्ठ नागरिकांनी प्रवेशाची तयारी करुन स्वतःचे व इतरांचे म्हातारपण आनंदाने, उत्साहाने व निरोगी घालवण्यासाठी प्रवेश घेऊन माझ्या कुशीत यायचे आहे हे विसरु नये.",
    color: "#EA580C",
    bgColor: "#FFF7ED",
    borderColor: "#FFEDD5",
    nodeIcon: Building2,
    cardIcon: Building2,
    side: "left",
  },
];

export default function JourneyTimeline() {
  return (
    <section className="journey-exact-v2">
      {/* Background Dot Grid */}
      <div className="journey-dot-grid" />

      {/* Building Sketch Background */}
      <div className="journey-building-sketch">
        <svg viewBox="0 0 500 400" fill="none" stroke="#1D4ED8" strokeWidth="1.2">
          <path d="M50 350 H450 M120 180 H380 M200 80 H300 V180 H200 Z M120 180 V350 M380 180 V350" />
          <rect x="220" y="100" width="25" height="35" rx="3" />
          <rect x="255" y="100" width="25" height="35" rx="3" />
          <rect x="220" y="220" width="60" height="130" rx="4" />
          <path d="M80 350 V200 L120 180 M420 350 V200 L380 180" />
        </svg>
      </div>

      <div className="journey-exact-container">
        {/* HEADER */}
        <div className="journey-exact-header">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="journey-exact-badge"
          >
            <span className="badge-line"></span>
            <span className="font-bold">● वाट चाल ●</span>
            <span className="badge-line"></span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="journey-exact-title"
          >
            आमचा प्रवास
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="journey-exact-subtitle"
          >
            प्रेम, विश्वास आणि सेवांचा प्रवास – आनंदशाळेच्या सोबत...
          </motion.p>

          {/* Ornamental Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="journey-ornament"
          >
            <span className="ornament-line"></span>
            <span className="ornament-node">❖</span>
            <span className="ornament-line"></span>
          </motion.div>
        </div>

        {/* TIMELINE GRID */}
        <div className="journey-exact-timeline">
          {/* Center Vertical Dashed Line */}
          <div className="journey-center-line">
            <div className="line-dashed" />
            <div className="line-end-circle" />
          </div>

          {/* ROW 1: Card 1 (Left) */}
          <div className="journey-row-item row-left">
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="journey-card-box left-box"
            >
              {/* Date Badge */}
              <div className="card-date-badge" style={{ backgroundColor: timelineData[0].color }}>
                {timelineData[0].date}
              </div>

              <div className="card-inner flex items-center justify-between gap-4">
                <div className="card-text-content">
                  <h3 className="card-title">
                    {timelineData[0].titleNormal}{" "}
                    <span style={{ color: timelineData[0].color }}>
                      {timelineData[0].titleHighlight}
                    </span>
                  </h3>
                  <p className="card-desc">{timelineData[0].description}</p>
                </div>

                {/* Right Floating Icon Box */}
                <div
                  className="card-icon-wrapper"
                  style={{ backgroundColor: timelineData[0].bgColor }}
                >
                  <HeartHandshake className="size-7 sm:size-8" style={{ color: timelineData[0].color }} />
                </div>
              </div>

              {/* Triangle Arrow */}
              <div className="arrow-right" style={{ borderLeftColor: timelineData[0].color }} />
            </motion.div>

            {/* Center Node 1 */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="center-node-box relative"
              style={{ borderColor: timelineData[0].color }}
            >
              <Sprout className="size-6" style={{ color: timelineData[0].color }} />
            </motion.div>

            <div className="journey-row-empty" />
          </div>

          {/* ROW 2: Card 2 (Right) */}
          <div className="journey-row-item row-right">
            <div className="journey-row-empty" />

            {/* Center Node 2 */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="center-node-box relative"
              style={{ borderColor: timelineData[1].color }}
            >
              <Users className="size-6" style={{ color: timelineData[1].color }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="journey-card-box right-box"
            >
              {/* Date Badge */}
              <div className="card-date-badge" style={{ backgroundColor: timelineData[1].color }}>
                {timelineData[1].date}
              </div>

              <div className="card-inner flex items-center justify-between gap-4">
                {/* Left Floating Icon Box */}
                <div
                  className="card-icon-wrapper"
                  style={{ backgroundColor: timelineData[1].bgColor }}
                >
                  <Users className="size-7 sm:size-8" style={{ color: timelineData[1].color }} />
                </div>

                <div className="card-text-content">
                  <h3 className="card-title">
                    {timelineData[1].titleNormal}{" "}
                    <span style={{ color: timelineData[1].color }}>
                      {timelineData[1].titleHighlight}
                    </span>
                  </h3>
                  <p className="card-desc">{timelineData[1].description}</p>
                </div>
              </div>

              {/* Triangle Arrow */}
              <div className="arrow-left" style={{ borderRightColor: timelineData[1].color }} />
            </motion.div>
          </div>

          {/* ROW 3: Card 3 (Left) */}
          <div className="journey-row-item row-left">
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="journey-card-box left-box"
            >
              {/* Date Badge */}
              <div className="card-date-badge" style={{ backgroundColor: timelineData[2].color }}>
                {timelineData[2].date}
              </div>

              <div className="card-inner flex items-center justify-between gap-4">
                <div className="card-text-content">
                  <h3 className="card-title">
                    {timelineData[2].titleNormal}{" "}
                    <span style={{ color: timelineData[2].color }}>
                      {timelineData[2].titleHighlight}
                    </span>
                  </h3>
                  <p className="card-desc">{timelineData[2].description}</p>
                </div>

                {/* Right Floating Icon Box */}
                <div
                  className="card-icon-wrapper"
                  style={{ backgroundColor: timelineData[2].bgColor }}
                >
                  <Building2 className="size-7 sm:size-8" style={{ color: timelineData[2].color }} />
                </div>
              </div>

              {/* Triangle Arrow */}
              <div className="arrow-right" style={{ borderLeftColor: timelineData[2].color }} />
            </motion.div>

            {/* Center Node 3 */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="center-node-box relative"
              style={{ borderColor: timelineData[2].color }}
            >
              <Building2 className="size-6" style={{ color: timelineData[2].color }} />
            </motion.div>

            <div className="journey-row-empty" />
          </div>
        </div>

      </div>
    </section>
  );
}
