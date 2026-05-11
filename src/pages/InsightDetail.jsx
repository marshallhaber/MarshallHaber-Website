import { useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function InsightDetail() {
  const { slug } = useParams();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = "#fbf0f2";
    document.body.style.color = "#020817";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-6 md:px-12 pb-24 max-w-4xl mx-auto"
    >
      <Link to="/" className="text-sm font-bold mb-8 inline-block hover:opacity-70">← Back Home</Link>
      <h1 className="text-4xl md:text-6xl font-bold mb-8" style={{ fontFamily: "'PP Mori', sans-serif" }}>
        Insight Article
      </h1>
      <p className="text-lg leading-relaxed mb-6 font-medium">
        This is a placeholder for the <span className="font-bold">{slug}</span> article. The full content will be provided by the content team.
      </p>
      <p className="text-lg leading-relaxed font-medium">
        We craft our future with kindness to create brands that make people smile.
      </p>
    </motion.div>
  );
}
