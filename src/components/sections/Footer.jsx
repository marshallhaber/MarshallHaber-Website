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
    <footer id="main-footer" className={`w-full pt-10 md:pt-20 pb-4 md:pb-6 px-4 md:px-6 relative overflow-hidden z-50 ${bgClass}`}>

      {/* Grid Links Section */}
      <div className="w-full flex flex-col md:flex-row justify-between mb-16 md:mb-32 text-base font-medium tracking-tight">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 flex-1">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <h4 className="text-[10px] uppercase font-bold tracking-widest mt-2 opacity-50">{f.exploreLabel}</h4>
            <ul className="space-y-1">
              {(f.exploreLinks || []).map((link) => (
                <li key={link.href}>
                  <TransitionLink to={link.href} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-tight">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <h4 className="text-[10px] uppercase font-bold tracking-widest mt-2 opacity-50">{f.stalkUsLabel}</h4>
            <ul className="space-y-1">
              {(f.stalkUsLinks || []).map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[1.8rem] sm:text-[2.5rem] md:text-[2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-tight">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-12 text-left md:text-right mt-10 md:mt-0">
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-widest mb-3 opacity-50">{f.sayHelloLabel}</h4>
            <a href={`mailto:${f.sayHelloEmail}`} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-tight">{f.sayHelloEmail}</a>
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-widest mb-3 opacity-50">{f.callUsLabel}</h4>
            <a href={`tel:${f.callUsPhone.replace(/[^+\d]/g, '')}`} className="text-[1.8rem] sm:text-[2.5rem] md:text-[2rem] font-bold tracking-tight hover:opacity-60 transition-opacity leading-tight">{f.callUsPhone}</a>
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
