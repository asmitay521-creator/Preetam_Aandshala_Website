import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Lightbulb,
  HandHeart,
  UsersRound,
  Handshake,
  Target,
  Heart,
  Sparkles,
  Smile,
  ShieldCheck,
  Star,
  Award,
  X,
  PhoneCall,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/lib/use-language";
import "./SpecialReasons.css";

const rawReasons = [
  {
    number: "01",
    mr: "माझ्या मनातील व जीवनातील राहून गेलेल्या बऱ्याच गोष्टी, खेळ, आवडी-निवडी मला आनंदाने करण्यासाठी.",
    en: "To happily fulfill lifelong unfulfilled hobbies, games, and passions.",
    icon: "book",
    color: "#E5A315",
  },
  {
    number: "02",
    mr: "मला माझ्या मनासारखे आनंदी व स्वावलंबी जीवन जगता येण्यासाठी.",
    en: "To live a happy and self-reliant life on my own terms.",
    icon: "hand",
    color: "#F47D22",
  },
  {
    number: "03",
    mr: "माझ्या कलागुणांना वाव, मानधन व आत्मसन्मान मिळण्यासाठी.",
    en: "To showcase my artistic talents, earn stipends, and gain self-dignity.",
    icon: "people",
    color: "#E64248",
  },
  {
    number: "04",
    mr: "कोणाच्या बंधनात राहून, मन मारून, चार भिंतीत एकटेपणाने जीवन जगावे लागणार नाही यासाठी.",
    en: "To avoid living in restriction, solitude, or suppressed desires within 4 walls.",
    icon: "target",
    color: "#981867",
  },
  {
    number: "05",
    mr: "घरी एक-दोघे राहून, साहित्य आणून, विश्वास ठेवून जीवन जगणे जास्त खर्चिक व त्रासाचे असते, हे समजण्यासाठी.",
    en: "To realize that living alone at home managing groceries is costly & stressful.",
    icon: "heart",
    color: "#0D9488",
  },
  {
    number: "06",
    mr: "आयुष्याला त्रासून-कष्टून मरण मागावे लागणार नाही यासाठी.",
    en: "To live golden years with joy instead of feeling exhausted or hopeless.",
    icon: "sparkles",
    color: "#4F46E5",
  },
  {
    number: "07",
    mr: "एकटेपणाला कंटाळून नैराश्य, चिडचिड होणार नाही यासाठी.",
    en: "To overcome loneliness, depression, and irritability effortlessly.",
    icon: "smile",
    color: "#E11D48",
  },
  {
    number: "08",
    mr: "घरगुती कटकटी, अबोला, त्रास व भांडणापासून मुक्ती मिळवण्यासाठी.",
    en: "To get relief from domestic stress, silence, and daily friction.",
    icon: "shield",
    color: "#D97706",
  },
  {
    number: "09",
    mr: "स्वतः कमावलेल्या पैशांचा थोडातरी स्वतःसाठी उपभोग घेण्यासाठी.",
    en: "To enjoy at least a portion of hard-earned savings for oneself.",
    icon: "star",
    color: "#059669",
  },
  {
    number: "10",
    mr: "जीवनाची सायंकाळ आनंदाने उत्साहाने मनसोक्त जगून करण्यासाठी.",
    en: "To spend the evening of life enthusiastically and to the fullest.",
    icon: "award",
    color: "#7C3AED",
  },
  {
    number: "11",
    mr: "आप्तजन व स्वतःसाठी खूप गरजेची व अभिमानास्पद गोष्ट आहे.",
    en: "A deeply essential and proud step for oneself and loved ones.",
    icon: "hand",
    color: "#E5A315",
  },
  {
    number: "12",
    mr: "दूर राहून प्रेम, आपुलकी, जिव्हाळा व नातेसंबंध वाढवण्यासाठी.",
    en: "To nurture deeper love, affection, and strong family relationships.",
    icon: "heart",
    color: "#F47D22",
  },
  {
    number: "13",
    mr: "आपल्या वयाच्या विचारांच्या मित्र-मैत्रिणींसोबत माणसांसोबत आनंदाने स्वाभिमानाने जगण्यासाठी.",
    en: "To live with self-respect alongside like-minded peers of one's age group.",
    icon: "people",
    color: "#E64248",
  },
  {
    number: "14",
    mr: "मनसोक्त, आनंदी, उत्साही व स्वावलंबी जीवन जगता आले म्हणून देवाचे आभार मानण्यासाठी.",
    en: "To thank Almighty God for a joyful, energetic, and independent life.",
    icon: "sparkles",
    color: "#981867",
  },
  {
    number: "15",
    mr: "पैसा नसला तरी थोडेसे काम श्रमदान करून आनंदी जीवन कसे जगता येते ते दाखवण्यासाठी.",
    en: "To demonstrate how joyful life can be lived through voluntary contribution.",
    icon: "smile",
    color: "#0D9488",
  },
  {
    number: "16",
    mr: "पैसा म्हणजे सर्वकाही नाही, मानवता धर्म व स्वतःसाठी व इतरांसाठी जगणे शिकण्यासाठी.",
    en: "To learn that money isn't everything; humanity & living for others matters.",
    icon: "target",
    color: "#4F46E5",
  },
  {
    number: "17",
    mr: "मानव जन्म मिळाला ते आनंदाने जीवन जगण्यासाठी.",
    en: "To honor human birth by living every single day happily.",
    icon: "star",
    color: "#E11D48",
  },
  {
    number: "18",
    mr: "आपल्या माणसांवर रुसणे, अबोला, ओझे होण्यासाठी जीवन नाही हे सिद्ध करण्यासाठी.",
    en: "To prove life isn't meant for resentment or becoming a burden on anyone.",
    icon: "shield",
    color: "#D97706",
  },
  {
    number: "19",
    mr: "नातेवाईक, लोक काय म्हणतील याचा विचार करू नका, स्वतःच्या आनंदासाठी आजच प्रवेश घ्या.",
    en: "Do not worry what society says — take admission for your own happiness.",
    icon: "award",
    color: "#059669",
  },
  {
    number: "20",
    mr: "कल्पना न केलेले, कधी न उपभोगलेले, आपलेपण काय असते ते जग अनुभवण्यासाठी.",
    en: "To experience true warmth and belonging never imagined before.",
    icon: "book",
    color: "#7C3AED",
  },
  {
    number: "21",
    mr: "पैसा असून सुद्धा सर्व सुखसोई उपभोग विकत घेऊ शकत नाहीत परंतु येथे घेऊ शकतो ते दाखवण्यासाठी.",
    en: "To experience comforts money alone cannot buy at home.",
    icon: "hand",
    color: "#E5A315",
  },
  {
    number: "22",
    mr: "प्रचंड पैसा असून सुद्धा ह्या सर्व सोयी सुविधा मी स्वतःच्या घरात करू शकत नाही हे लक्षात घेण्यासाठी.",
    en: "To realize that even with wealth, creating such a 1.5 acre hub at home is impossible.",
    icon: "target",
    color: "#F47D22",
  },
  {
    number: "23",
    mr: "आपल्या वयाच्या लोकांसोबत गप्पा-गोष्टी-खेळ खेळण्यासाठी.",
    en: "To chat, share stories, and play games with friends of your age.",
    icon: "people",
    color: "#E64248",
  },
];

// Double array for seamless infinite marquee loop
const extendedReasons = [...rawReasons, ...rawReasons];

function CardIcon({ type }: { type: string }) {
  if (type === "book") {
    return (
      <div className="book-icon">
        <Lightbulb size={20} />
        <BookOpen size={32} />
      </div>
    );
  }
  if (type === "hand") {
    return <HandHeart size={40} strokeWidth={1.5} />;
  }
  if (type === "people") {
    return (
      <div className="people-icon">
        <UsersRound size={26} strokeWidth={1.5} />
        <Handshake size={32} strokeWidth={1.5} />;
      </div>
    );
  }
  if (type === "target") {
    return <Target size={40} strokeWidth={1.5} />;
  }
  if (type === "heart") {
    return <Heart size={40} strokeWidth={1.5} />;
  }
  if (type === "sparkles") {
    return <Sparkles size={40} strokeWidth={1.5} />;
  }
  if (type === "smile") {
    return <Smile size={40} strokeWidth={1.5} />;
  }
  if (type === "shield") {
    return <ShieldCheck size={40} strokeWidth={1.5} />;
  }
  if (type === "star") {
    return <Star size={40} strokeWidth={1.5} />;
  }
  return <Award size={40} strokeWidth={1.5} />;
}

interface Reason {
  number: string;
  color: string;
  mr: string;
  en: string;
  icon: string;
}

function ReasonCard({ item, onClick }: { item: Reason; onClick: () => void }) {
  const { isEn } = useLanguage();
  return (
    <div
      className="reasonItem cursor-pointer"
      onClick={onClick}
      style={{
        "--theme": item.color,
      } as React.CSSProperties}
    >
      {/* NUMBER LOCATION BADGE */}
      <div className="numberBadge">
        <div className="badgeCircle">
          <span>{item.number}</span>
        </div>
        <div className="badgePointer"></div>
      </div>

      {/* TOP CONNECTING LINE */}
      <div className="cardTopLine"></div>

      {/* BACK LAYER */}
      <div className="backCard"></div>

      {/* MAIN CARD */}
      <div className="mainReasonCard">
        {/* right colored edge */}
        <div className="rightColorEdge"></div>

        {/* ICON CIRCLE */}
        <div className="iconHolder">
          <div className="iconInner">
            <CardIcon type={item.icon} />
          </div>
        </div>

        {/* TEXT */}
        <div className="reasonContent">
          <p>{isEn ? item.en : item.mr}</p>
        </div>



        {/* DOTS */}
        <div className="dotRow">
          <div className="smallDots">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div className="centerDot"></div>
          <div className="smallDots">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>

        {/* Curved Bottom - SVG */}
        <div className="bottomCurveSvg">
          <svg
            viewBox="0 0 400 55"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="curveFill"
              d="
                M 0 0
                L 0 12
                C 70 25,
                  135 35,
                  205 37
                C 275 39,
                  335 29,
                  400 13
                L 400 0
                Z
              "
            />
            <path
              className="curveStroke"
              d="
                M 0 12
                C 70 25,
                  135 35,
                  205 37
                C 275 39,
                  335 29,
                  400 13
              "
            />
          </svg>

          <div className="paperFold"></div>
        </div>
      </div>
    </div>
  );
}

export default function SpecialReasons() {
  const { isEn } = useLanguage();
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  return (
    <section className="specialReasonsSection">
      {/* HEADER */}
      <div className="reasonsHeading">
        <div className="miniHeading">
          <span className="miniLine"></span>
          <span className="miniDiamond">◆</span>
          <span>{isEn ? "Special Reasons" : "विशेष कारणे"}</span>
          <span className="miniDiamond">◆</span>
          <span className="miniLine reverse"></span>
        </div>
        <h2>
          {isEn ? (
            <>Why Join <span className="text-[#be185d] font-black">Anandshala</span>? </>
          ) : (
            <><span className="text-[#be185d] font-black">आनंदशाळेतच</span> प्रवेश का घ्यायचा? </>
          )}
          <span className="text-[#831843]">{isEn ? "(23 Special Reasons)" : "(२३ विशेष कारणे)"}</span>
        </h2>
        <div className="headingOrnament">
          <span></span>
          <b>❖</b>
          <span></span>
        </div>
        <p>
          {isEn
            ? "Our mission is the overall development and blissful future of every senior citizen."
            : "आमचं ध्येय आहे प्रत्येक नागरिकाचा सर्वांगीण विकास आणि उज्ज्वल भविष्य."}
        </p>
      </div>

      {/* CONTINUOUS MARQUEE CAROUSEL */}
      <div className="specialReasonsCarousel">
        <div className="reasonsTrack">
          {extendedReasons.map((item, idx) => (
            <div className="reasonSlide" key={`${item.number}-${idx}`}>
              <ReasonCard item={item} onClick={() => setSelectedReason(item)} />
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM MESSAGE */}
      <div className="bottomMessage">
        <div className="goldLeaf leftLeaf">❧</div>
        <span className="goldStar">★</span>
        <p>
          {isEn
            ? "Knowledge is Service, Values are Identity, and Anandshala is the Right Choice for Your Future."
            : "विद्या हि सेवा, संस्कार हि ओळख, आणि आनंदशाळा हि तुमच्या भविष्याची योग्य निवड."}
        </p>
        <span className="goldStar">★</span>
        <div className="goldLeaf rightLeaf">❧</div>
      </div>

      {/* PORTAL POPUP MODAL WINDOW FOR SELECTED REASON */}
      {selectedReason && typeof document !== "undefined" && createPortal(
        <div 
          className="reason-modal-overlay"
          onClick={() => setSelectedReason(null)}
        >
          <div 
            className="reason-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ "--theme-color": selectedReason.color } as React.CSSProperties}
          >
            {/* CLOSE BUTTON */}
            <button 
              className="reason-modal-close"
              onClick={() => setSelectedReason(null)}
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {/* MODAL HEADER WITH BADGE */}
            <div className="reason-modal-header">
              <div className="reason-modal-num-badge">
                <Sparkles size={16} />
                <span>विशेष कारण क्रमांक {selectedReason.number}</span>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="reason-modal-body">
              <div className="reason-modal-icon-wrapper">
                <CardIcon type={selectedReason.icon} />
              </div>

              <h3 className="reason-modal-text-mr">
                "{selectedReason.mr}"
              </h3>

              {selectedReason.en && (
                <p className="reason-modal-text-en">
                  {selectedReason.en}
                </p>
              )}

              {/* HIGHLIGHTS */}
              <div className="reason-modal-features">
                <div className="modal-feat-row">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>आनंदशाळा सांगली • १.५ एकर निसर्गरम्य हक्काचे घर</span>
                </div>
                <div className="modal-feat-row">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>२४×७ डॉक्टर्स, सुरक्षा, पौष्टिक आहार व आपुलकीचे नाते</span>
                </div>
                <div className="modal-feat-row">
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                  <span>आनंदी, स्वावलंबी व स्वाभिमानी जीवनशैलीचा सुंदर संगम</span>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER ACTION BUTTONS */}
            <div className="reason-modal-footer">
              <button 
                className="modal-btn-close w-full justify-center"
                onClick={() => setSelectedReason(null)}
              >
                बंद करा
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
