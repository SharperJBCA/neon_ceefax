import { useEffect, useMemo, useState } from "react";
import "./scrollingLog.css";

export default function ScrollingLog({
  lines = [],
  visibleCount = 6,
  msPerStep = 650,   // how often it jumps
}) {
    const  [idx, setIdx] = useState(0) 

    useEffect(() => {
        if (lines.length === 0) return; 
        const id = setInterval(() => {
            setIdx((i) => (i+1) % lines.length);
        }, msPerStep);
        return () => clearInterval(id);
    }, [lines.length, msPerStep])

    const windowLines = useMemo(() => {
        if (lines.length === 0) return [];
        const out = [];
        for (let k = 0; k < visibleCount; k++) {
            const j = (idx + k) % lines.length;
            out.push(lines[j]) 
        }
        return out; 
    }, [idx, lines, visibleCount])

  return (
    <div className="log">
        {windowLines.map((t,i) => (
            <div className={`log__line ${i === (visibleCount-1) ? "highlight" : ""}`} key={`${idx}-${i}`}>
                {t}
            </div>
        ))}
    </div>
  );
}