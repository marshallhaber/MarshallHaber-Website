import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AdminPanel.module.css";
import { invalidatePageContent } from "../hooks/usePageContent";
import { defaults } from "../lib/contentDefaults";

const API = "/api/admin";
const KEY = "234583419264838";
const headers = { "x-admin-key": KEY };
const jsonHeaders = { "x-admin-key": KEY, "Content-Type": "application/json" };

const ICON = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  work: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>,
  about: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
  clients: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  services: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  contact: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  legal: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  global: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  workDetail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12h6M9 8h6M9 16h4" /></svg>,
  insights: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  comingSoon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  leads: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><circle cx="9" cy="15" r="1" /><path d="M9 11v2" /></svg>,
};

// ─── Page definitions: what sections each page has ───
const PAGE_CONFIG = {
  home: {
    label: "Home",
    icon: ICON.home,
    sections: [
      {
        key: "hero",
        title: "Hero Section",
        fields: [
          { name: "headingBold", label: "Heading (bold line)", type: "textarea" },
          { name: "headingItalic", label: "Heading (italic line)", type: "textarea" },
          { name: "videoUrl", label: "Hero Video", type: "video" },
        ],
      },
      {
        key: "about",
        title: "About Section",
        fields: [
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "buttonText", label: "Button Text", type: "text" },
          { name: "keyFactsLabel", label: "Key Facts Label", type: "text" },
        ],
      },
      {
        key: "about.facts",
        title: "About Key Facts",
        type: "list",
        fields: [
          { name: "value", label: "Value (e.g. 20+)", type: "text" },
          { name: "label", label: "Description", type: "textarea" },
        ],
      },
      {
        key: "works",
        title: "Works Heading",
        fields: [
          { name: "headingBold", label: "Heading (bold line)", type: "textarea" },
          { name: "headingItalic", label: "Heading (italic line)", type: "textarea" },
          { name: "ctaText", label: "Button Text", type: "text" },
        ],
      },
      {
        key: "insights",
        title: "Insights Heading",
        fields: [
          { name: "heading", label: "Heading", type: "textarea" },
          { name: "trendingButton", label: "Trending Pill Text", type: "text" },
        ],
      },
      {
        key: "insights.cards",
        title: "Insight Cards",
        type: "list",
        fields: [
          { name: "bg", label: "Background Color", type: "color" },
          { name: "brand", label: "Brand Name", type: "text" },
          { name: "label", label: "Italic Label", type: "text" },
          { name: "title", label: "Title (use \\n for line break)", type: "textarea" },
          { name: "titleLarge", label: "Title (single large)", type: "text" },
          { name: "desc", label: "Description (under card)", type: "textarea" },
          { name: "slug", label: "Article URL Slug", type: "text" },
        ],
      },
      {
        key: "servicePanels",
        title: "Service Stack Panels",
        type: "list",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "items", label: "Items (comma-separated)", type: "text" },
          { name: "bg", label: "Background Color", type: "color" },
          { name: "textColor", label: "Text Color (Tailwind class)", type: "text" },
        ],
      },
      {
        key: "cta.left",
        title: "CTA – Left Card",
        fields: [
          { name: "topBold", label: "Top Bold Text", type: "text" },
          { name: "topItalic", label: "Top Italic Text", type: "text" },
          { name: "heading", label: "Heading", type: "text" },
        ],
      },
      {
        key: "cta.right",
        title: "CTA – Right Card",
        fields: [
          { name: "topBold", label: "Top Bold Text", type: "text" },
          { name: "topItalic", label: "Top Italic Text", type: "textarea" },
          { name: "heading", label: "Heading", type: "text" },
        ],
      },
    ],
  },
  work: {
    label: "Work",
    icon: ICON.work,
    sections: [
      {
        key: "tabs",
        title: "Tab Labels",
        fields: [
          { name: "featured", label: "Featured Tab", type: "text" },
          { name: "allProjects", label: "All Projects Tab", type: "text" },
          { name: "industries", label: "Industries Tab", type: "text" },
        ],
      },
      {
        key: "projects",
        title: "Projects",
        type: "list",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "slug", label: "URL Slug", type: "text" },
          { name: "sortOrder", label: "Sort Order on Work Page (lower = first)", type: "numbering" },
          { name: "homeSortOrder", label: "Sort Order on Home Page (lower = first)", type: "numbering" },
          { name: "moreProjectsOrder", label: "Sort Order in 'More Projects' Strip (lower = first; leave blank to hide)", type: "numbering" },
          { name: "featuredOnWork", label: "Feature on Work Page (Featured Tab)", type: "boolean" },
          { name: "featuredOnHome", label: "Feature on Home Page", type: "boolean" },
          { name: "subtitle", label: "Subtitle", type: "text" },
          { name: "client", label: "Client", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "services", label: "Services", type: "text" },
          { name: "description", label: "Short Description (legacy)", type: "textarea" },
          { name: "body", label: "Article Body (## Heading  ·  - Bullet  ·  blank line = paragraph)", type: "textarea" },
          { name: "imageUrl", label: "Project Image", type: "image", description: "Used in 2 places: (1) Work grid card thumbnail — 16:9 aspect ratio. (2) Internal work page hero — min 650px tall. Recommended size: 1600×900px. Use a landscape photo for best results across both views." },
          { name: "videoUrl", label: "Project Video", type: "video", description: "Replaces the hero image on the internal work page. Also used as the card thumbnail on the Work grid. Recommended: 1920×1080 MP4, landscape, under 20MB." },
          { name: "description2", label: "Secondary Description (legacy)", type: "textarea" },
          { name: "image2Url", label: "Secondary Image", type: "image", description: "Second full-width image shown below the body text. Same dimensions as Project Image — 1600×900px (16:9) recommended." },
          { name: "video2Url", label: "Secondary Video", type: "video", description: "Second full-width video. Recommended: 1920×1080 MP4, landscape. Displayed at the same size as the secondary image." },
          { name: "gallery", label: "Project Gallery (Multiple Images)", type: "gallery", description: "Stacked full-width images below the main content. Recommended: 1600×1000px (16:10 aspect ratio) per image. Portrait or square crops also work — images scale to fill the full width." },
        ],
      },
    ],
  },
  workDetail: {
    label: "Work Detail (Template)",
    icon: ICON.workDetail,
    sections: [
      {
        key: "info",
        title: "Info Block Labels",
        fields: [
          { name: "clientLabel", label: "Client Label", type: "text" },
          { name: "industryLabel", label: "Industry Label", type: "text" },
          { name: "servicesLabel", label: "Services Label", type: "text" },
          { name: "servicesValue", label: "Services Value", type: "text" },
        ],
      },
    ],
  },
  about: {
    label: "About",
    icon: ICON.about,
    sections: [
      {
        key: "hero",
        title: "Hero (Est. + Tagline)",
        fields: [
          { name: "estHeading", label: "Heading (e.g. Est. 2005)", type: "text" },
          { name: "taglineBold", label: "Tagline Bold Line", type: "text" },
          { name: "taglineItalic", label: "Tagline Italic Line", type: "text" },
        ],
      },
      {
        key: "paragraphs",
        title: "Body Paragraphs",
        type: "list",
        fields: [
          { name: "text", label: "Paragraph", type: "textarea" },
        ],
      },
    ],
  },
  clients: {
    label: "Clients",
    icon: ICON.clients,
    sections: [
      {
        key: "hero",
        title: "Hero Section",
        fields: [
          { name: "label", label: "Eyebrow Label", type: "text" },
          { name: "heading", label: "Heading (use \\n for line break)", type: "textarea" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        key: "grid",
        title: "Grid Heading",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "subtext", label: "Subtext", type: "textarea" },
        ],
      },
      {
        key: "list",
        title: "Client List",
        type: "list",
        fields: [
          { name: "name", label: "Client Name", type: "text" },
          { name: "category", label: "Category", type: "text" },
          {
            name: "logo",
            label: "Logo Image",
            type: "image",
            description: "Recommended: Transparent SVG or horizontal PNG (e.g. 300x100px) with dark/transparent bg."
          },
          {
            name: "logoSize",
            label: "Logo Size (%)",
            type: "number",
            min: 10,
            max: 300,
            step: 5,
            description: "Click + or - to scale this logo dynamically on the website (Default is 100%)."
          },
          {
            name: "showOnHome",
            label: "Show on Homepage",
            type: "boolean",
            description: "Feature this client logo in the home page clients section."
          },
          {
            name: "homeSortOrder",
            label: "Home Page Order (lower = first)",
            type: "numbering",
            description: "Controls the display order of this logo on the home page. Leave blank to use default order."
          },
        ],
      },
      {
        key: "cta",
        title: "CTA",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "buttonText", label: "Button Text", type: "text" },
        ],
      },
    ],
  },
  services: {
    label: "Services",
    icon: ICON.services,
    sections: [
      {
        key: "hero",
        title: "Hero Section",
        fields: [
          { name: "heading", label: "Heading", type: "textarea" },
        ],
      },
      {
        key: "servicePanels",
        title: "Service Stack Panels",
        type: "list",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "items", label: "Items (comma-separated)", type: "text" },
          { name: "bg", label: "Background Color", type: "color" },
          { name: "textColor", label: "Text Color (Tailwind class)", type: "text" },
          { name: "videoUrl", label: "Overlay Video (mp4)", type: "video" },
          { name: "imageUrl", label: "Overlay Image (fallback)", type: "image" },
          { name: "mediaTitle", label: "Card Title (e.g. Imagination beyond limits)", type: "textarea" },
          { name: "mediaLabel", label: "Card Label (e.g. strategy.mp4)", type: "text" },
          { name: "hideImage", label: "Hide Image / Video Panel", type: "boolean", description: "Turn off the right-side image/video block for this service panel." },
          { name: "featureOnHome", label: "Feature on Homepage", type: "boolean" },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    icon: ICON.contact,
    sections: [
      {
        key: "hero",
        title: "Hero Section",
        fields: [
          { name: "label", label: "Eyebrow Label", type: "text" },
          { name: "title", label: "Title (use \\n for line break)", type: "textarea" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        key: "info.location",
        title: "Info – Visit Us",
        fields: [
          { name: "title", label: "Card Title", type: "text" },
          { name: "addressLine1", label: "Address Line 1", type: "text" },
          { name: "addressLine2", label: "Address Line 2", type: "text" },
          { name: "regions", label: "Regions Caption", type: "text" },
        ],
      },
      {
        key: "info.phone",
        title: "Info – Call Us",
        fields: [
          { name: "title", label: "Card Title", type: "text" },
          { name: "number", label: "Phone Number", type: "text" },
          { name: "hours", label: "Hours", type: "text" },
        ],
      },
      {
        key: "info.email",
        title: "Info – Email Us",
        fields: [
          { name: "title", label: "Card Title", type: "text" },
          { name: "address", label: "Email Address", type: "text" },
          { name: "response", label: "Response Caption", type: "text" },
        ],
      },
      {
        key: "form",
        title: "Form Copy",
        fields: [
          { name: "label", label: "Eyebrow Label", type: "text" },
          { name: "title", label: "Title (use \\n for line break)", type: "textarea" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
          { name: "nameLabel", label: "Name Field Label", type: "text" },
          { name: "namePlaceholder", label: "Name Placeholder", type: "text" },
          { name: "emailLabel", label: "Email Field Label", type: "text" },
          { name: "emailPlaceholder", label: "Email Placeholder", type: "text" },
          { name: "companyLabel", label: "Company Field Label", type: "text" },
          { name: "companyPlaceholder", label: "Company Placeholder", type: "text" },
          { name: "messageLabel", label: "Message Field Label", type: "text" },
          { name: "messagePlaceholder", label: "Message Placeholder", type: "text" },
          { name: "checkboxLabel", label: "Checkbox Label", type: "textarea" },
          { name: "submitText", label: "Submit Button", type: "text" },
          { name: "successTitle", label: "Success Title", type: "text" },
          { name: "successMessage", label: "Success Message", type: "textarea" },
        ],
      },
    ],
  },
  legal: {
    label: "Legal",
    icon: ICON.legal,
    sections: [
      {
        key: "hero",
        title: "Hero",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "lastUpdated", label: "Last Updated Caption", type: "text" },
        ],
      },
      {
        key: "sections",
        title: "Legal Blocks",
        type: "list",
        fields: [
          { name: "heading", label: "Block Heading", type: "text" },
          { name: "content", label: "Content (use \\n for line break)", type: "textarea" },
          { name: "email", label: "Email (optional)", type: "text" },
        ],
      },
    ],
  },
  comingSoon: {
    label: "Coming Soon",
    icon: ICON.comingSoon,
    sections: [
      {
        key: "page",
        title: "Coming Soon Copy",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
          { name: "cta", label: "CTA Button Text", type: "text" },
        ],
      },
    ],
  },
  insights: {
    label: "Insights",
    icon: ICON.insights,
    sections: [
      {
        key: "articles",
        title: "Articles",
        type: "list",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "subtitle", label: "Subtitle (italic line under title)", type: "text" },
          { name: "slug", label: "URL Slug", type: "text" },
          { name: "tag", label: "Card Tag (e.g. SERIOUS.BUSINESS)", type: "text" },
          { name: "desc", label: "Card Description/Subtitle", type: "textarea" },
          { name: "bgColor", label: "Card Background Color", type: "color" },
          { name: "textColor", label: "Card Text Color", type: "color" },
          { name: "heroImage", label: "Hero Image", type: "image" },
          { name: "body", label: "Article Body (use ## for headings, - for bullet points, blank lines for paragraphs)", type: "textarea" },
          { name: "image1", label: "Image 1 (placed after first section)", type: "image" },
          { name: "image2", label: "Image 2 (placed after second section)", type: "image" },
          { name: "image3", label: "Image 3 (placed after third section)", type: "image" },
          { name: "image4", label: "Image 4", type: "image" },
          { name: "image5", label: "Image 5", type: "image" },
        ],
      },
    ],
  },
  global: {
    label: "Global (Nav + Footer)",
    icon: ICON.global,
    sections: [
      {
        key: "nav",
        title: "Navigation",
        fields: [
          { name: "menuButton", label: "Menu Pill Label", type: "text" },
          { name: "contactButton", label: "Contact Button Label", type: "text" },
          { name: "sayHelloLabel", label: "Mobile · Say Hello Label", type: "text" },
          { name: "sayHelloEmail", label: "Mobile · Say Hello Email", type: "text" },
          { name: "talentLabel", label: "Mobile · Talent Label", type: "text" },
          { name: "talentEmail", label: "Mobile · Talent Email", type: "text" },
        ],
      },
      {
        key: "nav.menu",
        title: "Nav Menu Items",
        type: "list",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link URL", type: "text" },
        ],
      },
      {
        key: "footer",
        title: "Footer",
        fields: [
          { name: "exploreLabel", label: "Explore Label", type: "text" },
          { name: "stalkUsLabel", label: "Social Label", type: "text" },
          { name: "sayHelloLabel", label: "Say Hello Label", type: "text" },
          { name: "sayHelloEmail", label: "Say Hello Email", type: "text" },
          { name: "callUsLabel", label: "Call Us Label", type: "text" },
          { name: "callUsPhone", label: "Phone", type: "text" },
          { name: "copyright", label: "Copyright", type: "text" },
          { name: "legalLink", label: "Legal Link Text", type: "text" },
          { name: "address", label: "Address", type: "textarea" },
        ],
      },
      {
        key: "footer.exploreLinks",
        title: "Footer · Explore Links",
        type: "list",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "URL", type: "text" },
        ],
      },
      {
        key: "footer.stalkUsLinks",
        title: "Footer · Social Links",
        type: "list",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "URL", type: "text" },
        ],
      },
    ],
  },
};

// ─── Reusable media uploader ───
function MediaUploader({ type, value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append(type, file);
    try {
      const res = await fetch(`${API}/upload-${type}`, { method: "POST", headers, body: fd });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "Upload failed — no URL returned.");
      }
    } catch (err) {
      setUploadError(err.message || "Upload failed. Check your connection and try again.");
    }
    setUploading(false);
  }

  if (value) {
    return (
      <div className={styles.mediaThumb}>
        {type === "image" ? (
          <img src={value} alt="" />
        ) : (
          <video src={value} controls autoPlay muted loop playsInline />
        )}
        <button type="button" className={styles.mediaRemove} onClick={() => onChange("")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.dropzone} onClick={() => inputRef.current?.click()}>
        <input
          ref={inputRef}
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          className={styles.hiddenInput}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <>
            <div className={styles.spinner} />
            <span style={{ marginTop: "0.5rem", fontSize: "0.78rem", opacity: 0.6 }}>Uploading{type === "video" ? " (may take ~30s for video)" : ""}…</span>
          </>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.dropzoneIcon}>
              {type === "image" ? (
                <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>
              ) : (
                <polygon points="5 3 19 12 5 21 5 3" />
              )}
            </svg>
            <span>Click to upload {type}</span>
          </>
        )}
      </div>

      {/* Google Drive URL option for video */}
      {type === "video" && (
        <div style={{ marginTop: "0.6rem" }}>
          <button
            type="button"
            onClick={() => setShowUrlInput(v => !v)}
            style={{ fontSize: "0.78rem", color: "#60a5fa", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            {showUrlInput ? "Hide" : "Or use a Google Drive link"}
          </button>

          {showUrlInput && (
            <div style={{ marginTop: "0.5rem", background: "#1a1a2e", borderRadius: "10px", padding: "0.9rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.6rem", lineHeight: 1.6 }}>
                <strong style={{ color: "#e2e8f0" }}>Google Drive:</strong> Open the file → Share → set to <em>"Anyone with the link"</em> → copy and paste the link below. It will be automatically converted.
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Paste Google Drive share link…"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  style={{ flex: 1, background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", padding: "0.45rem 0.7rem", fontSize: "0.78rem", color: "#e2e8f0", outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const raw = urlInput.trim();
                    if (!raw) return;
                    let fileId = null;
                    // Format: drive.google.com/file/d/FILE_ID/...
                    const matchPath = raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    if (matchPath) fileId = matchPath[1];
                    // Format: drive.google.com/uc?...id=FILE_ID or ?id=FILE_ID&...
                    if (!fileId) {
                      const matchQuery = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                      if (matchQuery) fileId = matchQuery[1];
                    }
                    const driveUrl = fileId
                      ? `https://drive.usercontent.google.com/download?id=${fileId}`
                      : raw;
                    const finalUrl = `/api/admin/proxy-video?url=${encodeURIComponent(driveUrl)}`;
                    onChange(finalUrl);
                    setUrlInput("");
                    setShowUrlInput(false);
                  }}
                  style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", padding: "0.45rem 0.9rem", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Use Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p style={{ marginTop: "0.4rem", fontSize: "0.78rem", color: "#e53e3e" }}>
          ⚠ {uploadError}
        </p>
      )}
    </div>
  );
}

// ─── Single field renderer ───
function FieldInput({ field, value, onChange }) {
  if (field.type === "image" || field.type === "video") {
    return <MediaUploader type={field.type} value={value || ""} onChange={onChange} />;
  }
  if (field.type === "color") {
    return (
      <div className={styles.colorRow}>
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className={styles.colorPicker} />
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={styles.input} placeholder="#000000" />
      </div>
    );
  }
  if (field.type === "numbering") {
    return (
      <input
        className={styles.input}
        type="number"
        value={value !== undefined && value !== null ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
      />
    );
  }
  if (field.type === "number") {
    const numVal = parseInt(value, 10) || 100;
    const min = field.min !== undefined ? field.min : 10;
    const max = field.max !== undefined ? field.max : 300;
    const step = field.step !== undefined ? field.step : 5;
    return (
      <div className={styles.numberControlRow}>
        <button
          type="button"
          className={styles.numBtn}
          disabled={numVal <= min}
          onClick={() => onChange((Math.max(min, numVal - step)).toString())}
        >
          -
        </button>
        <span className={styles.numVal}>{numVal}%</span>
        <button
          type="button"
          className={styles.numBtn}
          disabled={numVal >= max}
          onClick={() => onChange((Math.min(max, numVal + step)).toString())}
        >
          +
        </button>
      </div>
    );
  }
  if (field.type === "gallery") {
    const images = Array.isArray(value) ? value : (value ? [value] : []);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = async (files) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      const newUrls = [];
      try {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
          const formData = new FormData();
          formData.append("image", file);
          
          const res = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: { "x-admin-key": KEY },
            body: formData,
          });
          
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          if (data.url) {
            newUrls.push(data.url);
          }
        }
        if (newUrls.length > 0) {
          onChange([...images, ...newUrls]);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload one or more images. Please try again.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    const handleRemoveImage = (indexToRemove) => {
      onChange(images.filter((_, idx) => idx !== indexToRemove));
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };

    return (
      <div className={styles.galleryFieldContainer}>
        {images.length > 0 && (
          <div className={styles.galleryPreviewGrid}>
            {images.map((url, idx) => (
              <div key={idx} className={styles.galleryPreviewItem}>
                <img src={url} alt={`Gallery ${idx + 1}`} className={styles.galleryPreviewImg} />
                <button
                  type="button"
                  className={styles.galleryPreviewRemove}
                  onClick={() => handleRemoveImage(idx)}
                  title="Remove Image"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div 
          className={`${styles.galleryDropZone} ${dragActive ? styles.galleryDropZoneActive : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />
          
          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.gallerySpinner} />
              <p>Uploading files...</p>
            </div>
          ) : (
            <div className={styles.dropZoneContent}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "8px", opacity: 0.5 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p><strong>Click to upload</strong> or drag and drop</p>
              <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "4px" }}>Images only (Multiple allowed)</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (field.type === "boolean") {
    return (
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={value === true || value === "true"}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.checkbox}
        />
        <span className={styles.checkboxLabel}>{field.description || "Enable"}</span>
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        className={styles.textarea}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
        rows={3}
      />
    );
  }
  return (
    <input
      className={styles.input}
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
    />
  );
}

// ─── Section editor (single object) ───
function SectionEditor({ section, data, onChange }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{section.title}</h3>
      <div className={styles.fieldGrid}>
        {section.fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label className={styles.label}>{field.label}</label>
            <FieldInput
              field={field}
              value={data?.[field.name]}
              onChange={(val) => onChange({ ...data, [field.name]: val })}
            />
            {field.description && (
              <span className={styles.fieldDescription}>{field.description}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── List section editor (array of objects) ───
function ListSectionEditor({ section, data, onChange }) {
  const items = Array.isArray(data) ? data : [];

  function updateItem(index, field, value) {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(updated);
  }

  function addItem() {
    const blank = {};
    section.fields.forEach((f) => { blank[f.name] = ""; });
    onChange([...items, blank]);
  }

  function removeItem(index) {
    if (!window.confirm("Delete this item?")) return;
    const updated = [...items];
    updated.splice(index, 1);
    onChange(updated);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{section.title}</h3>
        <span className={styles.countBadge}>{items.length}</span>
      </div>
      <div className={styles.listItems}>
        {items.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listIndex}>{i + 1}</span>
              <span className={styles.listItemTitle}>{item.title || item.name || item.value || `Item ${i + 1}`}</span>
              <button type="button" className={styles.removeBtn} onClick={() => removeItem(i)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
            <div className={styles.fieldGrid}>
              {section.fields.map((field) => (
                <div key={field.name} className={styles.field}>
                  <label className={styles.label}>{field.label}</label>
                  <FieldInput
                    field={field}
                    value={item[field.name]}
                    onChange={(val) => updateItem(i, field.name, val)}
                  />
                  {field.description && (
                    <span className={styles.fieldDescription}>{field.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={addItem}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        Add {section.title.replace(/s$/, "")}
      </button>
    </div>
  );
}

// ─── Fallback data when API is unavailable ───
const FALLBACK_DATA = defaults;

// Utilities for reading/writing nested keys like "cta.left" inside the
// section dictionary, so a single PAGE_CONFIG section can address a deep
// slot in the published JSON shape consumed by public components.
function getNested(obj, path) {
  if (!obj) return undefined;
  return path.split(".").reduce((cur, k) => (cur == null ? cur : cur[k]), obj);
}
function setNested(obj, path, value) {
  const segments = path.split(".");
  const next = { ...(obj || {}) };
  let cur = next;
  for (let i = 0; i < segments.length - 1; i++) {
    const k = segments[i];
    cur[k] = { ...(cur[k] || {}) };
    cur = cur[k];
  }
  cur[segments[segments.length - 1]] = value;
  return next;
}

// ─── Main Admin Panel ───
export default function AdminPanel() {
  const [activePage, setActivePage] = useState("home");
  const [pageData, setPageData] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState(null);
  const importInputRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  async function loadLeads() {
    setLoadingLeads(true);
    try {
      const res = await fetch(`${API}/contact`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      showToast("Failed to load submissions", "error");
    }
    setLoadingLeads(false);
  }

  async function handleDeleteLead(id) {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await fetch(`${API}/contact/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s._id !== id));
        showToast("Submission deleted");
      }
    } catch (err) {
      showToast("Delete failed", "error");
    }
  }

  async function handleExport() {
    try {
      const res = await fetch(`${API}/pages`, { headers });
      if (!res.ok) throw new Error("Failed to fetch pages");
      const pages = await res.json();
      const blob = new Blob([JSON.stringify({ pages }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `marshall-cms-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Export downloaded!");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleImport(file) {
    try {
      const text = await file.text();
      const { pages } = JSON.parse(text);
      if (!Array.isArray(pages)) throw new Error("Invalid export file — missing pages array");
      const res = await fetch(`${API}/import`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ pages: pages.map(p => ({ page: p.page, sections: p.sections })) }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Imported ${data.imported} pages successfully!`);
      } else {
        showToast(data.error || "Import failed", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
    if (importInputRef.current) importInputRef.current.value = "";
  }

  async function handleMigrateLogos() {
    if (!window.confirm("This will scan all pages, download every external image URL, and re-upload them to your ImageKit account. Proceed?")) return;
    setMigrating(true);
    setMigrateResult(null);
    try {
      const res = await fetch(`${API}/migrate-logos`, { method: "POST", headers: jsonHeaders });
      const data = await res.json();
      setMigrateResult(data);
      if (data.success) showToast(`Migration done — ${data.succeeded}/${data.scanned} images re-hosted`);
      else showToast(data.error || "Migration failed", "error");
    } catch (err) {
      showToast(err.message, "error");
    }
    setMigrating(false);
  }

  const config = PAGE_CONFIG[activePage] || { label: "Form Entries", sections: [] };

  async function loadPage(page) {
    setLoading(true);
    try {
      const res = await fetch(`${API}/pages/${page}`);
      const data = await res.json();
      const sections = data.sections || {};
      
      // Deep merge with fallback data so existing content is visible where DB is empty
      const merged = JSON.parse(JSON.stringify(FALLBACK_DATA[page] || {}));
      
      Object.keys(sections).forEach(key => {
        const value = sections[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          merged[key] = { ...(merged[key] || {}), ...value };
        } else if (Array.isArray(value) && value.length > 0) {
          merged[key] = value;
        } else if (value !== undefined && value !== null) {
          merged[key] = value;
        }
      });

      setPageData(merged);
    } catch {
      // API down — show fallback data so user can still see/edit
      setPageData(FALLBACK_DATA[page] || {});
    }
    setLoading(false);
  }

  useEffect(() => {
    if (activePage !== "leads") {
      loadPage(activePage);
    }
  }, [activePage]);

  function updateSection(sectionKey, value) {
    setPageData((prev) => setNested(prev, sectionKey, value));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/pages/${activePage}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify({ sections: pageData }),
      });
      const data = await res.json();
      if (data.page) {
        invalidatePageContent(activePage);
        showToast(`${config.label} page saved!`);
      } else {
        showToast(data.error || "Save failed", "error");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
    setSaving(false);
  }

  return (
    <div className={styles.layout}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>M</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Marshall</span>
            <span className={styles.brandSub}>Content Manager</span>
          </div>
        </div>

        <div className={styles.navLabel}>Pages</div>
        <nav className={styles.nav}>
          {Object.entries(PAGE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              className={`${styles.navItem} ${activePage === key ? styles.active : ""}`}
              onClick={() => setActivePage(key)}
            >
              {cfg.icon}
              <span>{cfg.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.navLabel} style={{ marginTop: "1.5rem" }}>Submissions</div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activePage === "leads" ? styles.active : ""}`}
            onClick={() => setActivePage("leads")}
          >
            {ICON.leads}
            <span>Form Entries</span>
          </button>
        </nav>

        <div className={styles.navLabel} style={{ marginTop: "1.5rem" }}>Tools</div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activePage === "migration" ? styles.active : ""}`}
            onClick={() => setActivePage("migration")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Migration Tools</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.dot} />
          <span>API Connected</span>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className={styles.main}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
        )}

        <header className={styles.header}>
          <div>
            <h1>{activePage === "leads" ? "Form Entries" : activePage === "migration" ? "Migration Tools" : config.label}</h1>
            <p>
              {activePage === "leads"
                ? "View and manage incoming contact form submissions"
                : activePage === "migration"
                ? "Export, import, and migrate content between deployments"
                : `Edit content for the ${config.label} page`}
            </p>
          </div>
          {activePage === "leads" ? (
            <button className={styles.publishBtn} onClick={loadLeads} disabled={loadingLeads}>
              Refresh Entries
            </button>
          ) : activePage === "migration" ? null : (
            <button className={styles.publishBtn} onClick={handleSave} disabled={saving}>
              {saving ? (
                <><div className={styles.btnSpinner} />Saving...</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>Save Changes</>
              )}
            </button>
          )}
        </header>

        {activePage === "migration" ? (
          <div className={styles.sections} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Export */}
            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.75rem" }}>
              <h3 style={{ margin: "0 0 0.5rem", color: "#fff", fontSize: "1.1rem" }}>Export All Data</h3>
              <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Download every page's content as a single JSON file. Use this to back up your CMS or transfer data to a new deployment.
              </p>
              <button
                onClick={handleExport}
                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download JSON Export
              </button>
            </div>

            {/* Import */}
            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.75rem" }}>
              <h3 style={{ margin: "0 0 0.5rem", color: "#fff", fontSize: "1.1rem" }}>Import Data</h3>
              <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Upload a JSON file exported from another deployment to restore all page content. This will overwrite existing data.
              </p>
              <input
                ref={importInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) handleImport(e.target.files[0]); }}
              />
              <button
                onClick={() => importInputRef.current?.click()}
                style={{ background: "#059669", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload & Import JSON
              </button>
            </div>

            {/* Migrate Logos */}
            <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.75rem" }}>
              <h3 style={{ margin: "0 0 0.5rem", color: "#fff", fontSize: "1.1rem" }}>Migrate Logos to ImageKit</h3>
              <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Scan all pages for external image URLs (e.g. WordPress logos), download them, and re-upload to this deployment's ImageKit account. URLs in the database are updated automatically. Run this after importing data into a new deployment to fix broken logos.
              </p>
              <button
                onClick={handleMigrateLogos}
                disabled={migrating}
                style={{ background: migrating ? "#475569" : "#7c3aed", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: "10px", cursor: migrating ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                {migrating ? (
                  <><div className={styles.btnSpinner} />Migrating...</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>Re-host All Images</>
                )}
              </button>
              {migrateResult && (
                <div style={{ marginTop: "1.25rem", background: "#0f172a", borderRadius: "10px", padding: "1rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
                  <div><strong style={{ color: "#4ade80" }}>Scanned:</strong> {migrateResult.scanned} external image URLs</div>
                  <div><strong style={{ color: "#4ade80" }}>Re-hosted:</strong> {migrateResult.succeeded} succeeded</div>
                  {migrateResult.failed > 0 && <div><strong style={{ color: "#f87171" }}>Failed:</strong> {migrateResult.failed} (dead links — upload manually)</div>}
                  <div><strong style={{ color: "#4ade80" }}>Pages updated:</strong> {migrateResult.updatedPages}</div>
                  {migrateResult.failed > 0 && (
                    <details style={{ marginTop: "0.75rem" }}>
                      <summary style={{ cursor: "pointer", color: "#f87171" }}>Failed URLs</summary>
                      <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.25rem", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>
                        {Object.entries(migrateResult.mapping).filter(([,v]) => !v).map(([url]) => (
                          <li key={url} style={{ wordBreak: "break-all" }}>{url}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activePage === "leads" ? (
          loadingLeads ? (
            <div className={styles.loadingState}><div className={styles.spinner} /></div>
          ) : (
            <div className={styles.sections} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {submissions.length === 0 ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
                  No lead entries submitted yet.
                </div>
              ) : (
                submissions.map((lead) => (
                  <div key={lead._id} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' }}>{lead.name}</h3>
                        <p style={{ margin: '0.25rem 0 0', opacity: 0.8, fontSize: '0.9rem' }}>
                          <a href={`mailto:${lead.email}`} style={{ color: '#60a5fa', textDecoration: 'underline' }}>{lead.email}</a>
                          {lead.phone && `  •  ${lead.phone}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                          {new Date(lead.createdAt).toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteLead(lead._id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {lead.services && lead.services.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {lead.services.map(s => (
                          <span key={s} style={{ background: '#0f172a', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', border: '1px solid #38bdf8' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {lead.message && (
                      <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: '1.5', opacity: 0.9 }}>
                        {lead.message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )
        ) : loading ? (
          <div className={styles.loadingState}><div className={styles.spinner} /></div>
        ) : (
          <div className={styles.sections}>
            {config.sections.map((section) =>
              section.type === "list" ? (
                <ListSectionEditor
                  key={section.key}
                  section={section}
                  data={getNested(pageData, section.key)}
                  onChange={(val) => updateSection(section.key, val)}
                />
              ) : (
                <SectionEditor
                  key={section.key}
                  section={section}
                  data={getNested(pageData, section.key)}
                  onChange={(val) => updateSection(section.key, val)}
                />
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
