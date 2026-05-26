import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
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

    const categories = ['All', ...Array.from(new Set(clients.map(c => c.category).filter(Boolean)))];

    const [activeFilter, setActiveFilter] = useState('All');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
                    For over 20 years, companies across finance, real estate, technology, family office, entertainment, and nonprofit sectors have trusted MHCG to help bring complex ideas to market.
                </motion.p>
                <motion.p
                    className={styles.heroSub}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    style={{ marginTop: '1rem' }}
                >
                    From brand strategy to production, we help companies move from vision to execution.
                </motion.p>
            </section>

            {/* Filter pills — desktop */}
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

            {/* Filter dropdown — mobile */}
            <div className={styles.filterDropdownWrap}>
                <select
                    className={styles.filterDropdown}
                    value={activeFilter}
                    onChange={e => setActiveFilter(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <span className={styles.filterDropdownArrow}>▾</span>
            </div>

            {/* Logo grid */}
            <section className={styles.gridSection}>
                <motion.div className={styles.logoGrid} layout>
                    {filtered.map((client, i) => {
                        const sizePercent = parseInt(client.logoSize, 10) || 100;
                        const scaleFactor = sizePercent / 100;
                        return (
                            <FadeIn key={client.name} delay={i * 0.04}>
                                <div className={styles.logoCell}>
                                    <div className={styles.logoContent}>
                                        {client.logo ? (
                                            <img
                                                src={getLogoUrl(client.logo)}
                                                alt={client.name}
                                                className={styles.clientLogoImg}
                                                style={{
                                                    transform: `scale(${scaleFactor})`,
                                                    transformOrigin: "center center",
                                                }}
                                            />
                                        ) : (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                color: '#020817',
                                                opacity: 0.6,
                                                textAlign: 'center',
                                                lineHeight: 1.3,
                                            }}>
                                                {client.name}
                                            </span>
                                        )}
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
                    <button className={styles.ctaButton} onClick={() => setIsContactModalOpen(true)}>
                        {ctaButtonText}
                    </button>
                </FadeIn>
            </section>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </motion.div>
    );
}
