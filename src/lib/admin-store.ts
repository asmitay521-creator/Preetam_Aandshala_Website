import { useState, useEffect } from "react";
import { db, storage } from "@/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImageToFirebase(file: File, pathFolder = "admin_uploads"): Promise<string> {
  try {
    const fileRef = ref(storage, `${pathFolder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn("Firebase Storage Upload fallback to base64:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }
}

// ============================================================================
// TYPES
// ============================================================================

export type GalleryItem = {
  id: string;
  url: string;
  caption: string;
  category: string[];
};

export type InquiryItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  category?: "anandshala" | "sports";
};

export function isSportsInquiryItem(inq: InquiryItem): boolean {
  if (inq.category === "sports") return true;
  if (inq.category === "anandshala") return false;
  const combined = `${inq.subject || ""} ${inq.message || ""}`.toLowerCase();
  return (
    combined.includes("स्पोर्ट्स") ||
    combined.includes("sports") ||
    combined.includes("फिटनेस") ||
    combined.includes("fitness") ||
    combined.includes("जीम") ||
    combined.includes("gym") ||
    combined.includes("टर्फ") ||
    combined.includes("स्विमिंग") ||
    combined.includes("swimming") ||
    combined.includes("बॅडमिंटन") ||
    combined.includes("badminton") ||
    combined.includes("स्क्वॅश") ||
    combined.includes("पिकलबॉल")
  );
}

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  text?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  rating: number;
  approved: boolean;
  date: string;
};

export type SportsFacilityItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
};

export type SportsPackageItem = {
  id: string;
  title: string;
  price: string;
  subtitle?: string;
  features: string[];
};

export type SiteData = {
  nameMr: string;
  tagline: string;
  announcement: string;
  launchDate: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  girishOakQuote: string;
  anandshalaDesc: string;
  sportsDesc: string;
  welcomePosterUrl?: string;
  showWelcomePoster?: boolean;
  aanandshalaTitle?: string;
  aanandshalaBadge?: string;
  aanandshalaImages?: string[];
  sportsTitle?: string;
  sportsBadge?: string;
  sportsImages?: string[];
  sportsBrochureUrl?: string;
  sportsBrochureType?: "image" | "pdf";
  sportsFacilities?: SportsFacilityItem[];
  sportsPackages?: SportsPackageItem[];
  sportsGallery?: string[];
};

export type HomeNewsItem = {
  id: string;
  title: string;
  badge?: string;
  description: string;
  imageUrl?: string;
  date: string;
  linkUrl?: string;
};

export type PackageItem = {
  id: string;
  title: string;
  price: string;
  sub: string;
  badge: string;
  periodType: "days" | "month" | "year";
  features: string[];
  featured?: boolean;
};

export type AboutHighlightItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date?: string;
};

export type AboutParagraphItem = {
  id: string;
  label?: string;
  text: string;
  imageUrl?: string;
};

export type AboutData = {
  storyP1: string;
  storyP2: string;
  storyP3: string;
  awardNotice: string;
  photos?: string[];
  highlights?: AboutHighlightItem[];
  paragraphs?: AboutParagraphItem[];
};

export type BrochureItem = {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  description?: string;
  date: string;
};

// ============================================================================
// INITIAL DEFAULT DATA
// ============================================================================

export const initialPackages: PackageItem[] = [
  {
    id: "pkg-1",
    title: "एक दिवस सहल भेट पास",
    price: "₹ ६०० /-",
    sub: "वेळ: सकाळी ११ ते सायं. ५ (एका व्यक्तीसाठी)",
    badge: "१ दिवस सहल भेट पास",
    periodType: "days",
    features: [
      "चहा, नाश्ता व चवदार प्युअर व्हेज जेवण",
      "संपूर्ण १.५ एकर विहंगम परिसर दर्शन",
      "खेळ, स्विमिंग पूल व सर्व सोयी-सुविधांचा आनंद",
      "मित्र-मैत्रिणींसोबत एक आनंददायी दिवस",
    ],
  },
  {
    id: "pkg-2",
    title: "फक्त आनंदशाळा (डे-केअर)",
    price: "₹ ३,००० /-",
    sub: "प्रति महिना पासून (मानसिक फी)",
    badge: "डे-केअर पर्याय",
    periodType: "month",
    features: [
      "वेळ: सकाळी ११ ते सायं. ५",
      "दैनंदिन ५ तासांचे १५ हॉल्समधील उपक्रम",
      "खेळ, कला, संगीत व व्यायाम",
      "निरोगी व उत्साही दिनचर्या",
    ],
  },
  {
    id: "pkg-3",
    title: "आनंदनिवास (राहण्यासह)",
    price: "₹ ११,००० /-",
    sub: "प्रति महिना पासून (*GST Extra)",
    badge: "संपूर्ण निवासाचा पर्याय",
    periodType: "month",
    featured: true,
    features: [
      "फुल फर्निश्ड निवास + आनंदशाळा",
      "नाश्ता २ वेळ, जेवण २ वेळ, चहा २ वेळ",
      "२४x७ वैद्यकीय काळजी व हेल्पडेस्क",
      "सर्व उपक्रम, खेळ व गोशाळा आनंद",
    ],
  },
  {
    id: "pkg-4",
    title: "प्रीतम एलिट लाईफटाईम मेंबरशिप",
    price: "₹ १,५०,००० /-",
    sub: "१० वर्षांचे फॅमिली मेंबरशिप",
    badge: "वार्षिक व १० वर्षे योजना",
    periodType: "year",
    featured: true,
    features: [
      "४ सदस्यांच्या कुटुंबासाठी प्रीमियम क्लब प्रवेश",
      "स्विमिंग पूल, इनडोअर बॅडमिंटन व जिम मोफत",
      "सर्व कार्यक्रमांमध्ये प्राधान्य प्रवेश",
      "वार्षिक विशेष डिस्काऊंट ऑफर्स",
    ],
  },
];

const initialSiteData: SiteData = {
  nameMr: "प्रीतम ज्येष्ठ नागरिक आनंदशाळा",
  tagline: "ज्येष्ठ नागरिकांच्या निरोगी आरोग्य व आनंददायी आयुष्याचे दार येथेच उघडते....",
  announcement: "सांगली · महाराष्ट्र · सवलतीच्या दरात ॲडव्हान्स बुकिंग सुरू",
  launchDate: "शुभारंभ : २६ / २७ / २८ जानेवारी २०२६ पासून",
  phone1: "99 7007 9090",
  phone2: "94 2325 8859",
  email: "preetamanandshala@gmail.com",
  address: "सर्व्हे नं. ३९/१,२,३, माधवनगर - धनंजय गार्डन रोड, रेल्वे गेट शेजारी, सांगली",
  girishOakQuote: "आनंदात जगायचं, आरोग्य जपायचं, आनंदशाळेत येऊन स्वप्न साकारायचं",
  anandshalaDesc: "भारतातील पहिली ज्येष्ठ नागरिक आनंदशाळा! निवास, सकस जेवण, २४x७ दवाखाना, ५५ फुटांची राधाकृष्ण मूर्ती, मंदिर, गोशाळा, १५ उपक्रम हॉल्स व सर्व सोयी सुविधा.",
  sportsDesc: "सांगलीतील १.५ एकर भव्य अद्ययावत क्रीडा संकुल! ओलंपिक स्टाईल स्विमिंग पूल, इनडोअर बॅडमिंटन, टेनिस कोर्ट, वातानुकूलित जीम व रेस्टॉरंट.",
  welcomePosterUrl: "/images/preetam-welcome.png",
  showWelcomePoster: true,
  aanandshalaTitle: "प्रीतम ज्येष्ठ नागरिक आनंदशाळा व निवारा",
  aanandshalaBadge: "भारतातील पहिली ज्येष्ठ नागरिक आनंदशाळा",
  aanandshalaImages: [
    "/images/anandashram_building_card.png",
    "/images/aandshala_img.png",
    "/images/Screenshot 2026-07-31 103107.png",
  ],
  sportsTitle: "प्रीतम स्पोर्ट्स अँड फिटनेस क्लब",
  sportsBadge: "अद्ययावत १.५ एकर स्पोर्ट्स संकुल",
  sportsImages: [
    "/images/sports_club_building_card.png",
    "/images/epic_sports_gym_bg.png",
    "/images/pickleball-court.png",
  ],
  sportsBrochureUrl: "/images/Screenshot 2026-07-31 103659.png",
  sportsBrochureType: "image",
  sportsFacilities: [
    { id: "sf-1", title: "ओलंपिक स्टाईल स्विमिंग पूल", description: "स्वच्छ व फिल्टर केलेल्या पाण्यातील स्विमिंग पूल.", icon: "🏊", imageUrl: "/images/swimming hall.png" },
    { id: "sf-2", title: "वातानुकूलित जीम व फिटनेस सेंटर", description: "अद्ययावत जीम व व्यायाम साधने.", icon: "🏋️", imageUrl: "/images/vyayam hall.png" },
    { id: "sf-3", title: "इनडोअर बॅडमिंटन व कोर्ट्स", description: "प्रोफेशनल बॅडमिंटन, टेबल टेनिस व टर्फ.", icon: "🏸", imageUrl: "/images/tebal tenis.png" },
    { id: "sf-4", title: "पिकलबॉल कोर्ट", description: "भारतातील लोकप्रिय नवीन पिकलबॉल क्रीडा कोर्ट.", icon: "🏓", imageUrl: "/images/pickleball-court.png" },
  ],
  sportsPackages: [
    { id: "spk-1", title: "स्पोर्ट्स क्लब डे पास", price: "₹ ३०० / दिवस", subtitle: "सर्व क्रीडा सोयी वापरता येतील", features: ["स्विमिंग पूल प्रवेश", "जीम व इनडोअर गेम्स", "चहा व अल्पोपहार"] },
    { id: "spk-2", title: "मासिक जीम व स्पोर्ट्स मेंबरशिप", price: "₹ २,५०० / महिना", subtitle: "नियमित सदस्यांसाठी सवलत", features: ["२४x७ जीम प्रवेश", "स्विमिंग पूल व बॅडमिंटन", "पर्सनल फिटनेस ट्रेनर सल्ला"] },
    { id: "spk-3", title: "वार्षिक फॅमिली स्पोर्ट्स मेंबरशिप", price: "₹ २५,००० / वर्ष", subtitle: "संपूर्ण कुटुंबासाठी ऑल-इन-वन", features: ["४ सदस्यांसाठी मोफत प्रवेश", "क्लब इव्हेंट्स प्राधान्य", "विनामूल्य स्पोर्ट्स किट"] },
  ],
  sportsGallery: [
    "/images/epic_sports_gym_bg.png",
    "/images/Screenshot 2026-07-31 103712.png",
    "/images/Screenshot 2026-07-31 103659.png",
    "/images/pickleball-court.png",
    "/images/sports_club_building_card.png",
  ],
};

const initialHomeNews: HomeNewsItem[] = [
  {
    id: "news-1",
    title: "प्रीतम आनंदशाळा भव्य शुभारंभ दि. २६, २७ व २८ जानेवारी २०२६!",
    badge: "नवीन घोषणा",
    description: "सांगलीतील माधवनगर रस्त्यावर दीड एकर निसर्गरम्य परिसरात आनंदशाळेचा भव्य शुभारंभ होत आहे. आजच आपले ॲडव्हान्स बुकिंग निश्चित करा.",
    imageUrl: "/images/Screenshot 2026-07-31 103107.png",
    date: "१ ऑगस्ट २०२६",
  },
];

const initialAboutData: AboutData = {
  storyP1: "माझ्या जन्माची बीजे रुजली ती श्री. अभिनय जगन्नाथ कामाजी (रा. सांगली) यांच्या स्वप्न प्रकल्पातून. अभिनय यांनी २६ जानेवारी २००० रोजी व्यवसाय सुरू केला आणि दरवर्षी वर्धापन दिन, वाढदिवस व ज्येष्ठ नागरिक मेळाव्याचे आयोजन करून साजरा करतात. १५ ऑगस्ट २०२३ रोजी भूमिपूजन झाले असून २६ जानेवारी २०२६ रोजी भव्य शुभारंभ होत आहे.",
  storyP2: "माणूस हा एकत्र राहणारा, बोलणारा, नाती जपणारा असतो. पाल्य मोठे होऊन दूर देशी जाते तेव्हा मागे उरतात त्या आठवणी आणि एकांत... याच विचारातून ही संकल्पना समोर आली — ज्येष्ठ नागरिकांसाठी एक अशी ‘आनंदशाळा’, जिथे रोज नवा आनंद शिकायला मिळेल!",
  storyP3: "सांगली शहरातील दीड एकर जागेत, निसर्गाच्या सानिध्यात उभा राहणारा हा भारतातील पहिलाच भव्य प्रकल्प आहे. येथे १ दिवसापासून ते शेवटच्या क्षणापर्यंत आनंदाने राहता येते.",
  awardNotice: "'साई दिशा प्रतिष्ठान' मुंबई यांच्याकडून व्यवसाय व सामाजिक कार्यासाठी 'समाजभूषण पुरस्कार' प्राप्त!",
  photos: [
    "/images/Screenshot 2026-07-31 103107.png",
    "/images/Screenshot 2026-07-31 103152.png",
    "/images/aandshala sahal 1.jpeg",
  ],
  highlights: [
    {
      id: "abh-1",
      title: "२६ जानेवारी २००० रोजी व्यवसायाची सुरुवात",
      description: "श्री. अभिनय कामाजी यांनी व्यवसायाची सुरुवात केली व दरवर्षी सामाजिक उपक्रम आयोजित केले.",
      imageUrl: "/images/Screenshot 2026-07-31 103107.png",
      date: "२६ जानेवारी २०००",
    },
    {
      id: "abh-2",
      title: "१५ ऑगस्ट २०२३ रोजी आनंदशाळा भूमिपूजन",
      description: "माधवनगर रस्त्यावरील १.५ एकर जागेत भूमिपूजन सोहळा संपन्न झाला.",
      imageUrl: "/images/Screenshot 2026-07-31 103152.png",
      date: "१५ ऑगस्ट २०२३",
    },
  ],
};

const initialBrochures: BrochureItem[] = [
  {
    id: "broch-1",
    title: "प्रीतम आनंदशाळा अधिकृत माहिती पत्रक (Official Brochure)",
    category: "आनंदशाळा ब्रोशर",
    fileUrl: "/images/Screenshot 2026-07-31 103107.png",
    fileType: "image",
    description: "आनंदशाळेचे १५ उपक्रम हॉल्स, दैनिक वेळापत्रक व संपूर्ण १५ सुविधांची रंगीत माहिती.",
    date: "३१ जुलै २०२६",
  },
];

const initialGallery: GalleryItem[] = [
  {
    id: "g-img1",
    url: "/images/gallery imgage1.JPG",
    caption: "आनंदशाळा संकुल गॅलरी चित्र १",
    category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती", "रौप्य महोत्सव व प्रकाशन"],
  },
  {
    id: "g-img2",
    url: "/images/gallery image2.JPG",
    caption: "आनंदशाळा परिसर गॅलरी चित्र २",
    category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती"],
  },
  {
    id: "g-img3",
    url: "/images/gallery image3.JPG",
    caption: "आनंदशाळा उपक्रम सोहळा चित्र ३",
    category: ["विशेष उपक्रम"],
  },
  {
    id: "g-img4",
    url: "/images/gallery image4.JPG",
    caption: "आनंदशाळा स्नेहसंमेलन चित्र ४",
    category: ["ज्येष्ठ नागरिक आनंद मेळावा"],
  },
  {
    id: "g-img5",
    url: "/images/gallery image5.JPG",
    caption: "आनंदशाळा सांस्कृतिक कार्यक्रम ५",
    category: ["ज्येष्ठ नागरिक आनंद मेळावा"],
  },
  {
    id: "g-img6",
    url: "/images/gallery image6.JPG",
    caption: "आनंदशाळा क्रीडा व मनोरंजन ६",
    category: ["विशेष उपक्रम"],
  },
  {
    id: "g-img7",
    url: "/images/gallery image7.JPG",
    caption: "आनंदशाळा परिसर दृश्य ७",
    category: ["आनंदशाळा भूमिपूजन व बांधकाम"],
  },
  {
    id: "g-img8",
    url: "/images/gallery image8.JPG",
    caption: "आनंदशाळा विशेष सोहळा ८",
    category: ["रौप्य महोत्सव व प्रकाशन"],
  },
  {
    id: "g1",
    url: "/images/Screenshot 2026-07-31 103107.png",
    caption: "आनंदशाळा मुखपृष्ठ माहिती पत्रक व प्रवेश माहिती",
    category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती", "रौप्य महोत्सव व प्रकाशन", "प्रीतम व्यावसायिक माहिती"],
  },
  {
    id: "g2",
    url: "/images/Screenshot 2026-07-31 103131.png",
    caption: "आनंदशाळेतील ५ तासांचे वेळापत्रक व १५ उपक्रम हॉल्स",
    category: ["ज्येष्ठ नागरिक आनंदशाळा माहिती", "ज्येष्ठ नागरिक विरंगुळा केंद्र"],
  },
  {
    id: "g3",
    url: "/images/Screenshot 2026-07-31 103152.png",
    caption: "आनंदशाळा १.५ एकर विहंगम परिसर व बांधकाम दृश्य",
    category: ["आनंदशाळा भूमिपूजन व बांधकाम", "ज्येष्ठ नागरिक आनंदशाळा माहिती"],
  },
  {
    id: "g4",
    url: "/images/Screenshot 2026-07-31 103213.png",
    caption: "५५ फुटांची राधाकृष्ण मूर्ती, नियोजित मंदिर व गोशाळा",
    category: ["आनंदशाळा भूमिपूजन व बांधकाम", "ज्येष्ठ नागरिक आनंदशाळा माहिती"],
  },
  {
    id: "g5",
    url: "/images/Screenshot 2026-07-31 103238.png",
    caption: "१ दिवस सहल भेट पास (रु. ६००/-) सोहळा व व्हॅन सेवा",
    category: ["ज्येष्ठ नागरिक आनंद सहल", "रौप्य महोत्सव व प्रकाशन"],
  },
  {
    id: "g6",
    url: "/images/aandshala sahal 1.jpeg",
    caption: "आनंद सहलीतील ज्येष्ठ नागरिकांचे आनंदी क्षण",
    category: ["ज्येष्ठ नागरिक आनंद सहल", "ज्येष्ठ नागरिक विरंगुळा केंद्र"],
  },
  {
    id: "g7",
    url: "/images/Screenshot 2026-07-31 103517.png",
    caption: "ज्येष्ठ नागरिक आनंद मेळावा व स्नेहमेलन सांगली",
    category: ["ज्येष्ठ नागरिक आनंद मेळावा", "सामाजिक कार्य माहिती"],
  },
  {
    id: "g8",
    url: "/images/Screenshot 2026-07-31 103545.png",
    caption: "आनंद मेळावा सांस्कृतिक व करमणूक कार्यक्रम",
    category: ["ज्येष्ठ नागरिक आनंद मेळावा", "ज्येष्ठ नागरिक विरंगुळा केंद्र"],
  },
  {
    id: "g9",
    url: "/images/Screenshot 2026-07-31 103659.png",
    caption: "विरंगुळा केंद्र - कॅरम, बुद्धिबळ, वाचनालय व आर्ट हॉल्स",
    category: ["ज्येष्ठ नागरिक विरंगुळा केंद्र", "ज्येष्ठ नागरिक आनंदशाळा माहिती"],
  },
  {
    id: "g10",
    url: "/images/Screenshot 2026-07-31 103712.png",
    caption: "स्विमिंग पूल, स्पोर्ट्स कॉम्प्लेक्स व योग केंद्र",
    category: ["ज्येष्ठ नागरिक विरंगुळा केंद्र", "आनंदशाळा भूमिपूजन व बांधकाम"],
  },
  {
    id: "g11",
    url: "/images/Screenshot 2026-07-31 103842.png",
    caption: "प्रीतम आपुलकी व जिव्हाळा ट्रस्ट - सामाजिक कार्य व सन्मान",
    category: ["सामाजिक कार्य माहिती", "प्रीतम व्यावसायिक माहिती", "रौप्य महोत्सव व प्रकाशन"],
  },
];

const initialInquiries: InquiryItem[] = [
  { id: "inq-1", name: "रमेश पाटील", phone: "98221 45678", email: "ramesh.patil@gmail.com", subject: "डे-केअर प्रवेश बुकिंग", message: "माझ्या आई-वडिलांसाठी आनंदशाळा डे-केअर प्रवेशासाठी माहिती हवी आहे.", date: "३१ जुलै २०२६, स. ११:३०", read: false, category: "anandshala" },
  { id: "inq-2", name: "सुरेश कुलकर्णी", phone: "94220 89123", email: "suresh.kulkarni@yahoo.com", subject: "१ दिवस सहल भेट पास", message: "आमच्या ज्येष्ठ नागरिक संघासाठी १ दिवस सहल पास बुकिंग कसे करावे?", date: "३० जुलै २०२६, सायं. ०४:१५", read: false, category: "anandshala" },
  { id: "inq-3", name: "आनंद शहा", phone: "97654 32109", email: "anand.shah@gmail.com", subject: "आनंदनिवास १ महिना बुकिंग", message: "१ महिन्याच्या आनंदनिवास निवासाची फी आणि सोयी-सुविधांची विचारणा.", date: "२९ जुलै २०२६, दु. ०२:००", read: false, category: "anandshala" },
  { id: "inq-4", name: "विक्रम निंबाळकर", phone: "98501 23456", email: "vikram.n@gmail.com", subject: "🏋️ स्पोर्ट्स क्लब मेंबरशिप चौकशी (12 Months Package)", message: "जिम व ऑलिंपिक स्विमिंग पूल मेंबरशिपसाठी चौकशी करत आहे.", date: "१ ऑगस्ट २०२६, स. १०:००", read: false, category: "sports" },
  { id: "inq-5", name: "अमित जोशी", phone: "94231 77889", email: "amit.joshi@gmail.com", subject: "🏋️ बॅडमिंटन व टर्फ मैदान चौकशी", message: "साप्ताहिक बॅडमिंटन आणि स्पोर्ट्स टर्फ बुकिंगची माहिती द्यावी.", date: "३१ जुलै २०२६, सायं. ०५:३०", read: false, category: "sports" },
];

const initialTestimonials: TestimonialItem[] = [
  {
    id: "vtest-1",
    name: "डॉ. गिरीश ओक (अभिनेते)",
    role: "प्रसिद्ध अभिनेते व ज्येष्ठ नागरिक मार्गदर्शक",
    text: "आनंदात जगायचं, आरोग्य जपायचं, प्रीतम आनंदशाळेत येऊन स्वप्न साकारायचं! सांगलीतील हा पहिलाच जागतिक दर्जाचा प्रकल्प आहे.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoThumbnail: "/images/Screenshot 2026-07-31 103107.png",
    rating: 5,
    approved: true,
    date: "३१ जुलै २०२६",
  },
  {
    id: "vtest-2",
    name: "श्री. प्रकाश देशपांडे व परिवार",
    role: "निवृत्त बँक अधिकारी, सांगली",
    text: "आनंदशाळेच्या १ दिवस सहल पासमध्ये अतिशय कौटुंबिक व आनंददायी अनुभव मिळाला.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoThumbnail: "/images/aandshala sahal 1.jpeg",
    rating: 5,
    approved: true,
    date: "२८ जुलै २०२६",
  },
];

export type ScheduleRowItem = {
  id: string;
  icon: string;
  time: string;
  mon: { main: string; sub: string };
  tue: { main: string; sub: string };
  wed: { main: string; sub: string };
  thu: { main: string; sub: string };
  fri: { main: string; sub: string };
};

export type ScheduleConfig = {
  headerTitle: string;
  daysText: string;
  timeRange: string;
  subtitle: string;
  posterUrl?: string;
  posterType?: "image" | "pdf";
  rules: string[];
  items: ScheduleRowItem[];
};

export const initialScheduleConfig: ScheduleConfig = {
  headerTitle: "प्रीतम ज्येष्ठ नागरिक आनंदशाळा वेळापत्रक",
  daysText: "सोमवार ते शुक्रवार (दैनिक हजेरी)",
  timeRange: "05:30 ते 09:30",
  subtitle: "आनंदी जीवन, सुंदर विचार... आरोग्य, मनोरंजन, संस्कार आणि सहवास यांचं आदर्श केंद्र.",
  posterUrl: "",
  posterType: "image",
  rules: [
    "क्लबाचे वेळापत्रक हे सदस्यांनी नियमित पाळावे.",
    "वेळेवर हजेरी लावणे सर्व सदस्यांसाठी अनिवार्य आहे.",
    "योग वर्गात योग ड्रेस व स्वच्छ चटई आणणे आवश्यक आहे.",
    "वेट ट्रेनिंग करताना प्रशिक्षकांच्या मार्गदर्शनाखाली व्यायाम करावा.",
    "जिम मध्ये मोबाईल वापरण्यास संपूर्ण बंदी आहे.",
    "क्लब परिसर स्वच्छ व नीटनेटका ठेवणे ही सर्वांची जबाबदारी आहे.",
    "क्लबांमध्ये धुम्रपान, तंबाखू व मद्यपान सक्त मनाई आहे.",
    "जिममध्ये मोठ्याने बोलणे किंवा गोंधळ करणे टाळावे.",
    "कोणत्याही प्रकारची दुखापत झाल्यास व्यवस्थापन जबाबदार राहणार नाही.",
    "वैयक्तिक वस्तूंची काळजी स्वतः घ्यावी."
  ],
  items: [
    {
      id: "sch-1",
      icon: "🧘‍♂️",
      time: "सकाळी ०५:३० ते ०६:१५",
      mon: { main: "योग व प्राणायाम", sub: "आसने, प्राणायाम व हास्ययोग" },
      tue: { main: "योग व प्राणायाम", sub: "आसने, प्राणायाम व हास्ययोग" },
      wed: { main: "योग व प्राणायाम", sub: "आसने, प्राणायाम व हास्ययोग" },
      thu: { main: "योग व प्राणायाम", sub: "आसने, प्राणायाम व हास्ययोग" },
      fri: { main: "योग व प्राणायाम", sub: "आसने, प्राणायाम व हास्ययोग" },
    },
    {
      id: "sch-2",
      icon: "🧠",
      time: "सकाळी ०६:१५ ते ०७:००",
      mon: { main: "ध्यानधारणा & निसर्गोपचार", sub: "ओमकार जप व ध्यान" },
      tue: { main: "ध्यानधारणा & निसर्गोपचार", sub: "ओमकार जप व ध्यान" },
      wed: { main: "ध्यानधारणा & निसर्गोपचार", sub: "ओमकार जप व ध्यान" },
      thu: { main: "ध्यानधारणा & निसर्गोपचार", sub: "ओमकार जप व ध्यान" },
      fri: { main: "ध्यानधारणा & निसर्गोपचार", sub: "ओमकार जप व ध्यान" },
    },
    {
      id: "sch-3",
      icon: "🚶‍♂️",
      time: "सकाळी ०७:०० ते ०७:४५",
      mon: { main: "मॉर्निंग वॉक & वॉर्मअप", sub: "१.५ एकर परिसरात फिरणे" },
      tue: { main: "मॉर्निंग वॉक & वॉर्मअप", sub: "१.५ एकर परिसरात फिरणे" },
      wed: { main: "मॉर्निंग वॉक & वॉर्मअप", sub: "१.५ एकर परिसरात फिरणे" },
      thu: { main: "मॉर्निंग वॉक & वॉर्मअप", sub: "१.५ एकर परिसरात फिरणे" },
      fri: { main: "मॉर्निंग वॉक & वॉर्मअप", sub: "१.५ एकर परिसरात फिरणे" },
    },
    {
      id: "sch-4",
      icon: "☕",
      time: "सकाळी ०७:४५ ते ०८:१५",
      mon: { main: "आरोग्यदायी चहा & काढा", sub: "गप्पागोष्टी व संवाद" },
      tue: { main: "आरोग्यदायी चहा & काढा", sub: "गप्पागोष्टी व संवाद" },
      wed: { main: "आरोग्यदायी चहा & काढा", sub: "गप्पागोष्टी व संवाद" },
      thu: { main: "आरोग्यदायी चहा & काढा", sub: "गप्पागोष्टी व संवाद" },
      fri: { main: "आरोग्यदायी चहा & काढा", sub: "गप्पागोष्टी व संवाद" },
    },
    {
      id: "sch-5",
      icon: "💪",
      time: "सकाळी ०८:१५ ते ०९:००",
      mon: { main: "जिम & लाईट कार्डिओ", sub: "फिजिओथेरपिस्ट मार्गदर्शन" },
      tue: { main: "जिम & लाईट कार्डिओ", sub: "फिजिओथेरपिस्ट मार्गदर्शन" },
      wed: { main: "जिम & लाईट कार्डिओ", sub: "फिजिओथेरपिस्ट मार्गदर्शन" },
      thu: { main: "जिम & लाईट कार्डिओ", sub: "फिजिओथेरपिस्ट मार्गदर्शन" },
      fri: { main: "जिम & लाईट कार्डिओ", sub: "फिजिओथेरपिस्ट मार्गदर्शन" },
    },
    {
      id: "sch-6",
      icon: "🥗",
      time: "सकाळी ०९:०० ते ०९:३०",
      mon: { main: "पौष्टिक नाश्ता & विश्रांती", sub: "ताजा आहार व फळे" },
      tue: { main: "पौष्टिक नाश्ता & विश्रांती", sub: "ताजा आहार व फळे" },
      wed: { main: "पौष्टिक नाश्ता & विश्रांती", sub: "ताजा आहार व फळे" },
      thu: { main: "पौष्टिक नाश्ता & विश्रांती", sub: "ताजा आहार व फळे" },
      fri: { main: "पौष्टिक नाश्ता & विश्रांती", sub: "ताजा आहार व फळे" },
    },
  ]
};

export const initialSportsScheduleConfig: ScheduleConfig = {
  headerTitle: "प्रीतम स्पोर्ट्स अँड फिटनेस क्लब वेळापत्रक",
  daysText: "सोमवार ते रविवार (सर्व दिवस खुली)",
  timeRange: "सकाळी ०५:०० ते रात्री १०:००",
  subtitle: "फिटनेस, क्रीडा आणि आरोग्याचा परिपूर्ण अनुभव... आधुनिक जिम, स्विमिंग पुल व सर्व खेळांची सोय.",
  posterUrl: "",
  posterType: "image",
  rules: [
    "स्पोर्ट्स क्लबमध्ये स्पोर्ट्स शुझ व योग्य स्पोर्ट्स कपडे घालणे अनिवार्य आहे.",
    "जिम व स्विमिंग पुलच्या वेळेचे काटेकोरपणे पालन करावे.",
    "व्यायाम करताना किंवा खेळताना स्वतःची व उपकरणांची काळजी घ्यावी.",
    "स्विमिंग पुलमध्ये जाण्यापूर्वी शॉवर घेणे अनिवार्य आहे.",
    "ट्रेनरच्या सूचनांचे पालन करावे."
  ],
  items: [
    {
      id: "ssch-1",
      icon: "🏋️‍♂️",
      time: "सकाळी ०५:०० ते सकाळी ०९:००",
      mon: { main: "मॉर्निंग वर्कआउट & जिम", sub: "कार्डिओ, वेट ट्रेनिंग व पर्सनल ट्रेनिंग" },
      tue: { main: "मॉर्निंग वर्कआउट & जिम", sub: "कार्डिओ, वेट ट्रेनिंग व पर्सनल ट्रेनिंग" },
      wed: { main: "मॉर्निंग वर्कआउट & जिम", sub: "कार्डिओ, वेट ट्रेनिंग व पर्सनल ट्रेनिंग" },
      thu: { main: "मॉर्निंग वर्कआउट & जिम", sub: "कार्डिओ, वेट ट्रेनिंग व पर्सनल ट्रेनिंग" },
      fri: { main: "मॉर्निंग वर्कआउट & जिम", sub: "कार्डिओ, वेट ट्रेनिंग व पर्सनल ट्रेनिंग" },
    },
    {
      id: "ssch-2",
      icon: "🏊‍♂️",
      time: "सकाळी ०६:०० ते सकाळी ०९:३०",
      mon: { main: "स्विमिंग & वॉटर एरोबिक्स", sub: "सर्व वयोगटांसाठी पोहण्याचे प्रशिक्षण" },
      tue: { main: "स्विमिंग & वॉटर एरोबिक्स", sub: "सर्व वयोगटांसाठी पोहण्याचे प्रशिक्षण" },
      wed: { main: "स्विमिंग & वॉटर एरोबिक्स", sub: "सर्व वयोगटांसाठी पोहण्याचे प्रशिक्षण" },
      thu: { main: "स्विमिंग & वॉटर एरोबिक्स", sub: "सर्व वयोगटांसाठी पोहण्याचे प्रशिक्षण" },
      fri: { main: "स्विमिंग & वॉटर एरोबिक्स", sub: "सर्व वयोगटांसाठी पोहण्याचे प्रशिक्षण" },
    },
    {
      id: "ssch-3",
      icon: "🏸",
      time: "संध्याकाळी ०५:०० ते रात्री ०९:००",
      mon: { main: "बॅडमिंटन & इनडोअर गेम्स", sub: "लाकडी कोर्टवर सराव व मॅचेस" },
      tue: { main: "बॅडमिंटन & इनडोअर गेम्स", sub: "लाकडी कोर्टवर सराव व मॅचेस" },
      wed: { main: "बॅडमिंटन & इनडोअर गेम्स", sub: "लाकडी कोर्टवर सराव व मॅचेस" },
      thu: { main: "बॅडमिंटन & इनडोअर गेम्स", sub: "लाकडी कोर्टवर सराव व मॅचेस" },
      fri: { main: "बॅडमिंटन & इनडोअर गेम्स", sub: "लाकडी कोर्टवर सराव व मॅचेस" },
    },
    {
      id: "ssch-4",
      icon: "⚽",
      time: "संध्याकाळी ०६:०० ते रात्री १०:००",
      mon: { main: "टर्फ बॉक्स क्रिकेट & फुटबॉल", sub: "फ्लडलाईटमध्ये रात्रीचे सामने" },
      tue: { main: "टर्फ बॉक्स क्रिकेट & फुटबॉल", sub: "फ्लडलाईटमध्ये रात्रीचे सामने" },
      wed: { main: "टर्फ बॉक्स क्रिकेट & फुटबॉल", sub: "फ्लडलाईटमध्ये रात्रीचे सामने" },
      thu: { main: "टर्फ बॉक्स क्रिकेट & फुटबॉल", sub: "फ्लडलाईटमध्ये रात्रीचे सामने" },
      fri: { main: "टर्फ बॉक्स क्रिकेट & फुटबॉल", sub: "फ्लडलाईटमध्ये रात्रीचे सामने" },
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS FOR LOCALSTORAGE
// ============================================================================

const STORAGE_KEYS = {
  site: "anandshala_site_data",
  about: "anandshala_about_data",
  gallery: "anandshala_gallery_distinguished_v3",
  inquiries: "anandshala_inquiries_data",
  testimonials: "anandshala_testimonials_data_v2",
  packages: "anandshala_packages_data_v2",
  brochures: "anandshala_brochures_data_v1",
  homeNews: "anandshala_homenews_data_v1",
  schedule: "anandshala_schedule_data_v1",
  sportsSchedule: "anandshala_sports_schedule_data_v1",
};

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("admin_store_updated"));
  } catch (e: any) {
    console.error("LocalStorage save error:", e);
    window.dispatchEvent(new Event("admin_store_updated"));
  }

  // Asynchronously sync to Firestore Database
  try {
    const docRef = doc(db, "app_data", key);
    setDoc(docRef, { data }, { merge: true }).catch((err) => {
      console.warn("Firestore sync warning for", key, err);
    });
  } catch (err) {
    console.warn("Firestore connection warning:", err);
  }
}

// ============================================================================
// REACT HOOKS FOR LIVE REACTIVE DATA
// ============================================================================

export function useAdminStore() {
  const [siteData, setSiteDataState] = useState<SiteData>(() =>
    getStoredData(STORAGE_KEYS.site, initialSiteData)
  );
  const [aboutData, setAboutDataState] = useState<AboutData>(() =>
    getStoredData(STORAGE_KEYS.about, initialAboutData)
  );
  const [gallery, setGalleryState] = useState<GalleryItem[]>(() =>
    getStoredData(STORAGE_KEYS.gallery, initialGallery)
  );
  const [inquiries, setInquiriesState] = useState<InquiryItem[]>(() =>
    getStoredData(STORAGE_KEYS.inquiries, initialInquiries)
  );
  const [testimonials, setTestimonialsState] = useState<TestimonialItem[]>(() =>
    getStoredData(STORAGE_KEYS.testimonials, initialTestimonials)
  );
  const [packages, setPackagesState] = useState<PackageItem[]>(() =>
    getStoredData(STORAGE_KEYS.packages, initialPackages)
  );
  const [brochures, setBrochuresState] = useState<BrochureItem[]>(() =>
    getStoredData(STORAGE_KEYS.brochures, initialBrochures)
  );
  const [homeNews, setHomeNewsState] = useState<HomeNewsItem[]>(() =>
    getStoredData(STORAGE_KEYS.homeNews, initialHomeNews)
  );

  const [scheduleConfig, setScheduleConfigState] = useState<ScheduleConfig>(() =>
    getStoredData(STORAGE_KEYS.schedule, initialScheduleConfig)
  );
  const [sportsScheduleConfig, setSportsScheduleConfigState] = useState<ScheduleConfig>(() =>
    getStoredData(STORAGE_KEYS.sportsSchedule, initialSportsScheduleConfig)
  );

  useEffect(() => {
    // 1. Listen to LocalStorage updates
    const handleUpdate = () => {
      setSiteDataState(getStoredData(STORAGE_KEYS.site, initialSiteData));
      setAboutDataState(getStoredData(STORAGE_KEYS.about, initialAboutData));
      setGalleryState(getStoredData(STORAGE_KEYS.gallery, initialGallery));
      setInquiriesState(getStoredData(STORAGE_KEYS.inquiries, initialInquiries));
      setTestimonialsState(getStoredData(STORAGE_KEYS.testimonials, initialTestimonials));
      setPackagesState(getStoredData(STORAGE_KEYS.packages, initialPackages));
      setBrochuresState(getStoredData(STORAGE_KEYS.brochures, initialBrochures));
      setHomeNewsState(getStoredData(STORAGE_KEYS.homeNews, initialHomeNews));
      setScheduleConfigState(getStoredData(STORAGE_KEYS.schedule, initialScheduleConfig));
      setSportsScheduleConfigState(getStoredData(STORAGE_KEYS.sportsSchedule, initialSportsScheduleConfig));
    };

    window.addEventListener("admin_store_updated", handleUpdate);

    // 2. Listen to Firestore real-time snapshots
    const unsubscribes: (() => void)[] = [];

    try {
      const siteUnsub = onSnapshot(doc(db, "app_data", STORAGE_KEYS.site), (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.data) {
          const val = snapshot.data().data;
          setSiteDataState(val);
          try { localStorage.setItem(STORAGE_KEYS.site, JSON.stringify(val)); } catch (e) {}
        }
      });
      unsubscribes.push(siteUnsub);

      const aboutUnsub = onSnapshot(doc(db, "app_data", STORAGE_KEYS.about), (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.data) {
          const val = snapshot.data().data;
          setAboutDataState(val);
          try { localStorage.setItem(STORAGE_KEYS.about, JSON.stringify(val)); } catch (e) {}
        }
      });
      unsubscribes.push(aboutUnsub);

      const galleryUnsub = onSnapshot(doc(db, "app_data", STORAGE_KEYS.gallery), (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.data) {
          const val = snapshot.data().data;
          setGalleryState(val);
          try { localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(val)); } catch (e) {}
        }
      });
      unsubscribes.push(galleryUnsub);

      const inquiriesUnsub = onSnapshot(doc(db, "app_data", STORAGE_KEYS.inquiries), (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.data) {
          const val = snapshot.data().data;
          setInquiriesState(val);
          try { localStorage.setItem(STORAGE_KEYS.inquiries, JSON.stringify(val)); } catch (e) {}
        }
      });
      unsubscribes.push(inquiriesUnsub);

      const brochuresUnsub = onSnapshot(doc(db, "app_data", STORAGE_KEYS.brochures), (snapshot) => {
        if (snapshot.exists() && snapshot.data()?.data) {
          const val = snapshot.data().data;
          setBrochuresState(val);
          try { localStorage.setItem(STORAGE_KEYS.brochures, JSON.stringify(val)); } catch (e) {}
        }
      });
      unsubscribes.push(brochuresUnsub);
    } catch (err) {
      console.warn("Firestore listener warning:", err);
    }

    return () => {
      window.removeEventListener("admin_store_updated", handleUpdate);
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  const updateSiteData = (newSite: Partial<SiteData>) => {
    const updated = { ...siteData, ...newSite };
    setSiteDataState(updated);
    setStoredData(STORAGE_KEYS.site, updated);
  };

  const updateAboutData = (newAbout: Partial<AboutData>) => {
    const updated = { ...aboutData, ...newAbout };
    setAboutDataState(updated);
    setStoredData(STORAGE_KEYS.about, updated);
  };

  const addGalleryItem = (item: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = { id: `g-${Date.now()}`, ...item };
    const updated = [newItem, ...gallery];
    setGalleryState(updated);
    setStoredData(STORAGE_KEYS.gallery, updated);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGalleryState(updated);
    setStoredData(STORAGE_KEYS.gallery, updated);
  };

  const addInquiry = (inquiry: Omit<InquiryItem, "id" | "date" | "read">) => {
    const newInq: InquiryItem = {
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString("mr-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      read: false,
      ...inquiry,
    };
    const updated = [newInq, ...inquiries];
    setInquiriesState(updated);
    setStoredData(STORAGE_KEYS.inquiries, updated);
  };

  const markInquiryRead = (id: string) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, read: true } : inq
    );
    setInquiriesState(updated);
    setStoredData(STORAGE_KEYS.inquiries, updated);
  };

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiriesState(updated);
    setStoredData(STORAGE_KEYS.inquiries, updated);
  };

  const addTestimonial = (test: Omit<TestimonialItem, "id" | "date">) => {
    const newTest: TestimonialItem = {
      id: `t-${Date.now()}`,
      date: new Date().toLocaleDateString("mr-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ...test,
    };
    const updated = [newTest, ...testimonials];
    setTestimonialsState(updated);
    setStoredData(STORAGE_KEYS.testimonials, updated);
  };

  const toggleTestimonialApproval = (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, approved: !t.approved } : t
    );
    setTestimonialsState(updated);
    setStoredData(STORAGE_KEYS.testimonials, updated);
  };

  const deleteTestimonial = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonialsState(updated);
    setStoredData(STORAGE_KEYS.testimonials, updated);
  };

  const addPackage = (pkg: Omit<PackageItem, "id">) => {
    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      ...pkg,
    };
    const updated = [...packages, newPkg];
    setPackagesState(updated);
    setStoredData(STORAGE_KEYS.packages, updated);
  };

  const updatePackage = (id: string, updatedPkg: Partial<PackageItem>) => {
    const updated = packages.map((p) =>
      p.id === id ? { ...p, ...updatedPkg } : p
    );
    setPackagesState(updated);
    setStoredData(STORAGE_KEYS.packages, updated);
  };

  const deletePackage = (id: string) => {
    const updated = packages.filter((p) => p.id !== id);
    setPackagesState(updated);
    setStoredData(STORAGE_KEYS.packages, updated);
  };

  const addBrochure = (broch: Omit<BrochureItem, "id" | "date">) => {
    const newB: BrochureItem = {
      id: `broch-${Date.now()}`,
      date: new Date().toLocaleDateString("mr-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ...broch,
    };
    const updated = [newB, ...brochures];
    setBrochuresState(updated);
    setStoredData(STORAGE_KEYS.brochures, updated);
  };

  const deleteBrochure = (id: string) => {
    const updated = brochures.filter((b) => b.id !== id);
    setBrochuresState(updated);
    setStoredData(STORAGE_KEYS.brochures, updated);
  };

  const addHomeNews = (item: Omit<HomeNewsItem, "id" | "date">) => {
    const newNews: HomeNewsItem = {
      id: `news-${Date.now()}`,
      date: new Date().toLocaleDateString("mr-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      ...item,
    };
    const updated = [newNews, ...homeNews];
    setHomeNewsState(updated);
    setStoredData(STORAGE_KEYS.homeNews, updated);
  };

  const deleteHomeNews = (id: string) => {
    const updated = homeNews.filter((n) => n.id !== id);
    setHomeNewsState(updated);
    setStoredData(STORAGE_KEYS.homeNews, updated);
  };

  const updateScheduleConfig = (newSchedule: Partial<ScheduleConfig>) => {
    const updated = { ...scheduleConfig, ...newSchedule };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  const addScheduleRow = (row: Omit<ScheduleRowItem, "id">) => {
    const newRow: ScheduleRowItem = { id: `sch-${Date.now()}`, ...row };
    const updated = { ...scheduleConfig, items: [...scheduleConfig.items, newRow] };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  const updateScheduleRow = (id: string, updatedRow: Partial<ScheduleRowItem>) => {
    const updatedItems = scheduleConfig.items.map((r) =>
      r.id === id ? { ...r, ...updatedRow } : r
    );
    const updated = { ...scheduleConfig, items: updatedItems };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  const deleteScheduleRow = (id: string) => {
    const updatedItems = scheduleConfig.items.filter((r) => r.id !== id);
    const updated = { ...scheduleConfig, items: updatedItems };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  const addScheduleRule = (rule: string) => {
    if (!rule.trim()) return;
    const updatedRules = [...scheduleConfig.rules, rule.trim()];
    const updated = { ...scheduleConfig, rules: updatedRules };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  const deleteScheduleRule = (index: number) => {
    const updatedRules = scheduleConfig.rules.filter((_, idx) => idx !== index);
    const updated = { ...scheduleConfig, rules: updatedRules };
    setScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.schedule, updated);
  };

  // Sports Club Schedule Methods
  const updateSportsScheduleConfig = (partialConfig: Partial<ScheduleConfig>) => {
    const updated = { ...sportsScheduleConfig, ...partialConfig };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const addSportsScheduleRow = (row: Omit<ScheduleRowItem, "id">) => {
    const newRow: ScheduleRowItem = { id: `ssch-${Date.now()}`, ...row };
    const updated = { ...sportsScheduleConfig, items: [...sportsScheduleConfig.items, newRow] };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const updateSportsScheduleRow = (id: string, updatedRow: Partial<ScheduleRowItem>) => {
    const updatedItems = sportsScheduleConfig.items.map((r) =>
      r.id === id ? { ...r, ...updatedRow } : r
    );
    const updated = { ...sportsScheduleConfig, items: updatedItems };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const deleteSportsScheduleRow = (id: string) => {
    const updatedItems = sportsScheduleConfig.items.filter((r) => r.id !== id);
    const updated = { ...sportsScheduleConfig, items: updatedItems };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const addSportsScheduleRule = (rule: string) => {
    if (!rule.trim()) return;
    const updatedRules = [...sportsScheduleConfig.rules, rule.trim()];
    const updated = { ...sportsScheduleConfig, rules: updatedRules };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const deleteSportsScheduleRule = (index: number) => {
    const updatedRules = sportsScheduleConfig.rules.filter((_, idx) => idx !== index);
    const updated = { ...sportsScheduleConfig, rules: updatedRules };
    setSportsScheduleConfigState(updated);
    setStoredData(STORAGE_KEYS.sportsSchedule, updated);
  };

  const activeBrochures = brochures.filter(
    (b) => b.id !== "broch-2" && b.category !== "स्पोर्ट्स क्लब ब्रोशर" && !b.category.includes("स्पोर्ट्स")
  );

  const sportsInquiries = inquiries.filter(isSportsInquiryItem);
  const anandshalaInquiries = inquiries.filter((i) => !isSportsInquiryItem(i));

  const syncAllToFirebaseCloud = async () => {
    const itemsToSync = [
      { name: "site", ref: doc(db, "app_data", STORAGE_KEYS.site), payload: { data: siteData } },
      { name: "about", ref: doc(db, "app_data", STORAGE_KEYS.about), payload: { data: aboutData } },
      { name: "gallery", ref: doc(db, "app_data", STORAGE_KEYS.gallery), payload: { data: gallery } },
      { name: "inquiries", ref: doc(db, "app_data", STORAGE_KEYS.inquiries), payload: { data: inquiries } },
      { name: "testimonials", ref: doc(db, "app_data", STORAGE_KEYS.testimonials), payload: { data: testimonials } },
      { name: "packages", ref: doc(db, "app_data", STORAGE_KEYS.packages), payload: { data: packages } },
      { name: "brochures", ref: doc(db, "app_data", STORAGE_KEYS.brochures), payload: { data: brochures } },
      { name: "homeNews", ref: doc(db, "app_data", STORAGE_KEYS.homeNews), payload: { data: homeNews } },
      { name: "schedule", ref: doc(db, "app_data", STORAGE_KEYS.schedule), payload: { data: scheduleConfig } },
      { name: "sportsSchedule", ref: doc(db, "app_data", STORAGE_KEYS.sportsSchedule), payload: { data: sportsScheduleConfig } },
      { name: "site_settings", ref: doc(db, "site_settings", "general"), payload: { siteData } },
      { name: "gallery_collection", ref: doc(db, "gallery_collection", "all"), payload: { items: gallery } },
      { name: "inquiries_collection", ref: doc(db, "inquiries_collection", "all"), payload: { items: inquiries } },
      { name: "brochures_collection", ref: doc(db, "brochures_collection", "all"), payload: { items: brochures } },
    ];

    let successCount = 0;
    let firstError: any = null;

    for (const item of itemsToSync) {
      try {
        await setDoc(item.ref, item.payload, { merge: true });
        successCount++;
      } catch (err: any) {
        if (!firstError) firstError = err;
        console.warn(`Firestore sync warning for ${item.name}:`, err);
      }
    }

    if (successCount === 0 && firstError) {
      throw firstError;
    }

    console.log(`🔥 Successfully synced ${successCount} collection items to Firestore Cloud Database!`);
    return successCount;
  };

  return {
    siteData,
    aboutData,
    gallery,
    inquiries,
    sportsInquiries,
    anandshalaInquiries,
    testimonials,
    packages,
    brochures: activeBrochures,
    homeNews,
    scheduleConfig,
    sportsScheduleConfig,
    syncAllToFirebaseCloud,
    unreadInquiriesCount: inquiries.filter((i) => !i.read).length,
    unreadSportsInquiriesCount: sportsInquiries.filter((i) => !i.read).length,
    unreadAnandshalaInquiriesCount: anandshalaInquiries.filter((i) => !i.read).length,
    updateSiteData,
    updateAboutData,
    addGalleryItem,
    deleteGalleryItem,
    addInquiry,
    markInquiryRead,
    deleteInquiry,
    addTestimonial,
    toggleTestimonialApproval,
    deleteTestimonial,
    addPackage,
    updatePackage,
    deletePackage,
    addBrochure,
    deleteBrochure,
    addHomeNews,
    deleteHomeNews,
    updateScheduleConfig,
    addScheduleRow,
    updateScheduleRow,
    deleteScheduleRow,
    addScheduleRule,
    deleteScheduleRule,
    updateSportsScheduleConfig,
    addSportsScheduleRow,
    updateSportsScheduleRow,
    deleteSportsScheduleRow,
    addSportsScheduleRule,
    deleteSportsScheduleRule,
  };
}
