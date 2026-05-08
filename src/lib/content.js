/**
 * Read a nested key path from a CMS sections object, falling back to a
 * default when the value is missing/null/empty. Lets every public component
 * pass a sane local default so the site renders correctly while the CMS
 * fetch is in flight or if MongoDB is unreachable.
 *
 *   getContent(sections, "hero.heading", "Premium Branding Agency")
 *   getContent(sections, "facts", defaults.home.about.facts)
 */
export function getContent(sections, path, fallback) {
  if (sections == null) return fallback;
  const segments = path.split(".");
  let cur = sections;
  for (const seg of segments) {
    if (cur == null) return fallback;
    cur = cur[seg];
  }
  if (cur == null || cur === "") return fallback;
  if (Array.isArray(cur) && cur.length === 0) return fallback;
  return cur;
}
