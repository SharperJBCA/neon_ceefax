import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import floors from "./floors";
import useSystemStates from "./useSystemStates";
import SeegsonPage from "./SeegsonPage";
import SeegsonMap from "./SeegsonMap";
import "./seegson.css";

const VIEWS = ["rewire", "map"];
const SWIPE_THRESHOLD = 50;

function SeegsonShell() {
  const [floorIndex, setFloorIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);
  const { systemStates, toggleSystem, loading } = useSystemStates();

  const currentFloor = floors[floorIndex];
  const view = VIEWS[viewIndex];

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(VIEWS.length - 1, idx));
    setViewIndex(clamped);
  }, []);

  // ── Arrow key detection (desktop) ──────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") goTo(viewIndex - 1);
      else if (e.key === "ArrowRight") goTo(viewIndex + 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewIndex, goTo]);

  // Percentage each view occupies within the carousel (relative to carousel width)
  const pct = 100 / VIEWS.length;

  const viewIndicator = (
    <div className="seegson-view-indicator">
      <div className="seegson-view-hint seegson-view-hint--desktop">
        Use arrow keys to switch view
      </div>
      <div className="seegson-view-hint seegson-view-hint--mobile">
        Swipe to switch view
      </div>
      <div className="seegson-view-dots">
        {VIEWS.map((v, i) => (
          <button
            key={v}
            className={`seegson-view-dot ${i === viewIndex ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={v}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="seegson-shell">
      <nav className="seegson-sidebar">
        <div className="seegson-sidebar__title">Seegson Systems</div>
        {floors.map((floor, fi) => (
          <div key={fi} className="seegson-sidebar__floor">
            <button
              className={`seegson-sidebar__floor-btn ${fi === floorIndex ? "is-active" : ""}`}
              onClick={() => setFloorIndex(fi)}
            >
              {floor.name}
            </button>
          </div>
        ))}
      </nav>

      <div className="seegson-content">
        {loading ? (
          <div className="seegson">
            <div className="seegson__titlebar">Connecting...</div>
          </div>
        ) : (
          <motion.div
            className="seegson-carousel"
            drag="x"
            dragElastic={0.15}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = offset.x + velocity.x * 0.3;
              if (swipe < -SWIPE_THRESHOLD) goTo(viewIndex + 1);
              else if (swipe > SWIPE_THRESHOLD) goTo(viewIndex - 1);
            }}
            animate={{ x: `${-viewIndex * pct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ display: "flex", width: `${VIEWS.length * 100}%` }}
          >
            <div style={{ width: `${pct}%`, flexShrink: 0 }}>
              <SeegsonPage
                floor={currentFloor}
                floorIndex={floorIndex}
                systemStates={systemStates}
                toggleSystem={toggleSystem}
                activeRoom={activeRoom}
                setActiveRoom={setActiveRoom}
              />
            </div>
            <div style={{ width: `${pct}%`, flexShrink: 0 }}>
              <SeegsonMap
                floor={currentFloor}
                floorIndex={floorIndex}
                systemStates={systemStates}
                activeRoom={activeRoom}
                setActiveRoom={setActiveRoom}
              />
            </div>
          </motion.div>
        )}
        {viewIndicator}
      </div>
    </div>
  );
}

export default SeegsonShell;
