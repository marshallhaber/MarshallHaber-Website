import { useState, useMemo, useLayoutEffect, useRef } from 'react';
import TransitionLink from '../components/ui/TransitionLink';
import { motion, AnimatePresence } from 'framer-motion';
import hardcodedProjects from '../data/projects';
import styles from './Work.module.css';
import { usePageContent } from '../hooks/usePageContent';
import { getContent } from '../lib/content';
import { defaults } from '../lib/contentDefaults';

export default function Work() {
  const [activeTab, setActiveTab] = useState('All projects');
  const [hoveredSlug, setHoveredSlug] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef(null);

  const [searchPlaceholder, setSearchPlaceholder] = useState("Find work by client, type");

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#fbf0f2";
    document.body.style.color = "#020817";

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSearchPlaceholder("Search work...");
      } else {
        setSearchPlaceholder("Find work by client, type");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { sections } = usePageContent("work");
  const tabs = getContent(sections, "tabs", defaults.work.tabs);
  const cmsRawProjects = getContent(sections, "projects", []);
  const cmsProjects = useMemo(
    () =>
      cmsRawProjects
        .filter(p => p.title)
        .map(p => ({
          slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
          title: p.title,
          subtitle: p.subtitle || '',
          category: p.category || 'Uncategorized',
          client: p.client || p.title,
          services: p.services || '',
          description: p.description || '',
          image: p.imageUrl || '',
          video: p.videoUrl || '',
          featuredOnWork: p.featuredOnWork === true || p.featuredOnWork === "true",
          sortOrder: parseInt(p.sortOrder, 10) || 999,
          fromCms: true,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [cmsRawProjects]
  );

  const allProjects = useMemo(() => {
    if (!searchQuery.trim()) return cmsProjects;
    const q = searchQuery.toLowerCase();
    return cmsProjects.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.services.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
    );
  }, [cmsProjects, searchQuery]);

  const industriesCount = useMemo(
    () => new Set(allProjects.map(p => p.category)).size,
    [allProjects]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    allProjects.forEach(p => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category).push(p);
    });
    return [...map.entries()];
  }, [allProjects]);

  const featuredProjects = useMemo(() => {
    const explicitlyFeatured = allProjects.filter(p => p.featuredOnWork);
    if (explicitlyFeatured.length > 0) {
      return explicitlyFeatured;
    }
    return allProjects.slice(0, 6);
  }, [allProjects]);

  const hoveredProject = hoveredSlug
    ? allProjects.find(p => p.slug === hoveredSlug)
    : null;

  const handleMouseMove = (e) => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width - 320));
    const y = Math.max(0, Math.min(e.clientY - rect.top - 110, rect.height - 200));
    setCursor({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={styles.pageWrapper}
    >
      {/* Tabs Header */}
      <section className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          <button
            className={styles.tabButton}
            aria-selected={activeTab === 'Featured'}
            onClick={() => { setActiveTab('Featured'); setHoveredSlug(null); }}
          >
            {tabs.featured}<span className={styles.tabCount}>{String(featuredProjects.length).padStart(2, '0')}</span>
            {activeTab === 'Featured' && <span className={styles.tabDot} />}
          </button>
          <button
            className={styles.tabButton}
            aria-selected={activeTab === 'All projects'}
            onClick={() => { setActiveTab('All projects'); setHoveredSlug(null); }}
          >
            {tabs.allProjects}<span className={styles.tabCount}>{String(allProjects.length).padStart(2, '0')}</span>
            {activeTab === 'All projects' && <span className={styles.tabDot} />}
          </button>
          <button
            className={styles.tabButton}
            aria-selected={activeTab === 'Industries'}
            onClick={() => { setActiveTab('Industries'); setHoveredSlug(null); }}
          >
            {tabs.industries}<span className={styles.tabCount}>{String(industriesCount).padStart(2, '0')}</span>
            {activeTab === 'Industries' && <span className={styles.tabDot} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={styles.mobileDropdown}>
          <div className={`${styles.tabButton} !opacity-100 flex items-start pointer-events-none`}>
            {tabs[activeTab === 'Featured' ? 'featured' : activeTab === 'All projects' ? 'allProjects' : 'industries']}
            <span className={styles.tabCount}>
              {activeTab === 'Featured' ? String(featuredProjects.length).padStart(2, '0') :
               activeTab === 'All projects' ? String(allProjects.length).padStart(2, '0') :
               String(industriesCount).padStart(2, '0')}
            </span>
            <div className="flex flex-col ml-4 mt-3 gap-[2px]">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#020817]" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#020817]" />
            </div>
          </div>
          <select 
            value={activeTab}
            onChange={(e) => { setActiveTab(e.target.value); setHoveredSlug(null); }}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer appearance-none"
          >
            <option value="Featured">Featured</option>
            <option value="All projects">All projects</option>
            <option value="Industries">Industries</option>
          </select>
        </div>
      </section>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search projects"
        />
        {searchQuery ? (
          <button className={styles.searchAction} onClick={() => setSearchQuery('')}>✕</button>
        ) : (
          <span className={styles.searchAction}>Search</span>
        )}
      </div>

      {/* Content */}
      {(activeTab === 'Featured' || activeTab === 'All projects') && (
        <section className={styles.workGrid}>
          {(activeTab === 'Featured' ? featuredProjects : allProjects).length === 0 ? (
            <div className="w-full text-center py-20 text-xl font-medium" style={{ fontFamily: "'PP Mori', sans-serif", color: "#020817" }}>
              Work Not Found By This Name
            </div>
          ) : (
          <motion.div className={styles.grid}>
            {(activeTab === 'Featured' ? featuredProjects : allProjects).map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              >
                <TransitionLink to={`/work/${project.slug}`} className={styles.card}>
                  <div className={styles.cardImage}>
                    {project.video ? (
                      <video
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={styles.cardMedia}
                      />
                    ) : project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={styles.cardMedia}
                      />
                    ) : (
                      <div className={styles.cardMedia} style={{ backgroundColor: '#e0e0e0', width: '100%', height: '100%' }} />
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{project.title} <span className={styles.cardDesc}>| {project.subtitle}</span></h2>
                    <p className={styles.cardSubtitle}>
                      {project.category}
                    </p>
                  </div>
                </TransitionLink>
              </motion.div>
            ))}
          </motion.div>
          )}
        </section>
      )}

      {activeTab === 'Industries' && (
        <div
          ref={listRef}
          className={styles.listWrap}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSlug(null)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {grouped.map(([category, items]) => (
              <div key={category} className={styles.group}>
                <h3 className={styles.groupHeading}>{category}</h3>
                <div className={styles.rowList}>
                  {items.map(p => (
                    <WorkRow
                      key={p.slug}
                      project={p}
                      rightCol={category}
                      onEnter={() => setHoveredSlug(p.slug)}
                      onLeave={() => setHoveredSlug(null)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                key="preview"
                className={styles.previewCard}
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: cursor.x,
                  y: cursor.y,
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.18 },
                  scale: { duration: 0.18 },
                  x: { type: 'spring', damping: 25, stiffness: 200 },
                  y: { type: 'spring', damping: 25, stiffness: 200 },
                }}
              >
                {hoveredProject.image ? (
                  <img src={hoveredProject.image} alt="" />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function WorkRow({ project, rightCol, onEnter, onLeave }) {
  return (
    <TransitionLink
      to={`/work/${project.slug}`}
      className={styles.row}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Desktop view */}
      <div className="hidden md:contents">
        <span className={styles.rowTitle}>{project.subtitle || project.title}</span>
        <span className={styles.rowClient}>{project.client}</span>
        <span className={styles.rowMeta}>{rightCol}</span>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden w-full justify-between items-center">
        <div className="flex flex-col gap-1 items-start text-left">
          <span className="text-[14px] font-medium opacity-65 font-sans leading-none">{project.client}</span>
          <span className="text-[20px] font-bold tracking-tight text-[#020817] leading-tight" style={{ fontFamily: "'Nib Pro', serif", fontStyle: "italic" }}>
            {project.subtitle || project.title}
          </span>
        </div>
        {project.image && (
          <div className="w-[120px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 ml-4 bg-black/5">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </TransitionLink>
  );
}
