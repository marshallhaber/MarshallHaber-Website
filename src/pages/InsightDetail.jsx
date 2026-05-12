import { useLayoutEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

/**
 * Parse a simple markdown-like body string into renderable blocks.
 * Supports: ## headings, - bullet lists, blank-line paragraph separation.
 */
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

  // Fetch CMS articles
  const { sections: insightSections, loading: loadingInsights } = usePageContent("insights");
  // Also fetch home page card data (in case slugs differ)
  const { sections: homeSections, loading: loadingHome } = usePageContent("home");

  const loading = loadingInsights || loadingHome;

  // Get CMS articles; always merge with local defaults so articles always exist
  const cmsArticles = getContent(insightSections, "articles", null);
  const defaultArticles = defaults.insights.articles;

  let articles;
  if (cmsArticles && Array.isArray(cmsArticles) && cmsArticles.length > 0) {
    articles = cmsArticles;
  } else {
    articles = defaultArticles;
  }

  // Find article by slug
  let article = articles.find(a => a.slug === slug);

  // If not found in articles, check defaults
  if (!article) {
    article = defaultArticles.find(a => a.slug === slug);
  }

  // Last resort: build from home page insight cards
  if (!article) {
    const homeCards = getContent(homeSections, "insights.cards", defaults.home.insights.cards);
    const matchedCard = homeCards.find(c => c.slug === slug);
    if (matchedCard) {
      article = {
        title: matchedCard.desc || matchedCard.title?.replace(/\\n/g, ' ') || slug,
        slug,
        heroImage: "",
        body: "",
        images: [],
      };
    }
  }

  // Collect images from article (support both images array and image1-image5 fields)
  const images = useMemo(() => {
    if (!article) return [];
    // If images array exists and has items, use that
    if (article.images && Array.isArray(article.images) && article.images.length > 0) {
      return article.images.filter(Boolean);
    }
    // Otherwise collect image1..image5
    const imgs = [];
    for (let i = 1; i <= 5; i++) {
      const url = article[`image${i}`];
      if (url) imgs.push(url);
    }
    return imgs;
  }, [article]);

  // Parse body into blocks
  const bodyBlocks = useMemo(() => parseBody(article?.body || ''), [article]);

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
    return <div className="min-h-screen pt-32 px-6 flex items-center justify-center" style={{ backgroundColor: "#fbf0f2" }}>Loading...</div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center" style={{ backgroundColor: "#fbf0f2" }}>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'PP Mori', sans-serif" }}>Article Not Found</h1>
        <Link to="/" className="underline font-semibold mt-4">Return to Home</Link>
      </div>
    );
  }

  // Interleave images between heading sections
  // Strategy: place images after each heading section (group of heading + content)
  let imageIndex = 0;
  const renderBlocks = [];
  let sectionCount = 0;

  for (let i = 0; i < bodyBlocks.length; i++) {
    const block = bodyBlocks[i];

    // Before each heading (except the first), check if we should insert an image
    if (block.type === 'heading' && sectionCount > 0 && imageIndex < images.length) {
      renderBlocks.push({ type: 'image', url: images[imageIndex] });
      imageIndex++;
    }

    if (block.type === 'heading') sectionCount++;
    renderBlocks.push(block);
  }

  // Add remaining images at the end
  while (imageIndex < images.length) {
    renderBlocks.push({ type: 'image', url: images[imageIndex] });
    imageIndex++;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-6 md:px-12 pb-24 max-w-4xl mx-auto"
    >
      <Link to="/" className="text-sm font-bold mb-8 inline-block hover:opacity-70 tracking-widest uppercase">← Back</Link>
      
      <h1
        className="text-4xl md:text-6xl font-bold mb-12"
        style={{ fontFamily: "'PP Mori', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {article.title}
      </h1>

      {article.heroImage && (
        <img src={article.heroImage} alt="" className="w-full h-auto mb-16 rounded-[24px]" />
      )}

      {renderBlocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={idx}
                className="text-3xl md:text-[40px] font-bold mb-6 mt-16"
                style={{ fontFamily: "'PP Mori', sans-serif", letterSpacing: "-0.02em" }}
              >
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-lg md:text-[20px] leading-[1.7] mb-6"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {block.text}
              </p>
            );
          case 'list':
            return (
              <ul key={idx} className="list-disc pl-8 mb-8 space-y-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-lg md:text-[20px] leading-[1.7]"
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'image':
            return (
              <div key={idx} className="my-12">
                <img src={block.url} alt="" className="w-full h-auto rounded-[24px]" />
              </div>
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}
