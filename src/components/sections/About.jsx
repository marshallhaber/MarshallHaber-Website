import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedCounter from "../ui/AnimatedCounter";
import Reveal from "../ui/Reveal";
import TransitionLink from "../ui/TransitionLink";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

export default function About() {
  const { sections } = usePageContent("home");
  const heading = getContent(sections, "about.heading", defaults.home.about.heading);
  const buttonText = getContent(sections, "about.buttonText", defaults.home.about.buttonText);
  const keyFactsLabel = getContent(sections, "about.keyFactsLabel", defaults.home.about.keyFactsLabel);
  const facts = getContent(sections, "about.facts", defaults.home.about.facts);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + facts.length) % facts.length);
  const next = () => setCurrent((p) => (p + 1) % facts.length);

  const fact = facts[current] || { value: "", label: "" };

  return (
    // ✅ FULL PAGE BACKGROUND FIX
    <div className="w-full bg-[#020817]">

      {/* ✅ YOUR ORIGINAL CONTAINER (UNCHANGED DESIGN) */}
      <div className="px-6 md:px-12 py-20 md:py-24 flex items-center w-full text-[#fbf0f2] relative">

        <div className="grid grid-cols-1 md:grid-cols-12 w-full gap-20">

          {/* Left Column */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <Reveal>
              <h2
                className="text-[2rem] sm:text-[2.5rem] md:text-[72px] font-semibold tracking-tighter mb-12"
                style={{ fontFamily: "'PP Mori', sans-serif", lineHeight: 1 }}
              >
                Crafting premium <br />
                brands for scaleups <br />
                that make people smile.
              </h2>
            </Reveal>

            <Reveal delay={0.4}>
              <TransitionLink to="/about">
                <button className="px-6 py-3 rounded-full bg-[#fbf0f2] text-[#020817] text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 shadow-sm border border-transparent hover:border-white">
                  <span>About us</span>
                  <span>→</span>
                </button>
              </TransitionLink>
            </Reveal>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="flex items-center justify-between border-b border-[#fbf0f2]/20 mb-6 pb-2 text-sm font-bold tracking-wider uppercase" style={{ fontFamily: "'PP Mori', sans-serif" }}>
              <span>Key Facts</span>
              <span>
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(facts.length).padStart(2, "0")}
              </span>
            </div>

            <div className="relative overflow-hidden min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3
                    className="text-[2.5rem] md:text-[3.8rem] font-bold leading-none mb-4 whitespace-pre-line"
                    style={{ fontFamily: "'PP Mori', sans-serif" }}
                  >
                    {fact.value}
                  </h3>
                  <p className="text-sm font-medium tracking-wide leading-relaxed" style={{ fontFamily: "'PP Mori', sans-serif" }}>
                    {fact.label}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-12">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform border border-white/20"
              >
                ←
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 transition-transform border border-white/20"
              >
                →
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5 mt-4">
              {facts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${i === current
                      ? "w-4 h-1.5 bg-[#fbf0f2]"
                      : "w-1.5 h-1.5 bg-[#fbf0f2]/20"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}