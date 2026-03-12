import {React, useState} from "react";
import LoadingButton from "./LoadingButton";
import ScrollingLog from "./ScrollingLog";
function Landing({pageCode, setPageCode, content}) {

  const lines = [
    "// Initializing Neural Interface...",
    "// Decrypting Data Streams...",
    "// Synchronizing Parallel Realities...",
    "// Transmitting Quantum Signals...",
    "// Unlocking Digital Dimensions...",
    "// You’re About to Enter the Future...",
  ];

  function changePage(){
    setPageCode('100000.001')
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

        {/* <section className="panel">
          <h1 className="title">RECRUITMENT PAGE</h1>
          <br></br>
          <h2 className="title">Looking to join the Mothership Open table?</h2>
          <p className="body">What you need to know:</p>
          <ul>
            <li>[INF] On this page you may register an account.</li>
            <li>[!!!] If you already have an account, a login portal will show.</li>
            <li>[INF] If you </li>
          </ul>
        </section> */}
      </div>
    </div>  
  )
}
export default Landing