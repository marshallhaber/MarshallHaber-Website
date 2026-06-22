import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";
import strategyVid from "../../assets/vid2.mp4";
import torontoImg from "../../assets/myWork/TopImages/toronto.png";
import optifinoPng from "../../assets/myWork/TopImages/optifino.png";
import memriImg from "../../assets/myWork/TopImages/memri.png";
import jpMorganImg from "../../assets/myWork/TopImages/jpMorgan.png";

export default function ServiceBlock({
  title,
  description,
  list,
  textColor = "text-[#1a1a1a]",
}) {
  const items = Array.isArray(list)
    ? list
    : typeof list === "string"
      ? list.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return (
    <div
      className={`w-full flex flex-col items-stretch ${textColor} relative`}
      style={{ minHeight: "500px" }}
    >
      <div className="w-full flex flex-col justify-start items-start p-6 md:p-14 gap-8 md:gap-16">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-inherit font-bold leading-[0.92] tracking-tight"
          style={{
            fontFamily: "'PP Mori', sans-serif",
            fontSize: "clamp(2.6rem, 6.6vw, 6rem)",
          }}
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start w-full"
        >
          <p
            className="text-[18px] md:text-[22px] font-normal leading-[1.45] tracking-tight max-w-[42ch]"
            style={{ fontFamily: "'Nib Pro', serif", fontStyle: "normal" }}
          >
            {description}
          </p>
          <ul
            className="text-[14px] md:text-[16px] font-normal leading-[1.9]"
            style={{ fontFamily: "'PP Mori', sans-serif" }}
          >
            {items.map((item, i) => (
              <li key={i} className="hover:opacity-60 cursor-pointer transition-opacity duration-200">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

      </div>

    </div>
  );
}

export const StrategyVideo = () => (
  <div className="w-full h-full relative overflow-hidden bg-black/5">
    <img
      src={torontoImg}
      alt="Brand Strategy"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
);

export const VisualImage = () => (
  <div className="w-full h-full relative overflow-hidden bg-black/5">
    <img
      src={optifinoPng}
      alt="Identity"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
);

export const WebsiteImage = () => (
  <div className="w-full h-full relative overflow-hidden bg-black/5">
    <img
      src={memriImg}
      alt="Digital"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
);

export const ProductImage = () => (
  <div className="w-full h-full relative overflow-hidden bg-black/5">
    <img
      src={jpMorganImg}
      alt="Product"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
);
