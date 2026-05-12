import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import styles from './Clients.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent, getLogoUrl } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, delay = 0, className }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ─── Main ─── */
export default function Clients() {
    useLayoutEffect(() => {
        document.body.style.backgroundColor = "#fbf0f2";
        document.body.style.color = "#020817";
        return () => {
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        };
    }, []);

    const { sections } = usePageContent("clients");
    const heroLabel = getContent(sections, "hero.label", defaults.clients.hero.label);
    const heroHeading = getContent(sections, "hero.heading", defaults.clients.hero.heading);
    const heroSubtitle = getContent(sections, "hero.subtitle", defaults.clients.hero.subtitle);
    const gridHeading = getContent(sections, "grid.heading", defaults.clients.grid.heading);
    const gridSubtext = getContent(sections, "grid.subtext", defaults.clients.grid.subtext);
    const clients = getContent(sections, "list", defaults.clients.list);
    const ctaHeading = getContent(sections, "cta.heading", defaults.clients.cta.heading);
    const ctaButtonText = getContent(sections, "cta.buttonText", defaults.clients.cta.buttonText);

    const categories = ['All', ...Array.from(new Set(clients.map(c => c.category)))];

    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = activeFilter === 'All'
        ? clients
        : clients.filter(c => c.category === activeFilter);

    return (
        <motion.div
            className={styles.page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero */}
            <section className={styles.hero}>
                <motion.p
                    className={styles.heroLabel}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {heroLabel}
                </motion.p>
                <motion.h1
                    className={styles.heroHeading}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {heroHeading.split("\n").map((line, i, arr) => (
                        <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                </motion.h1>
                <motion.p
                    className={styles.heroSub}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    {heroSubtitle}
                </motion.p>
            </section>

            {/* Filter pills */}
            <div className={styles.filters}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Logo grid */}
            <section className={styles.gridSection}>
                <p className={styles.gridHeading}>{gridHeading}</p>
                <p className={styles.gridSubtext}>{gridSubtext}</p>
                <motion.div className={styles.logoGrid} layout>
                    {filtered.map((client, i) => {
                        const sizePercent = parseInt(client.logoSize, 10) || 100;
                        const scaleFactor = sizePercent / 100;
                        return (
                            <FadeIn key={client.name} delay={i * 0.04}>
                                <div className={styles.logoCell}>
                                    <div className={styles.logoContent}>
                                        <img 
                                            src={getLogoUrl(client.logo)} 
                                            alt={client.name} 
                                            className={styles.clientLogoImg}
                                            style={{
                                                transform: `scale(${scaleFactor})`,
                                                transformOrigin: "center center",
                                            }}
                                        />
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </motion.div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <FadeIn>
                    <h2 className={styles.ctaHeading}>{ctaHeading}</h2>
                    <TransitionLink to="/contact" className={styles.ctaButton}>
                        {ctaButtonText}
                    </TransitionLink>
                </FadeIn>
            </section>
        </motion.div>
    );
}
