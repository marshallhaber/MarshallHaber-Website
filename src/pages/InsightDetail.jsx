import { useState, useLayoutEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TransitionLink from '../components/ui/TransitionLink';
import ContactModal from '../components/ui/ContactModal';
import styles from './WorkDetail.module.css';
import mhcgLogo from '../assets/logo/logo.png';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

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
      flushParagraph();
      flushBullets();
      blocks.push({ type: 'heading', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('- ')) {
      flushParagraph();
      bulletBuffer.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flushBullets();
      flushParagraph();
    } else {
      flushBullets();
      currentParagraph.push(trimmed);
    }
  }
  flushBullets();
  flushParagraph();
  return blocks;
}

export default function InsightDetail() {
  const { slug } = useParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const { sections: insightSections, loading: loadingInsights } = usePageContent("insights");
  const { sections: homeSections, loading: loadingHome } = usePageContent("home");

  const loading = loadingInsights || loadingHome;

  const ctaInquiry = getContent(homeSections, "cta.left", defaults.home.cta.left);
  const ctaReview = getContent(homeSections, "cta.right", defaults.home.cta.right);

  const cmsArticles = getContent(insightSections, "articles", null);
  const defaultArticles = defaults.insights.articles;

  const articles = useMemo(() => {
    if (cmsArticles && Array.isArray(cmsArticles) && cmsArticles.length > 0) return cmsArticles;
    return defaultArticles;
  }, [cmsArticles, defaultArticles]);

  const article = useMemo(() => {
    let found = articles.find(a => a.slug === slug);
    if (!found) found = defaultArticles.find(a => a.slug === slug);
    if (!found) {
      const homeCards = getContent(homeSections, "insights.cards", defaults.home.insights.cards);
      const matchedCard = homeCards?.find(c => c.slug === slug);
      if (matchedCard) {
        found = {
          title: matchedCard.desc || matchedCard.title?.replace(/\\n/g, ' ') || slug,
          slug,
          heroImage: '',
          body: '',
          images: [],
        };
      }
    }
    return found;
  }, [articles, slug, homeSections, defaultArticles]);

  const images = useMemo(() => {
    if (!article) return [];
    if (article.images && Array.isArray(article.images) && article.images.length > 0) {
      return article.images.filter(Boolean);
    }
    const imgs = [];
    for (let i = 1; i <= 5; i++) {
      const url = article[`image${i}`];
      if (url) imgs.push(url);
    }
    return imgs;
  }, [article]);

  const bodyBlocks = useMemo(() => parseBody(article?.body || ''), [article]);

  const moreArticles = useMemo(
    () => articles.filter(a => a.slug !== slug).slice(0, 3),
    [articles, slug]
  );

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = "#fbf0f2";
    document.body.style.color = "#020817";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex items-center justify-center" style={{ backgroundColor: "#fbf0f2" }}>
        Loading...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center" style={{ backgroundColor: "#fbf0f2" }}>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'PP Mori', sans-serif" }}>Article Not Found</h1>
        <Link to="/" className="underline font-semibold mt-4">Return to Home</Link>
      </div>
    );
  }

  const galleryImages = images.filter(url => url !== article.heroImage);

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* MHCG Logo */}
      <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
        <img src={mhcgLogo} alt="MHCG" style={{ height: '36px', display: 'inline-block' }} />
      </div>

      <div className={styles.container}>
        {/* Back Button */}
        <TransitionLink to="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </TransitionLink>

        {/* Header */}
        <section className={styles.heroHeader}>
          {article.category && (
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {article.category}
            </motion.p>
          )}
          <motion.h1
            className={styles.projectTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {article.title}
          </motion.h1>
          {article.subtitle && (
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {article.subtitle}
            </motion.p>
          )}
        </section>

        {/* Body Text */}
        {bodyBlocks.length > 0 && (
          <motion.section
            className={styles.descriptionSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {bodyBlocks.map((block, idx) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={idx}
                      style={{
                        fontFamily: "'PP Mori', sans-serif",
                        fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        margin: '2.5rem 0 1rem',
                        color: '#020817',
                      }}
                    >
                      {renderInline(block.text)}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p key={idx} className={styles.description} style={{ marginBottom: '1.5rem' }}>
                      {renderInline(block.text)}
                    </p>
                  );
                case 'list':
                  return (
                    <ul
                      key={idx}
                      style={{
                        paddingLeft: '1.5rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      {block.items.map((item, j) => (
                        <li key={j} className={styles.description} style={{ marginBottom: 0 }}>
                          {renderInline(item)}
                        </li>
                      ))}
                    </ul>
                  );
                default:
                  return null;
              }
            })}
          </motion.section>
        )}

        {/* Hero Image */}
        {article.heroImage && (
          <motion.section
            className={styles.mainImageWrapper}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img src={article.heroImage} alt={article.title} className={styles.mainImage} />
          </motion.section>
        )}

        {/* Gallery Images */}
        {galleryImages.length > 0 && (
          <div className={styles.galleryVerticalStack}>
            {galleryImages.map((url, idx) => (
              <motion.section
                key={idx}
                className={styles.mainImageWrapper}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8 }}
              >
                <img src={url} alt={`${article.title} ${idx + 1}`} className={styles.mainImage} />
              </motion.section>
            ))}
          </div>
        )}
      </div>

      {/* More Articles */}
      {moreArticles.length > 0 && (
        <section className={styles.moreProjects}>
          <div className={styles.container} style={{ padding: 0 }}>
            <h2 className={styles.moreProjectsHeader}>More Insights</h2>
            <div className={styles.moreProjectsGrid}>
              {moreArticles.map((a, i) => (
                <TransitionLink to={`/insights/${a.slug}`} key={a.slug} className={styles.projectCard}>
                  <motion.div
                    className={styles.projectImageWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    style={{ backgroundColor: '#e8e6df' }}
                  >
                    {a.heroImage ? (
                      <img src={a.heroImage} alt={a.title} className={styles.projectImage} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#e8e6df' }} />
                    )}
                  </motion.div>
                  <div>
                    <h3 className={styles.projectCardTitle}>{a.title}</h3>
                    {a.category && (
                      <p className={styles.projectCardCategory}>{a.category}</p>
                    )}
                  </div>
                </TransitionLink>
              ))}
            </div>
          </div>
        </section>
      )}

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
