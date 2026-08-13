import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/use-language";
import { 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Flower2, 
  Car, 
  ParkingCircle, 
  UtensilsCrossed, 
  Hotel, 
  Stethoscope, 
  Activity, 
  Church, 
  Pill, 
  Waves, 
  Radio, 
  Store, 
  Dumbbell,
  X,
  Sparkles,
  ArrowRight,
  PhoneCall
} from "lucide-react";

import "./brochure.css";
import buildingImage from "../assets/anandshala-building.png";

interface ModalDetail {
  title: string;
  category: string;
  img?: string;
  icon?: React.ReactNode;
  mrDesc: string;
  enDesc: string;
  highlights: string[];
}

const Brochure: React.FC = () => {
  const { isEn } = useLanguage();
  const [selectedDetail, setSelectedDetail] = useState<ModalDetail | null>(null);

  const photoItems: ModalDetail[] = [
    {
      title: "आरोग्यदायी जीवनशैली",
      category: "विशेष जीवनशैली",
      img: "/images/aandshala sahal 1.jpeg",
      mrDesc: "ज्येष्ठ नागरिकांसाठी निसर्गरम्य १५ एकर परिसरात शुद्ध हवा, नियमित योगासने, प्राणायाम, शुद्ध सेंद्रिय आहार व २४×७ वैद्यकीय निगराणी.",
      enDesc: "Fresh air, organic meals, daily yoga, pranayama, and 24x7 medical care in a 1.5-acre green environment.",
      highlights: [
        "निसर्गरम्य १५ एकर परिसर",
        "वैद्यकीय निगराणी व डॉक्टर्स सेवा",
        "आनंदी व निरोगी जीवनशैली"
      ]
    },
    {
      title: "स्नेह, संवाद व सहवास",
      category: "सामाजिक नाती",
      img: "/images/aandmelava1.jpg",
      mrDesc: "एकटेपणावर मात करून आपल्या वयाच्या समविचारी मित्र-मैत्रिणींसोबत गप्पागोष्टी, खेळ व आनंदी सहवासात जगण्याचा अद्वितीय अनुभव.",
      enDesc: "Overcome loneliness by connecting with like-minded friends of your age in a joyful environment.",
      highlights: [
        "एकटेपणा व नैराश्य मुक्ती",
        "आपुलकीचे व जिव्हाळ्याचे नाते",
        "दररोज गप्पागोष्टी व आनंद"
      ]
    },
    {
      title: "खेळ, व्यायाम व मनोरंजन",
      category: "क्रीडा व मनोरंजन",
      img: "/images/aandmelava4.jpg",
      mrDesc: "कॅरम, बुद्धिबळ, टेबल टेनिस, वातानुकूलित जिम, झुम्बा, स्विमिंग पूल व १५ विशेष उपक्रम हॉलमध्ये मनसोक्त मनोरंजन.",
      enDesc: "Enjoy indoor games, AC gym, Zumba, swimming pool, and 15 specialized activity halls.",
      highlights: [
        "१५ विशेष उपक्रम हॉल",
        "बैठे खेळ व वातानुकूलित जिम",
        "स्विमिंग पूल व झुम्बा क्लासेस"
      ]
    },
    {
      title: "सांस्कृतिक व शैक्षणिक उपक्रम",
      category: "संस्कार व संस्कृती",
      img: "/images/samajik karya 2.jpeg",
      mrDesc: "चित्रकला, विणकाम, संगीत शिकणे, नाटक, चित्रपट पाहणे, अंताक्षरी व धार्मिक-सांस्कृतिक उत्सव सोहळे.",
      enDesc: "Cultural events, music learning, painting, drama, Antakshari, and festival celebrations.",
      highlights: [
        "संगीत व कला शिकण्याची संधी",
        "चित्रपट व नाटक स्क्रींनिंग",
        "सर्व सण व वाढदिवस उत्सव"
      ]
    },
    {
      title: "सुरक्षित, सन्मानपूर्वक आयुष्य",
      category: "सुरक्षा व स्वाभिमान",
      img: "/images/vyavsaik mahiti 1.jpeg",
      mrDesc: "२४ तास सीसीटीव्ही सुरक्षा, प्रशिक्षित केअरटेकर, लिफ्ट व व्हीलचेअर सोयी, डॉक्टर ऑन कॉल व पूर्ण आत्मसन्मान.",
      enDesc: "24x7 CCTV security, trained caregivers, elevator & wheelchair access, and complete self-respect.",
      highlights: [
        "२४×७ सुरक्षा व सीसीटीव्ही",
        "प्रशिक्षित केअरटेकर स्टाफ",
        "पूर्ण स्वाभिमान व स्वातंत्र्य"
      ]
    },
    {
      title: "सुविधा व सेवा",
      category: "प्रिमियम सोयी सुविधा",
      img: "/images/vyavsaik mahiti 2.jpeg",
      mrDesc: "इलेक्ट्रिक व्हेईकल, फूड कोर्ट, लॉंड्री, मेडिकल स्टोअर, पोस्ट व बँकिंग मदत आणि २४ तास आपत्कालीन रुग्णवाहिका सेवा.",
      enDesc: "Electric vehicle transport, food court, laundry, medical store, and 24-hour ambulance service.",
      highlights: [
        "इलेक्ट्रिक गोल्फ कार्ट गाडी",
        "हॉटेल व सुसज्ज फूड कोर्ट",
        "२४ तास रुग्णवाहिका सेवा"
      ]
    }
  ];

  const facilityDetails: Record<string, ModalDetail> = {
    "इलेक्ट्रिक गाडी": {
      title: "इलेक्ट्रिक गाडी (Golf Cart)",
      category: "परिसर वाहतूक सोय",
      icon: <Car size={40} className="text-pink-600" />,
      mrDesc: "१.५ एकर निसर्गरम्य आनंदशाळा परिसरात ज्येष्ठ नागरिकांना फिरण्यासाठी व हॉल्समध्ये जाण्यासाठी विनामूल्य बॅटरी कार सोय.",
      enDesc: "Free electric battery golf cart service inside the 1.5-acre campus for easy movement.",
      highlights: ["विनामूल्य सेवा", "ज्येष्ठांसाठी अत्यंत सोपी", "सुरक्षित व पर्यावरणपूरक"]
    },
    "२,३,४ व ६ चाकी पार्किंग": {
      title: "भव्य व सुरक्षित पार्किंग",
      category: "पार्किंग सोय",
      icon: <ParkingCircle size={40} className="text-pink-600" />,
      mrDesc: "भेट देणारे आप्तजन, नातेवाईक व सदस्यांच्या २, ३, ४ आणि ६ चाकी वाहनांसाठी विशाल, सुरक्षित व सीसीटीव्ही निगराणीखालील पार्किंग.",
      enDesc: "Spacious, CCTV-monitored parking for 2, 3, 4, and 6-wheeler vehicles of visitors and members.",
      highlights: ["२४ तास सीसीटीव्ही कॅमेरे", "विशाल मोकळी जागा", "सुरक्षित वाहन तळ"]
    },
    "फूड कोर्ट": {
      title: "प्रीतम फूड कोर्ट (Preetam Food Court)",
      category: "खानपान व आहार",
      icon: <UtensilsCrossed size={40} className="text-pink-600" />,
      mrDesc: "सकस, पौष्टिक, घरगुती पद्धतीचे शाकाहारी जेवण, ताज्या भाज्या, ज्यूस, सरबते व स्नॅक्स मिळण्याचे सुसज्ज हॉटेल व फूड कोर्ट.",
      enDesc: "Nutritious, home-cooked pure vegetarian meals, fresh juices, and snacks served daily.",
      highlights: ["सकस व पचनास हलका आहार", "स्वच्छ व वातानुकूलित डायनिंग", "ताजे सेंद्रिय पदार्थ"]
    },
    "हॉटेल": {
      title: "लक्झरी हॉटेल व निवास",
      category: "आतिथ्य सेवा",
      icon: <Hotel size={40} className="text-pink-600" />,
      mrDesc: "भेट देण्यासाठी येणाऱ्या आप्तजनांसाठी व पाहुण्यांसाठी विश्रांतीची व राहण्याची सर्व सोयींनी युक्त लक्झरी हॉटेल रूम्स.",
      enDesc: "Luxury guest rooms with full amenities for visiting family members and guests.",
      highlights: ["वातानुकूलित रूम्स", "स्वच्छ बेड व स्वच्छतागृह", "रूम सर्व्हिस उपलब्ध"]
    },
    "दवाखाना": {
      title: "दवाखाना व मेडिकल केअर",
      category: "आरोग्य सेवा",
      icon: <Stethoscope size={40} className="text-pink-600" />,
      mrDesc: "प्रकल्पातच सुसज्ज प्राथमिक आरोग्य केंद्र, डॉक्टरांची दररोजची नियमित तपासणी व २४ तास नर्स सेवा उपलब्ध.",
      enDesc: "In-house primary clinic with daily doctor visits and round-the-clock nursing care.",
      highlights: ["डॉक्टरांची दैनंदिन तपासणी", "२४ तास नर्स व केअरटेकर", "आपत्कालीन रुग्णवाहिका"]
    },
    "योगासन": {
      title: "योगासन व ध्यानधारणा कक्ष",
      category: "फिटनेस व मानसोपचार",
      icon: <Activity size={40} className="text-pink-600" />,
      mrDesc: "शांत वातानुकूलित हॉलमध्ये दररोज सकाळी व संध्याकाळी अनुभवी योगाचार्यांकडून प्राणायाम, ध्यानधारणा व योगासने सराव.",
      enDesc: "Daily morning and evening Yoga, Meditation & Pranayama sessions guided by experts.",
      highlights: ["बीपी व ताणतणाव मुक्ती", "ज्येष्ठांसाठी सोपे प्रकार", "प्रसन्न वातानुकूलित हॉल"]
    },
    "मंदिर": {
      title: "श्रीकृष्ण मंदिर व अध्यात्म केंद्र",
      category: "धार्मिक सोयी",
      icon: <Church size={40} className="text-pink-600" />,
      mrDesc: "५५ फुटांची भव्य राधाकृष्ण मूर्ती, दैनंदिन आरती, कीर्तन, भजन व मनःशांती देणारे शांत अध्यात्मिक वातावरण.",
      enDesc: "55ft grand Radha Krishna statue, daily Aarti, Kirtan, Bhajan, and serene spiritual vibe.",
      highlights: ["५५ फुटांची राधाकृष्ण मूर्ती", "रोज सकाळी व संध्याकाळी आरती", "प्रसन्न सत्संग केंद्र"]
    },
    "मेडिकल": {
      title: "२४ तास मेडिकल स्टोअर",
      category: "औषध सेवा",
      icon: <Pill size={40} className="text-pink-600" />,
      mrDesc: "ज्येष्ठ नागरिकांसाठी आवश्यक असणारी सर्व नियमित औषधे व प्रथमोपचार साहित्य २४ तास सवलतीच्या दरात उपलब्ध.",
      enDesc: "24-hour pharmacy with all essential medicines and first-aid supplies available.",
      highlights: ["२४ तास औषधे उपलब्ध", "सवलतीचे दर", "डोअर स्टेप डिलिव्हरी"]
    },
    "स्विमिंग पूल": {
      title: "ऑलिंपिक स्विमिंग पूल व वॉटर थेरपी",
      category: "जलतरण व व्यायाम",
      icon: <Waves size={40} className="text-pink-600" />,
      mrDesc: "ऑलिंपिक मानकांचा शुद्ध पाण्याचा तरणतलाव, ज्येष्ठांसाठी वॉटर ॲरोबिक्स व सुरक्षेसाठी अनुभवी लाईफगार्ड्स.",
      enDesc: "Olympic standard clean swimming pool with water aerobics and trained lifeguards.",
      highlights: ["फिल्टर केलेले स्वच्छ पाणी", "ज्येष्ठांसाठी वॉटर व्यायाम", "लाइफगार्ड्स व सुरक्षितता"]
    },
    "रेडिओ थेरपी": {
      title: "आनंदशाळा एफएम रेडिओ व संगीत",
      category: "मनोरंजन",
      icon: <Radio size={40} className="text-pink-600" />,
      mrDesc: "आनंदशाळा इन-हाऊस रेडिओ, जुनी आवडती भावगीते, भक्तीगीते, बातम्या व संगीताचा आनंद घेण्याचा विशेष हॉल.",
      enDesc: "In-house music and radio system playing classic retro tunes and devotional songs.",
      highlights: ["आनंददायी संगीत वातावरण", "जुनी भावगीते व भक्तीगीते", "रियाझ व गाण्याची सोय"]
    },
    "जनरल स्टोअर": {
      title: "जनरल स्टोअर व लॉंड्री",
      category: "दैनंदिन सोयी",
      icon: <Store size={40} className="text-pink-600" />,
      mrDesc: "दैनंदिन गरजेच्या सर्व वस्तू, साबण, पेस्ट, सौंदर्य प्रसाधने, कपडे धुणे व इस्त्री सेवा एकाच छताखाली उपलब्ध.",
      enDesc: "General daily store and laundry services for washing and ironing clothes.",
      highlights: ["कपडे धुणे व इस्त्री सोय", "दैनंदिन गरजेच्या सर्व वस्तू", "सुलभ खरेदी"]
    },
    "भव्य स्विमिंग पूल": {
      title: "भव्य जलतरण तलाव",
      category: "जलतरण",
      icon: <Waves size={40} className="text-pink-600" />,
      mrDesc: "शुद्ध व ऑक्सिजनयुक्त पाण्याचा तलाव, जेथे ज्येष्ठ नागरिक मनसोक्त पोहण्याचा व व्यायामाचा आनंद घेऊ शकतात.",
      enDesc: "Clean oxygenated swimming pool for fitness, fun, and relaxation.",
      highlights: ["शुद्ध पाणी", "सुरक्षित खोली", "व्यायाम सोय"]
    },
    "फिटनेस कॉम्प्लेक्स": {
      title: "वातानुकूलित फिटनेस कॉम्प्लेक्स",
      category: "फिटनेस केंद्र",
      icon: <Dumbbell size={40} className="text-pink-600" />,
      mrDesc: "आधुनिक वातानुकूलित जिम, कार्डिओ उपकरणे, फिजिओथेरपी व वैयक्तिक ट्रेनर्सच्या मार्गदर्शनाखाली व्यायाम.",
      enDesc: "Modern AC gym, cardio gear, physiotherapy, and certified personal trainers.",
      highlights: ["प्रशिक्षित ट्रेनर्स", "फिजिओथेरपी सोय", "वातानुकूलित जिम"]
    }
  };

  return (
    <div className="brochure-page-wrapper">
      <div className="brochure-main-container">

        {/* ══════════════════════════════════════════════════════════════
            COLUMN 1 (LEFT FOLD - BRAND & FOUNDATION)
           ══════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="brochure-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <div className="bcol-1-header">
              <div className="bcol-top-badge">
                {isEn ? "Enroll now for senior citizens' healthy and joyful golden years." : "ज्येष्ठ नागरिकांच्या निरोगी आरोग्य व आनंददायी आयुष्यासाठी आनंद प्रवेश घ्या."}
              </div>
              <h1 className="bcol-main-title">
                {isEn ? <>Preetam Senior Citizen<br/>Anandshala</> : <>प्रीतम ज्येष्ठ नागरिक<br/>आनंदशाळा</>}
              </h1>
              <p className="bcol-sub-title">
                {isEn ? "Sangli's premier, modern & fully-equipped senior citizen sanctuary" : "सांगलीतील भव्य, आधुनिक, सर्व सुविधायुक्त ज्येष्ठ नागरिक आनंदधाम"}
              </p>
            </div>

            {/* Main Building & Overlapping Founders Image */}
            <div className="bcol-hero-img-box">
              <img src={buildingImage} alt="Preetam Anandshala" className="bcol-hero-main-img" />
              <div className="bcol-founders-overlay">
                <img 
                  src="/images/founderimg.png" 
                  alt="Founders" 
                  onError={(e) => { e.currentTarget.src = buildingImage; }} 
                />
              </div>
            </div>
          </div>

          {/* Bottom Maroon Footer Block */}
          <div className="bcol-1-bottom">
            <div className="flex items-center gap-2 mb-2">
              <Flower2 size={24} className="text-pink-300" />
              <span className="font-bold text-sm text-pink-200">{isEn ? "Preetam Belonging & Care Trust" : "प्रीतम आपुलकी व जिव्हाळा ट्रस्ट"}</span>
            </div>
            <p className="bcol-bottom-text">
              {isEn
                ? "Built across 1.5 acres in Sangli amidst serene nature, this is India's first digital landmark project where senior citizens can reside happily for days or a lifetime."
                : "सांगली शहरातील दीड एकर जागेवर, निसर्गाच्या वातावरणात उभा राहणारा हा भारतातील पहिलाच भव्य प्रकल्प आहे. येथे दिवसापासून ते आयुष्यभर आनंदाने राहता येते."}
            </p>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            COLUMN 2 (MIDDLE FOLD - GALLERY & FACILITIES)
           ══════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="brochure-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <div className="bcol-2-top-badge">
              {isEn ? "Preetam Anandshala — An Ideal Senior Citizen Sanctuary" : "प्रीतम आनंदशाळा — एक आदर्श ज्येष्ठ नागरिक धाम"}
            </div>

            <p className="bcol-2-intro">
              {isEn
                ? "Founded from the dream of Mr. Abhinav Kamaji, Sangli. Started on 26 January 2000, organizing annual foundation day, birthdays & senior citizen meetups."
                : "माझ्या जन्माची बीजे रुजली ती श्री. अभिनव जगन्नाथ कामाजी, रा. सांगली यांच्या स्वप्न प्रकल्पातून. अभिनव यांनी २६ जानेवारी २००० रोजी व्यवसाय सुरु केला व प्रत्येक वर्षी वर्धापन दिन, वाढदिवस, ज्येष्ठ नागरिक आनंद मेळावा व सहलीचे आयोजन करून साजरा करतात."}
            </p>

            {/* 6 Feature Pillars - TEXT ONLY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
              {photoItems.map((item, idx) => (
                <div 
                  className="flex flex-col items-center justify-center text-center p-3.5 sm:p-4 rounded-2xl bg-pink-50/90 border-2 border-pink-200 hover:border-[#810B38] hover:bg-pink-100 transition-all cursor-pointer shadow-sm hover:scale-105"
                  key={idx}
                  onClick={() => setSelectedDetail(item)}
                  title={isEn ? item.category : item.title}
                >
                  <span className="font-black text-[#810B38] text-xs sm:text-sm leading-tight">
                    {isEn ? item.category : item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Facilities Header */}
            <div className="bcol-section-header-red">
              {isEn ? "Available Campus Facilities" : "आमच्याकडे उपलब्ध सुविधा"}
            </div>

            {/* 13 Facilities Grid - CLICKABLE */}
            <div className="bcol-facilities-grid">
              {Object.keys(facilityDetails).map((name) => {
                const fac = facilityDetails[name];
                return (
                  <div 
                    className="bcol-facility-box" 
                    key={name}
                    onClick={() => setSelectedDetail(fac)}
                    title={`${fac.title} - माहिती पाहण्यासाठी क्लीक करा`}
                  >
                    <div className="bcol-facility-icon-wrap">
                      {fac.icon}
                    </div>
                    <span className="bcol-facility-title">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Dark Blue Block */}
          <div className="bcol-2-bottom">
            <div className="flex items-center gap-2 mb-1">
              <Flower2 size={20} className="text-yellow-300" />
              <span className="font-bold text-yellow-300">धार्मिक व सांस्कृतिक उपक्रम</span>
            </div>
            आनंदशाळेमध्ये सर्व धार्मिक उत्सव, सण व वाढदिवस साजरे केले जातील. आनंद शाळा, पुणे, मुंबई, महाराष्ट्र, भारतासह जगात कुठेही ठिकाणाहून आनंदाने राहण्यासाठी येऊ शकता.
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            COLUMN 3 (RIGHT FOLD - OBJECTIVES, RULES & CONTACT)
           ══════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="brochure-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <div className="bcol-3-header">
              <h2 className="bcol-3-title">आनंदशाळेचे ध्येय</h2>
              <p className="bcol-3-sub">
                ज्येष्ठ नागरिकांना आनंदी, उत्साही व निरोगी जीवन सुखद अनुभवता यावा यासाठी...
              </p>
            </div>

            {/* Top Building Cover Banner */}
            <div className="bcol-3-banner-box">
              <img src={buildingImage} alt="Objective" className="bcol-3-banner-img" />
            </div>

            {/* Rules Checklist Section - CLEAN & CLICKABLE */}
            <div 
              className="bcol-rules-sec cursor-pointer hover:bg-pink-50/50 transition-all duration-300 rounded-2xl p-4 border-2 border-dashed border-pink-200/80 shadow-sm"
              onClick={() => setSelectedDetail({
                title: "प्रवेश प्रक्रिया व फी रचना माहिती",
                category: "प्रवेश योजना",
                img: buildingImage,
                mrDesc: "प्रीतम ज्येष्ठ नागरिक आनंदशाळेत प्रवेश घेण्यासाठी अत्यंत सोपी, पारदर्शक व सवलतीच्या दरातील विविध मासिक, दररोजच्या व डिपॉझिट योजना उपलब्ध आहेत.",
                enDesc: "Flexible, transparent, and discounted admission plans available for all senior citizens.",
                highlights: [
                  "प्रति व्यक्ती, महिन्याची, आवडीनुसार किंवा दिवसाची फी भरा.",
                  "५ ते १० लाखांपर्यंत फिक्स डिपॉझिट (FD) ठेवून त्याच्या व्याजातून विनामूल्य निवास.",
                  "सभासद नोंदणी करून सोयीस्कर मासिक किंवा दैनिक शुल्कात प्रवेश.",
                  "एक दिवसाचा डे-पास रू. ६००/- मध्ये सर्व सुविधांसह उपलब्ध.",
                  "आनंदशाळा फंडातून मासिक सवलत फी (रु. ११,००० ते १५,०००/-).",
                  "आनंदविलास निवास फी किमान रु. १२,०००/- *GST Extra."
                ]
              })}
            >
              <div className="flex items-center justify-between mb-3 border-b border-pink-100 pb-2">
                <h3 className="bcol-rules-title text-base sm:text-lg font-black text-[#881337] m-0">प्रवेश कसा घ्याल ?</h3>
              </div>
              
              <ul className="space-y-2.5 list-none p-0 m-0">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>प्रति व्यक्ती, महिन्याची, आवडीनुसार किंवा दिवसाची फी भरा.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>५ ते १० लाखांपर्यंत फिक्स डिपॉझिट ठेवल्यास व्याजातून राहणे.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>सभासद नोंदणी करून सोयीस्कर कन्फर्ट शुल्कात प्रवेश.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>एक दिवसाचा डे-पास रू. ६००/- किमतीत सर्व सुविधांसह.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>आनंदशाळा फंडातून मासिक सवलत फी (रु. ११,००० ते १५,०००/-).</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  <CheckCircle2 size={18} className="text-pink-600 shrink-0 mt-0.5" />
                  <span>आनंदविलास राहणे फी किमान रु. १२,०००/- *GST Extra.</span>
                </li>
              </ul>
            </div>

            {/* Founder Floating Badge */}
            <div 
              className="bcol-founder-badge-wrapper cursor-pointer hover:scale-[1.02] transition-transform shadow-lg"
              onClick={() => setSelectedDetail({
                title: "भारतातील पहिलेच ज्येष्ठ नागरिकांची आनंदशाळा",
                category: "प्रकल्पाचे मानचिन्ह",
                img: "/images/founderimg.png",
                mrDesc: "ज्येष्ठ नागरिकांसाठी उभारलेला भारतातील पहिलाच १.५ एकर निसर्गरम्य हक्काचा डिजिटल प्रकल्प, जेथे स्वातंत्र्य, आरोग्य व सन्मान मिळतो.",
                enDesc: "India's 1st 1.5-acre dedicated senior citizen landmark hub.",
                highlights: [
                  "१.५ एकर भव्य निसर्गरम्य परिसर",
                  "२४×७ वैद्यकीय निगराणी व सुसज्ज हॉटेल",
                  "सर्व सुविधायुक्त वातानुकूलित दालने"
                ]
              })}
            >
              <img 
                src="/images/founderimg.png" 
                alt="Founder" 
                className="bcol-founder-badge-img"
                onError={(e) => { e.currentTarget.src = buildingImage; }} 
              />
              <div className="bcol-founder-badge-text">
                भारतातील पहिलेच ज्येष्ठ नागरिकांची 'आनंदशाळा'
              </div>
            </div>
          </div>

          {/* Column 3 Contact Footer */}
          <div className="bcol-3-contact-footer">
            <div className="bcol-contact-row">
              <Phone size={18} />
              <span>9370237633 / 9422409748</span>
            </div>
            <div className="bcol-contact-address flex items-start gap-1.5">
              <MapPin size={16} className="shrink-0 text-pink-400 mt-0.5" />
              <span>आनंदशाळा धाम, सांगली-मिरज रोड, कुपवाड फाटा, सांगली, महाराष्ट्र.</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          POPUP MODAL WINDOW FOR CLICKED ITEM
         ══════════════════════════════════════════════════════════════ */}
      {selectedDetail && typeof document !== "undefined" && createPortal(
        <div 
          className="brochure-modal-overlay"
          onClick={() => setSelectedDetail(null)}
        >
          <div 
            className="brochure-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition"
              onClick={() => setSelectedDetail(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* MODAL HEADER BADGE */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-sm">
                <Sparkles size={16} className="text-amber-600" />
                <span>{selectedDetail.category}</span>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="flex flex-col items-center text-center mb-6">
              {selectedDetail.img ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border-2 border-pink-200 shadow-md">
                  <img src={selectedDetail.img} alt={selectedDetail.title} className="w-full h-full object-cover" />
                </div>
              ) : selectedDetail.icon ? (
                <div className="w-20 h-20 rounded-full bg-pink-50 border-2 border-pink-500 flex items-center justify-center text-pink-600 mb-4 shadow-md">
                  {selectedDetail.icon}
                </div>
              ) : null}

              <h3 className="text-xl font-black text-[#541A1A] mb-2">
                {selectedDetail.title}
              </h3>

              <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-2">
                {selectedDetail.mrDesc}
              </p>

              {selectedDetail.enDesc && (
                <p className="text-xs font-medium text-slate-500 mb-4">
                  {selectedDetail.enDesc}
                </p>
              )}

              {/* HIGHLIGHTS */}
              <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 p-3.5 rounded-xl w-full text-left">
                {selectedDetail.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a 
                href="tel:9370237633" 
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition"
              >
                <PhoneCall size={18} />
                <span>अधिक माहितीसाठी कॉल करा: 9370237633</span>
                <ArrowRight size={16} />
              </a>

              <button 
                className="bg-slate-100 border border-slate-300 text-slate-700 font-extrabold text-xs sm:text-sm py-3 px-5 rounded-xl cursor-pointer hover:bg-slate-200 transition"
                onClick={() => setSelectedDetail(null)}
              >
                बंद करा
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Brochure;
