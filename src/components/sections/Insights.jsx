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

const SmileyI = () => (
  <span className="relative inline-block mx-[1px]">
    <span className="opacity-0">i</span>
    <span className="absolute inset-0 flex items-center justify-center -translate-y-[0.1em]">ı</span>
    <svg className="absolute -top-[0.2em] left-1/2 -translate-x-1/2 w-[0.4em] h-[0.4em] text-[#ffb5cc]" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" />
      <path d="M7 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm10 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 16c-2.5 0-4.5-1.5-5.5-3.5h11c-1 2-3 3.5-5.5 3.5z" fill="#020817" />
    </svg>
  </span>
);

function renderTitleWithSmiley(text) {
  if (!text) return null;
  return text.split('*').map((part, i, arr) => (
    <span key={i}>
      {part}
      {i < arr.length - 1 && <SmileyI />}
    </span>
  ));
}

export default function Insights() {
  const sectionRef = useRef(null);
  const { sections } = usePageContent("home");
  const { sections: insightSections } = usePageContent("insights");
  const heading = getContent(sections, "insights.heading", defaults.home.insights.heading);
  const trendingButton = getContent(sections, "insights.trendingButton", defaults.home.insights.trendingButton);
  const rawCards = getContent(sections, "insights.cards", defaults.home.insights.cards);
  const cmsArticles = getContent(insightSections, "articles", []);

  // Merge CMS cards with defaults so slugs and other fields are never empty
  const defaultCards = defaults.home.insights.cards;
  const cards = defaultCards.map((def, i) => {
    const cms = cmsArticles[i] || {};
    return {
      ...def,
      ...cms,
      bg: cms.bgColor || def.bg,
      textColor: cms.textColor || def.textColor,
      brand: cms.tag || def.brand,
      label: cms.desc || def.label,
      title: cms.title || def.title,
      slug: cms.slug || def.slug,
    };
  });

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
                  {/* Card box — locked 16:9 aspect ratio. All inner text uses cqw so it scales with the card's own width. */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "55.5556%",
                      backgroundColor: card.bg,
                      overflow: "hidden",
                      containerType: "inline-size",
                    }}
                  >
                    <div
                      className="flex flex-col items-center justify-center text-center"
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "5cqw",
                        color:
                          card.bg === "#2B59C3" || card.bg === "#0B0215"
                            ? "#fbf0f2"
                            : "#020817",
                      }}
                    >
                      <p
                        className="font-bold uppercase opacity-50"
                        style={{
                          fontSize: "2.2cqw",
                          letterSpacing: "0.18em",
                          marginBottom: "4cqw",
                        }}
                      >
                        {card.brand}
                      </p>

                      {card.label && card.label !== (card.titleLarge || card.title) && (
                        <p
                          style={{
                            fontFamily: "'Nib Pro', serif",
                            fontStyle: "italic",
                            fontSize: "3.4cqw",
                            lineHeight: 1.35,
                            marginBottom: "2.5cqw",
                            color: card.labelColor || "inherit",
                          }}
                        >
                          {card.label}
                        </p>
                      )}

                      <h3
                        className="font-bold tracking-tight"
                        style={{
                          fontFamily: "'PP Mori', sans-serif",
                          fontSize: "6cqw",
                          lineHeight: 1.1,
                        }}
                      >
                        {(card.titleLarge || card.title).split("\n").map((line, j, arr) => (
                          <span key={j}>
                            {renderTitleWithSmiley(line)}
                            {j < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </h3>
                    </div>
                  </div>

                  {/* Description removed as per new layout */}
                </motion.div>
              </TransitionLink>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}