import { motion } from "framer-motion";
import { useRef, useMemo } from "react";
import Reveal from "../ui/Reveal";
import TransitionLink from "../ui/TransitionLink";
import projects from "../../data/projects";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

export default function Works() {
  const containerRef = useRef(null);
  const { sections } = usePageContent("home");
  const { sections: workSections } = usePageContent("work");

  const headingBold = getContent(sections, "works.headingBold", defaults.home.works.headingBold);
  const headingItalic = getContent(sections, "works.headingItalic", defaults.home.works.headingItalic);
  const ctaText = getContent(sections, "works.ctaText", defaults.home.works.ctaText);

  const cmsRawProjects = getContent(workSections, "projects", []);
  const featured = useMemo(() => {
    const cmsProjects = cmsRawProjects
      .filter(p => p.title)
      .map(p => ({
        slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
        title: p.title,
        subtitle: p.subtitle || '',
        category: p.category || 'Uncategorized',
        client: p.client || p.title,
        services: p.services || '',
        description: p.description || '',
        image: p.imageUrl || '',
        video: p.videoUrl || '',
        featuredOnHome: p.featuredOnHome === true || p.featuredOnHome === "true",
        homeSortOrder: parseInt(p.homeSortOrder, 10) || 999,
      }))
      .sort((a, b) => a.homeSortOrder - b.homeSortOrder);

    const explicitlyFeatured = cmsProjects.filter(p => p.featuredOnHome);
    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured.slice(0, 8);
    }
    return cmsProjects.slice(0, 8);
  }, [cmsRawProjects]);

  return (
    <div ref={containerRef} className="w-full px-6 pt-12 pb-10 bg-[#fbf0f2] text-[#020817]">
      <Reveal>
        <h2
          className="text-[clamp(1.6rem,4.2vw,4.2rem)] leading-[1.1] mb-16 text-inherit text-center whitespace-nowrap mx-auto"
        >
          <span style={{ fontFamily: "'Nib Pro', serif", fontWeight: 700, fontStyle: "italic" }}>
            {headingItalic || "Strategy. Design. Transformation."}
          </span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
        {featured.map((p, i) => {
          const isLeft = i % 2 === 0;
          return (
            <TransitionLink to={`/work/${p.slug}`} key={p.slug} className="block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: isLeft ? 0 : 0.1 }}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-6 bg-white/5">
                  {p.video ? (
                    <video
                      src={p.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      crossOrigin="anonymous"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>

                <Reveal>
                  <h3 className="text-base md:text-lg font-bold mb-1 text-left leading-snug" style={{ fontFamily: "'PP Mori', sans-serif" }}>
                    <span>{p.title}</span> <span className="font-normal opacity-60">| {p.subtitle}</span>
                  </h3>
                </Reveal>
                <Reveal delay={0.4}>
                  <p className="text-xs font-medium opacity-40 uppercase tracking-wide text-left">{p.category}</p>
                </Reveal>
              </motion.div>
            </TransitionLink>
          );
        })}
      </div>

      <div className="mt-20 flex justify-center">
        <TransitionLink to="/work" className="px-8 py-4 rounded-full border border-current font-semibold hover:bg-[#020817] hover:text-[#fbf0f2] transition-colors inline-block text-[#020817]">
          {ctaText}
        </TransitionLink>
      </div>
    </div>
  );
}