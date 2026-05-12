import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmileLogo from "../ui/SmileLogo";
import videoSrc from "../../assets/video.mp4";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

gsap.registerPlugin(ScrollTrigger);

export function HeroTopText() {
  return null;
}

export default function Hero() {
  const containerRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const textRef = useRef(null);
  const logoRef = useRef(null);

  const { sections } = usePageContent("home");
  const headingBold = getContent(sections, "hero.headingBold", defaults.home.hero.headingBold);
  const headingItalic = getContent(sections, "hero.headingItalic", defaults.home.hero.headingItalic);
  const cmsVideoUrl = getContent(sections, "hero.videoUrl", defaults.home.hero.videoUrl);
  const activeVideoUrl = cmsVideoUrl || videoSrc;

  // useLayoutEffect ensures cleanup (ctx.revert) runs BEFORE React removes
  // the DOM nodes, so GSAP can properly un-pin and remove the pin spacer.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Explicit start state so GSAP can interpolate (clamp/calc values can't be tweened)
      gsap.set(videoWrapperRef.current, {
        bottom: 24,
        left: 24,
        width: 320,
        height: 180,
        borderRadius: 12,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      tl.to(videoWrapperRef.current, {
        width: () => window.innerWidth - 48,
        height: () => window.innerHeight - 120,
        bottom: 24,
        left: 24,
        borderRadius: 16,
        ease: "power2.inOut",
      }, 0);

      tl.to([textRef.current, logoRef.current], {
        opacity: 0,
        y: -30,
        ease: "power1.inOut",
      }, 0);
    }, containerRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert(); // runs before DOM removal — pin spacer is properly cleaned up
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] bg-[#020817]">

      {/* LOGO — Upper Center */}
      <div
        ref={logoRef}
        className="absolute top-[15vh] w-full flex flex-col items-center gap-8 z-10 pointer-events-none"
      >
        <div className="w-[70vw] md:w-[60vw] max-w-[500px] aspect-square opacity-20">
          <SmileLogo />
        </div>
      </div>

      {/* TEXT — Center */}
      <div
        ref={textRef}
        className="absolute top-[45vh] md:top-[35vh] w-full flex justify-center z-20 pointer-events-none px-6"
      >
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[50px] leading-[1.1] text-[#fbf0f2] text-center tracking-tight max-w-[900px]">
          <span className="font-bold" style={{ fontFamily: "'PP Mori', sans-serif" }}>{headingBold}</span> <br className="hidden sm:block" />
          <span style={{ fontFamily: "'Nib Pro', serif", fontWeight: 400 }}>{headingItalic}</span>
        </h2>
      </div>

      {/* VIDEO — small card bottom-left, expands on scroll */}
      <div
        ref={videoWrapperRef}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "1.5rem",
          width: "clamp(160px, 25vw, 380px)",
          height: "clamp(100px, 15vw, 220px)",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          backgroundColor: "#0B0215",
          overflow: "hidden",
          zIndex: 40,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          src={activeVideoUrl}
        />
      </div>

    </section>
  );
}
