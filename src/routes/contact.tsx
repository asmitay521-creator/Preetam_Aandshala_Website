import React, { useState } from "react";
import { Phone, MessageCircle, Mail, User, MapPin, Building, Send, Map, CheckSquare, Edit3 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAdminStore } from "@/lib/admin-store";
import { site, sportsClub } from "@/lib/site-info";
import { useLanguage } from "@/lib/use-language";

function Contact() {
  const { addInquiry } = useAdminStore();
  const { isEn } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("आनंदशाळा प्रवेश चौकशी");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiryCategory = subject.includes("स्पोर्ट्स") || subject.includes("Sports") ? "sports" : "anandshala";
    addInquiry({ name, phone, email, subject, message, category: inquiryCategory });
    setSubmitted(true);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans overflow-hidden">
      
      {/* ══════════════════════════════════════════════════════════════
          TOP HEADER SECTION
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 flex flex-col items-center text-center px-4">
        
        {/* Background Decorative Patterns */}
        <div className="absolute top-10 left-10 opacity-30">
          <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />)}
          </div>
        </div>
        <div className="absolute top-10 right-10 opacity-30">
          <div className="grid grid-cols-5 gap-2">
            {[...Array(25)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />)}
          </div>
        </div>
        
        {/* Floating Icons */}
        <div className="hidden md:flex absolute left-[15%] top-1/2 -translate-y-1/2 w-24 h-24 bg-pink-100 rounded-full items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.2)]">
          <Phone className="text-pink-400" size={40} />
          <div className="absolute inset-0 rounded-full border border-pink-200 animate-ping opacity-50" />
        </div>
        <div className="hidden md:block absolute right-[15%] top-1/2 -translate-y-1/2 text-blue-300/50 rotate-[-15deg]">
          <Send size={100} strokeWidth={1} />
        </div>

        {/* Header Content */}
        <span className="relative z-10 flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-1.5 text-xs font-black tracking-widest text-purple-600 shadow-sm uppercase mb-6">
          <Phone size={14} /> CONTACT US
        </span>

        <h1 className="relative z-10 text-5xl sm:text-7xl font-black text-[#2e3192] mb-4 drop-shadow-sm">
          {isEn ? "Contact Us" : "संपर्क"}
          <div className="flex items-center justify-center mt-3 gap-2 text-pink-400">
            <span className="block w-12 h-0.5 bg-pink-400 rounded-full"></span>
            <span className="block w-2 h-2 rounded-full bg-pink-400"></span>
            <span className="block w-12 h-0.5 bg-pink-400 rounded-full"></span>
          </div>
        </h1>

        <p className="relative z-10 mt-4 text-base sm:text-lg font-bold text-slate-600">
          {isEn ? "Contact us today for admission, collaboration or further details." : "प्रवेश, सहकार्य किंवा अधिक माहितीसाठी आजच संपर्क साधा."}
        </p>

      </div>

      <div className="max-w-[1300px] mx-auto px-4 pb-20 relative z-10">

        {/* ══════════════════════════════════════════════════════════════
            CONTACT INFO CARDS
           ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          {/* Card 1 */}
          <div className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-400">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{isEn ? "Anandshala Helpline" : "आनंदशाळा हेल्पलाईन"}</p>
              <a href="tel:+919370237633" className="text-[15px] font-black text-[#f472b6] tracking-wide">+91-9370237633</a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{isEn ? "Office Contact" : "कार्यालय संपर्क"}</p>
              <a href="tel:+919423258859" className="text-[15px] font-black text-[#662d91] tracking-wide">+91-9423258859</a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{isEn ? "WhatsApp Chat" : "चॅट WhatsApp"}</p>
              <a href={sportsClub.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[15px] font-black text-[#0071bc] tracking-wide">+91-9370237633</a>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-center gap-4 bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{isEn ? "Email Address" : "ई-मेल पत्ता"}</p>
              <a href={`mailto:${site.email}`} className="text-[13px] font-black text-[#f26522] tracking-wide truncate block w-[160px] sm:w-full">{site.email}</a>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            FORM AND MAP SECTION
           ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: FORM */}
          <Reveal>
            <div className="h-full bg-white rounded-[24px] shadow-lg border border-slate-100 overflow-hidden relative flex flex-col p-8 sm:p-10">
              {/* Left Gradient Border */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#f472b6] to-[#662d91]" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                  <CheckSquare size={26} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1a1a40]">{isEn ? "Inquire About Admission & Booking" : "प्रवेश व नोंदणीची चौकशी करा"}</h2>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">{isEn ? "Fill in the details below - our team will get in touch with you soon." : "खालील माहिती भरा - आमची टीम लवकरच आपल्याशी संपर्क साधेल."}</p>
                </div>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-200">
                  {isEn ? "Your inquiry has been submitted successfully! We will contact you soon." : "तुमची चौकशी यशस्वीरित्या पाठवली गेली आहे! आम्ही लवकरच संपर्क करू."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEn ? "Your Full Name" : "आपले पूर्ण नाव"}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100 placeholder:text-slate-400 text-slate-700 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone size={18} />
                    </div>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isEn ? "Mobile Number" : "मोबाईल नंबर"}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100 placeholder:text-slate-400 text-slate-700 shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isEn ? "Email Address (Optional)" : "ई-मेल पत्ता (पर्यायी)"}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100 placeholder:text-slate-400 text-slate-700 shadow-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <CheckSquare size={18} />
                  </div>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-bold outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100 text-slate-700 shadow-sm appearance-none"
                  >
                    <option value="आनंदशाळा प्रवेश चौकशी">{isEn ? "Anandshala Admission Inquiry" : "आनंदशाळा प्रवेश चौकशी"}</option>
                    <option value="१ दिवस सहल पास">{isEn ? "1 Day Tour Pass" : "१ दिवस सहल पास"}</option>
                    <option value="डे-केअर मन्थली">{isEn ? "Day-Care Monthly Pass" : "डे-केअर मासिक पास"}</option>
                    <option value="आनंदनिवास">{isEn ? "Anandniwas Stay Pass" : "आनंदनिवास निवास पास"}</option>
                    <option value="स्पोर्ट्स क्लब">{isEn ? "Sports Club Membership" : "स्पोर्ट्स क्लब मेंबरशिप"}</option>
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Edit3 size={18} />
                  </div>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isEn ? "Write your message or query here..." : "आपला संदेश किंवा प्रश्न येथे लिहा..."}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-all focus:border-purple-400 focus:ring-4 focus:ring-purple-100 placeholder:text-slate-400 text-slate-700 shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-[#f472b6] to-[#662d91]"
                >
                  <Send size={18} /> {isEn ? "Submit Inquiry Form" : "चौकशी अर्ज पाठवा"}
                </button>
              </form>
            </div>
          </Reveal>

          {/* RIGHT: ADDRESS & MAP */}
          <Reveal delay={100}>
            <div className="h-full bg-white rounded-[24px] shadow-lg border border-slate-100 overflow-hidden relative flex flex-col p-8 sm:p-10">
              {/* Left Gradient Border */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#0071bc] to-[#00a8e8]" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                  <MapPin size={26} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1a1a40]">{isEn ? "Visit Us & Address" : "भेट द्या व पत्ता"}</h2>
                  <p className="text-[13px] sm:text-sm font-bold text-slate-500 mt-1 leading-relaxed">
                    {isEn
                      ? "Survey No. 39/1, 2, 3 Anand Nagari, Near Madhavnagar Daba, Gandge Road, Beside Railway Gate, Sangli"
                      : "सर्वे नंबर 39/1, 2, 3 आनंद नगरी, माधवनगर दाबा जवळ, गांडगे रोड, रेल्वे गेट शेजारी, सांगली"}
                  </p>
                </div>
              </div>

              <div className="bg-[#f4f7fb] rounded-xl p-4 mb-6 space-y-3 border border-blue-50/50">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#f472b6]" />
                  <p className="text-sm font-bold text-slate-700">{isEn ? "Anandshala Center: Bldg No. 1 to Survey 5" : "आनंदशाळेचे केंद्र : इमारती नं 1 ते सर्वे. 5"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-[#662d91]" />
                  <p className="text-sm font-bold text-slate-700">{isEn ? "Office Center: Bldg No. 6 to Survey 9" : "कार्यालय केंद्र : इमारती नं 6 ते सर्वे 9"}</p>
                </div>
              </div>

              <div className="flex-1 min-h-[220px] overflow-hidden rounded-2xl border border-slate-200 mb-6 shadow-sm">
                <iframe
                  title="Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3817.8!2d74.58!3d16.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDUxJzM2LjAiTiA3NMKwMzQnNDguMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="grayscale-[30%] contrast-[110%] hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <a
                href={sportsClub.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-[#20b2aa] to-[#0ea5e9]"
              >
                <Map size={18} /> {isEn ? "Get Directions on Google Maps" : "Google Maps वर दिशा पहा"}
              </a>

            </div>
          </Reveal>

        </div>

      </div>
    </div>
  );
}

export default Contact;

