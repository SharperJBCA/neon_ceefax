import { ReactNode, useState, useRef, useEffect } from "react";
import {motion, useInView, useAnimation} from "motion/react";
import "./Thread.css";

const embroideryImages = [
  { src: "/thread_images/embroidery01.svg", alt: "Floral embroidery hoop with pink and blue petals" },
  { src: "/thread_images/embroidery02.svg", alt: "Geometric neon thread pattern on black fabric" },
  { src: "/thread_images/embroidery03.svg", alt: "Celestial moon and stars embroidery in a wooden hoop" },
];

export const Reveal = ({ children, width = "fit-content" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: false});

  const mainControls = useAnimation() 

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      {/* <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {children}
      </motion.div> */}
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

function Thread({ content, pageCode, setPageCode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const blocks = content?.blocks ?? []; 

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % embroideryImages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? embroideryImages.length - 1 : prev - 1
    );
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.changedTouches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    if (deltaX > 40) {
      goNext();
    } else if (deltaX < -40) {
      goPrev();
    }

    setTouchStartX(null);
  };

  return (
    <div className="thread-page">
      <header className="thread-page__header">
        <h1 className="thread-page__title">Thread Archive: Embroidery Exchange</h1>

        <p className="thread-page__intro">
          Signal-safe scans from remote crews preserving old-world embroidery.
          Browse hand-stitched motifs and experimental neon-thread studies.
        </p>
      </header>

      {blocks.map((entry, i) => (
        <Reveal>
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

export default Thread;
