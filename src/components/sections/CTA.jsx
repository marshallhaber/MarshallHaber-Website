import { useState } from "react";
import ContactModal from "../ui/ContactModal";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

export default function CTA() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { sections } = usePageContent("home");
  const left = getContent(sections, "cta.left", defaults.home.cta.left);
  const right = getContent(sections, "cta.right", defaults.home.cta.right);

  return (
    <section className="w-full px-6 pt-20 pb-20 bg-[#020817] text-[#fbf0f2]">
      {/* Top CTA Cards */}
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-4">
        {/* Left Card */}
        <button
          type="button"
          onClick={() => setIsContactOpen(true)}
          className="bg-[#E8E6DF] text-[#0b1121] p-8 md:p-10 h-[300px] md:h-[350px] flex flex-col justify-between cursor-pointer group hover:opacity-95 transition-opacity border border-white/10 rounded-xl text-left"
          style={{ fontFamily: "inherit" }}
        >
          <div className="text-lg md:text-xl leading-tight">
            <p className="font-bold not-italic" style={{ fontFamily: "'PP Mori', sans-serif" }}>{left.topBold}</p>
            <p className="italic" style={{ fontFamily: "'Nib Pro', serif" }}>{left.topItalic}</p>
          </div>
          <h2 className="text-[10vw] md:text-[64px] font-bold tracking-tight leading-none group-hover:pl-2 transition-all duration-300" style={{ fontFamily: "'PP Mori', sans-serif" }}>
            {left.heading}
          </h2>
        </button>

        {/* Right Card */}
        <button
          type="button"
          onClick={() => setIsContactOpen(true)}
          className="bg-[#2B59C3] text-white p-8 md:p-10 h-[300px] md:h-[350px] flex flex-col justify-between cursor-pointer group hover:opacity-95 transition-opacity rounded-xl text-left"
          style={{ fontFamily: "inherit" }}
        >
          <div className="text-base md:text-lg leading-snug max-w-sm">
            <p className="font-bold not-italic" style={{ fontFamily: "'PP Mori', sans-serif" }}>{right.topBold}</p>
            <p className="italic" style={{ fontFamily: "'Nib Pro', serif" }}>{right.topItalic}</p>
          </div>
          <h2 className="text-[10vw] md:text-[64px] font-bold tracking-tight leading-none group-hover:pl-2 transition-all duration-300" style={{ fontFamily: "'PP Mori', sans-serif" }}>
            {right.heading}
          </h2>
        </button>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
}
