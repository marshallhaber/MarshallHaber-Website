import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TransitionLink from "../ui/TransitionLink";
import styles from "./ClientSection.module.css";

const clients = [
  { name: 'JPMorgan Chase', logo: 'jpmorgan.png' },
  { name: 'Jeffries', logo: '09_Jeffries_Logo.png' },
  { name: 'Eurotech', logo: '16_Eurotech_Logo.png' },
  { name: 'Celadon', logo: 'Celadon_Logo.png' },
  { name: 'Humankind Investments', logo: 'HumankindInvestments_Logo.png' },
  { name: 'MIZ', logo: 'MIZ_Logo_SVG_Gadrientdark.png' },
  { name: 'Y&R', logo: 'YR.png' },
  { name: 'Centerbridge', logo: 'centerbridge.png' },
  { name: 'Kaplan', logo: 'kaplan.png' },
  { name: 'Hotel on Rivington', logo: 'rivington.png' },
  { name: 'Trish McEvoy', logo: 'trishmcevoy-1.png' },
];

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
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h3 className={styles.label}>Clients:</h3>

          <div className={styles.logoGrid}>
            {clients.map((client, i) => (
              <FadeIn key={client.name} delay={i * 0.04} className={styles.logoCell}>
                <img
                  src={`/CliendLogo/${client.logo}`}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className={styles.clientLogoImg}
                />
              </FadeIn>
            ))}
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
