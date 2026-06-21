"use client";

import { motion } from "framer-motion";

// Splits a paragraph into words and reveals them with a soft staggered
// rise-and-fade as it scrolls into view. Used throughout the landing
// page so body copy never just "appears" — it's read into view.
export default function AnimatedParagraph({
  text,
  className = "",
  as = "p",
  delay = 0,
  stagger = 0.018,
  once = true,
}) {
  const words = text.split(" ");
  const Tag = motion[as] || motion.p;

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-80px" }}
        variants={container}
        className="inline"
      >
        {words.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block whitespace-pre">
            {w}{" "}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
