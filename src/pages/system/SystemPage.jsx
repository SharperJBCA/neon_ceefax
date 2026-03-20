import { useState } from "react";
import { motion } from "motion/react";
import "./system.css";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 1, ease: "easeIn", delayChildren: 1 },
  },
};

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function SystemPage({ pageCode, setPageCode }) {
  const imagePaths = [
    "./planets/centis_planet.svg",
    "./planets/lo_planet.svg",
    "./planets/aegir_planet.svg",
  ];

  return (
    <section className="system-page">
      <div className="system-overview">
        <motion.ul initial="hidden" animate="visible" variants={container}>
          {imagePaths.map((imagePath, i) => (
            <motion.li key={i} variants={item} transition={{ duration: 3 }}>
              <motion.button
                className="test-button"
                style={{ backgroundImage: `url(${imagePath})` }}
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9, y: 1 }}
                transition={{ type: "spring" }}
                drag
                dragConstraints={{
                  left: 0,
                  right: 100,
                  top: -100,
                  bottom: 100,
                }}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default SystemPage;
