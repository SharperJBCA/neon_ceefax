import { useEffect, useRef, useState } from "react";

export default function LoadingButton({
  idleText = "Begin Journey",
  loadingText = "Calibrating…",
  doneText = "Calibration complete",
  durationMs = 1400,
  onDone,
}) {
  // phase: "idle" -> "loading" -> "done"
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0); // 0..1

  const rafId = useRef(null);
  const startTime = useRef(null);

  const start = () => {
    if (phase !== "idle") return;

    setPhase("loading");
    setProgress(0);
    startTime.current = null;

    const tick = (t) => {
      if (startTime.current == null) startTime.current = t;

      const elapsed = t - startTime.current;
      const raw = Math.min(elapsed / durationMs, 1);

      // A little easing so it feels nicer than linear
      const eased = 1 - Math.pow(1 - raw, 3);

      setProgress(eased);

      if (raw < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        console.log('change page?')
        onDone();
      }
    };

    rafId.current = requestAnimationFrame(tick);
  };

  // Cleanup if component unmounts mid-animation
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const label =
    phase === "idle" ? idleText : phase === "loading" ? loadingText : doneText;

  return (
    <div className='center-screen'>
    <button
      type="button"
      className={`lb ${phase !== "idle" ? "lb--busy" : ""} ${
        phase === "done" ? "lb--done" : ""
      }`}
      onClick={start}
      disabled={phase !== "idle"}
    >
      <span className="lb__label">{label}</span>

      <span className="lb__bar" aria-hidden="true">
        <span
          className="lb__fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>

      <span className="lb__status">
        {phase === "idle"
          ? "click to initiate"
          : phase === "loading"
          ? `${Math.round(progress * 100)}%`
          : "ready"}
      </span>
    </button>
    </div>
  );
}