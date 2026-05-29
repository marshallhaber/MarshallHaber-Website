import { motion } from 'framer-motion';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

gsap.registerPlugin(ScrollTrigger);
import styles from './Services.module.css';
import StackContainer from '../components/layout/StackContainer';
import ServiceBlock, { StrategyVideo, VisualImage, WebsiteImage, ProductImage } from '../components/sections/Services';

const PANEL_VISUALS = [
  <StrategyVideo key="0" />,
  <VisualImage key="1" />,
  <WebsiteImage key="2" />,
  <ProductImage key="3" />,
];

export default function Services() {
  const { sections } = usePageContent("services");
  const heroHeading = getContent(sections, "hero.heading", defaults.services.hero.heading);
  const sidebarLabel = getContent(sections, "sidebar.label", defaults.services.sidebar.label);
  const sidebarText = getContent(sections, "sidebar.text", defaults.services.sidebar.text);
  const serviceCards = getContent(sections, "serviceCards", defaults.services.serviceCards);
  const programsHeading = getContent(sections, "programs.heading", defaults.services.programs.heading);
  const brandingServices = getContent(sections, "programs.services", defaults.services.programs.services);
  const cmsServicePanels = getContent(sections, "servicePanels", defaults.services.servicePanels);

  const servicePanels = cmsServicePanels.map((panel, i) => {
    const items = Array.isArray(panel.items)
      ? panel.items
      : typeof panel.items === "string"
        ? panel.items.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    return {
      bg: panel.bg,
      children: (
        <ServiceBlock
          title={panel.title}
          description={panel.description}
          list={items}
          imageContent={PANEL_VISUALS[i % PANEL_VISUALS.length]}
          textColor={panel.textColor || "text-[#020817]"}
          videoUrl={panel.videoUrl}
          imageUrl={panel.imageUrl}
          mediaTitle={panel.mediaTitle}
          mediaLabel={panel.mediaLabel}
          hideImage={panel.hideImage === true || panel.hideImage === "true"}
        />
      ),
    };
  });

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#fbf0f2';
    document.body.style.color = '#111111';

    const ctx = gsap.context(() => {
      // Empty context to satisfy revert
    });

    return () => {
      ctx.revert();
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.page}
    >
      {/* ── Full-viewport hero ── */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.heroHeading}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {heroHeading}
        </motion.h1>
      </section>

      {/* ── Scroll-scale video section removed per request ── */}

      <StackContainer panels={servicePanels} />

    </motion.div>
  );
}
