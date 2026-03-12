import { useMemo, useState } from "react";
import "./SystemPage.css";
import { PLANETS, PLANET_HOTSPOTS } from "../content/system.planets";

function SystemPage({ pageCode, setPageCode }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

  const activePlanetId = useMemo(() => {
    const [, suffix] = pageCode.split(".");
    return suffix && PLANETS[suffix] ? suffix : null;
  }, [pageCode]);

  if (activePlanetId) {
    const planet = PLANETS[activePlanetId];
    return (
      <section className="system-page">
        <div className="system-detail">
          <button className="system-back" onClick={() => setPageCode("system.000")}>
            ← Back to system map
          </button>

          <h1>{planet.name}</h1>
          <div className="system-detail-card">
            <img src={planet.image} alt={`${planet.name} planetary chart`} />
          </div>

          <p>{planet.summary}</p>
          <ul>
            <li><strong>Location:</strong> {planet.location}</li>
            <li><strong>Climate:</strong> {planet.climate}</li>
            <li><strong>Gravity:</strong> {planet.gravity}</li>
            <li><strong>Atmosphere:</strong> {planet.atmosphere}</li>
          </ul>

          <h2>Detailed breakdown</h2>
          <ul>
            {planet.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="system-page">
      <div className="system-overview">
        <h1>System Overview</h1>
        <p>Select a highlighted world to inspect its full planetary record.</p>

        <svg viewBox="0 0 850 500" className="system-map" role="img" aria-label="System map with selectable planets">
          <image href="./planets.svg" x="0" y="0" width="800" height="500" />

          {PLANET_HOTSPOTS.map((planet) => (
            <g key={planet.id}>
              {hoveredPlanet === planet.id && (
                <image
                  href={planet.labelImage}
                  x={planet.labelX}
                  y={planet.labelY}
                  width="200"
                  height="80"
                />
              )}
              <circle
                cx={planet.cx}
                cy={planet.cy}
                r={planet.r}
                fill="transparent"
                stroke={hoveredPlanet === planet.id ? "white" : "transparent"}
                strokeWidth="6"
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
                onClick={() => setPageCode(`system.${planet.id}`)}
              >
                <title>{PLANETS[planet.id].name}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

export default SystemPage;
