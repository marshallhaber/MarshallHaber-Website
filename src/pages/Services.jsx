import { motion } from 'framer-motion';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

gsap.registerPlugin(ScrollTrigger);
import styles from './Services.module.css';

export default function Services() {
  const { sections } = usePageContent("services");
  const heroHeading = getContent(sections, "hero.heading", defaults.services.hero.heading);
  const sidebarLabel = getContent(sections, "sidebar.label", defaults.services.sidebar.label);
  const sidebarText = getContent(sections, "sidebar.text", defaults.services.sidebar.text);
  const serviceCards = getContent(sections, "serviceCards", defaults.services.serviceCards);
  const programsHeading = getContent(sections, "programs.heading", defaults.services.programs.heading);
  const brandingServices = getContent(sections, "programs.services", defaults.services.programs.services);

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

      <div className={styles.divider} />

      {/* ── Body: sidebar + cards ── */}
      <section className={styles.body}>
        <motion.div
          className={styles.sidebar}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className={styles.sidebarLabel}>{sidebarLabel}</span>
          <p className={styles.sidebarText}>{sidebarText}</p>
        </motion.div>

        <div className={styles.grid}>
          {serviceCards.map((card, i) => (
            <motion.div
              key={card.id}
              className={`${styles.card} ${card.featured ? styles.cardFeatured : ''} ${card.bg ? styles.cardColored : ''
                }`}
              style={card.bg ? { backgroundColor: card.bg } : {}}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardInner}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardText}>{card.text}</p>
              </div>
              <span className={styles.cardArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Scroll-scale video section removed per request ── */}

      {/* ── Branding services list ── */}
      <section className={styles.programs}>
        <h2 className={styles.programsHeading}>{programsHeading}</h2>
        <div className={styles.programsList}>
          {brandingServices.map((s) => (
            <div key={s.name} className={styles.programRow} role="link" tabIndex={0}>
              <span className={styles.programName}>{s.name}</span>
              <span className={styles.programTagline}>{s.tagline}</span>
              <span className={styles.programArrow} aria-hidden>→</span>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
