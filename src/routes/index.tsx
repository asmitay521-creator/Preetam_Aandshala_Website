import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/site/Reveal";
import { brochurePages } from "@/lib/brochure-pages";
import { site, sportsClub } from "@/lib/site-info";
import { useAdminStore } from "@/lib/admin-store";
import { useLanguage } from "@/lib/use-language";
import { ShieldCheck, Users, Heart, Sprout, Award, Sparkles } from "lucide-react";
import SpecialReasons from "@/components/site/SpecialReasons";
import HomeHero from "@/components/HomeHero/HomeHero";
import SportsSection from "@/components/SportsSection";
import JourneySection from "@/components/journey/JourneySection";
import PricingSection from "@/components/PricingSection/PricingSection";
import SportsPricingSection from "@/components/SportsPricingSection/SportsPricingSection";
import ScheduleSection from "@/components/ScheduleSection";
import ActivityHallsSection from "@/components/ActivityHallsSection/ActivityHallsSection";
import TestimonialsSection from "@/components/TestimonialsSection";


const publicImages = [
  "/images/Screenshot 2026-07-31 103107.png",
  "/images/Screenshot 2026-07-31 103131.png",
  "/images/Screenshot 2026-07-31 103152.png",
  "/images/Screenshot 2026-07-31 103213.png",
  "/images/Screenshot 2026-07-31 103238.png",
  "/images/aandshala sahal 1.jpeg",
  "/images/Screenshot 2026-07-31 103517.png",
  "/images/Screenshot 2026-07-31 103545.png",
  "/images/Screenshot 2026-07-31 103659.png",
  "/images/Screenshot 2026-07-31 103712.png",
  "/images/Screenshot 2026-07-31 103842.png",
];

const reasonsList = [
  { mr: "माझ्या मनातील व जीवनातील राहून गेलेल्या बऱ्याच गोष्टी, खेळ, आवडी-निवडी मला आनंदाने करण्यासाठी.", en: "To happily fulfill lifelong unfulfilled hobbies, games, and passions." },
  { mr: "मला माझ्या मनासारखे आनंदी व स्वावलंबी जीवन जगता येण्यासाठी.", en: "To live a happy and self-reliant life on my own terms." },
  { mr: "माझ्या कलागुणांना वाव, मानधन व आत्मसन्मान मिळण्यासाठी.", en: "To showcase my artistic talents, earn stipends, and gain self-dignity." },
  { mr: "कोणाच्या बंधनात राहून, मन मारून, चार भिंतीत एकटेपणाने जीवन जगावे लागणार नाही यासाठी.", en: "To avoid living in restriction, solitude, or suppressed desires within 4 walls." },
  { mr: "घरी एक-दोघे राहून, साहित्य आणून, विश्वास ठेवून जीवन जगणे जास्त खर्चिक व त्रासाचे असते, हे समजण्यासाठी.", en: "To realize that living alone at home managing groceries is costly & stressful." },
  { mr: "आयुष्याला त्रासून-कष्टून मरण मागावे लागणार नाही यासाठी.", en: "To live golden years with joy instead of feeling exhausted or hopeless." },
  { mr: "एकटेपणाला कंटाळून नैराश्य, चिडचिड होणार नाही यासाठी.", en: "To overcome loneliness, depression, and irritability effortlessly." },
  { mr: "घरगुती कटकटी, अबोला, त्रास व भांडणापासून मुक्ती मिळवण्यासाठी.", en: "To get relief from domestic stress, silence, and daily friction." },
  { mr: "स्वतः कमावलेल्या पैशांचा थोडातरी स्वतःसाठी उपभोग घेण्यासाठी.", en: "To enjoy at least a portion of hard-earned savings for oneself." },
  { mr: "जीवनाची सायंकाळ आनंदाने उत्साहाने मनसोक्त जगून करण्यासाठी.", en: "To spend the evening of life enthusiastically and to the fullest." },
  { mr: "आप्तजन व स्वतःसाठी खूप गरजेची व अभिमानास्पद गोष्ट आहे.", en: "A deeply essential and proud step for oneself and loved ones." },
  { mr: "दूर राहून प्रेम, आपुलकी, जिव्हाळा व नातेसंबंध वाढवण्यासाठी.", en: "To nurture deeper love, affection, and strong family relationships." },
  { mr: "आपल्या वयाच्या विचारांच्या मित्र-मैत्रिणींसोबत माणसांसोबत आनंदाने स्वाभिमानाने जगण्यासाठी.", en: "To live with self-respect alongside like-minded peers of one's age group." },
  { mr: "मनसोक्त, आनंदी, उत्साही व स्वावलंबी जीवन जगता आले म्हणून देवाचे आभार मानण्यासाठी.", en: "To thank Almighty God for a joyful, energetic, and independent life." },
  { mr: "पैसा नसला तरी थोडेसे काम श्रमदान करून आनंदी जीवन कसे जगता येते ते दाखवण्यासाठी.", en: "To demonstrate how joyful life can be lived through voluntary contribution." },
  { mr: "पैसा म्हणजे सर्वकाही नाही, मानवता धर्म व स्वतःसाठी व इतरांसाठी जगणे शिकण्यासाठी.", en: "To learn that money isn't everything; humanity & living for others matters." },
  { mr: "मानव जन्म मिळाला ते आनंदाने जीवन जगण्यासाठी.", en: "To honor human birth by living every single day happily." },
  { mr: "आपल्या माणसांवर रुसणे, अबोला, ओझे होण्यासाठी जीवन नाही हे सिद्ध करण्यासाठी.", en: "To prove life isn't meant for resentment or becoming a burden on anyone." },
  { mr: "नातेवाईक, लोक काय म्हणतील याचा विचार करू नका, स्वतःच्या आनंदासाठी आजच प्रवेश घ्या.", en: "Do not worry what society says — take admission for your own happiness." },
  { mr: "कल्पना न केलेले, कधी न उपभोगलेले, आपलेपण काय असते ते जग अनुभवण्यासाठी.", en: "To experience true warmth and belonging never imagined before." },
  { mr: "पैसा असून सुद्धा सर्व सुखसोई उपभोग विकत घेऊ शकत नाहीत परंतु येथे घेऊ शकतो ते दाखवण्यासाठी.", en: "To experience comforts money alone cannot buy at home." },
  { mr: "प्रचंड पैसा असून सुद्धा ह्या सर्व सोयी सुविधा मी स्वतःच्या घरात करू शकत नाही हे लक्षात घेण्यासाठी.", en: "To realize that even with wealth, creating such a 1.5 acre hub at home is impossible." },
  { mr: "आपल्या वयाच्या लोकांसोबत गप्पा-गोष्टी-खेळ खेळण्यासाठी.", en: "To chat, share stories, and play games with friends of your age." },
];

const activityHalls = [
  { icon: "♟️", titleMr: "बैठे खेळ हॉल", titleEn: "Indoor Games Hall", textMr: "कॅरम, बुद्धिबळ, पत्ते, सापाशिडी इत्यादी खेळ खेळणे.", textEn: "Play Carrom, Chess, Cards, Snakes & Ladders.", image: "baithe khel.png" },
  { icon: "🎨", titleMr: "आर्ट हॉल", titleEn: "Arts & Crafts Studio", textMr: "चित्रकला, हस्तकला, विणकाम व कला शिकणे व सराव करणे.", textEn: "Learn painting, handicrafts, knitting & creative arts.", image: "aart hall.png" },
  { icon: "🎵", titleMr: "संगीत उपकरणे हॉल", titleEn: "Music Instrument Lounge", textMr: "तबला, गिटार, हार्मोनिअम, पेटी, पियानो, सॅक्सोफोन, बासरी शिकणे व आनंद घेणे.", textEn: "Play & learn Tabla, Guitar, Harmonium, Piano, Saxophone & Flute.", image: "sangit hall.png" },
  { icon: "💻", titleMr: "माहिती तंत्रज्ञान हॉल", titleEn: "IT & Digital Learning Hall", textMr: "कॉम्प्युटर, लॅपटॉप, मोबाईल, इंटरनेट व प्रिंटर शिकणे.", textEn: "Learn computer basics, smartphones, internet & printing.", image: "mahiti tantradyan hall.png" },
  { icon: "🥳", titleMr: "करमणूक हॉल", titleEn: "Recreation & Fun Hall", textMr: "गप्पा-गोष्टी, अंताक्षरी, पासिंग गेम व समूह खेळ खेळणे.", textEn: "Enjoy Antakshari, group games, conversations & storytelling.", image: "karmnuk hall.png" },
  { icon: "🏊", titleMr: "स्विमिंग पूल", titleEn: "Swimming Pool Complex", textMr: "पोहण्याचा व स्वच्छ पाण्यात खेळण्याचा मनसोक्त आनंद घेणे.", textEn: "Enjoy swimming in clean filtered water pool.", image: "swimming hall.png" },
  { icon: "📽️", titleMr: "संस्कार व संप्रदाय हॉल", titleEn: "Spiritual & Cultural Hall", textMr: "विविध धार्मिक कार्यक्रम, संस्कार वर्ग व व्हिडिओ पाहणे.", textEn: "Spiritual discourses, value classes & video screenings.", image: "sanskar sampraday hall.png" },
  { icon: "🏸", titleMr: "विविध खेळ हॉल", titleEn: "Sports Arena", textMr: "बॅडमिंटन, टेबल टेनिस, स्नुकर व स्क्वॅश खेळणे.", textEn: "Play Badminton, Table Tennis, Snooker & Squash.", image: "tebal tenis.png" },
  { icon: "🏋️", titleMr: "व्यायाम हॉल", titleEn: "Fitness & Wellness Lounge", textMr: "जीम, योगा, मेडिटेशन, झुम्बा व डान्स इत्यादी करणे.", textEn: "Gym, Yoga, Meditation, Zumba & Dance sessions.", image: "vyayam hall.png" },
  { icon: "🍲", titleMr: "पाककृती हॉल", titleEn: "Culinary & Cooking Studio", textMr: "स्वयंपाक, नाश्ता, जेवण, आईस्क्रीम, सरबते व मिठाई इत्यादी बनवणे शिकणे.", textEn: "Learn culinary skills, mocktails, sweets & snacks.", image: "pakruti hall.png" },
  { icon: "🛌", titleMr: "विश्रांती हॉल", titleEn: "Relaxation Lounge", textMr: "वाचन करणे, शांत झोपणे किंवा आराम खुर्चीत विश्रांती घेणे.", textEn: "Read books, quiet nap, or relax on recliners.", image: "vishranti hall.png" },
  { icon: "🎬", titleMr: "थिएटर हॉल", titleEn: "Mini Theatre Hall", textMr: "टी.व्ही., सिनेमा, नाटक व सांस्कृतिक कार्यक्रम पाहणे.", textEn: "Watch movies, TV shows, dramas & cultural performances.", image: "ChatGPT Image Aug 5, 2026, 04_15_03 PM.png" },
];

const dailySchedule = [
  {
    step: "01",
    timeMr: "११:०० ते ११:३०",
    timeEn: "11:00 to 11:30 AM",
    titleMr: "प्रार्थना व प्रार्थनायोग",
    titleEn: "Prayer & Yoga Meditation",
    textMr: "विद्यार्थी एकत्र येऊन प्रार्थना व सकारात्मक ऊर्जा घेणे.",
    textEn: "Gathering for morning prayer & positive energy meditation.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    step: "02",
    timeMr: "११:१५ ते १२:००",
    timeEn: "11:15 to 12:00 PM",
    titleMr: "कला, संगीत व वाचन",
    titleEn: "Arts, Music & Reading",
    textMr: "आवडीनुसार विविध हॉलमध्ये उपक्रम.",
    textEn: "Activity sessions across 15 specialized halls.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="12" rx="2" />
        <path d="M12 15v6M8 21h8" />
        <path d="M7 8h10M7 11h6" />
      </svg>
    ),
  },
  {
    step: "03",
    timeMr: "१२:१५ ते ०१:००",
    timeEn: "12:15 to 01:00 PM",
    titleMr: "क्रीडा व सराव (तुकडी 'ब' स्नेहभोजन)",
    titleEn: "Sports Practice (Batch B Lunch)",
    textMr: "खेळ, पोहणे व फिटनेस सराव.",
    textEn: "Sports, swimming, and fitness workouts.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a8 8 0 0 0 16 0H4z" />
        <path d="M6 7c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0" />
        <path d="M12 19v2M9 21h6" />
      </svg>
    ),
  },
  {
    step: "04",
    timeMr: "०१:१५ ते ०२:००",
    timeEn: "01:15 to 02:00 PM",
    titleMr: "तुकडी 'अ' स्नेहभोजन",
    titleEn: "Batch A Pure Veg Lunch",
    textMr: "सकस, घरगुती, स्वच्छ आहार घेणे.",
    textEn: "Nutritious, home-cooked pure veg meal.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="M5 4v6a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V4M7 12v8" />
        <path d="M19 4v16M19 4c-1.5 2-2 4-2 6v2" />
      </svg>
    ),
  },
  {
    step: "05",
    timeMr: "०२:१५ ते ०३:००",
    timeEn: "02:15 to 03:00 PM",
    titleMr: "विज्ञान व क्रियाप्रदर्शन",
    titleEn: "Science & Practical Demos",
    textMr: "चिकित्सक विचार, छोटी प्रयोगे आणि अनुभवाधारित शिकणे.",
    textEn: "Critical thinking, small experiments & hands-on learning.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v5.5L4.5 17A2 2 0 0 0 6.2 20h11.6a2 2 0 0 0 1.7-3L14 7.5V2" />
        <path d="M8.5 2h7M7 15h10" />
      </svg>
    ),
  },
  {
    step: "06",
    timeMr: "०३:१५ ते ०४:००",
    timeEn: "03:15 to 04:00 PM",
    titleMr: "चौथा तास - सर्जनशीलता व कला",
    titleEn: "Hour 4 - Creativity & Crafts",
    textMr: "रंगकाम, मॉडेलिंग, क्राफ्ट आणि सर्जनशील उपक्रम.",
    textEn: "Painting, modeling, craft & creative activities.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10c0-1.7-1.3-3-3-3h-1.5a1.5 1.5 0 0 1-1.5-1.5V6a4 4 0 0 0-4-4z" />
        <circle cx="7.5" cy="7.5" r="1" fill="#B8860B" />
        <circle cx="12" cy="6.5" r="1" fill="#B8860B" />
        <circle cx="6.5" cy="12" r="1" fill="#B8860B" />
        <circle cx="9" cy="16" r="1" fill="#B8860B" />
      </svg>
    ),
  },
  {
    step: "07",
    timeMr: "०४:१५ ते ०५:००",
    timeEn: "04:15 to 05:00 PM",
    titleMr: "पांचवा तास - चर्चा व संगीतमय संगत",
    titleEn: "Hour 5 - Discussion & Devotional Music",
    textMr: "चर्चा, नाट्य, गप्पा व भजनाने सांगता.",
    textEn: "Group discussion, drama, chats & devotional songs.",
    iconSvg: (
      <svg className="size-7 stroke-[#B8860B] fill-none stroke-[2]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const keyHighlights = [
  { num: "01", titleMr: "आनंद निवास", titleEn: "Anand Nivas Residence", icon: "🏠", textMr: "फुल फर्निश्ड निवास (सिंगल, कपल, 2-3 शेअरिंग, AC / Non-AC पर्याय).", textEn: "Fully furnished rooms (Single, Couple, Sharing, AC/Non-AC).", color: "#f472b6" },
  { num: "02", titleMr: "नियोजित गोशाळा", titleEn: "Proposed Gaushala", icon: "🐄", textMr: "देशी गायांचे पालन, गोपूजा व सेंद्रिय दुधाची सोय.", textEn: "Indigenous cow shelter, worship & organic milk facility.", color: "#9B1B54" },
  { num: "03", titleMr: "नियोजित श्रीकृष्ण मंदिर", titleEn: "Shri Krishna Temple", icon: "🛕", textMr: "55 फुटांची भव्य राधाकृष्ण मूर्ती व अध्यात्मिक वातावरण.", textEn: "55ft grand Radha Krishna statue in serene atmosphere.", color: "#D97706" },
  { num: "04", titleMr: "स्विमिंग पूल", titleEn: "Swimming Pool Complex", icon: "🏊", textMr: "जागतिक दर्जाचा शुद्ध पाण्याचा तरणतलाव व सुरक्षितता.", textEn: "World-class clean water pool with safety standards.", color: "#0284C7" },
  { num: "05", titleMr: "स्पोर्ट्स व फिटनेस कॉम्प्लेक्स", titleEn: "Sports & Fitness Hub", icon: "🏸", textMr: "जिम, इनडोअर बॅडमिंटन, टेनिस, टर्फ व क्रीडा संकूल.", textEn: "Gym, indoor badminton, tennis court, artificial turf.", color: "#0D9488" },
  { num: "06", titleMr: "अध्यायावत फूड कोर्ट व लक्झरी हॉटेल", titleEn: "Food Court & Luxury Hotel", icon: "🍽️", textMr: "PREETAM FOOD COURT - चवदार नाष्टा व चवदार जेवणाची उत्तम सोय.", textEn: "PREETAM FOOD COURT - Healthy breakfast & delicious veg meals.", color: "#7E22CE" },
  { num: "07", titleMr: "कार्यक्रम स्टेज, गार्डन व लॉन", titleEn: "Stage, Gardens & Lawns", icon: "🎭", textMr: "सांस्कृतिक कार्यक्रम, हिरवळ, कारंजे व निसर्गरम्य वातावरण.", textEn: "Cultural performance stage, lush green lawns & fountains.", color: "#15803D" },
  { num: "08", titleMr: "टर्फ - क्रिकेट व स्पोर्ट्स", titleEn: "Sports Turf Ground", icon: "⚽", textMr: "क्रिकेट, फुटबॉल व मैदानी खेळांसाठी सुसज्ज टर्फ मैदान.", textEn: "Fully equipped artificial turf for mini cricket & football.", color: "#1E40AF" },
];

function IndexComponent() {
  const [selectedSection, setSelectedSection] = useState<"aanandshala" | "sports" | null>(null);
  const [showIntroBanner, setShowIntroBanner] = useState(true);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("सर्व");
  const { isEn } = useLanguage();
  const store = useAdminStore();

  const welcomePosterUrl = store.siteData.welcomePosterUrl || "/images/preetam-welcome.png";

  // Clean Pure Architectural Renders & Photos (ZERO brochure/poster text)
  const card1Images = useMemo(() => {
    return [
      "/images/slider4.JPG",
      "/images/slider3.png"
    ];
  }, []);

  const card2Images = useMemo(() => {
    return [
      "/images/sports img.png",
      "/images/pickleball-court.png"
    ];
  }, []);

  const [card1Idx, setCard1Idx] = useState(0);
  const [card2Idx, setCard2Idx] = useState(0);

  const c1Len = card1Images.length;
  const c2Len = card2Images.length;

  // Preload all slider images instantly in browser memory for zero delay
  useEffect(() => {
    [...card1Images, ...card2Images].forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [JSON.stringify(card1Images), JSON.stringify(card2Images)]);

  // Auto slide images in background of section cards
  useEffect(() => {
    if (c1Len <= 1) return;
    const timer = setInterval(() => {
      setCard1Idx((prev) => (prev + 1) % c1Len);
    }, 3500);
    return () => clearInterval(timer);
  }, [c1Len]);

  useEffect(() => {
    if (c2Len <= 1) return;
    const timer = setInterval(() => {
      setCard2Idx((prev) => (prev + 1) % c2Len);
    }, 3500);
    return () => clearInterval(timer);
  }, [c2Len]);

  useEffect(() => {
    const handleReset = () => {
      setSelectedSection(null);
      setShowIntroBanner(true);
    };
    window.addEventListener("reset-section", handleReset);
    return () => window.removeEventListener("reset-section", handleReset);
  }, []);

  // Lock body scroll when intro banner modal is active
  useEffect(() => {
    if (showIntroBanner) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showIntroBanner]);

  useEffect(() => {
    if (selectedSection === null) {
      document.body.classList.add("hide-footer");
      document.body.classList.add("hide-nav-links");
    } else {
      document.body.classList.remove("hide-footer");
      document.body.classList.remove("hide-nav-links");
    }
    return () => {
      document.body.classList.remove("hide-footer");
      document.body.classList.remove("hide-nav-links");
    };
  }, [selectedSection]);

  const galleryCategories = [
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

  const heroImage = brochurePages[0]?.url || publicImages[0];
  const sportsHeroImage = brochurePages[6]?.url || publicImages[1];

  const sportsHeroImages = [
    sportsHeroImage,
    sportsClub.gallery[0] || "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357638128.jpg",
    sportsClub.facilities[0]?.images[0] || "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg",
    sportsClub.gallery[1] || "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357638129.jpg",
  ].filter(Boolean);

  const [sportsBgIdx, setSportsBgIdx] = useState(0);
  const [sportsLightboxIndex, setSportsLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sportsLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSportsLightboxIndex(null);
      if (e.key === "ArrowLeft")
        setSportsLightboxIndex((prev) => (prev === null || prev === 0 ? sportsClub.gallery.length - 1 : prev - 1));
      if (e.key === "ArrowRight")
        setSportsLightboxIndex((prev) => (prev === null || prev === sportsClub.gallery.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sportsLightboxIndex]);

  const handleSectionSelect = (sec: "aanandshala" | "sports" | null) => {
    setSelectedSection(sec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0429] via-[#2d0739] to-[#150424] animate-fade-up">

      <AnimatePresence>
        {showIntroBanner && store.siteData.showWelcomePoster !== false && (
          <motion.div
            key="preetam-intro"

            initial={{
              opacity: 0,
              y: "100%",
              scale: 0.98,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: "-100%",
              scale: 0.95,
            }}

            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}

            className="
              fixed
              inset-0
              z-[999999]

              w-screen
              h-screen
              h-[100dvh]

              flex
              flex-col
              items-center
              justify-center
              gap-4
              sm:gap-6

              overflow-y-auto
              overflow-x-hidden

              bg-[#0c0216]

              p-3
              sm:p-6
              py-4
              sm:py-8
            "
          >

            {/* TOP RIGHT CLOSE BUTTON */}
            <button
              onClick={() => setShowIntroBanner(false)}
              aria-label="Close"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[101] size-9 sm:size-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white font-extrabold text-base sm:text-lg flex items-center justify-center border border-white/30 cursor-pointer shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              ✕
            </button>

            {/* ========================================= */}
            {/* TOP WELCOME HEADER TEXT ABOVE IMAGE       */}
            {/* ========================================= */}
            <div className="relative z-10 text-center px-2 max-w-4xl shrink-0 space-y-1 mb-1 sm:mb-3 pt-1 sm:pt-2">
              <div>
                <h2
                  onClick={() => setShowIntroBanner(false)}
                  className="font-serif italic font-black text-base sm:text-2xl lg:text-3xl tracking-wide bg-gradient-to-r from-amber-200 via-yellow-300 to-rose-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(251,191,36,0.5)] leading-snug cursor-pointer transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_35px_rgba(251,191,36,0.85)] inline-block"
                >
                  <span className="block">Welcome to Preetam Anandshala &amp;</span>
                  <span className="block text-amber-300 font-extrabold not-italic mt-0.5">Sports Fitness Club</span>
                </h2>
              </div>
              <p className="text-[10px] sm:text-xs font-black text-amber-200/90 tracking-widest uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)] mt-1">
                आपले सहर्ष स्वागत आहे • सांगली
              </p>
            </div>

            {/* ========================================= */}
            {/* EXACT GENERATED POSTER - PERFECT FIT     */}
            {/* ========================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}

              className="
                relative

                w-full
                max-w-[1100px]
                max-h-[65vh]
                sm:max-h-[75vh]

                mx-auto

                flex
                items-center
                justify-center
                shrink-0
                py-1
              "
            >

              <img
                src={welcomePosterUrl}
                alt="Preetam Anandshala and Sports Fitness Club"
                onClick={() => setShowIntroBanner(false)}

                className="
                  block

                  max-w-full
                  max-h-full

                  w-auto
                  h-auto

                  object-contain
                  object-center

                  select-none
                  rounded-2xl
                  drop-shadow-[0_15px_50px_rgba(219,39,119,0.35)]
                  cursor-pointer
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  hover:drop-shadow-[0_20px_60px_rgba(219,39,119,0.55)]
                "
              />

              {/* ================= TRANSPARENT VISIT CLICK OVERLAY ================= */}

              <button
                onClick={() => setShowIntroBanner(false)}
                aria-label="Visit Website"
                className="
                  absolute

                  bottom-0

                  left-1/2
                  -translate-x-1/2

                  z-[100]

                  w-full
                  max-w-[450px]

                  h-[65px]
                  sm:h-[85px]

                  bg-transparent
                  border-none
                  outline-none
                  cursor-pointer
                "
              />

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
      {/* ============================================================== */}
      {selectedSection === null && !showIntroBanner && (
        <section id="sections" className="relative py-4 sm:py-7 px-3 sm:px-4 overflow-hidden bg-gradient-to-br from-[#1a0429] via-[#2d0739] to-[#150424] min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center">
          {/* FLOATING RICH AMBIENT LIGHT ORBS */}
          <div className="pointer-events-none absolute top-10 left-10 size-[450px] rounded-full bg-[#db2777]/25 blur-[120px] animate-pulse" />
          <div className="pointer-events-none absolute bottom-10 right-10 size-[450px] rounded-full bg-[#7c3aed]/25 blur-[120px] animate-float" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#f472b6]/15 blur-[140px]" />

          {/* BRAND HEADER */}
          <div className="animate-fade-up text-center max-w-5xl mx-auto mb-2 sm:mb-4 relative z-10 px-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-amber-300/40 text-amber-200 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(251,191,36,0.3)] tracking-wide">
              <span className="inline-block size-2 rounded-full bg-amber-400 animate-ping" />
              <span>✨ {isEn ? "Sangli's Grand Landmark Project" : "सांगलीतील भव्य मानचिन्ह प्रकल्प"}</span>
            </div>
            <h1 className="font-display font-black text-xl sm:text-3xl lg:text-4xl tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 via-rose-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(251,191,36,0.7)] leading-tight py-0.5 mt-3 sm:mt-5">
              {isEn
                ? "Preetam Senior Citizen Anandshala & Sports Fitness Club"
                : "प्रीतम ज्येष्ठ नागरिक आनंदशाळा व स्पोर्ट्स अँड फिटनेस क्लब"}
            </h1>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-amber-300 text-sm sm:text-base animate-bounce">📍</span>
              <span className="font-display font-black text-lg sm:text-2xl lg:text-3xl bg-gradient-to-r from-yellow-300 via-amber-200 to-rose-300 bg-clip-text text-transparent tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)] uppercase">
                {isEn ? "Sangli" : "सांगली"}
              </span>
            </div>
          </div>

          {/* 2 MAIN LUXURY FEATURE CARDS - TIGHT GAP WITH TEXT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-3 lg:gap-6 max-w-7xl w-full mx-auto relative z-10 py-0.5 px-2 my-auto">

            {/* SECTION 1 CARD: PREETAM AANANDASHRAM */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSectionSelect("aanandshala")}
              className={`group relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] h-[300px] sm:h-[360px] lg:h-[395px] bg-slate-950 cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 border-white/30 hover:border-pink-400 flex flex-col justify-between p-4 sm:p-6 ${selectedSection === "aanandshala" ? "ring-4 ring-pink-500 scale-[1.02]" : ""
                }`}
            >
              {/* ANIMATED IMAGE SLIDER BACKGROUND */}
              <AnimatePresence>
                <motion.img
                  key={card1Idx}
                  src={card1Images[card1Idx] || card1Images[0]}
                  alt={isEn ? site.nameEn : site.nameMr}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (card1Images[0] && target.src !== card1Images[0]) {
                      target.src = card1Images[0];
                    }
                  }}
                />
              </AnimatePresence>

              {/* RICH DARK GRADIENT OVERLAY FOR READABILITY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a0410]/95 via-[#2a0410]/40 to-black/30 pointer-events-none transition-opacity duration-500 group-hover:opacity-90" />

              {/* TOP BADGES & SLIDER DOTS */}
              <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#541A1A] shadow-lg group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                  🏠 {isEn ? "Section 1" : "विभाग १"}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {card1Images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCard1Idx(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === card1Idx ? "w-6 bg-pink-400 shadow-md shadow-pink-500/50" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                    />
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] sm:text-xs font-black text-white border border-white/20 ml-1">
                    ✨ {isEn ? "1.5 Acre Anandshala" : "१.५ एकर आनंदधाम"}
                  </span>
                </div>
              </div>

              {/* BOTTOM TITLE & BUTTON */}
              <div className="relative z-10 space-y-2 pt-2">
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                  {isEn ? site.nameEn : site.nameMr}
                </h3>

                <div className="pt-0.5 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-white shadow-xl group-hover:shadow-pink-500/60 group-hover:scale-105 transition-all duration-300 border border-white/30">
                    <span>{isEn ? "Open Anandashram Details" : "आनंदआश्रम माहिती उघडा"}</span>
                    <span className="grid size-5 place-items-center rounded-full bg-white text-pink-600 text-xs font-black group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* SECTION 2 CARD: PREETAM SPORTS & FITNESS CLUB */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSectionSelect("sports")}
              className={`group relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] h-[300px] sm:h-[360px] lg:h-[395px] bg-slate-950 cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 border-white/30 hover:border-purple-400 flex flex-col justify-between p-4 sm:p-6 ${selectedSection === "sports" ? "ring-4 ring-purple-500 scale-[1.02]" : ""
                }`}
            >
              {/* ANIMATED IMAGE SLIDER BACKGROUND */}
              <AnimatePresence>
                <motion.img
                  key={card2Idx}
                  src={card2Images[card2Idx] || card2Images[0]}
                  alt={isEn ? sportsClub.nameEn : sportsClub.nameMr}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (card2Images[0] && target.src !== card2Images[0]) {
                      target.src = card2Images[0];
                    }
                  }}
                />
              </AnimatePresence>

              {/* RICH DARK GRADIENT OVERLAY FOR READABILITY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12042b]/90 via-black/25 to-black/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />

              {/* TOP BADGES & SLIDER DOTS */}
              <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-black text-[#541A1A] shadow-lg group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  🏋️‍♂️ {isEn ? "Section 2" : "विभाग २"}
                </span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {card2Images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCard2Idx(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === card2Idx ? "w-6 bg-purple-400 shadow-md shadow-purple-500/50" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                    />
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-[11px] sm:text-xs font-black text-white border border-white/20 ml-1">
                    🏊‍♂️ {isEn ? "Sports & Fitness Club" : "ऑलिंपिक स्पोर्ट्स क्लब"}
                  </span>
                </div>
              </div>

              {/* BOTTOM TITLE & BUTTON */}
              <div className="relative z-10 space-y-2 pt-2">
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                  {isEn ? sportsClub.nameEn : sportsClub.nameMr}
                </h3>

                <div className="pt-0.5 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-white shadow-xl group-hover:shadow-purple-500/60 group-hover:scale-105 transition-all duration-300 border border-white/30">
                    <span>{isEn ? "Open Sports Club Details" : "क्रीडा संकुल माहिती उघडा"}</span>
                    <span className="grid size-5 place-items-center rounded-full bg-white text-purple-600 text-xs font-black group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 2. SECTION 1 DETAILS: PREETAM AANANDSHALA (DEDICATED VIEW)     */}
      {/* ============================================================== */}
      {selectedSection === "aanandshala" && (
        <div id="aanandshala-section" className="animate-fade-up">

          {/* HOME HERO BANNER */}
          <HomeHero />

          {/* MARQUEE TICKER */}
          <div className="overflow-hidden border-b py-3" style={{ background: "#1F070F", borderColor: "rgba(129,11,56,0.4)" }}>
            <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-xs sm:text-sm text-white font-bold">
              {Array.from({ length: 2 }).map((_, k) => (
                <span key={k} className="flex gap-12 items-center">
                  <span className="text-amber-200 font-extrabold">
                    {isEn
                      ? "“The gateway to healthy living & blissful golden years opens right here...” — Preetam Anandashram"
                      : "“ज्येष्ठ नागरिकांच्या निरोगी आरोग्य व आनंददायी आयुष्याचे दार येथेच उघडते...” — प्रीतम आनंदशाळा"}
                  </span>
                  <span className="text-[#DCC3AA] font-black">&bull;</span>
                  <span className="text-white font-bold">
                    {isEn
                      ? "• Book Admission Today • Grand Launch from 26/27/28 January 2026"
                      : "• आजच प्रवेश घ्या • शुभारंभ दि. २६/२७/२८ जानेवारी २०२६ पासून"}
                  </span>
                  <span className="text-[#DCC3AA] font-black">&bull;</span>
                  <span>
                    {isEn
                      ? "“Live with joy, preserve health, fulfill your dreams at Anandshala” — Dr. Girish Oak (Actor)"
                      : "“आनंदात जगायचं, आरोग्य जपायचं, आनंदशाळेत येऊन स्वप्न साकारायचं” — डॉ. गिरीश ओक (अभिनेते)"}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* 23 REASONS CAROUSEL */}
          <SpecialReasons />

          {/* OUR JOURNEY SECTION */}
          <JourneySection />

          {/* PRICING SECTION */}
          <PricingSection />

          {/* 15 ACTIVITY HALLS */}
          <ActivityHallsSection />

          {/* DAILY SCHEDULE ANANDSHALA */}
          <ScheduleSection type="anandshala" />

          {/* VIDEO & MEMBER TESTIMONIALS */}
          <TestimonialsSection />
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SECTION 2 DETAILS: PREETAM SPORTS CLUB (DEDICATED VIEW)     */}
      {/* ============================================================== */}
      {selectedSection === "sports" && (
        <div id="sports-section" className="animate-fade-up">
          {/* TOP BACK / NAVIGATION BAR REMOVED AS PER USER REQUEST */}

          {/* ── PREETAM SPORTS PREMIUM SECTION ── */}
          <SportsSection />

          {/* ── PREETAM SPORTS RATE CARD & FACILITIES ── */}
          <SportsPricingSection />

          {/* ── PREETAM SPORTS CLUB DAILY TIMETABLE SCHEDULE ── */}
          <ScheduleSection type="sports" />

          {/* VIDEO & MEMBER TESTIMONIALS */}
          <TestimonialsSection />
        </div>
      )}
    </div>
  );
}

export default IndexComponent;
