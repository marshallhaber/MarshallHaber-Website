import { useState, useLayoutEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
import hardcodedProjects from '../data/projects';
import styles from './WorkDetail.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

export default function WorkDetail() {
  const { slug } = useParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { sections } = usePageContent("workDetail");
  const { sections: workSections, loading: workLoading } = usePageContent("work");
  const info = getContent(sections, "info", defaults.workDetail.info);
  const moreProjectsHeading = getContent(sections, "moreProjectsHeading", defaults.workDetail.moreProjectsHeading);
  const ctaSendRequest = getContent(sections, "cta.sendRequest", defaults.workDetail.cta.sendRequest);
  const ctaMasterplan = getContent(sections, "cta.masterplan", defaults.workDetail.cta.masterplan);

  const projects = useMemo(() => {
    const cms = (workSections?.projects || [])
      .filter((p) => p && p.title)
      .map((p) => ({
        slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
        title: p.title,
        subtitle: p.subtitle || '',
        category: p.category || 'Uncategorized',
        client: p.client || p.title,
        description: p.description || '',
        image: p.imageUrl || '',
        video: p.videoUrl || '',
        fromCms: true,
      }));
    const hardcodedSlugs = new Set(hardcodedProjects.map((p) => p.slug));
    const newCms = cms.filter((p) => !hardcodedSlugs.has(p.slug));
    return [...hardcodedProjects, ...newCms];
  }, [workSections]);

  const project = projects.find((p) => p.slug === slug);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#fbf0f2";
    document.body.style.color = "#020817";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  // Wait for the CMS projects fetch before deciding the slug is invalid —
  // otherwise a CMS-created project would briefly redirect to /work.
  if (!project) {
    if (workLoading) return null;
    return <Navigate to="/work" replace />;
  }

  const moreProjects = projects.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        {/* Header */}
        <section className={styles.heroHeader}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {project.category}
          </motion.p>
          <motion.h1
            className={styles.projectTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {project.title}
          </motion.h1>
          {project.subtitle && project.subtitle.toLowerCase() !== project.category.toLowerCase() && (
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {project.subtitle}
            </motion.p>
          )}
        </section>

        {/* Info Grid */}
        <section className={styles.infoGrid}>
          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className={styles.infoDivider} />
            <h3 className={styles.infoLabel}>{info.clientLabel}</h3>
            <p className={styles.infoValue}>{project.client}</p>
          </motion.div>

          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <div className={styles.infoDivider} />
            <h3 className={styles.infoLabel}>{info.industryLabel}</h3>
            <p className={styles.infoValue}>{project.category}</p>
          </motion.div>

          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className={styles.infoDivider} />
            <h3 className={styles.infoLabel}>{info.servicesLabel}</h3>
            <p className={styles.infoValue}>{info.servicesValue}</p>
          </motion.div>
        </section>

        {project.description && (
          <motion.section
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <p className={styles.description}>{project.description}</p>
          </motion.section>
        )}

        {/* Main Image */}
        <motion.section
          className={styles.mainImageWrapper}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img src={project.image} alt={project.title} className={styles.mainImage} />
        </motion.section>
      </div>

      {/* More Projects Section */}
      <section className={styles.moreProjects}>
        <div className={styles.container} style={{ padding: 0 }}>
          <h2 className={styles.moreProjectsHeader}>{moreProjectsHeading}</h2>
          <div className={styles.moreProjectsGrid}>
            {moreProjects.map((p, i) => (
              <TransitionLink to={`/work/${p.slug}`} key={p.slug} className={styles.projectCard}>
                <motion.div
                  className={styles.projectImageWrapper}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <img src={p.image} alt={p.title} className={styles.projectImage} />
                </motion.div>
                <div>
                  <h3 className={styles.projectCardTitle}>{p.title}</h3>
                  <p className={styles.projectCardCategory}>{p.category} &middot; Brand Identity &middot; Website</p>
                </div>
              </TransitionLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

        <TransitionLink to="/services" className={styles.ctaBlockPink}>
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
        </TransitionLink>
      </section>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </motion.div>
  );
}
