import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import "./SportsSection.css";
import { site, sportsClub } from "../lib/site-info";
import { useLanguage } from "@/lib/use-language";
import { useAdminStore } from "@/lib/admin-store";

interface FacilityDetail {
  id: string;
  titleMr: string;
  titleEn: string;
  subMr: string;
  subEn: string;
  descMr: string;
  descEn?: string;
  img: string;
  images?: string[];
  icon: string;
  featuresMr: string[];
  featuresEn?: string[];
  timingMr: string;
  timingEn?: string;
}

const facilityItems: FacilityDetail[] = [
  {
    id: "gym",
    icon: "🏋️‍♂️",
    titleMr: "अत्याधुनिक जिम (State-of-the-Art Gym)",
    titleEn: "State-of-the-Art Gym",
    subMr: "कार्डिओ, वेट ट्रेनिंग & स्ट्रेंथ इक्विपमेंट्स",
    subEn: "Cardio, weight training & strength equipments",
    descMr: "तुमच्या फिटनेस प्रवासाची दमदार सुरुवात करा! प्रीतम स्पोर्ट्स अँड फिटनेस क्लब मधील अत्याधुनिक जिम हे तुमचे सामर्थ्य आणि तंदुरुस्ती वाढवण्याचे केंद्र आहे. जागतिक दर्जाची कार्डिओ 🏃‍♀️, वेट ट्रेनिंग 🏋️ आणि स्ट्रेंथ इक्विपमेंट्स येथे उपलब्ध आहेत. आमच्या तज्ज्ञ प्रशिक्षकांच्या मार्गदर्शनाखाली तुम्ही तुमचे फिटनेस ध्येय सहज साध्य करू शकता.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184843273.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184838684.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184833833.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:३०",
    featuresMr: [
      "🌐 सुविधा: आंतरराष्ट्रीय दर्जाचे कार्डिओ आणि वेट लिफ्टिंग उपकरणे.",
      "🧑‍🏫 मार्गदर्शन: प्रमाणित आणि अनुभवी प्रशिक्षक नेहमी मदतीसाठी उपलब्ध.",
      "⏰ लवचिकता: तुमच्या वेळेनुसार सोयीस्कर बॅच आणि ट्रेनिंग वेळापत्रक.",
      "🎯 फोकस: स्नायूंची वाढ, वजन कमी करणे आणि एकूण तंदुरुस्ती."
    ]
  },
  {
    id: "yoga",
    icon: "🧘",
    titleMr: "योगा स्टुडिओ (Yoga Studio)",
    titleEn: "Yoga Studio",
    subMr: "शरीर आणि मन यांच्यातील सुंदर समन्वय",
    subEn: "Physical and mental health harmony",
    descMr: "शरीर आणि मन यांच्यातील सुंदर समन्वय अनुभवा. प्रीतम क्लबचा शांत आणि हवेशीर योगा स्टुडिओ तुम्हाला प्राणायाम, ध्यान आणि आसने शिकण्यासाठी आदर्श जागा आहे. तणाव कमी करून, लवचिकता वाढवून आणि आंतरिक शांती मिळवून तुमचे आरोग्य सुधारा. आमचे प्रशिक्षित योग गुरू तुमच्या प्रत्येक सत्राला मार्गदर्शन करतील.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841664.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841664.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841665.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841666.jpg"
    ],
    timingMr: "सकाळी ६:३० ते ९:०० व सायं. ५ ते ७",
    featuresMr: [
      "🧘 फायदे: लवचिकता, मनःशांती आणि तणावमुक्ती.",
      "🙏 प्रकार: हठ योग, पॉवर योग आणि मेडिटेटिव्ह योगाचे क्लासेस.",
      "✨ वातावरण: शांत, नैसर्गिक आणि सकारात्मक ऊर्जा देणारे."
    ]
  },
  {
    id: "meditation",
    icon: "🕊️",
    titleMr: "मेडिटेशन (ध्यान) कक्ष (Meditation Room)",
    titleEn: "Meditation Room",
    subMr: "धावपळीच्या जीवनात शांतता देणारे केंद्र",
    subEn: "Peaceful sanctuary for mental clarity",
    descMr: "धावपळीच्या जीवनात मनाला विश्रांती देण्यासाठी समर्पित मेडिटेशन कक्ष हे तुमचे शांत आश्रयस्थान आहे. या विशेष कक्षात तुम्ही गहन ध्यान करून मानसिक स्पष्टता मिळवू शकता आणि कामातून आलेल्या थकव्यावर मात करू शकता. मानसिक शांती आणि एकाग्रता वाढवून तुमच्या जीवनात सकारात्मक बदल आणा.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203091441.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203091441.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203091442.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203091443.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203091444.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "💡 उद्देश: मानसिक शांती, एकाग्रता आणि तणाव कमी करणे.",
      "🤫 वैशिष्ट्य: शांतता आणि एकाग्रतेसाठी डिझाइन केलेला विशेष कक्ष.",
      "🧠 लाभ: मनःस्थिती सुधारण्यास आणि स्मरणशक्ती वाढवण्यास मदत."
    ]
  },
  {
    id: "zumba",
    icon: "💃",
    titleMr: "झुंबा क्लासेस (Zumba Classes)",
    titleEn: "Zumba Classes",
    subMr: "संगीताच्या तालावर डान्स व कॅलरी बर्न",
    subEn: "High-energy dance workout & fun",
    descMr: "व्यायाम कंटाळवाणा नाही! झुंबा क्लासेसमध्ये संगीताच्या तालावर डान्स करत कॅलरी बर्न करा आणि मजा करा! ही उच्च-ऊर्जा (High-Energy) ॲक्टिव्हिटी तुम्हाला तंदुरुस्त ठेवण्यासोबतच तुमचा मूड (Mood) सुधारते. उत्साही प्रशिक्षक आणि जगभरातील विविध संगीताच्या मदतीने तुमचे फिटनेसचे ध्येय एका पार्टीसारखे वाटेल.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357581614.png",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357581614.png",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357577652.png",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357572624.png"
    ],
    timingMr: "सकाळी ७:०० ते ८:०० व सायं. ६ ते ७",
    featuresMr: [
      "🥳 अनुभव: फिटनेस आणि डान्स पार्टीचा जबरदस्त अनुभव.",
      "🔥 परिणाम: वेगाने कॅलरी बर्न आणि संपूर्ण शरीराचा व्यायाम.",
      "🎶 प्रशिक्षक: उत्साही आणि प्रशिक्षित झुंबा प्रशिक्षकांचे मार्गदर्शन."
    ]
  },
  {
    id: "dance",
    icon: "👯",
    titleMr: "डान्स क्लासेस (Dance Classes)",
    titleEn: "Dance Classes",
    subMr: "बॉलीवूड, हिप-हॉप व फ्रीस्टाइल डान्स",
    subEn: "Bollywood, Hip-Hop & Freestyle dance",
    descMr: "तुमच्यातील कलाकाराला वाव द्या! डान्स क्लासेसमध्ये विविध नृत्य प्रकार (उदा. बॉलीवूड, हिप-हॉप, फ्रीस्टाइल) शिकण्याची संधी मिळते. डान्समुळे केवळ शारीरिक तंदुरुस्तीच मिळत नाही, तर आत्मविश्वास आणि देहबोली (Body Language) सुधारते.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444303.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444303.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444304.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444305.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444306.jpg"
    ],
    timingMr: "सकाळी ७:०० ते रात्री ८:००",
    featuresMr: [
      "🩰 प्रकार: बॉलीवूड, फ्रीस्टाइल, कंटेम्पररी यांसारखे विविध नृत्य प्रकार.",
      "💖 फायदे: लवचिकता वाढवणे आणि आत्मविश्वास सुधारणे.",
      "👩‍🏫 शिकणे: खास प्रशिक्षित नृत्य शिक्षकांकडून धडे."
    ]
  },
  {
    id: "swimming",
    icon: "🏊‍♂️",
    titleMr: "भव्य स्विमिंग पूल (Grand Swimming Pool)",
    titleEn: "Grand Swimming Pool",
    subMr: "ऑलिंपिक मानकांचा स्वच्छ व सुरक्षित पूल",
    subEn: "Olympic standard clean filtered pool",
    descMr: "उन्हाळ्यावर मात करा आणि शरीराला आराम द्या! आमचा स्वच्छ आणि मोठा स्विमिंग पूल पोहण्यासाठी एक सुरक्षित आणि आल्हाददायक जागा आहे. पोहणे हा सर्वात उत्तम कार्डिओ व्यायाम मानला जातो, जो सांध्यांवर कोणताही ताण न आणता संपूर्ण शरीराला बळकटी देतो.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243460172.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243460172.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1761815943159.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760177990367.jpeg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ८:००",
    featuresMr: [
      "💧 स्वच्छता: नियमित फिल्टरिंग आणि गुणवत्ता तपासणी.",
      "👨‍🎓 प्रशिक्षण: नवशिक्यांसाठी आणि मुलांसाठी पोहण्याचे खास क्लासेस.",
      "🌞 अनुभव: संपूर्ण शरीरासाठी प्रभावी आणि आनंददायी व्यायाम."
    ]
  },
  {
    id: "badminton",
    icon: "🏸",
    titleMr: "बॅडमिंटन कोर्ट (Badminton Courts)",
    titleEn: "Indoor Badminton Courts",
    subMr: "आंतरराष्ट्रीय मानकांचे कोर्ट्स व लाईटिंग",
    subEn: "International standard wooden courts",
    descMr: "बॅडमिंटनच्या उत्साही खेळासाठी सज्ज व्हा! आमच्या क्लबमध्ये आंतरराष्ट्रीय दर्जाचे बॅडमिंटन कोर्ट्स उपलब्ध आहेत. उत्कृष्ट फ्लोअरिंग आणि योग्य प्रकाशयोजनामुळे (Lighting) येथे खेळण्याचा अनुभव खास असतो. तुमचा खेळ सुधारण्यासाठी येथे अनेक स्पर्धा आणि प्रशिक्षण सत्रांचे आयोजन केले जाते.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203979535.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203979535.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203969471.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203952737.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203942143.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "🏆 दर्जा: आंतरराष्ट्रीय मानकांचे उच्च-गुणवत्तेचे कोर्ट्स.",
      "💡 लाईटिंग: खेळासाठी योग्य आणि डोळ्यांना आरामदायक प्रकाशयोजना.",
      "🤝 उपलब्धता: कोर्ट बुकिंग आणि मासिक मेंबरशिप पर्याय उपलब्ध."
    ]
  },
  {
    id: "squash",
    icon: "🎾",
    titleMr: "स्क्वॉश कोर्ट (Squash Court)",
    titleEn: "Squash Court",
    subMr: "ग्लास-बॅक कोर्ट व तीव्र स्टॅमिना वर्कआउट",
    subEn: "International glass-back squash court",
    descMr: "तुमचा वेग आणि प्रतिसाद (Reflexes) तपासा! स्क्वॉश हा एक अत्यंत वेगवान आणि ऊर्जा-खर्चीक खेळ आहे. आमच्या सुसज्ज स्क्वॉश कोर्ट्सवर तुम्ही तुमच्या मित्रांना आव्हान देऊ शकता आणि काही मिनिटांत जबरदस्त कॅलरी बर्न करू शकता.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206382917.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206382917.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206382918.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206382919.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "⚡️ वेग: उच्च वेगाच्या आणि तीव्र व्यायामासाठी उत्तम.",
      "💪 लाभ: हृदय व रक्तवाहिन्यासंबंधी (Cardiovascular) आरोग्य सुधारते.",
      "🔑 बुकिंग: सोयीनुसार तासावर कोर्ट बुकिंगची सोय."
    ]
  },
  {
    id: "table-tennis",
    icon: "🏓",
    titleMr: "टेबल टेनिस हॉल (Table Tennis Hall)",
    titleEn: "Table Tennis Hall",
    subMr: "एकाग्रता आणि प्रतिक्रिया गती सुधारणारा खेळ",
    subEn: "High performance indoor TT hall",
    descMr: "टेबल टेनिसच्या (TT) रोमांचक खेळासाठी तयार व्हा! आमच्या टेबल टेनिस हॉलमध्ये तुम्हाला सर्वोत्तम उपकरणे आणि खेळण्यासाठी पुरेसा अवकाश मिळतो. एकाग्रता आणि प्रतिक्रिया गती वाढवण्यासाठी हा खेळ उत्कृष्ट आहे.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206867693.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206867693.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206867694.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763206867695.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "🎯 फोकस: एकाग्रता आणि प्रतिक्रिया गती (Reaction Time) सुधारते.",
      "✅ उपकरणे: उच्च-गुणवत्तेचे टीटी टेबल्स आणि साहित्य.",
      "🕹️ अनुभव: शांत आणि उत्साही वातावरणात खेळण्याचा आनंद."
    ]
  },
  {
    id: "snooker",
    icon: "🎱",
    titleMr: "स्नूकर आणि पूल (Snooker and Pool)",
    titleEn: "Snooker and Pool Lounge",
    subMr: "अचूकता व एकाग्रतेसाठी प्रिमियम टेबल्स",
    subEn: "International snooker & 8-ball pool",
    descMr: "विश्रांतीच्या वेळेत मनोरंजनाची जोड द्या. आमच्या स्नूकर आणि पूल सुविधेमध्ये उच्च-गुणवत्तेचे टेबल्स उपलब्ध आहेत. स्नूकर हा खेळ एकाग्रता आणि अचूकता (Precision) वाढवण्यास मदत करतो.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243482819.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243482819.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1761816054100.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760115460449.png"
    ],
    timingMr: "सकाळी १०:०० ते रात्री ९:००",
    featuresMr: [
      "🧠 कौशल्य: अचूकता, एकाग्रता आणि धोरणात्मक विचार वाढवते.",
      "🛋️ सुविधा: आरामदायक बैठक व्यवस्था आणि शांत वातावरण.",
      "👍 उद्देश: सामाजिक आणि मनोरंजक विरंगुळ्यासाठी उत्तम."
    ]
  },
  {
    id: "pickleball",
    icon: "🥅",
    titleMr: "पिकलबॉल कोर्ट / कृत्रिम टर्फ मैदान",
    titleEn: "Pickleball Court / Turf Field",
    subMr: "पिकलबॉल, फुटबॉल ⚽ व क्रिकेट सरावासाठी टर्फ",
    subEn: "Artificial turf field for football & cricket",
    descMr: "हिरवीगार आणि उत्कृष्ट कृत्रिम टर्फ मैदान तुमच्या आऊटडोअर खेळांच्या गरजा पूर्ण करते. फुटबॉल ⚽, क्रिकेट किंवा इतर मैदानी खेळांच्या सरावासाठी हे मैदान भाड्याने उपलब्ध आहे. नैसर्गिक गवतापेक्षा अधिक सुरक्षित आणि वर्षभर वापरण्यास सोयीस्कर!",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763202416442.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763202416442.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763202393807.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763202037643.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763201883062.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763201883063.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ९:००",
    featuresMr: [
      "🌿 गुणवत्ता: उच्च-गुणवत्तेचे आणि सुरक्षित कृत्रिम टर्फ.",
      "📅 बुकिंग: टीम मॅच आणि सरावासाठी तासावर भाड्याने उपलब्ध.",
      "🎮 वापर: फुटबॉल, क्रिकेट, वॉर्म-अप आणि इतर मैदानी खेळांसाठी."
    ]
  },
  {
    id: "jogging",
    icon: "👟",
    titleMr: "जॉगिंग ट्रॅक (Jogging Track)",
    titleEn: "Jogging Track",
    subMr: "निसर्गरम्य हिरवळीत सुरक्षित ट्रॅक",
    subEn: "Scenic open-air jogging track",
    descMr: "निसर्गरम्य आणि शुद्ध हवेत जॉगिंग करा. आमच्या क्लबमध्ये एक भव्य, प्रशस्त आणि सुरक्षित जॉगिंग ट्रॅक आहे. ट्रॅकच्या आजूबाजूला हिरवळ असल्याने तुमचा व्यायाम अधिक उत्साहवर्धक आणि ताजेतवाना बनतो. सकाळी किंवा संध्याकाळी वॉकिंग/जॉगिंगसाठी हे ठिकाण सांगलीतील सर्वोत्तम आहे.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760166322502.jpeg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760166322502.jpeg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760166317653.jpeg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9029/1759815501929.png"
    ],
    timingMr: "सकाळी ५:३० ते रात्री ८:३०",
    featuresMr: [
      "🏞️ वातावरण: शुद्ध हवा आणि निसर्गाच्या सान्निध्यात ट्रॅक.",
      "✅ सुरक्षितता: सुरक्षित आणि वाहनांपासून मुक्त ट्रॅक.",
      "💖 फायदा: सकाळच्या व संध्याकाळच्या कार्डिओसाठी आदर्श आणि मूड बूस्टर."
    ]
  },
  {
    id: "open-gym",
    icon: "💪",
    titleMr: "ओपन जिम (Open Gym)",
    titleEn: "Open Gym",
    subMr: "आधुनिक उपकरणांनी सज्ज मोकळा व्यायाम परिसर",
    subEn: "Outdoor open-air gym equipments",
    descMr: "तुमच्या फिटनेसची वेळ आता तुमच्या हातात! आमच्या क्लबमध्ये आधुनिक उपकरणांनी सज्ज ओपन जिम उपलब्ध आहे. तुम्ही स्वतःच्या सोयीच्या वेळेनुसार येथे येऊन व्यायाम करू शकता. स्ट्रेंथ ट्रेनिंग, कार्डिओ, आणि फ्री वेट ट्रेनिंगसाठी हा एक आदर्श स्थान आहे.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243539238.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243539238.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243539239.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760274358794.jpg"
    ],
    timingMr: "सकाळी ५:३० ते रात्री ९:००",
    featuresMr: [
      "💪 उपकरणे: अत्याधुनिक जिम मशीन आणि फ्री वेट्स",
      "🕒 सोय: सदस्यांसाठी लवचिक वेळा आणि ओपन जिम सुविधा",
      "🤝 सपोर्ट: प्रशिक्षकांची मदत आणि मार्गदर्शन उपलब्ध"
    ]
  },
  {
    id: "lawn",
    icon: "🌿",
    titleMr: "लॉन (Lawn)",
    titleEn: "Lush Green Lawn",
    subMr: "योग, स्ट्रेचिंग व विश्रांतीसाठी हिरवळ",
    subEn: "Open green garden for yoga & events",
    descMr: "आनंदी वेळ घालवण्यासाठी आणि निसर्गाच्या सान्निध्यात सक्रिय राहण्यासाठी आमचा खुला लॉन आदर्श आहे. योग, स्ट्रेचिंग, ग्रुप फिटनेस सत्र किंवा फॅमिली पिकनिकसाठी येथे येऊ शकता. हिरव्या आणि स्वच्छ परिसरामुळे तुमचा अनुभव अत्यंत आरामदायक आणि ताजेतवाने वाटतो.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760461871266.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760461871266.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9336/1760461871267.jpg"
    ],
    timingMr: "सकाळी ६:०० ते रात्री ८:३०",
    featuresMr: [
      "🌞 सुविधा: खुला, हिरवळीत भरलेला परिसर",
      "🧘 उपयोग: योग, फिटनेस सत्र, इव्हेंट्स आणि विश्रांती",
      "🤝 सोय: मेंबर आणि बुकिंग पर्याय उपलब्ध"
    ]
  },
  {
    id: "children-play-area",
    icon: "🎡",
    titleMr: "चिल्ड्रन्स प्ले एरिया (Children's Play Area)",
    titleEn: "Children's Play Area",
    subMr: "मुलांसाठी रंगीबेरंगी व सुरक्षित खेळणी",
    subEn: "Safe and fun slides & swings for kids",
    descMr: "लहानग्यांसाठी सुरक्षित आणि मनोरंजक खेळाची जागा! आमच्या क्लबमध्ये रंगीबेरंगी आणि सुरक्षित उपकरणांनी सज्ज चिल्ड्रन्स प्ले एरिया उपलब्ध आहे. लहान मुलं येथे खेळत-खेळत आनंदी राहतात आणि त्यांचा शारीरिक आणि मानसिक विकासही होतो.",
    img: "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763209644300.jpg",
    images: [
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763209644300.jpg",
      "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763209631568.jpg"
    ],
    timingMr: "सकाळी ७:०० ते रात्री ८:३०",
    featuresMr: [
      "🌈 सुविधा: स्लाइड्स, स्विंग्स, झुला आणि इतर खेळाची साधने",
      "🛡️ सुरक्षा: मुलांसाठी सुरक्षित आणि नियंत्रित परिसर",
      "🤝 सोय: पालकांसाठी देखभाल आणि बुकिंग पर्याय उपलब्ध"
    ]
  }
];

export default function SportsSection() {
  const { isEn } = useLanguage();
  const store = useAdminStore();
  const [selectedFacility, setSelectedFacility] = useState<FacilityDetail | null>(null);
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFacility) {
      setActiveModalImg(selectedFacility.img);
    }
  }, [selectedFacility]);
  const [showRegModal, setShowRegModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    interest: "sports",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    try {
      store.addInquiry({
        name: formData.name,
        phone: formData.phone,
        email: "",
        subject: `🏆 प्रीतम स्पोर्ट्स ऑनलाईन नोंदणी: ${formData.interest}`,
        message: `शहर: ${formData.city || "उदा. सांगली"} | आवड: ${formData.interest} | संदेश: ${formData.message || "माहिती हवी आहे"}`,
        category: "sports",
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sp-v3-root">

      <div className="sp-container">
        {/* ══════════════════════════════════════════════════════════════
            2. HERO SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-clean-sec">
          {/* TOP LUXURY BANNER WITH KEN-BURNS ANIMATION & AMBIENT LIGHT ORBS */}
          <div className="sp-exact-banner-box">
            <div className="sp-banner-glow-orb-left" />
            <div className="sp-banner-glow-orb-right" />

            <img
              src="/images/preetam_sports_building.jpg"
              alt="Preetam Sports and Fitness Club Sangli Building Exterior"
              className="sp-exact-banner-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg";
              }}
            />
            <div className="sp-exact-banner-overlay">

              <h1 className="sp-exact-banner-title">
                प्रीतम स्पोर्ट्स अँड फिटनेस क्लब
                <br />
                <span className="sp-title-highlight">• सांगली</span>
              </h1>

              <p className="sp-exact-banner-sub">
                वातानुकूलित जिम • ऑलिंपिक स्विमिंग पूल • इनडोअर बॅडमिंटन • पिकलबॉल • योग व ध्यान
              </p>

              <button 
                type="button"
                onClick={() => setShowRegModal(true)} 
                className="sp-hero-cta-btn"
                title="ऑनलाईन नोंदणी करा"
              >
                <span>✨ आजच ऑनलाईन सभासद नोंदणी करा</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* MIDDLE CHIPS ROW WITH VIBRANT EMOJIS & GLOW HOVER EFFECTS */}
          <div className="sp-exact-chips-row">
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏋️‍♂️</span> AC जिम व बॉडीबिल्डिंग</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏊‍♂️</span> ऑलिंपिक स्विमिंग पूल</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏸</span> इनडोअर बॅडमिंटन</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🏓</span> पिकलबॉल Court</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🧘</span> योग व ध्यान धारणा</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">💃</span> झुंबा व डान्स क्लास</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🎾</span> स्क्वॅश ॲरेना</div>
            <div className="sp-exact-chip"><span className="sp-exact-chip-icon">🎱</span> स्नूकर लाउंज</div>
          </div>

        </section>

        {/* ══════════════════════════════════════════════════════════════
            ABOUT US (आमच्याबद्दल) ELEGANT LIGHT THEME INTERACTIVE SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section className="relative my-10 sm:my-16 p-6 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-50/90 via-rose-50/80 to-amber-100/90 border-2 border-pink-200/90 shadow-2xl text-slate-900 overflow-hidden">
          
          {/* Subtle Ambient Light Glowing Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-100 via-amber-100 to-rose-100 border border-pink-300 text-[#810B38] font-black text-xs sm:text-sm tracking-wider uppercase shadow-sm">
              <span className="animate-bounce">🏆</span> आमच्याबद्दल (About Us)
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#810B38] leading-tight drop-shadow-xs">
              प्रीतम स्पोर्ट्स अँड फिटनेस क्लब • सांगली
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-bold">
              सांगलीतील पहिले व भव्य १.५ एकर स्पोर्ट्स, फिटनेस आणि संपूर्ण आनंदाचे केंद्र
            </p>
          </div>

          {/* Grid Layout of Light Cards */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* CARD 1: Vision & Philosophy (Takes 7 cols on lg) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/95 border border-pink-200 shadow-lg hover:border-pink-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-pink-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    🌟
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#810B38]">
                    आमचा उद्देश व दूरदृष्टी
                  </h3>
                </div>

                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  आपण प्रीतम स्पोर्ट्स व फिटनेस क्लबची मेंबरशिप घेऊन भारतातील प्रथम चालू होत असलेल्या <strong className="text-[#810B38] font-extrabold">ज्येष्ठ नागरिक आनंदशाळेला</strong> सपोर्ट व सहकार्य करा आणि ज्येष्ठांचे मौल्यवान आशीर्वाद मिळवा.
                </p>

                <div className="p-4.5 rounded-xl bg-gradient-to-r from-amber-100/90 via-orange-50 to-pink-100/90 border border-amber-300 text-[#810B38] text-sm sm:text-base font-bold leading-relaxed shadow-xs">
                  सांगली जिल्ह्यातील <strong className="text-amber-900 font-black underline decoration-amber-400">पहिले आणि सर्वात भव्य स्पोर्ट्स अँड फिटनेस क्लब</strong> म्हणून 'प्रीतम स्पोर्ट्स अँड फिटनेस क्लब' आपल्या सेवेत आनंदाने सज्ज आहे! 🎉
                </div>

                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  आमचा उद्देश केवळ व्यायामशाळा (Gym) चालवणे नाही, तर <strong className="text-[#810B38] font-extrabold">संपूर्ण आरोग्य, उत्साह आणि आनंदाचे एक केंद्र</strong> निर्माण करणे आहे. <strong className="text-rose-900 font-extrabold">श्री. अभिनय जगन्नाथ कामाजी</strong> यांच्या दूरदृष्टीमुळे येथे <strong className="text-[#810B38] font-extrabold">फिटनेस, खेळ आणि नैसर्गिक शांतता</strong> यांचा अद्भुत संगम साकार झाला आहे.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-1.5 shadow-2xs">
                  ✨ २५+ जागतिक सुविधा
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-300 text-xs font-bold text-rose-950 flex items-center gap-1.5 shadow-2xs">
                  🌳 १.५ एकर निसर्गरम्य संकुल
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center gap-1.5 shadow-2xs">
                  🧘 फिटनेस + आनंदशाळा संगम
                </span>
              </div>
            </div>

            {/* CARD 2: Nature & Environment (Takes 5 cols on lg) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/95 border border-emerald-200 shadow-lg hover:border-emerald-400 hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    🌿
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                    निसर्गाच्या सान्निध्यात आरोग्य
                  </h3>
                </div>

                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  आमचे क्लब हे शहराच्या गजबजाटापासून दूर, <strong className="text-emerald-900 font-extrabold">शुद्ध हवा 🌬️ आणि हिरवळीच्या निसर्गरम्य वातावरणात</strong> स्थित आहे.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-center shadow-xs">
                    <span className="text-2xl block mb-1">📍</span>
                    <span className="text-xs text-slate-600 font-bold block">सांगली शहरापासून</span>
                    <span className="text-sm font-black text-emerald-900">५ किमी च्या आत</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-center shadow-xs">
                    <span className="text-2xl block mb-1">🏃‍♂️</span>
                    <span className="text-xs text-slate-600 font-bold block">प्रशस्त परिसर</span>
                    <span className="text-sm font-black text-emerald-900">जॉगिंग ट्रॅक & लॉन</span>
                  </div>
                </div>

                <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                  येथे व्यायाम करणे म्हणजे केवळ शरीराला ऊर्जा देणे नाही, तर मनालाही शांती आणि ताजेतवाने अनुभव देणे आहे.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs sm:text-sm text-emerald-950 font-bold text-center">
                🌱 हिरवळीच्या मोकळ्या वातावरणात प्रत्येक सकाळ उत्साहाने सुरू होते!
              </div>
            </div>

            {/* CARD 3: 4 Main Facility Pillars (Takes 6 cols on lg) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/95 via-white to-orange-50/95 border border-amber-200 shadow-lg hover:border-amber-400 hover:shadow-xl transition-all duration-300 space-y-5 group hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                  🥇
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                    सुविधांचा भव्य अनुभव
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    एकाच छताखाली २५ हून अधिक जागतिक दर्जाच्या सोयी
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all space-y-1">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                    <span>🦾</span> शारीरिक फिटनेस
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    अत्याधुनिक जिम, योगा स्टुडिओ, झुंबा आणि डान्स क्लासेस.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all space-y-1">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                    <span>🏊‍♂️</span> ॲथलेटिक्स व खेळ
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    ऑलिंपिक स्विमिंग पूल, बॅडमिंटन, पिकलबॉल व स्क्वॉश कोर्ट.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all space-y-1">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                    <span>🏓</span> इनडोअर गेम्स
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    रोमांचक टेबल टेनिस व स्नूकर लाउंजची सोय.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm transition-all space-y-1">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                    <span>🕊️</span> मानसिक शांती
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    गहन ध्यानासाठी समर्पित मेडिटेशन कक्ष.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 4: Complimentary Happy Center (Takes 6 cols on lg) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-50/95 via-white to-pink-50/95 border border-purple-200 shadow-lg hover:border-purple-400 hover:shadow-xl transition-all duration-300 space-y-5 group hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                  ✨
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-purple-950">
                    कॉम्प्लिमेंटरी आनंदाचे केंद्र
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    कोणत्याही मेंबरशिपसोबत मिळणाऱ्या मोफत (Complimentary) सुविधा
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white border border-purple-200 text-center space-y-1.5 shadow-xs">
                  <span className="text-2xl block">📚</span>
                  <h4 className="text-xs font-black text-purple-950">वाचनालय (Library)</h4>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug">ज्ञानाची भूक भागवण्यासाठी शांत कोपरा</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-purple-200 text-center space-y-1.5 shadow-xs">
                  <span className="text-2xl block">🎼</span>
                  <h4 className="text-xs font-black text-purple-950">संगीत उपकरण हॉल</h4>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug">तुमच्यातील कलाकाराला वाव देण्यासाठी</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-purple-200 text-center space-y-1.5 shadow-xs">
                  <span className="text-2xl block">♟️</span>
                  <h4 className="text-xs font-black text-purple-950">बैठे खेळ हॉल</h4>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug">कॅरम, बुद्धिबळ व विरंगुळा</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-100 via-purple-100 to-pink-100 border border-purple-300 text-purple-950 font-black text-xs sm:text-sm text-center leading-relaxed shadow-xs">
                🏃‍♂️ प्रीतम क्लब हे सांगलीच्या प्रत्येक नागरिकाला आरोग्य, आनंद आणि समाधानी जीवन जगण्यासाठी प्रेरित करते!
              </div>
            </div>

          </div>

        </section>

        {/* ══════════════════════════════════════════════════════════════
            3. "आमच्या सुविधा" 8 CARDS GRID
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-facilities-sec">
          <div className="sp-sec-header">
            <div className="sp-sec-badge">✨ प्रिमियम सोयी सुविधा</div>
            <h2 className="sp-sec-title-center">आमच्या सुविधा (विस्तृत माहितीसाठी कार्डवर क्लिक करा)</h2>
            <p className="sp-sec-subtitle">प्रीतम स्पोर्ट्स क्लबमधील जागतिक दर्जाच्या क्रीडा व फिटनेस सुविधा</p>
          </div>

          <div className="sp-facilities-grid">
            {facilityItems.map((item) => {
              const isActive = selectedFacility?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`sp-fac-card-v2 ${isActive ? "active-card" : ""}`}
                  onClick={() => setSelectedFacility(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sp-fac-img-box">
                    <img
                      src={item.img}
                      alt={isEn ? item.titleEn : item.titleMr}
                      className="sp-fac-img"
                    />
                  </div>
                  <div className="sp-fac-body">
                    <div className="sp-fac-info-title">{isEn ? item.titleEn : item.titleMr}</div>
                    <div className="sp-fac-info-sub">{isEn ? item.subEn : item.subMr}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FACILITY DETAIL POPUP MODAL
           ══════════════════════════════════════════════════════════════ */}
        {selectedFacility &&
          createPortal(
            <div
              className="sp-modal-overlay"
              onClick={() => setSelectedFacility(null)}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="sp-modal-container" onClick={(e) => e.stopPropagation()}>
                <button
                  className="sp-modal-close-btn"
                  onClick={() => setSelectedFacility(null)}
                  title="बंद करा"
                >
                  ✕
                </button>

                <div className="sp-modal-hero-img-box">
                  <img
                    src={activeModalImg || selectedFacility.img}
                    alt={selectedFacility.titleMr}
                    className="sp-modal-hero-img"
                  />
                  <div className="sp-modal-hero-badge">
                    <span>{selectedFacility.icon}</span>
                    <span>{selectedFacility.titleMr}</span>
                  </div>
                </div>

                {selectedFacility.images && selectedFacility.images.length > 1 && (
                  <div className="flex gap-2.5 p-3 bg-slate-900/80 overflow-x-auto justify-center rounded-xl my-3 max-w-full">
                    {selectedFacility.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveModalImg(imgUrl)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          (activeModalImg || selectedFacility.img) === imgUrl
                            ? "border-amber-400 scale-105 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="sp-modal-content">
                  <div className="sp-modal-header">
                    <h3 className="sp-modal-title">
                      {selectedFacility.icon} {selectedFacility.titleMr}
                    </h3>
                    <div className="sp-modal-timing">
                      ⏰ उपलब्ध वेळ: <strong>{selectedFacility.timingMr}</strong>
                    </div>
                  </div>

                  <p className="sp-modal-desc">{selectedFacility.descMr}</p>

                  <div className="sp-modal-features-sec">
                    <h4 className="sp-modal-features-title">✨ मुख्य वैशिष्ट्ये व सोयी:</h4>
                    <ul className="sp-modal-features-list">
                      {selectedFacility.featuresMr.map((feat, idx) => (
                        <li key={idx} className="sp-modal-feat-item">
                          <span className="sp-feat-check">✔</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sp-modal-actions">
                    <button
                      type="button"
                      onClick={() => {
                        const facTitle = selectedFacility.titleMr;
                        setSelectedFacility(null);
                        setFormData((prev) => ({
                          ...prev,
                          message: `${facTitle} बुकिंग चौकशी`
                        }));
                        setShowRegModal(true);
                      }}
                      className="sp-modal-btn-call cursor-pointer border-0 w-full"
                    >
                      📝 आजच बुकिंग करा (फॉर्म / फोन)
                    </button>
                    <a
                      href={`${sportsClub.whatsapp}&text=मला%20${encodeURIComponent(
                        selectedFacility.titleMr
                      )}%20बद्दल%20अधिक%20माहिती%20हवी%20आहे.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-modal-btn-wa"
                    >
                      💬 WhatsApp वर चौकशी करा
                    </a>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* ══════════════════════════════════════════════════════════════
            4. "आरोग्य, फिटनेस आणि आनंदाचा एकत्रित प्रवास!" GRID
           ══════════════════════════════════════════════════════════════ */}
        <section className="sp-journey-sec">
          <div className="sp-journey-grid">
            {/* LEFT CONTENT */}
            <div className="sp-journey-left">
              <div className="sp-journey-badge">✨ प्रीतम स्पोर्ट्स अँड फिटनेस क्लब • सांगली</div>
              <h2 className="sp-journey-title">
                आरोग्य, फिटनेस आणि <br />
                <span className="sp-title-gradient">आनंदाचा एकत्रित प्रवास!</span>
              </h2>
              <p className="sp-journey-sub">
                सुसज्ज वातानुकूलित जिम, ऑलिंपिक स्विमिंग पूल, इनडोअर बॅडमिंटन कोर्ट्स आणि निसर्गरम्य वातावरणात समृद्ध जीवनशैलीचा मनसोक्त आनंद घ्या.
              </p>
              
              <div className="sp-journey-highlights">
                <span className="sp-hl-chip">🏊‍♂️ ऑलिंपिक पूल</span>
                <span className="sp-hl-chip">🏋️‍♂️ AC जिम</span>
                <span className="sp-hl-chip">🏸 इन्डोअर कोर्ट्स</span>
                <span className="sp-hl-chip">🧘 योग & ध्यान</span>
              </div>

              <button 
                type="button"
                onClick={() => setShowRegModal(true)} 
                className="sp-btn-pink-hero cursor-pointer hover:scale-105 transition-transform"
                title="ऑनलाईन प्रवेश नोंदणी फॉर्म उघडा"
              >
                <Sparkles size={18} />
                <span>आजच प्रवेश नोंदणी करा</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* RIGHT 6 PHOTO COLLAGE WITH LABELS */}
            <div className="sp-photo-collage">
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1762243460172.jpg"
                  alt="Pool"
                />
                <span className="sp-collage-label">🏊‍♂️ स्विमिंग पूल</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763184848892.jpg"
                  alt="Gym"
                />
                <span className="sp-collage-label">🏋️‍♂️ AC जिम</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763188841664.jpg"
                  alt="Yoga"
                />
                <span className="sp-collage-label">🧘 योग व ध्यान</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763203444303.jpg"
                  alt="Badminton"
                />
                <span className="sp-collage-label">🏸 बॅडमिंटन</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357581614.png"
                  alt="Zumba"
                />
                <span className="sp-collage-label">💃 झुम्बा डान्स</span>
              </div>
              <div className="sp-collage-img-box">
                <img
                  src="https://d3k88l35vy59af.cloudfront.net/A42/9663/1763357638128.jpg"
                  alt="Club House"
                />
                <span className="sp-collage-label">🏢 प्रिमियम क्लब</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. ONLINE REGISTRATION ENQUIRY FORM MODAL
         ══════════════════════════════════════════════════════════════ */}
      {showRegModal && createPortal(
        <div 
          className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
        >
          <div 
            className="bg-gradient-to-br from-[#1a0429] via-[#2d0739] to-[#0c0216] border-4 border-pink-500/40 rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl text-white my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
              className="absolute top-4 right-4 size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition font-black cursor-pointer z-20"
              aria-label="Close"
            >
              ✕
            </button>

            {!isSubmitted ? (
              <div>
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-black mb-2 shadow-inner">
                    ✨ ऑनलाईन प्रवेश व चौकशी नोंदणी
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    आजच प्रवेश नोंदणी करा
                  </h3>
                  <p className="text-xs sm:text-sm text-pink-200/80 font-bold mt-1 mb-3">
                    खालील ऑनलाईन फॉर्म भरा (ॲडमिन पॅनेलमध्ये जमा होईल) किंवा थेट कॉल करा:
                  </p>

                  {/* QUICK PHONE CALL BUTTONS */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 mb-2">
                    <a
                      href="tel:9970079090"
                      className="px-3.5 py-2 rounded-xl bg-pink-500/30 hover:bg-pink-500/50 text-white border border-pink-400/40 text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
                    >
                      📞 9970079090 कॉल करा
                    </a>
                    <a
                      href="tel:9423258859"
                      className="px-3.5 py-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-white border border-purple-400/40 text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
                    >
                      📞 9423258859 कॉल करा
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubmitReg} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      १. आपले संपूर्ण नाव *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="उदा. राहुल सचिन पाटील"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      २. संपर्क मोबाईल नंबर *
                    </label>
                    <input 
                      type="tel" 
                      required
                      maxLength={10}
                      placeholder="उदा. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-pink-200 mb-1.5">
                        ३. शहर / गाव
                      </label>
                      <input 
                        type="text" 
                        placeholder="उदा. सांगली / मिरज"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-pink-200 mb-1.5">
                        ४. प्रवेशाचा प्रकार
                      </label>
                      <select 
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-slate-900 text-white border-2 border-white/20 rounded-2xl px-3 py-3 font-bold text-sm focus:outline-none focus:border-pink-500 transition"
                      >
                        <option value="sports" className="bg-[#0f172a] text-white font-bold">स्पोर्ट्स अँड फिटनेस क्लब</option>
                        <option value="anandshala" className="bg-[#0f172a] text-white font-bold">आनंदशाळा ज्येष्ठ नागरिक धाम</option>
                        <option value="both" className="bg-[#0f172a] text-white font-bold">दोन्ही (आनंदशाळा व स्पोर्ट्स)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-pink-200 mb-1.5">
                      ५. विशेष टीप / संदेश (पर्यायी)
                    </label>
                    <textarea 
                      rows={2}
                      placeholder="तुमचे काही प्रश्न असल्यास येथे लिहा..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-2.5 text-white placeholder-white/40 font-bold text-sm focus:outline-none focus:border-pink-500 transition resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <span>कृपया वाट पहा...</span>
                    ) : (
                      <>
                        <span>फॉर्म सबमिट करा</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="size-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  अभिनंदन! नोंदणी सबमिट झाली.
                </h3>
                <p className="text-sm font-bold text-pink-200/90 leading-relaxed max-w-sm mx-auto mb-6">
                  धन्यवाद <strong>{formData.name}</strong>! आमची प्रीतम आनंदशाळा टीम लवकरच आपल्याशी फोन वर संवाद साधेल.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a 
                    href={`https://wa.me/91${sportsClub.phones[0]}?text=नमस्कार,%20मी%20फॉर्म%20भरला%20आहे.%20माझे%20नाव:%20${encodeURIComponent(formData.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <span>💬 WhatsApp वर मेसेज करा</span>
                  </a>

                  <button 
                    onClick={() => { setShowRegModal(false); setIsSubmitted(false); }}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm border border-white/20 transition"
                  >
                    बंद करा
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
