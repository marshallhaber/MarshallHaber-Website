import { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Legal.module.css";
import { usePageContent } from "../hooks/usePageContent";
import { getContent } from "../lib/content";
import { defaults } from "../lib/contentDefaults";

export default function Legal() {
  useEffect(() => {
    document.body.style.backgroundColor = "#fbf0f2";
    document.body.style.color = "#020817";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const { sections } = usePageContent("legal");
  const heading = getContent(sections, "hero.heading", defaults.legal.hero.heading);
  const lastUpdated = getContent(sections, "hero.lastUpdated", defaults.legal.hero.lastUpdated);
  const blocks = getContent(sections, "sections", defaults.legal.sections);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className={styles.hero}>
        <h1 className={styles.heroHeading}>{heading}</h1>
        <p className={styles.heroSub}>{lastUpdated}</p>
      </section>

      <article className={styles.body}>
        {blocks.map((block, i) => (
          <section className={styles.block} key={i}>
            <h2 className={styles.blockHeading}>{block.heading}</h2>
            <p>
              {block.content.split("\n").map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
            {block.email && (
              <p>
                Email: <a href={`mailto:${block.email}`}>{block.email}</a>
              </p>
            )}
          </section>
        ))}
      </article>
    </motion.div>
  );
}
