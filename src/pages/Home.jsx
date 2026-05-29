import { useLayoutEffect, useEffect } from "react";
import Hero, { HeroTopText } from "../components/sections/Hero";
import AboutSection from "../components/sections/About";
import ServiceBlock, { StrategyVideo, VisualImage, WebsiteImage, ProductImage } from "../components/sections/Services";
import StackContainer from "../components/layout/StackContainer";
import Works from "../components/sections/Works";
import Insights from "../components/sections/Insights";
import ClientSection from "../components/sections/ClientSection";
import CTA from "../components/sections/CTA";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageContent } from "../hooks/usePageContent";
import { getContent } from "../lib/content";
import { defaults } from "../lib/contentDefaults";

gsap.registerPlugin(ScrollTrigger);

const PANEL_VISUALS = [
  <StrategyVideo key="0" />,
  <VisualImage key="1" />,
  <WebsiteImage key="2" />,
  <ProductImage key="3" />,
];

export default function Home() {
  const { sections } = usePageContent("home");

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.innerHTML = `(function(ss,ex){ window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));}; (function(d,s){ fs=d.getElementsByTagName(s)[0]; function ce(src){ var cs=d.createElement(s); cs.src=src; cs.async=1; fs.parentNode.insertBefore(cs,fs); }; ce('https://sc.lfeeder.com/lftracker_v1_'+ss+(ex?'_'+ex:'')+'.js'); })(document,'script'); })('bElvO73XO964ZMqj');`;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  const servicesLabel = getContent(sections, "servicesLabel", defaults.home.servicesLabel);

  useLayoutEffect(() => {
    // Set initial body color for home page
    document.body.style.backgroundColor = "#020817";
    document.body.style.color = "#fbf0f2";

    // Use class-based toggles so the browser only repaints at section
    // boundaries, not every scroll frame. The previous scrub-based body
    // tweens caused full-document repaints during scroll.
    document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";

    const setLightTheme = () => {
      document.body.style.backgroundColor = "#fbf0f2";
      document.body.style.color = "#020817";
      document.body.style.setProperty("--accent-color", "#020817");
      document.body.style.setProperty("--accent-bg", "#020817");
      document.body.style.setProperty("--accent-text", "#fbf0f2");
    };
    const setDarkTheme = () => {
      document.body.style.backgroundColor = "#020817";
      document.body.style.color = "#fbf0f2";
      document.body.style.setProperty("--accent-color", "#ffffff");
      document.body.style.setProperty("--accent-bg", "#ffffff");
      document.body.style.setProperty("--accent-text", "#020817");
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".dark-section",
        start: "top top",
        end: "bottom 60%",
        onEnter: setLightTheme,
        onEnterBack: setLightTheme,
        onLeave: setDarkTheme,
        onLeaveBack: setDarkTheme,
      });

      ScrollTrigger.create({
        trigger: "footer",
        start: "top 80%",
        onEnter: setDarkTheme,
        onLeaveBack: setLightTheme,
      });
    });

    return () => {
      // Revert only OUR context's triggers (not global ones)
      ctx.revert();

      // Reset body inline styles to CSS defaults
      document.body.style.transition = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.style.removeProperty("--accent-color");
      document.body.style.removeProperty("--accent-bg");
      document.body.style.removeProperty("--accent-text");
    };
  }, []);

  const { sections: servicesSections } = usePageContent("services");
  const rawServicePanels = getContent(servicesSections, "servicePanels", defaults.services.servicePanels);
  const featuredPanels = rawServicePanels.filter(p => p.featureOnHome);
  
  // If no panels are explicitly featured, fall back to defaults or a subset
  const displayPanels = featuredPanels.length > 0 ? featuredPanels : rawServicePanels.slice(0, 4);

  const servicePanels = displayPanels.map((panel, i) => {
    const items = Array.isArray(panel.items)
      ? panel.items
      : typeof panel.items === "string"
        ? panel.items.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    return {
      bg: panel.bg,
      children: (
        <ServiceBlock
          title={panel.title}
          description={panel.description}
          list={items}
          imageContent={PANEL_VISUALS[i % PANEL_VISUALS.length]}
          textColor={panel.textColor || "text-[#fbf0f2]"}
          videoUrl={panel.videoUrl}
          imageUrl={panel.imageUrl}
          mediaTitle={panel.mediaTitle}
          mediaLabel={panel.mediaLabel}
          hideImage={panel.hideImage === true || panel.hideImage === "true"}
        />
      ),
    };
  });

  return (
    <>
      <HeroTopText />
      {/* Navbar and Footer will be handled by Layout or individual pages */}
      <Hero />
      <AboutSection />

      <ClientSection />
      <div className="dark-section bg-[#fbf0f2]">
        <Works />
        <div className="relative z-[60] pt-0 pb-0">
          <div className="w-full">
            <Insights />
          </div>
        </div>
      </div>

      <div className="w-full flex items-end pt-4 pb-4 px-6 bg-[#fbf0f2] text-[#020817]" style={{ fontFamily: "'PP Mori', sans-serif" }}>
        <span className="text-[2.2rem] md:text-[3rem] font-bold tracking-tighter leading-none">{servicesLabel}</span>
      </div>
      <StackContainer panels={servicePanels} />

      <CTA />
    </>
  );
}
