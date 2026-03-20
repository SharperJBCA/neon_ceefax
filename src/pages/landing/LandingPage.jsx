import { useState } from "react";
import LoadingButton from "../../components/LoadingButton";
import ScrollingLog from "../../components/ScrollingLog";

function LandingPage({ pageCode, setPageCode, content }) {
  const lines = [
    "// Initializing Neural Interface...",
    "// Decrypting Data Streams...",
    "// Synchronizing Parallel Realities...",
    "// Transmitting Quantum Signals...",
    "// Unlocking Digital Dimensions...",
    "// You're About to Enter the Future...",
  ];

  function changePage() {
    setPageCode("100000.001");
  }

  return (
    <div className="parent">
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "left" }}>
        <ScrollingLog lines={lines} msPerStep={650} />
      </div>
      <div className="div1">
        <LoadingButton
          idleText="Begin Journey"
          loadingText="Calibration in progress…"
          doneText="Calibration complete"
          durationMs={5000}
          onDone={() => changePage()}
        />
      </div>
    </div>
  );
}

export default LandingPage;
