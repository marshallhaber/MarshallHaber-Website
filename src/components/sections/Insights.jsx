import { motion } from "framer-motion";
import { useRef } from "react";
import Reveal from "../ui/Reveal";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";
import TransitionLink from "../ui/TransitionLink";

const cardInitial = [
  { opacity: 0, x: -150 },
  { opacity: 0, y: 150 },
  { opacity: 0, x: 150 },
];

export default function Insights() {
  const sectionRef = useRef(null);
  const { sections } = usePageContent("home");
  const heading = getContent(sections, "insights.heading", defaults.home.insights.heading);
  const trendingButton = getContent(sections, "insights.trendingButton", defaults.home.insights.trendingButton);
  const cards = getContent(sections, "insights.cards", defaults.home.insights.cards);

  // Section has a static cream bg; all text/borders stay dark for readability.
  const textColor = "#020817";
  const mutedColor = "#020817";
  const borderColor = "rgba(2,8,23,0.1)";
  const buttonBorder = "#020817";
  const logoFilter = "brightness(0) grayscale(1)";

  return (
    <motion.div
      ref={sectionRef}
      style={{ backgroundColor: "#fbf0f2" }}
      className="w-full relative"
    >
      <div className="px-6 md:px-12 pt-8 md:pt-14 pb-8 md:pb-12 w-full">

        {/* Heading row — title left, button right */}
        <div className="flex items-start justify-between gap-6 mb-10 md:mb-14">
          <Reveal>
            <motion.h2
              style={{ color: textColor, fontFamily: "'PP Mori', sans-serif", fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
              className="font-bold leading-[1.0] tracking-tight"
            >
              {heading}
            </motion.h2>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-2 shrink-0 mt-2"
          >
            <motion.div
              style={{ borderColor: buttonBorder, color: buttonBorder }}
              className="w-8 h-8 border-[0.5px] border-opacity-30 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            >
              ←
            </motion.div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="-mx-4 md:mx-0 mb-8 md:mb-12">
          <div
            className="flex flex-col px-4 md:px-0 md:grid"
            style={{
              gap: "1rem",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              alignItems: "stretch",
            }}
          >
            {cards.map((card, i) => (
              <TransitionLink
                key={i}
                to={`/insights/${card.slug || 'article'}`}
                className="flex flex-col gap-0 group"
                style={{ width: "100%", minWidth: 0 }}
              >
                <motion.div
                  initial={cardInitial[i % cardInitial.length]}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.1,
                  }}
                  className="flex flex-col gap-0 cursor-pointer"
                  style={{ width: "100%", minWidth: 0 }}
                >
                  {/* Card box — locked aspect ratio via padding trick */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "55.5556%",
                      backgroundColor: card.bg,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="flex flex-col items-center justify-center text-center"
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "clamp(24px, 4vw, 48px)",
                        color:
                          card.bg === "#2B59C3" || card.bg === "#0B0215"
                            ? "#fbf0f2"
                            : "#020817",
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6 opacity-50">
                        {card.brand}
                      </p>

                      <p
                        className="text-sm mb-3 tracking-wide leading-snug"
                        style={{
                          fontFamily: "'Nib Pro', serif",
                          fontStyle: "italic",
                          color: card.labelColor || "inherit",
                        }}
                      >
                        {card.label}
                      </p>

                      <h3
                        className="font-bold leading-tight tracking-tight"
                        style={{
                          fontFamily: "'PP Mori', sans-serif",
                          fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
                        }}
                      >
                        {(card.titleLarge || card.title).split("\n").map((line, j, arr) => (
                          <span key={j}>
                            {line}
                            {j < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.1 + 0.2,
                    }}
                    style={{
                      color: textColor,
                      fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                      minHeight: "calc(2 * 1.375em)",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                    className="font-semibold leading-snug mt-5 mb-4 group-hover-underline"
                  >
                    {card.desc}
                  </motion.p>
                </motion.div>
              </TransitionLink>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}