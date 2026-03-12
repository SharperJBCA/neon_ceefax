import { useState } from "react";
import "./Thread.css";

const embroideryImages = [
  { src: "/thread_images/embroidery01.svg", alt: "Floral embroidery hoop with pink and blue petals" },
  { src: "/thread_images/embroidery02.svg", alt: "Geometric neon thread pattern on black fabric" },
  { src: "/thread_images/embroidery03.svg", alt: "Celestial moon and stars embroidery in a wooden hoop" },
];

function Thread() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

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

      <section
        className="thread-carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="thread-carousel__viewport">
          <img
            src={embroideryImages[currentIndex].src}
            alt={embroideryImages[currentIndex].alt}
            className="thread-carousel__image"
          />
        </div>

        <div className="thread-carousel__controls">
          <button
            type="button"
            className="thread-carousel__button"
            onClick={goPrev}
            aria-label="Show previous embroidery image"
          >
            ◀ Prev
          </button>
          <span className="thread-carousel__counter" aria-live="polite">
            {currentIndex + 1} / {embroideryImages.length}
          </span>
          <button
            type="button"
            className="thread-carousel__button"
            onClick={goNext}
            aria-label="Show next embroidery image"
          >
            Next ▶
          </button>
        </div>

        <div className="thread-carousel__thumbs" role="tablist" aria-label="Embroidery image selection">
          {embroideryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`thread-carousel__thumb ${index === currentIndex ? "is-active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
            >
              <img src={image.src} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Thread;
