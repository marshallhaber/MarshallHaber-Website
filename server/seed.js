require("dotenv").config();
const mongoose = require("mongoose");
const PageContent = require("./models/PageContent");

// One source-of-truth for the public site's content. Mirrors
// src/lib/contentDefaults.js — keep them in sync after edits to either
// file. (Duplicated rather than imported because this script runs in
// CommonJS Node and the frontend bundle is ESM.)
const defaultData = [
  // ─────────────── HOME ───────────────
  {
    page: "home",
    sections: {
      hero: {
        headingBold: "Premium Branding Agency",
        headingItalic: "for B2B Tech Scaleups",
      },
      about: {
        heading: "Crafting premium\nbrands for scaleups\nthat make people smile.",
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
        heading: "Latest insights for scaleup teams",
        trendingButton: "What's trending.",
        cards: [
          { bg: "#f7c4d5", brand: "Marshall Haber", label: "The Heart of the Shift:", title: "Brand Messaging is the\nSoul of Rebranding", desc: "The Heart of the Shift: Brand Messaging Is the Soul of Rebranding" },
          { bg: "#2B59C3", brand: "Marshall Haber", label: "Research Is Our Love Language:", labelColor: "#fbf0f2", title: "The Art of\nGathering Insights", desc: "Research Is Our Love Language: The Art of Gathering Insights" },
          { bg: "#0B0215", brand: "Marshall Haber", label: "The Founders' Guide to Rebranding", titleLarge: "...is it time?", desc: "The Founders' Guide to Rebranding" },
        ],
      },
      servicePanels: [
        { bg: "#2B59C3", title: "Brand Strategy", description: "It's the core of your company's identity. It guides all business decisions, ensuring a consistent and impactful presence in the market.", items: "Research & Insights, Brand Model, Positioning, Value proposition, Messaging, Verbal Identity, Naming", textColor: "text-[#fbf0f2]" },
        { bg: "#0B0215", title: "Identity", description: "Distinctive visual systems designed to be immediate, enduring, and unmistakable.", items: "Logo & Wordmark, Typography & Color, Art Direction, Brand Systems, Guidelines", textColor: "text-[#fbf0f2]" },
        { bg: "#fbf0f2", title: "Digital", description: "High-performance digital experiences—designed with precision and built to scale.", items: "UX & UI Design, Website Design, Web Development, Interaction & Motion", textColor: "text-[#020817]" },
        { bg: "#020817", title: "Product", description: "Thoughtfully designed products that are intuitive, refined, and built for real use.", items: "UX Design, Prototyping, UI Systems, App Design", textColor: "text-[#fbf0f2]" },
      ],
      cta: {
        left: { topBold: "You feel it too?", topItalic: "Let's talk, no strings attached", heading: "Send Request" },
        right: { topBold: "Our free offer for B2B tech scaleups!", topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.", heading: "Brand Masterplan" },
      },
    },
  },

  // ─────────────── WORK ───────────────
  {
    page: "work",
    sections: {
      tabs: { featured: "Featured", allProjects: "All projects", industries: "Industries" },
      projects: [],
    },
  },

  // ─────────────── WORK DETAIL ───────────────
  {
    page: "workDetail",
    sections: {
      info: {
        clientLabel: "Client",
        industryLabel: "Industry",
        servicesLabel: "Services",
        servicesValue: "Strategy · Brand Identity · Website",
      },
      cta: {
        sendRequest: { topBold: "You feel it too?", topItalic: "Let's talk, no strings attached", heading: "Send Request" },
        masterplan: { topBold: "Our free offer for B2B tech scaleups!", topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.", heading: "Brand Masterplan" },
      },
    },
  },

  // ─────────────── ABOUT ───────────────
  {
    page: "about",
    sections: {
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
        sendRequest: { topBold: "You feel it too?", topItalic: "Let's talk, no strings attached", heading: "Send Request" },
        masterplan: { topBold: "Our free offer for B2B tech scaleups!", topItalic: "We identify high-impact messaging and brand fixes you can implement within 24 hours.", heading: "Brand Masterplan" },
      },
    },
  },

  // ─────────────── CLIENTS ───────────────
  {
    page: "clients",
    sections: {
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
        { name: "J.P. Morgan", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/jpmorgan.png", category: "Finance", logoSize: "100" },
        { name: "Hotel on Rivington", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/rivington.png", category: "Hospitality", logoSize: "100" },
        { name: "Centerbridge", logo: "https://marshallhaber.com/wp-content/uploads/2020/10/centerbridge.png", category: "Finance", logoSize: "100" },
        { name: "Trish McEvoy", logo: "https://marshallhaber.com/wp-content/uploads/2021/05/trishmcevoy-1.png", category: "Beauty", logoSize: "100" },
        { name: "Special Olympics", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/1200px-Special_Olympics_logo.svg_-1.png", category: "Nonprofit", logoSize: "100" },
        { name: "Mizrahi Developments", logo: "https://marshallhaber.com/wp-content/uploads/2022/06/MIZ_Logo_SVG_Gadrientdark.png", category: "Real Estate", logoSize: "100" },
        { name: "Burson Marsteller", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/Burson-Marsteller-logo_250px.png", category: "Communications", logoSize: "100" },
        { name: "Eurotech", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/16_Eurotech_Logo.png", category: "Technology", logoSize: "100" },
        { name: "Signature Bank", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/23_Signature_Bank.png", category: "Finance", logoSize: "100" },
        { name: "Berkshire Hathaway", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/berkshire-hathaway-logonew.png", category: "Finance", logoSize: "100" },
        { name: "Jefferies", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/09_Jeffries_Logo.png", category: "Finance", logoSize: "100" },
        { name: "Weizmann Institute of Science", logo: "https://marshallhaber.com/wp-content/uploads/2023/07/logo.png", category: "Education", logoSize: "100" },
        { name: "Kaplan", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/kaplan.png", category: "Education", logoSize: "100" },
        { name: "Memorial Sloan Kettering", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/logo-memorial-sloan-kettering-cancer-center_2018.png", category: "Healthcare", logoSize: "100" },
        { name: "Humankind Investments", logo: "https://marshallhaber.com/wp-content/uploads/2022/03/HumankindInvestments_Logo.png", category: "Finance", logoSize: "100" },
        { name: "Celadon", logo: "https://marshallhaber.com/wp-content/uploads/2022/03/Celadon_Logo.png", category: "Technology", logoSize: "100" },
        { name: "Usher", logo: "https://marshallhaber.com/wp-content/uploads/2021/08/usher-new-logo_white.png", category: "Entertainment", logoSize: "100" },
        { name: "Stone Ridge", logo: "https://marshallhaber.com/wp-content/uploads/2023/09/SR_Logo_Blue@2x.png", category: "Finance", logoSize: "100" },
        { name: "Y&R", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/YR.png", category: "Advertising", logoSize: "100" },
        { name: "National Jewish Health", logo: "https://marshallhaber.com/wp-content/uploads/2021/05/nationaljewishhealth.png", category: "Healthcare", logoSize: "100" },
        { name: "Freeport LNG", logo: "https://marshallhaber.com/wp-content/uploads/2021/08/freeport-logo.png", category: "Energy", logoSize: "100" },
        { name: "Weatherproof", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/56_Weatherproof_Logo.png", category: "Fashion", logoSize: "100" },
        { name: "Magen David Adom", logo: "https://marshallhaber.com/wp-content/uploads/2023/07/mda_cleanlogo.png", category: "Healthcare", logoSize: "100" },
        { name: "JDC", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/jdc.png", category: "Nonprofit", logoSize: "100" },
        { name: "Platinum Cleaning", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/Platinum_Logo_Secondary_Horizontal_4C.png", category: "Services", logoSize: "100" },
        { name: "FXFL", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/fxfl.png", category: "Sports", logoSize: "100" },
        { name: "Raynor Gaming", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/Raynor_Logo_Vertical_Gradient_RGB.png", category: "Sports", logoSize: "100" },
        { name: "Polaris Medical Resorts", logo: "https://marshallhaber.com/wp-content/uploads/2023/07/polaris.png", category: "Healthcare", logoSize: "100" },
        { name: "Rosedev", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/42_Rosedev_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Ackman-Ziff", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/17_Ackman_Ziff_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "JAT Capital", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/04_JAT_Capital_Logo.png", category: "Finance", logoSize: "100" },
        { name: "Mike Bloomberg", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/47_Mike_Bloomberg_Logo.png", category: "Government", logoSize: "100" },
        { name: "Madison Realty Capital", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/madison-realty-capital-logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Sphera", logo: "https://marshallhaber.com/wp-content/uploads/2020/06/spheralogo2.png", category: "Technology", logoSize: "100" },
        { name: "Reliant Safety", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/48_Reliant_Safety_Logo.png", category: "Services", logoSize: "100" },
        { name: "Forcefield", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/49_Forcefield_Logo.png", category: "Technology", logoSize: "100" },
        { name: "Noitacov Resorts & Spa", logo: "https://marshallhaber.com/wp-content/uploads/2023/07/noitacov_logo-1.png", category: "Hospitality", logoSize: "100" },
        { name: "South Africa", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/southafrica.png", category: "Government", logoSize: "100" },
        { name: "Amudim", logo: "https://marshallhaber.com/wp-content/uploads/2022/03/Amudim_PrimaryLogo_RGB.png", category: "Nonprofit", logoSize: "100" },
        { name: "Hertz Investment Group", logo: "https://marshallhaber.com/wp-content/uploads/2021/05/hertz-2.png", category: "Real Estate", logoSize: "100" },
        { name: "Apexon", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/apexon.png", category: "Technology", logoSize: "100" },
        { name: "The Classic", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/07_Classic_Logo.png", category: "Hospitality", logoSize: "100" },
        { name: "Nariman House", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/Nariman_house_logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "Optifino", logo: "https://marshallhaber.com/wp-content/uploads/2023/07/optifino.png", category: "Finance", logoSize: "100" },
        { name: "Met Council", logo: "https://marshallhaber.com/wp-content/uploads/2021/05/MetCouncil.jpg", category: "Nonprofit", logoSize: "100" },
        { name: "Meridian", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/meridian.png", category: "Finance", logoSize: "100" },
        { name: "Treeco", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/45_Treeco_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "BHI USA", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/bhi.png", category: "Finance", logoSize: "100" },
        { name: "Reliant Realty", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/51_Reliant_Realty_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Lincoln Avenue Capital", logo: "https://marshallhaber.com/wp-content/uploads/2021/05/LincolnAvenueCapital.jpg", category: "Real Estate", logoSize: "100" },
        { name: "Copia", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/54_Copia_Logo.png", category: "Finance", logoSize: "100" },
        { name: "Futerfas Law", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/FuterfasLaw_Logo.png", category: "Legal", logoSize: "100" },
        { name: "AIFL", logo: "https://marshallhaber.com/wp-content/uploads/2022/03/AIFL_Logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "Parklee", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/astleys_logo_black.png", category: "Real Estate", logoSize: "100" },
        { name: "5WPR", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/25_5WPR_Logo.png", category: "Communications", logoSize: "100" },
        { name: "The Frick Estate", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/WCH.png", category: "Real Estate", logoSize: "100" },
        { name: "Estates at Alpine", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/63_Estates_at_Alpine_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "UX3", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/UX3_Logo.jpg", category: "Technology", logoSize: "100" },
        { name: "Associated", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/assoiated-logo.png", category: "Finance", logoSize: "100" },
        { name: "Lapolla", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/68_Lapolla_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Olami", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/18_Olami_Logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "TAG", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/32_TAG_Logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "Chai Lifeline", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/chai_lifeline_hort_4_color.png", category: "Healthcare", logoSize: "100" },
        { name: "IAC", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/60_IAC_Logo_small.jpg", category: "Nonprofit", logoSize: "100" },
        { name: "Jewish National Fund", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/jewish-national-fund_logonew.png", category: "Nonprofit", logoSize: "100" },
        { name: "SIDS", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/57_SIDS_Logo.png", category: "Healthcare", logoSize: "100" },
        { name: "AFHU", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/37_American_Friends_Hebrew_Logo.png", category: "Education", logoSize: "100" },
        { name: "Permanent Mission", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/13_Permanent_Mission_Logo.jpg", category: "Government", logoSize: "100" },
        { name: "MEMRI", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/77_Memri_Logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "Technion", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/technion.jpg", category: "Education", logoSize: "100" },
        { name: "NK Architects", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/69_NK_Architect_Logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Le Marais", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/71_Le_Marais_Logo-copy.png", category: "Hospitality", logoSize: "100" },
        { name: "OATS", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/73_OATS_Logo.png", category: "Nonprofit", logoSize: "100" },
        { name: "ELC Breast Cancer Campaign", logo: "https://marshallhaber.com/wp-content/uploads/2022/03/ELC_BreastCancer_Logo-1.png", category: "Healthcare", logoSize: "100" },
        { name: "NYSCQ", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/NYSCQ_Logo.jpg", category: "Real Estate", logoSize: "100" },
        { name: "StellaService", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/38_Stella_Logo.png", category: "Technology", logoSize: "100" },
        { name: "The Gilbert", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/the-gilbert-logo.png", category: "Real Estate", logoSize: "100" },
        { name: "Bailey & Galyen", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/BG-LOGO.jpg", category: "Legal", logoSize: "100" },
        { name: "SBE", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/20_SBE_Logo-1.png", category: "Hospitality", logoSize: "100" },
        { name: "Belz Enterprises", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/08_Belz_Enterprise.png", category: "Real Estate", logoSize: "100" },
        { name: "Kasowitz", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/22_Kasowitz_Logo.png", category: "Legal", logoSize: "100" },
        { name: "Milberg Factors", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/MilbergFactors_Logo_BOLD_black_singleline_00.png", category: "Finance", logoSize: "100" },
        { name: "Newseum", logo: "https://marshallhaber.com/wp-content/uploads/2019/10/09_Newseum_Logo.png", category: "Education", logoSize: "100" },
        { name: "NYU Langone", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/11_NYU_Langone_Logo.png", category: "Healthcare", logoSize: "100" },
        { name: "GCG", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/12_GCG_Logo.png", category: "Finance", logoSize: "100" },
        { name: "Intelligence Options", logo: "https://marshallhaber.com/wp-content/uploads/2019/11/19_Intelligence_Options_Logo.png", category: "Services", logoSize: "100" },
        { name: "Charity Bids", logo: "https://marshallhaber.com/wp-content/uploads/2022/01/new-logo.png", category: "Nonprofit", logoSize: "100" }
      ],
      cta: { heading: "Want to join our client roster?", buttonText: "Get in Touch" },
    },
  },

  // ─────────────── SERVICES ───────────────
  {
    page: "services",
    sections: {
      hero: { heading: "We equip, empower, and inspire tomorrow's leaders through premium branding" },
      sidebar: { label: "When?", text: "Our work focusses on B2B tech scaleups at Series A & B stage. On top of that we work with one early stage startup at a time. Honoring both our passion and how we started." },
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
  },

  // ─────────────── CONTACT ───────────────
  {
    page: "contact",
    sections: {
      hero: {
        label: "Contact",
        title: "Let's create\nsomething great",
        subtitle: "We'd love to hear about your next project",
      },
      info: {
        location: { title: "Visit Us", addressLine1: "99 Wall Street +1467", addressLine2: "New York, NY 10005", regions: "New York · Toronto · Florida" },
        phone: { title: "Call Us", number: "+1 (212) 494-9052", hours: "Mon - Fri, 9am - 6pm EST" },
        email: { title: "Email Us", address: "newbiz@marshallhaber.com", response: "We'll respond within 24 hours" },
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
  },

  // ─────────────── LEGAL ───────────────
  {
    page: "legal",
    sections: {
      hero: { heading: "Legal", lastUpdated: "Last updated: 2026" },
      sections: [
        { heading: "Imprint", content: "Marshall Haber Creative Group\n99 Wall Street, Suite #1467\nNew York, NY 10005, United States", email: "studio@marshallhaber.com" },
        { heading: "Privacy", content: "We respect your privacy. Personal data submitted through forms on this site is used solely to respond to your inquiry and is never sold or shared with third parties for marketing purposes. To request deletion or export of your data, contact us at the email above." },
        { heading: "Cookies", content: "This site uses essential cookies for routing and accessibility. We do not use third-party tracking cookies. Analytics, when enabled, are anonymized and aggregated." },
        { heading: "Intellectual Property", content: "All content, branding, and design assets on this site are the property of Marshall Haber Creative Group or our clients. Unauthorized reproduction is prohibited." },
      ],
    },
  },

  // ─────────────── COMING SOON ───────────────
  {
    page: "comingSoon",
    sections: {
      page: { heading: "Coming Soon", subtitle: "We are actively working on this page. Check back soon!", cta: "Go back home" },
    },
  },

  // ─────────────── GLOBAL (Nav + Footer) ───────────────
  {
    page: "global",
    sections: {
      nav: {
        menuButton: "Menu",
        contactButton: "Contact",
        sayHelloLabel: "Say hello",
        sayHelloEmail: "newbiz@marshallhaber.com",
        talentLabel: "Exceptional talent?",
        talentEmail: "apply@marshallhaber.com",
        menu: [
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
          { label: "Clients", href: "/clients" },
          { label: "Services", href: "/services" },
        ],
      },
      footer: {
        exploreLabel: "Explore",
        stalkUsLabel: "Stalk us",
        sayHelloLabel: "Say Hello",
        sayHelloEmail: "studio@marshallhaber.com",
        callUsLabel: "Call us",
        callUsPhone: "+1 212.494.9052",
        copyright: "© 2015—2026 Marshall Haber Creative Group",
        legalLink: "Legal",
        address: "99 Wall Street, Suite #1467, New York, NY 10005, United States",
        exploreLinks: [
          { label: "Services", href: "/services" },
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
          { label: "Clients", href: "/clients" },
        ],
        stalkUsLinks: [
          { label: "LinkedIn", href: "#" },
          { label: "Instagram", href: "#" },
        ],
      },
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  for (const doc of defaultData) {
    await PageContent.findOneAndUpdate(
      { page: doc.page },
      { page: doc.page, sections: doc.sections },
      { upsert: true, new: true }
    );
    console.log(`  upserted: ${doc.page}`);
  }
  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
