import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import heroVideo from '../assets/video.mp4';
import styles from './Contact.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] },
  }),
};

function AnimatedSection({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const { sections } = usePageContent("contact");
  const hero = getContent(sections, "hero", defaults.contact.hero);
  const info = getContent(sections, "info", defaults.contact.info);
  const form = getContent(sections, "form", defaults.contact.form);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#fbf0f2';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.pageWrapper}
    >
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <AnimatedSection>
            <span className={styles.heroLabel}>{hero.label}</span>
          </AnimatedSection>
          <AnimatedSection delay={1}>
            <h1 className={styles.heroTitle}>
              {hero.title.split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={2}>
            <p className={styles.heroSubtitle}>{hero.subtitle}</p>
          </AnimatedSection>
        </div>

        {/* Video */}
        <AnimatedSection delay={3} className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <video
              className={styles.heroVideoPlayer}
              autoPlay
              muted
              loop
              playsInline
              src={heroVideo}
            />
            <div className={styles.videoOverlay} />
          </div>
        </AnimatedSection>
      </section>

      {/* Info Cards */}
      <section className={styles.infoSection}>
        <AnimatedSection className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3 className={styles.infoCardTitle}>{info.location.title}</h3>
          <p className={styles.infoCardText}>
            {info.location.addressLine1}<br />
            {info.location.addressLine2}
          </p>
          <p className={styles.infoCardMuted}>{info.location.regions}</p>
        </AnimatedSection>

        <AnimatedSection delay={1} className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h3 className={styles.infoCardTitle}>{info.phone.title}</h3>
          <p className={styles.infoCardText}>
            <a href={`tel:${info.phone.number.replace(/[^+\d]/g, '')}`}>{info.phone.number}</a>
          </p>
          <p className={styles.infoCardMuted}>{info.phone.hours}</p>
        </AnimatedSection>

        <AnimatedSection delay={2} className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 className={styles.infoCardTitle}>{info.email.title}</h3>
          <p className={styles.infoCardText}>
            <a href={`mailto:${info.email.address}`}>{info.email.address}</a>
          </p>
          <p className={styles.infoCardMuted}>{info.email.response}</p>
        </AnimatedSection>
      </section>

      {/* Form Section */}
      <section className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <AnimatedSection className={styles.formLeft}>
            <span className={styles.formLabel}>{form.label}</span>
            <h2 className={styles.formTitle}>
              {form.title.split("\n").map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
            <p className={styles.formSubtext}>{form.subtitle}</p>
          </AnimatedSection>

          <AnimatedSection delay={1} className={styles.formRight}>
            {submitted ? (
              <motion.div
                className={styles.successMsg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>{form.successTitle}</h3>
                <p>{form.successMessage}</p>
              </motion.div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={`${styles.inputGroup} ${focused === 'name' ? styles.focused : ''}`}>
                    <label htmlFor="contact-name">{form.nameLabel}</label>
                    <input
                      type="text"
                      placeholder={form.namePlaceholder}
                      className={styles.input}
                      required
                      id="contact-name"
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className={`${styles.inputGroup} ${focused === 'email' ? styles.focused : ''}`}>
                    <label htmlFor="contact-email">{form.emailLabel}</label>
                    <input
                      type="email"
                      placeholder={form.emailPlaceholder}
                      className={styles.input}
                      required
                      id="contact-email"
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                <div className={`${styles.inputGroup} ${focused === 'company' ? styles.focused : ''}`}>
                  <label htmlFor="contact-company">{form.companyLabel}</label>
                  <input
                    type="text"
                    placeholder={form.companyPlaceholder}
                    className={styles.input}
                    id="contact-company"
                    onFocus={() => setFocused('company')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className={`${styles.inputGroup} ${focused === 'message' ? styles.focused : ''}`}>
                  <label htmlFor="contact-message">{form.messageLabel}</label>
                  <textarea
                    placeholder={form.messagePlaceholder}
                    className={styles.textarea}
                    rows="5"
                    required
                    id="contact-message"
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    id="subscribe-checkbox"
                  />
                  <label htmlFor="subscribe-checkbox" className={styles.checkboxLabel}>
                    {form.checkboxLabel}
                  </label>
                </div>

                <button type="submit" className={styles.submitBtn} id="contact-submit">
                  <span>{form.submitText}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>
    </motion.div>
  );
}
