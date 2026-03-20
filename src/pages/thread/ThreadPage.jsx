import { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "motion/react";
import "./thread.css";

const Reveal = ({ children, width = "fit-content" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: "some" }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

function ThreadPage({ content, pageCode, setPageCode }) {
  const blocks = content?.blocks ?? [];

  return (
    <div className="thread-page">
      <header className="thread-page__header">
        <h1 className="thread-page__title">
          Thread Archive: Embroidery Exchange
        </h1>
        <p className="thread-page__intro">
          Signal-safe scans from remote crews preserving old-world embroidery.
          Browse hand-stitched motifs and experimental neon-thread studies.
        </p>
      </header>

      {blocks.map((entry, i) => (
        <Reveal key={i}>
          <section className="thread-entry">
            <div className="thread-entry__separator" />
            <div className="thread-entry__content">
              <div className="thread-entry__image-wrap">
                <img
                  src={entry.filename}
                  alt={entry.alt}
                  className="thread-entry__image"
                />
              </div>
              <div className="thread-entry__text">
                <h2 className="thread-entry__title">{entry.title}</h2>
                <p className="thread-entry__description">
                  {entry.description}
                </p>
              </div>
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

export default ThreadPage;
