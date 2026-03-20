import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function IctombPanel({ floor, selectedRoom }) {
  const [itemIndex, setItemIndex] = useState(0);

  const roomConfig = selectedRoom ? floor.rooms[selectedRoom] : null;
  const items = roomConfig?.items ?? [];

  // Reset carousel when room changes
  useEffect(() => {
    setItemIndex(0);
  }, [selectedRoom]);

  // Arrow key support
  useEffect(() => {
    if (!selectedRoom || items.length === 0) return;
    function handleKey(e) {
      if (e.key === "ArrowLeft") setItemIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setItemIndex((i) => Math.min(items.length - 1, i + 1));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedRoom, items.length]);

  if (!selectedRoom || !roomConfig) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="ictomb-panel"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        key={selectedRoom}
      >
        <div className="ictomb-panel__title">{roomConfig.displayName}</div>
        {items.length > 0 ? (
          <>
            <div className="ictomb-panel__carousel">
              <motion.div
                className="ictomb-panel__track"
                animate={{ x: `${-itemIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {items.map((item, i) => (
                  <div key={i} className="ictomb-panel__card">
                    {item.name || `Item ${i + 1}`}
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="ictomb-panel__dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`ictomb-panel__dot ${i === itemIndex ? "is-active" : ""}`}
                  onClick={() => setItemIndex(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="ictomb-panel__empty">No items discovered</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default IctombPanel;
