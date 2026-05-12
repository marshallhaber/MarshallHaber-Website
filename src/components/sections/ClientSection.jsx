import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TransitionLink from "../ui/TransitionLink";
import styles from "./ClientSection.module.css";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent, getLogoUrl } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

function FadeIn({ children, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ClientSection() {
  const { sections } = usePageContent("clients");
  const clients = getContent(sections, "list", defaults.clients.list);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h3 className={styles.label}>Clients:</h3>

          <div className={styles.logoGrid}>
            {clients.map((client, i) => {
              const sizePercent = parseInt(client.logoSize, 10) || 100;
              const scaleFactor = sizePercent / 100;
              return (
                <FadeIn key={client.name} delay={i * 0.04} className={styles.logoCell}>
                  <img
                    src={getLogoUrl(client.logo)}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                    className={styles.clientLogoImg}
                    style={{
                      transform: `scale(${scaleFactor})`,
                      transformOrigin: "left center",
                    }}
                  />
                </FadeIn>
              );
            })}
          </div>
        </div>

        <div className={styles.showAllWrap}>
          <TransitionLink to="/clients" className={styles.showAllBtn}>
            Show All
            <span aria-hidden>→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
