import { useLocation } from "react-router-dom";
import TransitionLink from "../ui/TransitionLink";
import { usePageContent } from "../../hooks/usePageContent";
import { getContent } from "../../lib/content";
import { defaults } from "../../lib/contentDefaults";

export default function Footer() {
  const { pathname } = useLocation();
  const isCreamPage = pathname !== "/";

  const bgClass = isCreamPage ? "bg-[#fbf0f2] text-[#020817]" : "bg-[#020817] text-[#fbf0f2]";
  const borderClass = isCreamPage ? "border-[#020817]/20" : "border-[#fbf0f2]/20";
  const logoSrc = "/logonewlong.png";
  const logoFilter = isCreamPage ? "invert(1) brightness(0)" : "none";

  const { sections } = usePageContent("global");
  const f = getContent(sections, "footer", defaults.global.footer);

  return (
    <footer id="main-footer" className={`w-full pt-16 md:pt-28 pb-8 md:pb-12 px-6 md:px-12 relative overflow-hidden z-50 ${bgClass}`}>

      {/* Grid Links Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 md:mb-36 text-base font-medium tracking-tight">
        {/* Explore */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-50">{f.exploreLabel}</h4>
          <ul className="space-y-2">
            {(f.exploreLinks || []).map((link) => (
              <li key={link.href}>
                <TransitionLink to={link.href} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2.2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-none">
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Stalk Us */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-50">{f.stalkUsLabel}</h4>
          <ul className="space-y-2">
            {(f.stalkUsLinks || []).map((link) => {
              const isLinkedIn = link.label.toLowerCase().includes("linkedin");
              const isInstagram = link.label.toLowerCase().includes("instagram");
              return (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[1.8rem] sm:text-[2.5rem] md:text-[2.2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-none group">
                    {isLinkedIn && (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    )}
                    {isInstagram && (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    )}
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-6 md:items-end">
          <div className="flex flex-col gap-1 md:items-end">
            <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-50">{f.sayHelloLabel}</h4>
            <a href={`mailto:${f.sayHelloEmail}`} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2.2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-none">{f.sayHelloEmail}</a>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <h4 className="text-[10px] uppercase font-bold tracking-widest opacity-50">{f.callUsLabel}</h4>
            <a href={`tel:${f.callUsPhone.replace(/[^+\d]/g, '')}`} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2.2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-none">{f.callUsPhone}</a>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mb-12 md:mb-6 mt-16 md:mt-0">
        <img src={logoSrc} alt="Marshall Haber Creative Group" className="h-[12vw] md:h-[6vw] lg:h-[5.5vw] xl:h-[7vw] w-auto" style={{ filter: logoFilter }} />
      </div>

      {/* Bottom Legal Links */}
      <div className={`w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-bold uppercase tracking-widest px-4 border-t ${borderClass} pt-6 md:pt-8 mt-6 md:mt-12`}>
        <div className="w-full md:w-auto flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <p className="leading-relaxed">{f.copyright}</p>
          <div className="flex items-center gap-3 mt-1 md:mt-0">
            <span aria-hidden="true" className="hidden md:inline opacity-40">|</span>
            <TransitionLink to="/legal" className="hover:opacity-60 transition-opacity">{f.legalLink}</TransitionLink>
          </div>
        </div>
        <p className="w-full md:w-auto text-left md:text-right leading-[1.6] mt-2 md:mt-0 opacity-80">{f.address}</p>
      </div>
    </footer>
  );
}
