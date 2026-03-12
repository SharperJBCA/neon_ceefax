import React from "react";
import { useState } from "react";
import "./CosmicVoyage.css";

function CosmicVoyage({ content, setPageCode }) {
    const blocks = content?.blocks ?? [];
  
    return (
    <div className="voyage">
        <div className="page-wrapper">
        <SvgMap setPageCode={setPageCode} />      

        {blocks.map((b, i) => (
          <Block key={i} block={b} setPageCode={setPageCode} />
        ))}
      </div>
      </div>
    );
  }

function Block({ block, setPageCode }) {
    switch (block.type) {
      case "image":
        return <img src={block.filename}></img>
      case "h1":
        return <h1 className="r-h1">{block.text}</h1>;
      case "h2":
        return <h2 className="r-h2">{block.text}</h2>;
      case "p":
        return <p className="r-p">{block.text}</p>;
      case "pre":
        return <pre>{block.text}</pre>;
      case "feed":
        return <div className={block.className}>
            {(block.items ?? []).map((it, idx) => (
                <Block key={idx} block={it} setPageCode={setPageCode} />
            ))}
        </div>
      case "callout":
        return (
          <div className="r-callout">
            {block.label ? <div className="r-callout__label">{block.label}</div> : null}
            <div className="r-callout__text">{block.text}</div>
          </div>
        );
        case "menu":
            return (
              <ul className="menu">
                {(block.items ?? []).map((it, idx) => (
                  <li className="menu-item" key={idx}>
                    <img src={it.filename} alt={it.title} />
                    <div className="menu-item-body">
                      <div className="menu-item-title">{it.title}</div>
                      <div className="menu-item-description">
                        {it.description}
                      </div>
                    </div>
                    <div className="menu-item-cost">{it.cost}</div>
                  </li>
                ))}
              </ul>
            );      
        case "links":
        return (
            <ul className='list-links'>
                {(block.items ?? []).map((it, idx) => (
                    <li key={idx}>
                <a
                href="#"
                onClick={() => it.to && setPageCode(it.to)}
                >
                <span className="dim">&gt;&gt;</span>{it.label}
                </a>
                </li>
                ))}
            </ul>
        );
      default:
        return null;
    }
}

function SvgMap({ setPageCode }) {

    const [hoveredPlanet, setHoveredPlanet] = useState(null);

    return (
      <svg viewBox="0 0 850 500" style={{ width: "30%", display: "block", margin: "0 auto" }}>
        <image href="/planets.svg" x="0" y="0" width="800" height="500" />
  
        {hoveredPlanet === "aegir" && (
        <image
          href="/aegir_text.svg"
          x="0"
          y="40"
          width="200"
          height="80"
        />
      )}
        <circle
          cx="67.5"
          cy="175"
          r="65"
          fill="transparent"
          stroke={hoveredPlanet === "aegir" ? "white" : "transparent"}
          strokeWidth="6"
          onMouseEnter={() => setHoveredPlanet("aegir")}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => setPageCode("100002.001")}
        >
          <title>Aegir</title>
        </circle>


        {hoveredPlanet === "centis" && (
        <image
          href="/centis_text.svg"
          x="470"
          y="30"
          width="200"
          height="80"
        />
      )}
        <circle
          cx="510.5"
          cy="250"
          r="150"
          fill="transparent"
          stroke={hoveredPlanet === "centis" ? "white" : "transparent"}
          strokeWidth="6"
          onMouseEnter={() => setHoveredPlanet("centis")}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => setPageCode("100002.000")}
        >
          <title>Aegir</title>
        </circle>

        {hoveredPlanet === "lo" && (
        <image
          href="/lo_text.svg"
          x="625"
          y="120"
          width="200"
          height="80"
        />
      )}
        <circle
          cx="755"
          cy="230"
          r="45"
          fill="transparent"
          stroke={hoveredPlanet === "lo" ? "white" : "transparent"}
          strokeWidth="6"
          onMouseEnter={() => setHoveredPlanet("lo")}
          onMouseLeave={() => setHoveredPlanet(null)}
          onClick={() => setPageCode("100002.000")}
        >
          <title>Lo</title>
        </circle>


      </svg>
    );
  }

export default CosmicVoyage;