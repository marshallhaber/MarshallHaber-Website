import { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
import styles from './About.module.css';

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
          Est. 2005
        </h1>
        <div className={styles.tagline}>
          <p className={styles.taglineBold}>Crafting the future,</p>
          <p className={styles.taglineItalic}>while having serious fun.</p>
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
          <p className={styles.mainParagraph}>
            <strong>MARSHALL.HABER</strong> <span>started in 2005 as a</span> <strong>passion project</strong> <span>at Hyper Island, Stockholm by a diverse group of creatives with the goal of re-defining what a serious business is really about:</span> <strong>kindness and creativity.</strong>
          </p>
          <p className={styles.mainParagraph} style={{ marginTop: '2rem' }}>
            <span>That's why we craft our future with kindness to</span> <strong>create brands that make people smile.</strong>
          </p>
          <p className={styles.mainParagraph} style={{ marginTop: '2rem' }}>
            <span>Today our</span> <strong>dream team</strong> <span>of 15 creatives with a global perspective has crafted a new generation of brands with</span> <strong>over 180 change-making scaleups</strong> <span>in Europe and the Americas, a living proof that it is culture that drives a serious business.</span>
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <button
          onClick={() => setIsContactModalOpen(true)}
          className={styles.ctaBlockDark}
          style={{ border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
        >
          <div className={styles.ctaTextTop}>
            <strong>You feel it too?</strong>
            <span>Let's talk, no strings attached</span>
          </div>
          <h2 className={styles.ctaHeading}>Send Request</h2>
        </button>

        <button
          onClick={() => setIsContactModalOpen(true)}
          className={styles.ctaBlockPink}
          style={{ border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
        >
          <div className={styles.ctaTextTop}>
            <strong>Our free offer for B2B tech scaleups!</strong>
            <span>We identify high-impact messaging and brand fixes you can implement within 24 hours.</span>
          </div>
          <div className={styles.ctaHeadingContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
              <polyline points="9 8 9 14 19 14"></polyline>
              <polyline points="15 10 19 14 15 18"></polyline>
            </svg>
            <div className={styles.ctaHeadingPinkGroup}>
              <h2 className={styles.ctaHeading}>Brand</h2>
              <h2 className={styles.ctaHeadingUnderlined}>Masterplan</h2>
            </div>
          </div>
        </button>
      </section>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </motion.div>
  );
}
