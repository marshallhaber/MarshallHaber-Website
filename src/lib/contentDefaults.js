/**
 * Source-of-truth copy for the public site. Every paragraph, heading,
 * label, and button across every page lives here and acts as the
 * fallback for the CMS — components read from MongoDB via
 * usePageContent(page) and fall back to these defaults if a value is
 * missing or the fetch hasn't resolved yet.
 *
 * Keep this file pure data. Do not import it from server-side code; the
 * seed script duplicates the shape it needs.
 */
export const defaults = {
  // ─────────────── HOME ───────────────
  home: {
    hero: {
      headingBold: "Premium Branding Agency",
      headingItalic: "for B2B Tech Scaleups",
      videoUrl: "",
    },
    about: {
      heading: "Strategic branding,\ndigital & production\nbuilt for companies in motion.",
      buttonText: "About us",
      keyFactsLabel: "Key Facts",
      facts: [
        { value: "20+", label: "years building brands, platforms, and experiences that actually ship" },
        { value: "$100M+", label: "in projects, developments, and ventures supported through our work" },
        { value: "3 markets", label: "New York • Toronto • Florida — operating across borders and industries" },
        { value: "0 layers", label: "you work directly with senior leadership — always" },
        { value: "Weeks,\nnot months", label: "from strategy to execution" },
      ],
    },
    works: {
      headingBold: "We partner with serious scaleups",
      headingItalic: "in Europe and the Americas",
      ctaText: "See more projects",
    },
    insights: {
      heading: "Latest insights",
      trendingButton: "What's trending.",
      cards: [
        {
          bg: "#f7c4d5",
          brand: "Marshall Haber",
          label: "The Heart of the Shift:",
          title: "Brand Messaging is the\nSoul of Rebranding",
          desc: "Brand Messaging is the Soul of Rebranding",
          slug: "brand-messaging",
        },
        {
          bg: "#2B59C3",
          brand: "Marshall Haber",
          label: "Research Is Our Love Language:",
          labelColor: "#fbf0f2",
          title: "The Art of\nGathering Insights",
          desc: "The Art of Gathering Insights",
          slug: "art-of-gathering-insights",
        },
        {
          bg: "#0B0215",
          brand: "Marshall Haber",
          label: "The Founders' Guide to Rebranding",
          titleLarge: "...is it time?",
          desc: "...is it time?",
          slug: "founders-guide",
        },
      ],
    },
    servicesLabel: "Services",
    servicePanels: [
      {
        bg: "#2B59C3",
        title: "Brand Strategy",
        description: "It's the core of your company's identity. It guides all business decisions, ensuring a consistent and impactful presence in the market.",
        items: ["Research & Insights", "Brand Model", "Positioning", "Value proposition", "Messaging", "Verbal Identity", "Naming"],
        textColor: "text-[#fbf0f2]",
      },
      {
        bg: "#0B0215",
        title: "Identity",
        description: "Distinctive visual systems designed to be immediate, enduring, and unmistakable.",
        items: ["Logo & Wordmark", "Typography & Color", "Art Direction", "Brand Systems", "Guidelines"],
        textColor: "text-[#fbf0f2]",
      },
      {
        bg: "#fbf0f2",
        title: "Digital",
        description: "High-performance digital experiences—designed with precision and built to scale.",
        items: ["UX & UI Design", "Website Design", "Web Development", "Interaction & Motion"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#020817",
        title: "Product",
        description: "Thoughtfully designed products that are intuitive, refined, and built for real use.",
        items: ["UX Design", "Prototyping", "UI Systems", "App Design"],
        textColor: "text-[#fbf0f2]",
      },
    ],
    cta: {
      left: {
        topBold: "You feel it too?",
        topItalic: "Let's talk, no strings attached",
        heading: "Send Request",
      },
      right: {
        topBold: "Our free offer for B2B tech scaleups!",
        topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.",
        heading: "Brand Masterplan",
      },
    },
  },

  // ─────────────── ABOUT ───────────────
  about: {
    hero: {
      estHeading: "Est. 2005",
      taglineBold: "Crafting the future,",
      taglineItalic: "while having serious fun.",
    },
    paragraphs: [
      { text: "MARSHALL.HABER started in 2005 as a passion project at Hyper Island, Stockholm by a diverse group of creatives with the goal of re-defining what a serious business is really about: kindness and creativity." },
      { text: "That's why we craft our future with kindness to create brands that make people smile." },
      { text: "Today our dream team of 15 creatives with a global perspective has crafted a new generation of brands with over 180 change-making scaleups in Europe and the Americas, a living proof that it is culture that drives a serious business." },
    ],
    cta: {
      sendRequest: {
        topBold: "You feel it too?",
        topItalic: "Let's talk, no strings attached",
        heading: "Send Request",
      },
      masterplan: {
        topBold: "Our free offer for B2B tech scaleups!",
        topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.",
        heading: "Brand Masterplan",
      },
    },
  },

  // ─────────────── SERVICES ───────────────
  services: {
    hero: {
      heading: "We equip, empower, and inspire tomorrow's leaders through premium branding",
    },
    servicePanels: [
      {
        bg: "#B59DF3", // Purple for Brand Strategy (from the earlier screenshot)
        title: "Brand Strategy",
        description: "It's the core of your company's identity. It guides all business decisions, ensuring a consistent and impactful presence in the market.",
        items: ["Research & Insights", "Brand Model", "Positioning", "Value proposition", "Messaging", "Verbal Identity", "Naming"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#e9e9e9", // Light gray from screenshot
        title: "Identity",
        description: "Distinctive visual systems designed to be immediate, enduring, and unmistakable.",
        items: ["Logo & Wordmark", "Typography & Color", "Art Direction", "Brand System", "Guidelines"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#E8A838", // Mustard Yellow
        title: "Digital",
        description: "High-performance digital experiences—designed with precision and built to scale.",
        items: ["UX & UI Design", "Website Design", "Web Development", "Interaction & Motion"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#111111", // Black
        title: "Product",
        description: "Thoughtfully designed products that are intuitive, refined, and built for real use.",
        items: ["UX Design", "Prototyping", "UI Systems", "App Design"],
        textColor: "text-[#fbf0f2]",
      },
      {
        bg: "#D9D1CB", // Warm light gray
        title: "Sprints",
        description: "We run rapid focused sprints—prototyping, testing, and refining to move ideas forward quickly.",
        items: ["Rapid Prototyping", "Design Sprints", "User Validation", "Idea Incubation", "Concept Testing"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#E2EBE5", // Light mint
        title: "Experiential",
        description: "Immersive brand experiences that make a real-world impact.",
        items: ["Brand Activations", "Event Experiences", "Spatial Design", "Interactive Installations"],
        textColor: "text-[#020817]",
      },
      {
        bg: "#151624", // Dark navy
        title: "Film & Content",
        description: "Cinematic storytelling that drives brand and B2B engagement.",
        items: ["Brand Films", "Campaign Videos", "Motion & Animation", "Social Media"],
        textColor: "text-[#fbf0f2]",
      },
      {
        bg: "#2B5CD1", // Blue
        title: "Objects",
        description: "Physical expressions of your brand—designed with the same level of care and precision.",
        items: ["Corporate Gifting", "Merchandise & Swag", "Packaging", "Custom Products"],
        textColor: "text-[#fbf0f2]",
      },
    ],
    sidebar: {
      label: "When?",
      text: "Our work focusses on B2B tech scaleups at Series A & B stage. On top of that we work with one early stage startup at a time. Honoring both our passion and how we started.",
    },
    serviceCards: [
      { id: "premium", title: "Premium Branding", text: "Our bestseller for scaleups: a premium branding approach that connects strategy and creativity to turn complex value into a clear and credible story for enterprise buyers." },
      { id: "sprint", title: "Sprint", text: "Sprints are 1-month projects designed to create a brand or website quickly and efficiently for early-stage startups." },
      { id: "subscription", title: "Subscription", text: "Design subscriptions are our way of collaborating long-term with clients, acting as their extended team to speed up growth and ensure consistency." },
      { id: "venture", title: "Venture", text: "Venture relationships involve high commitment projects where we invest our expertise and resources in exchange for shares." },
    ],
    programs: {
      heading: "Our branding services",
      services: [
        { name: "Brand Strategy", tagline: "It's the core of your company's identity." },
        { name: "Identity", tagline: "Distinctive visual systems built to last." },
        { name: "Digital", tagline: "High-performance digital experiences." },
        { name: "Product", tagline: "Thoughtfully designed products, built for real use." },
        { name: "Sprints", tagline: "Rapid cycles to move ideas forward fast." },
        { name: "Experiential", tagline: "Immersive brand experiences with real-world impact." },
        { name: "Film & Content", tagline: "Cinematic storytelling that drives engagement." },
        { name: "Objects", tagline: "Physical expressions of your brand." },
      ],
    },
  },

  // ─────────────── CLIENTS ───────────────
  clients: {
    hero: {
      label: "Our Partners",
      heading: "Credibility has an impact\nin numbers",
      subtitle: "Bookings in Europe and the Americas partner with us for our expertise in Brand Strategy, Identity, Marketing & Product.",
    },
    grid: {
      heading: "Trusted by industry leaders",
      subtext: "Bookings in Europe and the Americas partner with us for our expertise in Brand Strategy, Identity, Marketing & Product.",
    },
    list: [
      { name: "JPMorgan Chase", logo: "jpmorgan.png", category: "Finance" },
      { name: "Berkshire Hathaway", logo: "berkshire-hathaway-logonew.png", category: "Finance" },
      { name: "Jeffries", logo: "09_Jeffries_Logo.png", category: "Finance" },
      { name: "Special Olympics", logo: "1200px-Special_Olympics_logo.svg_-1.png", category: "Nonprofit" },
      { name: "Eurotech", logo: "16_Eurotech_Logo.png", category: "Technology" },
      { name: "Signature Bank", logo: "23_Signature_Bank.png", category: "Finance" },
      { name: "Burson Marsteller", logo: "Burson-Marsteller-logo_250px.png", category: "Communications" },
      { name: "Celadon", logo: "Celadon_Logo.png", category: "Technology" },
      { name: "Humankind Investments", logo: "HumankindInvestments_Logo.png", category: "Finance" },
      { name: "MIZ", logo: "MIZ_Logo_SVG_Gadrientdark.png", category: "Technology" },
      { name: "Y&R", logo: "YR.png", category: "Advertising" },
      { name: "Centerbridge", logo: "centerbridge.png", category: "Finance" },
      { name: "Kaplan", logo: "kaplan.png", category: "Education" },
      { name: "Rivington", logo: "rivington.png", category: "Finance" },
      { name: "Trish McEvoy", logo: "trishmcevoy-1.png", category: "Beauty" },
      { name: "Usher", logo: "usher-new-logo_white.png", category: "Entertainment" },
    ],
    cta: {
      heading: "Want to join our client roster?",
      buttonText: "Get in Touch",
    },
  },

  // ─────────────── WORK / WORKDETAIL ───────────────
  work: {
    tabs: {
      featured: "Featured",
      allProjects: "All projects",
      industries: "Industries",
    },
    metaLabel: "Strategy, Visual Identity, Website",
  },
  workDetail: {
    info: {
      clientLabel: "Client",
      industryLabel: "Industry",
      servicesLabel: "Services",
      servicesValue: "Strategy · Brand Identity · Website",
    },
    moreProjectsHeading: "More projects",
    cta: {
      sendRequest: {
        topBold: "You feel it too?",
        topItalic: "Let's talk, no strings attached",
        heading: "Send Request",
      },
      masterplan: {
        topBold: "Our free offer for B2B tech scaleups!",
        topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.",
        heading: "Brand Masterplan",
      },
    },
  },

  // ─────────────── CONTACT ───────────────
  contact: {
    hero: {
      label: "Contact",
      title: "Let's create\nsomething great",
      subtitle: "We'd love to hear about your next project",
    },
    info: {
      location: {
        title: "Visit Us",
        addressLine1: "99 Wall Street +1467",
        addressLine2: "New York, NY 10005",
        regions: "New York · Toronto · Florida",
      },
      phone: {
        title: "Call Us",
        number: "+1 (212) 494-9052",
        hours: "Mon - Fri, 9am - 6pm EST",
      },
      email: {
        title: "Email Us",
        address: "newbiz@marshallhaber.com",
        response: "We'll respond within 24 hours",
      },
    },
    form: {
      label: "Get in touch",
      title: "Want to work\nwith us?",
      subtitle: "Let us know a bit about you and your business idea, challenge, or needs. We'll get back to you within one business day.",
      nameLabel: "Name",
      namePlaceholder: "Your full name",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      companyLabel: "Company",
      companyPlaceholder: "Your company name",
      messageLabel: "Message",
      messagePlaceholder: "Tell us about your project...",
      checkboxLabel: "Send me occasional updates on events, insights, and services",
      submitText: "Send Message",
      successTitle: "Thank you!",
      successMessage: "We've received your message and will be in touch shortly.",
    },
  },

  // ─────────────── LEGAL ───────────────
  legal: {
    hero: {
      heading: "Legal",
      lastUpdated: "Last updated: 2026",
    },
    sections: [
      {
        heading: "Imprint",
        content: "Marshall Haber Creative Group\n99 Wall Street, Suite #1467\nNew York, NY 10005, United States",
        email: "studio@marshallhaber.com",
      },
      {
        heading: "Privacy",
        content: "We respect your privacy. Personal data submitted through forms on this site is used solely to respond to your inquiry and is never sold or shared with third parties for marketing purposes. To request deletion or export of your data, contact us at the email above.",
      },
      {
        heading: "Cookies",
        content: "This site uses essential cookies for routing and accessibility. We do not use third-party tracking cookies. Analytics, when enabled, are anonymized and aggregated.",
      },
      {
        heading: "Intellectual Property",
        content: "All content, branding, and design assets on this site are the property of Marshall Haber Creative Group or our clients. Unauthorized reproduction is prohibited.",
      },
    ],
  },

  // ─────────────── COMING SOON ───────────────
  comingSoon: {
    heading: "Coming Soon",
    subtitle: "We are actively working on this page. Check back soon!",
    cta: "Go back home",
  },

  // ─────────────── GLOBAL (Navbar + Footer) ───────────────
  global: {
    nav: {
      menu: [
        { label: "Work", href: "/work" },
        { label: "About", href: "/about" },
        { label: "Clients", href: "/clients" },
        { label: "Services", href: "/services" },
      ],
      contactButton: "Contact",
      menuButton: "Menu",
      sayHelloLabel: "Say hello",
      sayHelloEmail: "newbiz@marshallhaber.com",
      talentLabel: "Exceptional talent?",
      talentEmail: "apply@marshallhaber.com",
    },
    footer: {
      exploreLabel: "Explore",
      exploreLinks: [
        { label: "Services", href: "/services" },
        { label: "Work", href: "/work" },
        { label: "About", href: "/about" },
        { label: "Clients", href: "/clients" },
      ],
      stalkUsLabel: "Stalk us",
      stalkUsLinks: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/marshallhaber" },
        { label: "Instagram", href: "https://www.instagram.com/mhcginc/" },
      ],
      sayHelloLabel: "Say Hello",
      sayHelloEmail: "studio@marshallhaber.com",
      callUsLabel: "Call us",
      callUsPhone: "+1 212.494.9052",
      copyright: "© 2015—2026 Marshall Haber Creative Group",
      legalLink: "Legal",
      address: "99 Wall Street, Suite #1467, New York, NY 10005, United States",
    },
  },
};
