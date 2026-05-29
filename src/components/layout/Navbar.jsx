import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import TransitionLink from "../ui/TransitionLink";
import ContactModal from "../ui/ContactModal";
import gsap from "gsap";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

// Right chevron ">" — default state on Contact button
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Left chevron "<" — hover state on Contact button
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MenuIcon = ({ isOpen }) => (
  <div className="w-6 h-6 relative flex flex-col items-center justify-center">
    <motion.span
      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 1 : -4 }}
      className="w-6 h-[2px] bg-current absolute rounded-full"
    />
    <motion.span
      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 1 : 4 }}
      className="w-6 h-[2px] bg-current absolute rounded-full"
    />
  </div>
);

const NavButton = ({ text, activeText, isActive = false, hoverText, icon, hoverIcon, onClick, isLetsWork = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconWrapperRef = useRef(null);

  useEffect(() => {
    if (isLetsWork && iconWrapperRef.current) {
      if (isHovered) {
        gsap.fromTo(iconWrapperRef.current,
          { scale: 0, rotate: -180, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: "power4.out" }
        );
      }
    }
  }, [isHovered, isLetsWork]);

  const staticStyle = { backgroundColor: "var(--accent-bg)", color: "var(--accent-text, #020817)" };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center gap-1.5 pointer-events-auto cursor-none shrink-0"
      onClick={onClick}
    >
      <motion.div
        layout
        style={staticStyle}
        transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        className="px-7 py-4 rounded-full shadow-sm font-bold text-sm flex items-center overflow-hidden h-[52px]"
      >
        <div className="relative h-5 overflow-hidden flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isHovered && !isActive ? (
              <motion.span key="text" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="whitespace-nowrap">
                {text}
              </motion.span>
            ) : isActive ? (
              <motion.span key="activeText" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="whitespace-nowrap">
                {activeText || "Close"}
              </motion.span>
            ) : (
              <motion.div key="hoverText" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex gap-6 whitespace-nowrap">
                {hoverText || text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {(icon || hoverIcon) && (
        <motion.div
          style={staticStyle}
          animate={{
            opacity: (isLetsWork && !isHovered && !icon) ? 0 : 1,
            scale: (isLetsWork && !isHovered && !icon) ? 0.8 : 1,
          }}
          transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
          className="w-[52px] h-[52px] rounded-full shadow-sm flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{ opacity: isHovered || isActive ? 0 : 1, transform: isHovered || isActive ? "scale(0) rotate(-180deg)" : "scale(1) rotate(0deg)" }}
          >
            {icon}
          </div>
          <div
            ref={iconWrapperRef}
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{ opacity: isHovered || isActive ? 1 : 0, transform: isHovered || isActive ? "scale(1) rotate(0deg)" : "scale(0) rotate(180deg)" }}
          >
            {hoverIcon || icon}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const menuItems = [
  { label: "Work", to: "/work", sub: [] },
  { label: "About", to: "/about", sub: [] },
  { label: "Clients", to: "/clients", sub: [] },
  { label: "Services", to: "/services", sub: [] },
];

const subRoutes = {
  "Featured": "/work/featured",
  "Video": "/work/video",
  "All Projects": "/work",
  "Filter Industries": "/work/industries",
  "20 Years": "/about/story",
  "Brand Strategy": "/services/brand-strategy",
  "Visual Identity": "/services/visual-identity",
  "Website": "/services/website",
  "Product": "/services/product",
};

const DropdownPortal = ({ children }) => createPortal(children, document.body);

const DesktopMenu = () => {
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const { pathname } = useLocation();
  const staticStyle = { backgroundColor: "var(--accent-bg, #fbf0f2)", color: "var(--accent-text, #020817)" };

  const { sections } = usePageContent("global");
  const cmsMenu = getContent(sections, "nav.menu", defaults.global.nav.menu);
  const menuButtonLabel = getContent(sections, "nav.menuButton", defaults.global.nav.menuButton);
  const menuItems = cmsMenu.map((m) => ({ label: m.label, to: m.href, sub: [] }));

  const menuTimeoutRef = useRef(null);
  const itemTimeoutRef = useRef(null);
  const itemRefs = useRef({});

  const handleMenuEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsMenuHovered(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsMenuHovered(false);
      setActiveItem(null);
    }, 200);
  };

  const handleItemEnter = (label) => {
    clearTimeout(itemTimeoutRef.current);
    setActiveItem(label);
    const el = itemRefs.current[label];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleItemLeave = () => {
    itemTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  };

  const handleDropdownEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    clearTimeout(itemTimeoutRef.current);
    setIsMenuHovered(true);
    setActiveItem(activeItem);
  };

  const handleDropdownLeave = () => {
    handleMenuLeave();
  };

  const activeMenuData = menuItems.find((m) => m.label === activeItem);

  return (
    <div
      className="flex items-center gap-1.5"
      onMouseEnter={handleMenuEnter}
      onMouseLeave={handleMenuLeave}
    >
      {/* Pill */}
      <motion.div
        layout
        style={staticStyle}
        transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        className="px-7 py-4 rounded-full shadow-sm text-sm flex items-center overflow-hidden h-[52px] cursor-pointer"
      >
        <div className="relative h-5 overflow-hidden flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isMenuHovered ? (
              <motion.span
                key="closed"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="whitespace-nowrap font-bold"
              >
                {menuButtonLabel}
              </motion.span>
            ) : (
              <motion.div
                key="open"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="flex gap-6 items-center whitespace-nowrap h-5"
              >
                {menuItems.map((item) => {
                  const isActive = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                  return (
                  <div
                    key={item.label}
                    ref={(el) => (itemRefs.current[item.label] = el)}
                    onMouseEnter={() => handleItemEnter(item.label)}
                    onMouseLeave={handleItemLeave}
                    className={`relative flex items-center gap-0.5 transition-all cursor-pointer h-5 ${isActive ? "font-bold opacity-100" : "font-normal opacity-50 hover:opacity-100 hover:font-bold"}`}
                  >
                    <TransitionLink to={item.to} className="relative flex items-center h-full">
                      <span className="relative py-1 flex items-center justify-center">
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="activeNavDot"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </span>
                    </TransitionLink>
                    {item.sub.length > 0 && (
                      <motion.svg
                        animate={{ rotate: activeItem === item.label ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                      >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </motion.svg>
                    )}
                  </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Icon circle — > when closed, < when open */}
      <motion.div
        style={staticStyle}
        className="w-[52px] h-[52px] rounded-full shadow-sm flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden relative"
      >
        {/* Default: > */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ opacity: isMenuHovered ? 0 : 1, transform: isMenuHovered ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)" }}
        >
          <ChevronRight />
        </div>
        {/* Hover: < */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ opacity: isMenuHovered ? 1 : 0, transform: isMenuHovered ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)" }}
        >
          <ChevronLeft />
        </div>
      </motion.div>

      {/* Dropdown via portal */}
      <DropdownPortal>
        <AnimatePresence>
          {activeItem && activeMenuData && activeMenuData.sub.length > 0 && (
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
              style={{
                backgroundColor: "var(--accent-bg, #fbf0f2)",
                color: "var(--accent-text, #020817)",
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
                transform: activeItem === "Services" ? "translateX(-80%)" : "translateX(-50%)",
                zIndex: 99999,
              }}
              className="rounded-2xl shadow-xl p-3 flex flex-col gap-1.5 min-w-max"
            >
              {activeMenuData.sub.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <TransitionLink to={subRoutes[s] || activeMenuData.to}>
                    <div
                      style={{
                        border: "1px solid color-mix(in srgb, var(--accent-text, #020817) 20%, transparent)"
                      }}
                      className="text-sm px-4 py-2 rounded-full text-center hover:bg-black/5 hover:opacity-100 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {s}
                    </div>
                  </TransitionLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownPortal>
    </div>
  );
};

export default function Navbar() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const { sections: globalSections } = usePageContent("global");
  const nav = getContent(globalSections, "nav", defaults.global.nav);
  const useShortLogoByDefault =
    pathname === "/work" ||
    pathname === "/clients" ||
    pathname === "/services" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/legal" ||
    pathname.startsWith("/work/") ||
    pathname.startsWith("/insights/");
  const [showCenterLogo, setShowCenterLogo] = useState(useShortLogoByDefault);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLightBg, setIsLightBg] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    setShowCenterLogo(useShortLogoByDefault);
    const unsub = scrollY.on("change", (latest) => {
      setShowCenterLogo(useShortLogoByDefault || latest > 300);
    });

    const footerObserver = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    const footer = document.getElementById("main-footer");
    if (footer) footerObserver.observe(footer);

    // Detect light/cream/offwhite page by checking body background color
    const checkBg = () => {
      if (pathname !== "/") {
        setIsLightBg(true);
        return;
      }
      const inlineBg = document.body.style.backgroundColor;
      const computedBg = typeof window !== "undefined" ? window.getComputedStyle(document.body).backgroundColor : "";
      
      const lightBackgrounds = [
        "rgb(251, 240, 242)", "#FBF0F2", "#fbf0f2",
        "rgb(244, 237, 217)", "#F4EDD9", "#f4edd9",
        "rgb(244, 240, 234)", "#F4F0EA", "#f4f0ea",
        "rgb(255, 255, 255)", "#FFFFFF", "#ffffff", "white",
      ];
      
      const isLight = lightBackgrounds.includes(inlineBg) || lightBackgrounds.includes(computedBg);
      setIsLightBg(isLight);
    };
    checkBg();

    // Also watch .dark-section for home page scroll transitions
    const lightSection = document.querySelector(".dark-section");
    const bgObserver = new IntersectionObserver(
      () => {
        checkBg();
      },
      { threshold: 0.05 }
    );
    if (lightSection) bgObserver.observe(lightSection);

    // MutationObserver to catch GSAP style changes on body
    const mutObs = new MutationObserver(checkBg);
    mutObs.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      unsub();
      if (footer) footerObserver.unobserve(footer);
      if (lightSection) bgObserver.disconnect();
      mutObs.disconnect();
    };
  }, [scrollY, useShortLogoByDefault, pathname]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0, pointerEvents: "auto" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-8 pointer-events-none"
      style={{ position: "relative", zIndex: 9999 }}
    >
      <div className="md:hidden block pointer-events-auto leading-none mt-4 relative h-9 w-40">
        <TransitionLink to="/" className="block w-full h-full relative">
          <div className="relative flex items-center h-full w-full">
            <img
              src="/logonewlong.png"
              alt=""
              className="h-9 w-auto opacity-0 pointer-events-none"
            />
            <img
              src="/logonewlong.png"
              alt="Marshall Haber Creative Group"
              className="absolute left-0 top-0 h-9 w-auto cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                opacity: showCenterLogo ? 0 : 1,
                filter: isLightBg ? "invert(1) brightness(0)" : "none",
              }}
            />
            <img
              src="/logo.svg"
              alt="MHCG"
              className="absolute left-0 top-0 h-9 w-auto cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                opacity: showCenterLogo ? 1 : 0,
                filter: isLightBg ? "brightness(0)" : "invert(1)",
              }}
            />
          </div>
        </TransitionLink>
      </div>

      {/* Desktop Left: Contact */}
      <div className="hidden md:block shrink-0">
        <NavButton
          text={nav.contactButton}
          icon={<ChevronRight />}
          hoverIcon={<ChevronLeft />}
          isLetsWork={false}
          onClick={() => setIsContactOpen(true)}
        />
      </div>

      {/* Center: Desktop Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-auto h-28">
        <TransitionLink to="/" className="relative block h-28">
          <div className="relative flex items-center justify-center h-full">
            {/* Invisible placeholder for maintaining container dimensions */}
            <img
              src="/logonewlong.png"
              alt=""
              className="h-28 w-auto opacity-0 pointer-events-none"
            />
            <img
              src="/logonewlong.png"
              alt="Marshall Haber Creative Group"
              className="absolute h-28 w-auto cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                opacity: showCenterLogo ? 0 : 1,
                filter: isLightBg ? "invert(1) brightness(0)" : "none",
              }}
            />
            <img
              src="/logo.svg"
              alt="MHCG"
              className="absolute h-32 w-auto cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                opacity: showCenterLogo ? 1 : 0,
                filter: isLightBg ? "brightness(0)" : "invert(1)",
                marginTop: "-32px",
              }}
            />
          </div>
        </TransitionLink>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 pointer-events-auto shrink-0">
        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <MenuIcon isOpen={isOpen} />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <DesktopMenu />
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020817] z-[200] pointer-events-auto flex flex-col justify-between px-6 py-8 md:hidden text-[#fbf0f2]"
          >
            <div className="flex justify-between items-center">
              <img src="/logonewlong.png" className="h-6" />
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                className="w-10 h-10 rounded-full bg-[#fbf0f2] text-[#020817] flex items-center justify-center cursor-pointer border border-white/20"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center justify-center h-full gap-8 text-4xl font-semibold">
              {(nav.menu || []).map((item) => (
                <TransitionLink key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </TransitionLink>
              ))}
              <button
                type="button"
                onClick={() => { setIsOpen(false); setIsContactOpen(true); }}
              >
                {nav.contactButton}
              </button>
            </div>

            {/* Mobile Footer removed per user request */}
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </motion.div>
  );
}