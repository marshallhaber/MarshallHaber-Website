import { useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
import hardcodedProjects from '../data/projects';
import styles from './WorkDetail.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

// Render inline markdown: **bold**, *italic*, __bold__, _italic_
function renderInline(text) {
  const parts = [];
  const re = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
  let last = 0, match, key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={key++}>{match[2]}</strong>);
    else parts.push(<em key={key++}>{match[4]}</em>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function parseBody(body) {
  if (!body) return [];
  const lines = body.split('\n');
  const blocks = [];
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join('\n') });
      currentParagraph = [];
    }
  };
  let bulletBuffer = [];
  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({ type: 'list', items: [...bulletBuffer] });
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      flushParagraph(); flushBullets();
      blocks.push({ type: 'heading', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('- ')) {
      flushParagraph();
      bulletBuffer.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flushBullets(); flushParagraph();
    } else {
      flushBullets();
      currentParagraph.push(trimmed);
    }
  }
  flushBullets(); flushParagraph();
  return blocks;
}

export default function WorkDetail() {
  const { slug } = useParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const { sections } = usePageContent("workDetail");
  const { sections: workSections, loading: workLoading } = usePageContent("work");
  const moreProjectsHeading = getContent(sections, "moreProjectsHeading", defaults.workDetail.moreProjectsHeading);
  const { sections: homeSections } = usePageContent("home");
  const ctaInquiry = getContent(homeSections, "cta.left", defaults.home.cta.left);
  const ctaReview = getContent(homeSections, "cta.right", defaults.home.cta.right);

  const projects = useMemo(() => {
    const cms = (workSections?.projects || [])
      .filter((p) => p && p.title)
      .map((p) => ({
        slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
        title: p.title,
        subtitle: p.subtitle || '',
        category: p.category || 'Uncategorized',
        client: p.client || p.title,
        services: p.services || '',
        body: p.body || '',
        description: p.description || '',
        image: p.imageUrl || '',
        video: p.videoUrl || '',
        description2: p.description2 || '',
        image2: p.image2Url || '',
        video2: p.video2Url || '',
        gallery: p.gallery || [],
        fromCms: true,
      }));

    return cms;
  }, [workSections]);

  const project = projects.find((p) => p.slug === slug);
  const mutedVideoRef = useCallback(node => { if (node) node.muted = true; }, []);
  console.log('[Video URL]', project?.video);

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
        {/* Back Button */}
        <TransitionLink to="/work" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </TransitionLink>

        {/* Header */}
        <section className={styles.heroHeader}>
          {project.category && (
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {project.category}
            </motion.p>
          )}
          <motion.h1
            className={styles.projectTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {project.title}
          </motion.h1>
          {project.subtitle && project.subtitle.toLowerCase() !== (project.category || '').toLowerCase() && (
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

        {/* Rich Body Text (new) — falls back to description if body not set */}
        {(project.body || project.description) && (
          <motion.section
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {project.body ? (
              parseBody(project.body).map((block, idx) => {
                switch (block.type) {
                  case 'heading':
                    return (
                      <h2 key={idx} style={{
                        fontFamily: "'PP Mori', sans-serif",
                        fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        margin: '2.5rem 0 0.75rem',
                        color: '#020817',
                      }}>{renderInline(block.text)}</h2>
                    );
                  case 'paragraph':
                    return <p key={idx} className={styles.description} style={{ marginBottom: '1.25rem' }}>{renderInline(block.text)}</p>;
                  case 'list':
                    return (
                      <ul key={idx} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {block.items.map((item, j) => (
                          <li key={j} className={styles.description} style={{ marginBottom: 0 }}>{renderInline(item)}</li>
                        ))}
                      </ul>
                    );
                  default: return null;
                }
              })
            ) : (
              <p className={styles.description}>{project.description}</p>
            )}
          </motion.section>
        )}

        {/* Main Image or Video */}
        {(project.image || project.video) && (
          <motion.section
            className={styles.mainImageWrapper}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {project.video ? (
              <video
                ref={mutedVideoRef}
                src={project.video}
                autoPlay muted loop playsInline
                className={styles.mainImage}
                onError={(e) => console.log('[Video ERROR]', e.target.error?.code, e.target.error?.message)}
                onPlaying={() => console.log('[Video PLAYING]')}
              />
            ) : (
              <img src={project.image} alt={project.title} className={styles.mainImage} />
            )}
          </motion.section>
        )}

        {/* Secondary description (legacy) */}
        {project.description2 && (
          <motion.section
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className={styles.description}>{project.description2}</p>
          </motion.section>
        )}

        {project.image2 && (
          <motion.section
            className={styles.mainImageWrapper}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <img src={project.image2} alt={`${project.title} secondary`} className={styles.mainImage} />
          </motion.section>
        )}

        {project.video2 && (
          <motion.section
            className={styles.mainImageWrapper}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <video ref={mutedVideoRef} src={project.video2} autoPlay muted loop playsInline className={styles.mainImage} />
          </motion.section>
        )}

        {/* Gallery — multiple images stacked */}
        {project.gallery && project.gallery.length > 0 && (
          <div className={styles.galleryVerticalStack}>
            {project.gallery
              .filter((url) => url !== project.image && url !== project.image2)
              .map((url, idx) => (
                <motion.section
                  key={idx}
                  className={styles.mainImageWrapper}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8 }}
                >
                  <img src={url} alt={`${project.title} gallery ${idx + 1}`} className={styles.mainImage} />
                </motion.section>
              ))}
          </div>
        )}
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
                  {p.video ? (
                    <video
                      src={p.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={styles.projectImage}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <img src={p.image} alt={p.title} className={styles.projectImage} />
                  )}
                </motion.div>
                <div>
                  <h3 className={styles.projectCardTitle}>{p.title}</h3>
                  <p className={styles.projectCardCategory}>
                    {p.category} {p.services ? `\u00B7 ${p.services}` : '\u00B7 Brand Identity \u00B7 Website'}
                  </p>
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
            <strong>{ctaInquiry.topBold}</strong>
            <span>{ctaInquiry.topItalic}</span>
          </div>
          <h2 className={styles.ctaHeading}>{ctaInquiry.heading}</h2>
        </button>

        <TransitionLink to="/services" className={styles.ctaBlockPink}>
          <div className={styles.ctaTextTop}>
            <strong>{ctaReview.topBold}</strong>
            <span>{ctaReview.topItalic}</span>
          </div>
          <h2 className={styles.ctaHeading}>{ctaReview.heading}</h2>
        </TransitionLink>
      </section>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </motion.div>
  );
}
