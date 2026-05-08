import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
import styles from './About.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

const randomImages = [
  "https://picsum.photos/id/1015/500/400",
  "https://picsum.photos/id/1018/400/500",
  "https://picsum.photos/id/1025/600/400",
  "https://picsum.photos/id/1035/500/500",
  "https://picsum.photos/id/1043/450/450",
  "https://picsum.photos/id/1045/400/300",
  "https://picsum.photos/id/1048/500/350",
  "https://picsum.photos/id/1050/350/500",
];

export default function About() {
  const [trail, setTrail] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const count = useRef(0);
  const sectionRef = useRef(null);

  const { sections } = usePageContent("about");
  const estHeading = getContent(sections, "hero.estHeading", defaults.about.hero.estHeading);
  const taglineBold = getContent(sections, "hero.taglineBold", defaults.about.hero.taglineBold);
  const taglineItalic = getContent(sections, "hero.taglineItalic", defaults.about.hero.taglineItalic);
  const paragraphs = getContent(sections, "paragraphs", defaults.about.paragraphs);
  const ctaSendRequest = getContent(sections, "cta.sendRequest", defaults.about.cta.sendRequest);
  const ctaMasterplan = getContent(sections, "cta.masterplan", defaults.about.cta.masterplan);

  useEffect(() => {
    document.body.style.backgroundColor = '#fbf0f2';
    document.body.style.color = '#111111';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 80) {
      lastPos.current = { x, y };

      const newImage = {
        id: Date.now() + Math.random(),
        src: randomImages[count.current % randomImages.length],
        x,
        y,
        rotate: (Math.random() - 0.5) * 30,
      };

      setTrail(prev => [...prev, newImage]);
      count.current += 1;

      setTimeout(() => {
        setTrail(prev => prev.filter(img => img.id !== newImage.id));
      }, 2000);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.pageWrapper}
    >
      {/* Est. 2015 Hero */}
      <section className={styles.estSection}>
        <h1 className={styles.estHeading}>
          {estHeading}
        </h1>
        <div className={styles.tagline}>
          <p className={styles.taglineBold}>{taglineBold}</p>
          <p className={styles.taglineItalic}>{taglineItalic}</p>
        </div>
      </section>

      {/* About Text */}
      <section
        ref={sectionRef}
        className={styles.heroSection}
        onMouseMove={handleMouseMove}
      >
        {trail.map((img) => (
          <motion.img
            key={img.id}
            src={img.src}
            alt=""
            className={styles.trailImage}
            style={{ top: img.y, left: img.x }}
            initial={{ opacity: 0, scale: 0.5, rotate: img.rotate }}
            animate={{ opacity: 1, scale: 1, rotate: img.rotate }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8, ease: "easeOut" } }}
            transition={{ duration: 0.4, ease: "backOut" }}
          />
        ))}

        <div className={styles.textContent}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={styles.mainParagraph}
              style={i > 0 ? { marginTop: '2rem' } : undefined}
            >
              {typeof p === 'string' ? p : p.text}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <button
          onClick={() => setIsContactModalOpen(true)}
          className={styles.ctaBlockDark}
          style={{ border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
        >
          <div className={styles.ctaTextTop}>
            <strong>{ctaSendRequest.topBold}</strong>
            <span>{ctaSendRequest.topItalic}</span>
          </div>
          <h2 className={styles.ctaHeading}>{ctaSendRequest.heading}</h2>
        </button>

        <button
          onClick={() => setIsContactModalOpen(true)}
          className={styles.ctaBlockPink}
          style={{ border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
        >
          <div className={styles.ctaTextTop}>
            <strong>{ctaMasterplan.topBold}</strong>
            <span>{ctaMasterplan.topItalic}</span>
          </div>
          <div className={styles.ctaHeadingContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
              <polyline points="9 8 9 14 19 14"></polyline>
              <polyline points="15 10 19 14 15 18"></polyline>
            </svg>
            <div className={styles.ctaHeadingPinkGroup}>
              {ctaMasterplan.heading.split(/\s+/).slice(0, -1).join(" ") && (
                <h2 className={styles.ctaHeading}>{ctaMasterplan.heading.split(/\s+/).slice(0, -1).join(" ")}</h2>
              )}
              <h2 className={styles.ctaHeadingUnderlined}>{ctaMasterplan.heading.split(/\s+/).slice(-1)[0]}</h2>
            </div>
          </div>
        </button>
      </section>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </motion.div>
  );
}
