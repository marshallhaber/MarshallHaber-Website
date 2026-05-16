import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AdminPanel.module.css";
import { invalidatePageContent } from "../hooks/usePageContent";
import { defaults } from "../lib/contentDefaults";

const API = "http://localhost:5000/api/admin";
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
          { name: "featuredOnWork", label: "Feature on Work Page (Featured Tab)", type: "boolean" },
          { name: "featuredOnHome", label: "Feature on Home Page", type: "boolean" },
          { name: "subtitle", label: "Subtitle", type: "text" },
          { name: "client", label: "Client", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "services", label: "Services", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "imageUrl", label: "Project Image", type: "image" },
          { name: "videoUrl", label: "Project Video", type: "video" },
          { name: "description2", label: "Secondary Description", type: "textarea" },
          { name: "image2Url", label: "Secondary Image", type: "image" },
          { name: "video2Url", label: "Secondary Video", type: "video" },
          { name: "gallery", label: "Project Gallery (Multiple Images)", type: "gallery" },
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
          { name: "slug", label: "URL Slug", type: "text" },
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

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append(type, file);
    try {
      const res = await fetch(`${API}/upload-${type}`, { method: "POST", headers, body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch { }
    setUploading(false);
  }

  if (value) {
    return (
      <div className={styles.mediaThumb}>
        {type === "image" ? (
          <img src={value} alt="" />
        ) : (
          <video src={value} controls />
        )}
        <button type="button" className={styles.mediaRemove} onClick={() => onChange("")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dropzone} onClick={() => inputRef.current?.click()}>
      <input
        ref={inputRef}
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        className={styles.hiddenInput}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {uploading ? (
        <div className={styles.spinner} />
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

  const config = PAGE_CONFIG[activePage];

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

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
    loadPage(activePage);
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
            <h1>{config.label}</h1>
            <p>Edit content for the {config.label} page</p>
          </div>
          <button className={styles.publishBtn} onClick={handleSave} disabled={saving}>
            {saving ? (
              <><div className={styles.btnSpinner} />Saving...</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>Save Changes</>
            )}
          </button>
        </header>

        {loading ? (
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
